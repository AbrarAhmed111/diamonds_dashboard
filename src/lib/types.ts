export type SignalStatus = "healthy" | "stale" | "error" | "unknown";

export type SentimentType = "positive" | "neutral" | "negative";

export interface SignalValue {
  timestamp: string;
  value: number;
  /** Allow forward-compatible per-point fields (inflows, outflows, etc.) */
  [extra: string]: unknown;
}

export interface Signal {
  id: string;
  name: string;
  category: string;
  description?: string;
  source?: string;
  unit?: string;
  min_val?: number;
  max_val?: number;
  status?: SignalStatus;
  sentiment?: SentimentType;
  interpretation?: string;
  values: SignalValue[];
  /** Allow forward-compatible fields the backend may add later. */
  [extra: string]: unknown;
}

export type SortKey =
  | "name_asc"
  | "value_desc"
  | "value_asc"
  | "category_asc"
  | "status_asc";

export interface SignalFilters {
  query: string;
  category: string | "all";
  status: SignalStatus | "all";
  sentiment: SentimentType | "all";
  sort: SortKey;
}

export const DEFAULT_FILTERS: SignalFilters = {
  query: "",
  category: "all",
  status: "all",
  sentiment: "all",
  sort: "name_asc",
};

export type ChartRange = "1D" | "1W" | "1M" | "3M" | "12M";
