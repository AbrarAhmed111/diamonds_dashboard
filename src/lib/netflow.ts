import type { SignalValue } from "./types";

export interface NetflowSeriesPoint {
  label: string;
  inflows: number;
  outflows: number;
}

const WEEKDAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function weekdayIndex(timestamp: string): number {
  const day = new Date(timestamp).getUTCDay();
  return day === 0 ? 6 : day - 1;
}

function weekdayLabel(timestamp: string): string {
  return WEEKDAY_ORDER[weekdayIndex(timestamp)] ?? "Mon";
}

/** Last 7 daily points sorted Mon → Sun for the grouped bar chart. */
export function buildNetflowWeek(values: SignalValue[]): NetflowSeriesPoint[] {
  const last7 = values.slice(-7);
  return [...last7]
    .sort((a, b) => weekdayIndex(a.timestamp) - weekdayIndex(b.timestamp))
    .map((point) => ({
      label: weekdayLabel(point.timestamp),
      inflows: typeof point.inflows === "number" ? point.inflows : Math.max(0, point.value),
      outflows: typeof point.outflows === "number" ? point.outflows : Math.max(0, -point.value),
    }));
}
