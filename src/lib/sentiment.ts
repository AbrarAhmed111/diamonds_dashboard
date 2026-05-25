import type { ChartRange, Signal, SentimentType } from "./types";

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

function dayKey(timestamp: string): string {
  return timestamp.slice(0, 10);
}

function parseUtcDay(timestamp: string): Date | null {
  const key = dayKey(timestamp);
  const d = new Date(`${key}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Filter values to the last N calendar days ending on the latest data point. */
export function sliceByRange(values: Signal["values"], range: ChartRange) {
  if (!values?.length) return [];

  const days = rangeToDays(range);
  const sorted = [...values].sort((a, b) => dayKey(a.timestamp).localeCompare(dayKey(b.timestamp)));
  const lastPoint = sorted[sorted.length - 1];
  const endDay = lastPoint ? parseUtcDay(lastPoint.timestamp) : null;

  if (!endDay) {
    return sorted.slice(-Math.min(days, sorted.length));
  }

  const cutoff = new Date(endDay);
  cutoff.setUTCDate(cutoff.getUTCDate() - (days - 1));
  const cutoffKey = cutoff.toISOString().slice(0, 10);

  const filtered = sorted.filter((point) => dayKey(point.timestamp) >= cutoffKey);
  return filtered.length ? filtered : [lastPoint];
}

export function rangeCaptionFor(range: ChartRange): string {
  switch (range) {
    case "1D":
      return "Last 24 hours";
    case "1W":
      return "Last 7 days";
    case "1M":
      return "Last 30 days";
    case "3M":
      return "Last 90 days";
    case "12M":
    default:
      return "Last 12 months";
  }
}

export const SENTIMENT_LABEL: Record<SentimentType, string> = {
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
};
