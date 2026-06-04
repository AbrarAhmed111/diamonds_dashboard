import type { DashboardSnapshotParams } from "./types";

export const HELIX_DEFAULT_URL = "https://helix.diamondpigs.com/api/v1";

// Helix is only ever called from the server (see src/app/api/helix/route.ts),
// so the key is read from a non-public env var and never reaches the browser.
export function getHelixApiUrl(): string {
  return process.env.HELIX_API_URL ?? HELIX_DEFAULT_URL;
}

export function getHelixApiKey(): string | undefined {
  return process.env.HELIX_API_KEY;
}

export const DEFAULT_SNAPSHOT_PARAMS: DashboardSnapshotParams = {
  output_prompt_id: 7,
  limit_days: 730,
};
