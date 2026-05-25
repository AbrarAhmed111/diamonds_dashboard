import type { DashboardSnapshotParams } from "./types";

export const HELIX_DEFAULT_URL = "https://helix.diamondpigs.com/api/v1";

export function getHelixApiUrl(): string {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_HELIX_API_URL ?? HELIX_DEFAULT_URL;
  }
  return process.env.HELIX_API_URL ?? process.env.NEXT_PUBLIC_HELIX_API_URL ?? HELIX_DEFAULT_URL;
}

export function getHelixApiKey(): string | undefined {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_HELIX_API_KEY;
  }
  return process.env.HELIX_API_KEY ?? process.env.NEXT_PUBLIC_HELIX_API_KEY;
}

export const DEFAULT_SNAPSHOT_PARAMS: DashboardSnapshotParams = {
  output_prompt_id: 7,
  limit_days: 90,
};
