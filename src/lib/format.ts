import type { Signal, SignalValue } from "./types";

const compactUSD = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 2,
});

const standardNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const integerNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
  hour12: false,
});

export function getLatestValue(signal: Signal): SignalValue | null {
  if (!signal?.values?.length) return null;
  return signal.values[signal.values.length - 1] ?? null;
}

export function getValueChangePercent(signal: Signal, days = 1): number | null {
  if (!signal?.values?.length) return null;
  const last = signal.values[signal.values.length - 1];
  const idx = Math.max(0, signal.values.length - 1 - days);
  const prev = signal.values[idx];
  if (!last || !prev || prev.value === 0) return null;
  return ((last.value - prev.value) / Math.abs(prev.value)) * 100;
}

export function formatValue(value: number | null | undefined, unit?: string): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  const u = (unit || "").toLowerCase();
  if (u === "usd") {
    if (Math.abs(value) >= 1_000) return `$${compactUSD.format(value)}`;
    return `$${standardNumber.format(value)}`;
  }
  if (u === "%") return `${standardNumber.format(value)}%`;
  if (u === "index") return integerNumber.format(value);
  if (u === "z-score") return standardNumber.format(value);
  if (u === "ratio") return standardNumber.format(value);
  if (Math.abs(value) >= 1_000_000) return compactUSD.format(value);
  return standardNumber.format(value);
}

export function formatChange(
  value: number | null | undefined,
  suffix: "%" | "" = "",
  fractionDigits = 2,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  const sign = value > 0 ? "+" : "";
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value);
  return `${sign}${formatted}${suffix}`;
}

export function formatDate(timestamp: string | Date | null | undefined): string {
  if (!timestamp) return "–";
  const d = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (Number.isNaN(d.getTime())) return "–";
  return dateFmt.format(d);
}

export function formatDateTime(timestamp: string | Date | null | undefined): string {
  if (!timestamp) return "–";
  const d = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (Number.isNaN(d.getTime())) return "–";
  return `${dateFmt.format(d)}, ${timeFmt.format(d)} GMT`;
}

export function categoryLabel(category: string): string {
  const map: Record<string, string> = {
    sentiment: "Sentiment",
    technical: "Technical",
    macro: "Macro",
    on_chain: "On-chain",
    market: "Market",
  };
  return map[category] ?? category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
