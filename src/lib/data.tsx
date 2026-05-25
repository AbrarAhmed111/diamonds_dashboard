"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  extractConsolidationBullets,
  fetchDashboardSnapshot,
  HelixApiError,
  mapHelixSnapshot,
  type HelixSignal,
} from "@/lib/helix";
import type { Signal } from "./types";

const STALE_MS = 1000 * 60 * 60 * 24;
const STORAGE_KEY = "dp.lastFetchedAt";

type Status = "loading" | "ready" | "error";

interface DataContextValue {
  signals: Signal[];
  consolidationBullets: string[];
  status: Status;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: Date | null;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

async function loadHelixSnapshot(): Promise<HelixSignal[]> {
  const response = await fetchDashboardSnapshot();
  if (!response.ok) {
    throw new HelixApiError(response.error.message, {
      code: response.error.code,
      status: 0,
    });
  }
  return response.data;
}

export function SignalsProvider({ children }: { children: ReactNode }) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [consolidationBullets, setConsolidationBullets] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const snapshot = await loadHelixSnapshot();
      setSignals(mapHelixSnapshot(snapshot));
      setConsolidationBullets(extractConsolidationBullets(snapshot));
      const now = new Date();
      setLastFetchedAt(now);
      try {
        window.localStorage?.setItem(STORAGE_KEY, now.toISOString());
      } catch {
        /* storage unavailable */
      }
      setStatus("ready");
    } catch (e) {
      const message =
        e instanceof HelixApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Unknown error";
      setError(message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    let stored: Date | null = null;
    try {
      const raw = window.localStorage?.getItem(STORAGE_KEY);
      if (raw) {
        const d = new Date(raw);
        if (!Number.isNaN(d.getTime())) stored = d;
      }
    } catch {
      /* storage unavailable */
    }
    if (stored) setLastFetchedAt(stored);
    load();
  }, [load]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!lastFetchedAt) return;
      if (Date.now() - lastFetchedAt.getTime() > STALE_MS) {
        load();
      }
    }, 1000 * 60 * 30);
    return () => window.clearInterval(id);
  }, [lastFetchedAt, load]);

  const value = useMemo<DataContextValue>(
    () => ({
      signals,
      consolidationBullets,
      status,
      isLoading: status === "loading",
      error,
      lastFetchedAt,
      refresh: load,
    }),
    [signals, consolidationBullets, status, error, lastFetchedAt, load],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useSignals(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useSignals must be used inside <SignalsProvider>");
  }
  return ctx;
}
