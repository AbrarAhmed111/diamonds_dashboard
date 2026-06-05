import type { DashboardPayload } from "@/lib/dashboard";
import { fetchDashboardSnapshot } from "./client";
import { mapHelixSnapshot } from "./mapSnapshot";
import { parseConsolidationSummary } from "./parseSummary";
import { HelixApiError } from "./types";

/**
 * Server-only Helix snapshot cache.
 * Helix is called at most once every 4 hours; all requests in between are
 * served from this in-memory copy.
 */

const CACHE_TTL_MS = 4 * 60 * 60 * 1000;

let cache: { payload: DashboardPayload; expiresAt: number } | null = null;

async function buildSnapshot(): Promise<DashboardPayload> {
  const response = await fetchDashboardSnapshot();
  if (!response.ok) {
    throw new HelixApiError(response.error.message, {
      code: response.error.code,
      status: 0,
    });
  }

  return {
    signals: mapHelixSnapshot(response.data),
    consolidation: parseConsolidationSummary(response.data),
    fetchedAt: new Date().toISOString(),
  };
}

interface SnapshotOptions {
  /** Bypass the in-memory cache and call Helix immediately (manual refresh / testing). */
  force?: boolean;
}

/** Returns cached dashboard data, refreshing from Helix once the 4-hour window expires. */
export async function getDashboardSnapshot(
  options?: SnapshotOptions,
): Promise<DashboardPayload> {
  if (!options?.force && cache && cache.expiresAt > Date.now()) {
    return cache.payload;
  }

  const payload = await buildSnapshot();
  cache = { payload, expiresAt: Date.now() + CACHE_TTL_MS };
  return payload;
}
