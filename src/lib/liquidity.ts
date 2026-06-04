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

/** Y-axis domain from data min/max (not zero) so M2 moves are easier to read. */
export function buildLiquidityYAxis(data: Array<{ x: string; y: number }>) {
  if (!data.length) {
    return { min: 0, max: 1, ticks: [0, 1] };
  }

  const values = data.map((point) => point.y);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const span = Math.max(dataMax - dataMin, 0.001);
  const pad = Math.max(span * 0.06, 0.05);

  let step = 0.5;
  if (span <= 0.5) step = 0.1;
  else if (span <= 1.5) step = 0.2;
  else if (span <= 4) step = 0.5;
  else if (span <= 10) step = 1;
  else if (span <= 25) step = 2;
  else step = 5;

  const min = Math.floor((dataMin - pad) / step) * step;
  const max = Math.ceil((dataMax + pad) / step) * step;

  const ticks: number[] = [];
  for (let value = min; value <= max + step * 0.0001; value += step) {
    ticks.push(Number(value.toFixed(2)));
  }

  return { min, max, ticks };
}
