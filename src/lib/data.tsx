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
import { isSnapshotStale, msUntilNextRefresh } from "@/lib/refreshSchedule";
import type {
  ConsolidationSummary,
  DashboardApiResponse,
  DashboardPayload,
} from "@/lib/dashboard";
import { EMPTY_CONSOLIDATION, normalizeDashboardPayload } from "@/lib/dashboard";
import type { Signal } from "./types";

const DASHBOARD_ENDPOINT = "/api/helix";

const STORAGE_KEY = "dp.lastFetchedAt";

type Status = "loading" | "ready" | "error";

interface LoadOptions {
  silent?: boolean;
  /** Bypass the server cache and call Helix immediately. */
  force?: boolean;
}

interface DataContextValue {
  signals: Signal[];
  consolidation: ConsolidationSummary;
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

async function loadDashboard(
  signal?: AbortSignal,
  force = false,
): Promise<DashboardPayload> {
  const endpoint = force ? `${DASHBOARD_ENDPOINT}?force=true` : DASHBOARD_ENDPOINT;
  const res = await fetch(endpoint, {
    signal,
    cache: force ? "no-store" : "default",
    headers: { Accept: "application/json" },
  });

  let body: DashboardApiResponse;
  try {
    body = (await res.json()) as DashboardApiResponse;
  } catch {
    throw new Error(`Market data request failed (${res.status}).`);
  }

  if (!res.ok || !body.ok) {
    const message = body.ok === false ? body.error.message : `Market data request failed (${res.status}).`;
    throw new Error(message);
  }

  return normalizeDashboardPayload(body);
}

export function SignalsProvider({ children }: { children: ReactNode }) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [consolidation, setConsolidation] = useState<ConsolidationSummary>(EMPTY_CONSOLIDATION);
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
      const dashboard = await loadDashboard(undefined, options?.force);
      setSignals(dashboard.signals);
      setConsolidation(dashboard.consolidation ?? EMPTY_CONSOLIDATION);
      const fetchedAt = new Date(dashboard.fetchedAt);
      persistLastFetched(Number.isNaN(fetchedAt.getTime()) ? new Date() : fetchedAt);
      setStatus("ready");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
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
      consolidation,
      status,
      isLoading: status === "loading",
      error,
      lastFetchedAt,
      refresh: () => load({ force: true }),
    }),
    [signals, consolidation, status, error, lastFetchedAt, load],
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
