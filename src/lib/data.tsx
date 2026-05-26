"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { isSnapshotStale, msUntilNextRefresh } from "@/lib/refreshSchedule";
import type { Signal } from "./types";

const STORAGE_KEY = "dp.lastFetchedAt";

type Status = "loading" | "ready" | "error";

interface LoadOptions {
  silent?: boolean;
}

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

function readStoredLastFetched(): Date | null {
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return null;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

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
  const lastFetchedAtRef = useRef<Date | null>(null);

  const persistLastFetched = useCallback((fetchedAt: Date) => {
    lastFetchedAtRef.current = fetchedAt;
    setLastFetchedAt(fetchedAt);
    try {
      window.localStorage?.setItem(STORAGE_KEY, fetchedAt.toISOString());
    } catch {
      /* storage unavailable */
    }
  }, []);

  const load = useCallback(async (options?: LoadOptions) => {
    const silent = options?.silent ?? false;
    if (!silent) {
      setStatus("loading");
      setError(null);
    }

    try {
      const snapshot = await loadHelixSnapshot();
      setSignals(mapHelixSnapshot(snapshot));
      setConsolidationBullets(extractConsolidationBullets(snapshot));
      persistLastFetched(new Date());
      setStatus("ready");
    } catch (e) {
      const message =
        e instanceof HelixApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Unknown error";
      if (!silent) {
        setError(message);
        setStatus("error");
      }
    }
  }, [persistLastFetched]);

  useEffect(() => {
    const stored = readStoredLastFetched();
    if (stored) {
      lastFetchedAtRef.current = stored;
      setLastFetchedAt(stored);
    }
    load();
  }, [load]);

  useEffect(() => {
    let timeoutId = 0;

    const scheduleNextRefresh = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(async () => {
        await load({ silent: true });
        scheduleNextRefresh();
      }, msUntilNextRefresh());
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") return;
      if (isSnapshotStale(lastFetchedAtRef.current)) {
        void load({ silent: true }).finally(scheduleNextRefresh);
        return;
      }
      scheduleNextRefresh();
    };

    scheduleNextRefresh();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [load]);

  const value = useMemo<DataContextValue>(
    () => ({
      signals,
      consolidationBullets,
      status,
      isLoading: status === "loading",
      error,
      lastFetchedAt,
      refresh: () => load(),
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
