export interface DashboardSnapshotParams {
  output_prompt_id: number;
  limit_days: number;
}

export interface HelixRequestBody {
  action: string;
  params?: Record<string, unknown> | DashboardSnapshotParams;
}

export interface HelixSignalValue {
  timestamp: string;
  value: number | string;
  [extra: string]: unknown;
}

export interface HelixSignal {
  id: string;
  name: string | null;
  category: string;
  description: string | null;
  source: string | null;
  unit: string | null;
  min_val: number | null;
  max_val: number | null;
  values: HelixSignalValue[];
  [extra: string]: unknown;
}

export interface HelixErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface HelixSuccessResponse<T = HelixSignal[]> {
  ok: true;
  data: T;
}

export interface HelixErrorResponse {
  ok: false;
  error: HelixErrorBody;
}

export type HelixResponse<T = HelixSignal[]> = HelixSuccessResponse<T> | HelixErrorResponse;

export class HelixApiError extends Error {
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly status: number;

  constructor(message: string, options: { code: string; status: number; details?: Record<string, unknown> }) {
    super(message);
    this.name = "HelixApiError";
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
  }
}
