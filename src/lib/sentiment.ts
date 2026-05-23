import type { ChartRange, Signal, SentimentType, SignalFilters, SortKey } from "./types";
import { getLatestValue } from "./format";

export function getSignalSentiment(signal: Signal): SentimentType {
  return signal.sentiment ?? "neutral";
}

export function getOverallSentiment(signals: Signal[]): SentimentType {
  if (!signals.length) return "neutral";
  let pos = 0;
  let neg = 0;
  let neu = 0;
  for (const s of signals) {
    const sent = getSignalSentiment(s);
    if (sent === "positive") pos++;
    else if (sent === "negative") neg++;
    else neu++;
  }
  if (pos > neg && pos >= neu) return "positive";
  if (neg > pos && neg >= neu) return "negative";
  return "neutral";
}

export function getStatusLabel(status: Signal["status"]): string {
  switch (status) {
    case "healthy":
      return "Live";
    case "stale":
      return "Delayed";
    case "error":
      return "Error";
    default:
      return "Unknown";
  }
}

export function rangeToDays(range: ChartRange): number {
  switch (range) {
    case "1D":
      return 1;
    case "1W":
      return 7;
    case "1M":
      return 30;
    case "3M":
      return 90;
    case "12M":
    default:
      return 365;
  }
}

export function sliceByRange(values: Signal["values"], range: ChartRange) {
  if (!values?.length) return [];
  const days = rangeToDays(range);
  return values.slice(-Math.min(days, values.length));
}

export function filterSignals(signals: Signal[], filters: SignalFilters): Signal[] {
  const q = filters.query.trim().toLowerCase();
  return signals.filter((s) => {
    if (filters.category !== "all" && s.category !== filters.category) return false;
    if (filters.status !== "all" && (s.status ?? "unknown") !== filters.status) return false;
    if (filters.sentiment !== "all" && (s.sentiment ?? "neutral") !== filters.sentiment)
      return false;
    if (!q) return true;
    const haystack = [
      s.name,
      s.category,
      s.description ?? "",
      s.source ?? "",
      s.interpretation ?? "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function sortSignals(signals: Signal[], key: SortKey): Signal[] {
  const list = [...signals];
  switch (key) {
    case "name_asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "value_desc":
      return list.sort((a, b) => (getLatestValue(b)?.value ?? 0) - (getLatestValue(a)?.value ?? 0));
    case "value_asc":
      return list.sort((a, b) => (getLatestValue(a)?.value ?? 0) - (getLatestValue(b)?.value ?? 0));
    case "category_asc":
      return list.sort((a, b) => a.category.localeCompare(b.category));
    case "status_asc":
      return list.sort((a, b) => (a.status ?? "unknown").localeCompare(b.status ?? "unknown"));
    default:
      return list;
  }
}

export const SENTIMENT_LABEL: Record<SentimentType, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};
