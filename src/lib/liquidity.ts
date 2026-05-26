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

function parseYear(timestamp: string): number {
  return Number(timestamp.slice(0, 4));
}

/** Figma: even-year labels (2014, 2016, …) across the full series span. */
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

  return ticks;
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
