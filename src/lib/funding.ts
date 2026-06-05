/** Funding rate stored as a decimal fraction per 8h (e.g. 0.00007 = 0.007%). */

/** Gauge scale: -0.1% (left) to +0.1% (right) per 8h, stored as decimal. */
export const FUNDING_RATE_GAUGE_MIN = -0.001;
export const FUNDING_RATE_GAUGE_MAX = 0.001;

/** Rates within ±0.001% per 8h are treated as neutral positioning. */
export const FUNDING_NEUTRAL_BAND = 0.00001;

const PERIODS_PER_YEAR = 3 * 365;

export function fundingRateToPercent(decimal: number): number {
  return decimal * 100;
}

/** Project an 8h decimal rate to an annualized percentage (3 periods/day × 365 days). */
export function annualizeFundingRate(decimal: number): number {
  return decimal * PERIODS_PER_YEAR * 100;
}

export function fundingGaugePosition(
  rate: number,
  min = FUNDING_RATE_GAUGE_MIN,
  max = FUNDING_RATE_GAUGE_MAX,
): number {
  const span = Math.max(0.000001, max - min);
  return Math.max(0, Math.min(1, (rate - min) / span));
}

export function fundingGaugeZone(rate: number): 0 | 1 | 2 {
  if (rate < -FUNDING_NEUTRAL_BAND) return 0;
  if (rate > FUNDING_NEUTRAL_BAND) return 2;
  return 1;
}
