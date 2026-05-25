export type SignalStatus = "healthy" | "stale" | "error" | "unknown";

export type SentimentType = "positive" | "neutral" | "negative";

export interface SignalValue {
  timestamp: string;
  value: number;
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
  [extra: string]: unknown;
}

export type ChartRange = "1D" | "1W" | "1M" | "3M" | "12M";
