import type { SignalValue } from "./types";

export interface NetflowSeriesPoint {
  label: string;
  inflows: number;
  outflows: number;
}

export interface NetflowWeekMetrics {
  netflowWeek: number;
  grossInflow: number;
  grossOutflow: number;
  exchangeBalanceChangeWoW: number | null;
}

const WEEKDAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function weekdayIndex(timestamp: string): number {
  const day = new Date(`${timestamp.slice(0, 10)}T00:00:00.000Z`).getUTCDay();
  return day === 0 ? 6 : day - 1;
}

function weekdayLabel(timestamp: string): string {
  return WEEKDAY_ORDER[weekdayIndex(timestamp)] ?? "Mon";
}

function splitFlows(point: SignalValue): { inflows: number; outflows: number } {
  if (typeof point.inflows === "number" && typeof point.outflows === "number") {
    return {
      inflows: Math.max(0, point.inflows),
      outflows: Math.max(0, point.outflows),
    };
  }

  const net = point.value;
  return {
    inflows: Math.max(0, net),
    outflows: Math.max(0, -net),
  };
}

export function computeNetflowWeekMetrics(values: SignalValue[]): NetflowWeekMetrics {
  const last7 = values.slice(-7);
  const netflowWeek = last7.reduce((sum, point) => sum + point.value, 0);
  const grossInflow = last7.reduce((sum, point) => sum + splitFlows(point).inflows, 0);
  const grossOutflow = last7.reduce((sum, point) => sum + splitFlows(point).outflows, 0);

  let exchangeBalanceChangeWoW: number | null = null;
  if (values.length > 7) {
    const balanceNow = values.reduce((sum, point) => sum + point.value, 0);
    const balanceWeekAgo = values.slice(0, -7).reduce((sum, point) => sum + point.value, 0);
    if (balanceWeekAgo !== 0) {
      exchangeBalanceChangeWoW =
        ((balanceNow - balanceWeekAgo) / Math.abs(balanceWeekAgo)) * 100;
    }
  }

  return {
    netflowWeek,
    grossInflow,
    grossOutflow,
    exchangeBalanceChangeWoW,
  };
}

export function buildNetflowWeek(values: SignalValue[]): NetflowSeriesPoint[] {
  const last7 = values.slice(-7);
  return [...last7]
    .sort((a, b) => weekdayIndex(a.timestamp) - weekdayIndex(b.timestamp))
    .map((point) => {
      const { inflows, outflows } = splitFlows(point);
      return {
        label: weekdayLabel(point.timestamp),
        inflows,
        outflows,
      };
    });
}

function niceAxisStep(peak: number): number {
  if (peak <= 60) return 10;
  const rawStep = peak / 5;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const normalized = rawStep / magnitude;
  if (normalized <= 1) return magnitude;
  if (normalized <= 2) return 2 * magnitude;
  if (normalized <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

export function buildNetflowYAxis(data: NetflowSeriesPoint[]) {
  const peak = Math.max(
    1,
    ...data.flatMap((point) => [point.inflows, point.outflows]),
  );
  const step = niceAxisStep(peak);
  const top = Math.max(step, Math.ceil(peak / step) * step);
  const ticks: number[] = [];
  for (let value = 0; value <= top; value += step) {
    ticks.push(value);
  }
  return { max: top, ticks };
}
