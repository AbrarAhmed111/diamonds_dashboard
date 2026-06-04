import type { ConsolidationSummary } from "@/lib/helix/parseSummary";
import type { Signal } from "./types";

export type { ConsolidationSummary };

export const EMPTY_CONSOLIDATION: ConsolidationSummary = {
  position: null,
  description: null,
  updatedAt: null,
  bullets: [],
};

/** Display-ready dashboard data returned by the internal API route. */
export interface DashboardPayload {
  signals: Signal[];
  consolidation: ConsolidationSummary;
  /** ISO timestamp of when the underlying Helix data was fetched (cache age). */
  fetchedAt: string;
}

/** Legacy API shape before `consolidation` was introduced. */
type LegacyDashboardPayload = DashboardPayload & {
  consolidationBullets?: string[];
};

/** Ensures `consolidation` is always present (handles stale server/cache responses). */
export function normalizeDashboardPayload(
  payload: LegacyDashboardPayload,
): DashboardPayload {
  if (payload.consolidation) {
    return {
      signals: payload.signals ?? [],
      consolidation: payload.consolidation,
      fetchedAt: payload.fetchedAt,
    };
  }

  return {
    signals: payload.signals ?? [],
    consolidation: {
      ...EMPTY_CONSOLIDATION,
      bullets: payload.consolidationBullets ?? [],
    },
    fetchedAt: payload.fetchedAt,
  };
}

export interface DashboardApiErrorBody {
  code: string;
  message: string;
}

export type DashboardApiResponse =
  | ({ ok: true } & DashboardPayload)
  | { ok: false; error: DashboardApiErrorBody };
