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

export function getRangeEndValue(values: SignalValue[]): SignalValue | null {
  if (!values?.length) return null;
  return values[values.length - 1] ?? null;
}

export function getRangeStartValue(values: SignalValue[]): SignalValue | null {
  if (!values?.length) return null;
  return values[0] ?? null;
}

export function getValueChangePercent(signal: Signal, days = 1): number | null {
  if (!signal?.values?.length) return null;
  const last = signal.values[signal.values.length - 1];
  const idx = Math.max(0, signal.values.length - 1 - days);
  const prev = signal.values[idx];
  if (!last || !prev || prev.value === 0) return null;
  return ((last.value - prev.value) / Math.abs(prev.value)) * 100;
}

export type RangeChangeMode = "relative" | "points";

/** Change over a sliced range — relative % for prices, percentage points when values are already in %. */
export function computeRangeChange(
  values: SignalValue[],
  mode: RangeChangeMode = "relative",
): number | null {
  if (!values.length) return null;
  const first = values[0];
  const last = values[values.length - 1];
  if (!first || !last) return null;

  if (mode === "points") {
    return last.value - first.value;
  }

  if (first.value === 0) {
    return last.value === 0 ? null : last.value;
  }

  return ((last.value - first.value) / Math.abs(first.value)) * 100;
}

/** Period-over-period % change; uses ~12-month lookback when enough points exist. */
export function computePeriodChangePercent(values: SignalValue[], minLookback = 12): number | null {
  if (values.length < 2) return null;
  const last = values[values.length - 1];
  const baseIndex = values.length >= minLookback + 1 ? values.length - 1 - minLookback : 0;
  const base = values[baseIndex];
  if (!last || !base || base.value === 0) return null;
  return ((last.value - base.value) / Math.abs(base.value)) * 100;
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

