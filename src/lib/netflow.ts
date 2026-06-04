import type { SignalValue } from "./types";

export interface NetflowChartPoint {
  label: string;
  timestamp: string;
  netflow: number;
}

const netflowDateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** X-axis label, e.g. "May 30", "Jun 1". */
export function formatNetflowAxisDate(timestamp: string): string {
  const d = new Date(`${timestamp.slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return timestamp.slice(0, 10);
  return netflowDateFmt.format(d);
}

/** Last 7 daily netflow points from the API, sorted chronologically. */
export function buildNetflowLast7Days(values: SignalValue[]): NetflowChartPoint[] {
  const sorted = [...values].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  return sorted.slice(-7).map((point) => ({
    label: formatNetflowAxisDate(point.timestamp),
    timestamp: point.timestamp,
    netflow: point.value,
  }));
}

function niceAxisStep(peak: number): number {
  if (peak <= 60) return 10;
  const rawStep = peak / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

/** Signed Y-axis for netflow (positive and negative values). */
export function buildNetflowSignedYAxis(data: NetflowChartPoint[]) {
  if (!data.length) {
    return { min: -1000, max: 1000, ticks: [-1000, 0, 1000] };
  }

  const values = data.map((point) => point.netflow);
  let min = Math.min(...values);
  let max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const pad = Math.max(span * 0.12, 100);

  min = Math.min(min - pad, 0);
  max = Math.max(max + pad, 0);

  const peak = Math.max(Math.abs(min), Math.abs(max), 1);
  const step = niceAxisStep(peak);
  const axisMin = Math.floor(min / step) * step;
  const axisMax = Math.ceil(max / step) * step;

  const ticks: number[] = [];
  for (let value = axisMin; value <= axisMax + step * 0.001; value += step) {
    ticks.push(Number(value.toFixed(2)));
  }

  return { min: axisMin, max: axisMax, ticks };
}
