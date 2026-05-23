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
import type { Signal } from "./types";

const DATA_PATH = "/data/indicators.json";
const STALE_MS = 1000 * 60 * 60 * 24; // 24h
const STORAGE_KEY = "dp.lastFetchedAt";

type Status = "idle" | "loading" | "ready" | "error";

interface DataContextValue {
  signals: Signal[];
  status: Status;
  error: string | null;
  lastFetchedAt: Date | null;
  refresh: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

function withBasePath(path: string): string {
  if (typeof window === "undefined") return path;
  // Next exposes basePath via __NEXT_DATA__ at runtime; fall back to env var injected at build time.
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  if (!base) return path;
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

export function SignalsProvider({ children }: { children: ReactNode }) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(withBasePath(DATA_PATH), { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to load indicators (${res.status})`);
      }
      const json = (await res.json()) as Signal[];
      if (!Array.isArray(json)) throw new Error("Invalid indicators payload");
      setSignals(json);
      const now = new Date();
      setLastFetchedAt(now);
      try {
        window.localStorage?.setItem(STORAGE_KEY, now.toISOString());
      } catch {
        // ignore storage errors (private mode etc.)
      }
      setStatus("ready");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
      setStatus("error");
    }
  }, []);

  // Initial fetch + 24h staleness check.
  useEffect(() => {
    let stored: Date | null = null;
    try {
      const raw = window.localStorage?.getItem(STORAGE_KEY);
      if (raw) {
        const d = new Date(raw);
        if (!Number.isNaN(d.getTime())) stored = d;
      }
    } catch {
      // ignore
    }
    if (stored) setLastFetchedAt(stored);
    load();
  }, [load]);

  // Periodic staleness check while tab is open.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!lastFetchedAt) return;
      if (Date.now() - lastFetchedAt.getTime() > STALE_MS) {
        load();
      }
    }, 1000 * 60 * 30); // every 30 minutes
    return () => window.clearInterval(id);
  }, [lastFetchedAt, load]);

  const value = useMemo<DataContextValue>(
    () => ({ signals, status, error, lastFetchedAt, refresh: load }),
    [signals, status, error, lastFetchedAt, load],
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
