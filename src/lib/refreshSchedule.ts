export const REFRESH_INTERVAL_MS = 4 * 60 * 60 * 1000;

/** Start of the current 4-hour UTC window (00:00, 04:00, 08:00, … GMT). */
export function getCurrentRefreshWindowStart(now: Date = new Date()): Date {
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0),
  );
  start.setUTCHours(Math.floor(now.getUTCHours() / 4) * 4);
  return start;
}

/** Next UTC refresh boundary after `now`. */
export function getNextRefreshAt(now: Date = new Date()): Date {
  return new Date(getCurrentRefreshWindowStart(now).getTime() + REFRESH_INTERVAL_MS);
}

export function isSnapshotStale(
  lastFetchedAt: Date | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!lastFetchedAt || Number.isNaN(lastFetchedAt.getTime())) return true;
  return lastFetchedAt.getTime() < getCurrentRefreshWindowStart(now).getTime();
}

export function msUntilNextRefresh(now: Date = new Date()): number {
  return Math.max(0, getNextRefreshAt(now).getTime() - now.getTime());
}
