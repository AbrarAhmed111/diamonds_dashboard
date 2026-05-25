import { getHelixApiKey, getHelixApiUrl, DEFAULT_SNAPSHOT_PARAMS } from "./config";
import type {
  DashboardSnapshotParams,
  HelixRequestBody,
  HelixResponse,
  HelixSignal,
} from "./types";
import { HelixApiError } from "./types";

export async function helixRequest<T = HelixSignal[]>(
  body: HelixRequestBody,
  options?: { apiKey?: string; baseUrl?: string; signal?: AbortSignal },
): Promise<HelixResponse<T>> {
  const apiKey = options?.apiKey ?? getHelixApiKey();
  if (!apiKey) {
    throw new HelixApiError("Missing Helix API key. Set HELIX_API_KEY or pass apiKey explicitly.", {
      code: "missing_api_key",
      status: 0,
    });
  }

  const url = options?.baseUrl ?? getHelixApiUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-DP-Api-Key": apiKey,
    },
    body: JSON.stringify(body),
    signal: options?.signal,
  });

  let payload: HelixResponse<T>;
  try {
    payload = (await res.json()) as HelixResponse<T>;
  } catch {
    throw new HelixApiError(`Helix API returned non-JSON response (${res.status}).`, {
      code: "invalid_response",
      status: res.status,
    });
  }

  if (!res.ok || !payload.ok) {
    const error = payload.ok === false ? payload.error : undefined;
    throw new HelixApiError(error?.message ?? `Helix API request failed (${res.status}).`, {
      code: error?.code ?? "request_failed",
      status: res.status,
      details: error?.details,
    });
  }

  return payload;
}

export async function fetchDashboardSnapshot(
  params: DashboardSnapshotParams = DEFAULT_SNAPSHOT_PARAMS,
  options?: { apiKey?: string; baseUrl?: string; signal?: AbortSignal },
): Promise<HelixResponse<HelixSignal[]>> {
  return helixRequest<HelixSignal[]>(
    {
      action: "dashboard.snapshot",
      params,
    },
    options,
  );
}
