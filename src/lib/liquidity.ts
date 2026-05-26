import type { SignalValue } from "./types";

/** Helix global M2 values are reported in USD billions. */
export function billionsToTrillions(valueInBillions: number): number {
  return valueInBillions / 1000;
}

export function toLiquidityChartPoints(values: SignalValue[]) {
  return values.map((point) => ({
    x: point.timestamp,
    y: billionsToTrillions(point.value),
  }));
}

export type LiquidityDateRangeType = "monthly" | "yearly";

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function parseLiquidityDate(timestamp: string) {
  const [ys, ms] = timestamp.slice(0, 10).split("-");
  return { year: Number(ys), month: Number(ms) - 1 };
}

/** Inclusive month span between first and last data points. */
export function getLiquidityRangeMonths(data: Array<{ x: string }>): number {
  if (!data.length) return 0;
  if (data.length === 1) return 1;

  const first = parseLiquidityDate(data[0].x);
  const last = parseLiquidityDate(data[data.length - 1].x);
  return (last.year - first.year) * 12 + (last.month - first.month) + 1;
}

export function getDateRangeType(data: Array<{ x: string }>): LiquidityDateRangeType {
  return getLiquidityRangeMonths(data) < 24 ? "monthly" : "yearly";
}

function pickEvenlySpacedTimestamps(timestamps: string[], maxTicks: number): string[] {
  if (!timestamps.length) return [];
  if (maxTicks <= 1) return [timestamps[0]];
  if (timestamps.length <= maxTicks) return timestamps;

  const ticks: string[] = [];
  for (let i = 0; i < maxTicks; i++) {
    const idx = Math.round((i / (maxTicks - 1)) * (timestamps.length - 1));
    ticks.push(timestamps[idx]);
  }

  return [...new Set(ticks)];
}

/** Month labels from actual data timestamps — no fabricated months. */
export function buildLiquidityMonthTicks(data: Array<{ x: string }>): string[] {
  // Monthly mode only applies when span < 24 months — show every available point.
  return data.map((point) => point.x);
}

function parseYear(timestamp: string): number {
  return parseLiquidityDate(timestamp).year;
}

/** Even-year labels from actual data when range is 2+ years. */
export function buildLiquidityYearTicks(data: Array<{ x: string; y: number }>): string[] {
  if (!data.length) return [];

  const firstYear = parseYear(data[0].x);
  const lastYear = parseYear(data[data.length - 1].x);
  const startYear = firstYear % 2 === 0 ? firstYear : firstYear + 1;
  const ticks: string[] = [];

  for (let year = startYear; year <= lastYear; year += 2) {
    const inYear = data.find((point) => parseYear(point.x) === year);
    if (inYear) {
      ticks.push(inYear.x);
      continue;
    }

    const next = data.find((point) => parseYear(point.x) >= year);
    if (next && !ticks.includes(next.x)) {
      ticks.push(next.x);
    }
  }

  if (!ticks.length) {
    return pickEvenlySpacedTimestamps(
      data.map((point) => point.x),
      Math.min(6, data.length),
    );
  }

  return ticks;
}

export function buildLiquidityXAxisTicks(data: Array<{ x: string; y: number }>): {
  rangeType: LiquidityDateRangeType;
  ticks: string[];
} {
  const rangeType = getDateRangeType(data);
  const ticks =
    rangeType === "monthly" ? buildLiquidityMonthTicks(data) : buildLiquidityYearTicks(data);

  return { rangeType, ticks };
}

export function formatGlobalLiquidityXAxisTick(
  timestamp: string,
  rangeType: LiquidityDateRangeType,
  context?: { previousTimestamp?: string },
): string {
  const { year, month } = parseLiquidityDate(timestamp);
  const monthLabel = MONTH_SHORT[month] ?? "";

  if (rangeType === "yearly") {
    return String(year);
  }

  const prevYear = context?.previousTimestamp
    ? parseLiquidityDate(context.previousTimestamp).year
    : year;
  const yearChanged = Boolean(context?.previousTimestamp && year !== prevYear);

  if (month === 0 || yearChanged) {
    return `${monthLabel} ${year}`;
  }

  return monthLabel;
}

export function formatGlobalLiquidityTooltipDate(
  timestamp: string,
  rangeType: LiquidityDateRangeType,
): string {
  const { year, month } = parseLiquidityDate(timestamp);
  if (rangeType === "yearly") {
    return String(year);
  }
  return `${MONTH_SHORT[month] ?? ""} ${year}`;
}

export function buildLiquidityYAxis(data: Array<{ x: string; y: number }>) {
  const peak = Math.max(1, ...data.map((point) => point.y));
  let step = 20;
  if (peak <= 30) step = 5;
  else if (peak <= 60) step = 10;

  const top = Math.max(step, Math.ceil(peak / step) * step);
  const ticks: number[] = [];
  for (let value = 0; value <= top; value += step) {
    ticks.push(value);
  }

  return { max: top, ticks };
}
