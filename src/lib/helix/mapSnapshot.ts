import type { Signal, SentimentType, SignalValue } from "@/lib/types";
import type { HelixSignal, HelixSignalValue } from "./types";

type Transform = "none" | "dailyLast" | "pctFromStart";

interface DashboardMapping {
  helixIds: string[];
  dashboardId: string;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  transform?: Transform;
  min_val?: number;
  max_val?: number;
}

const DASHBOARD_MAPPINGS: DashboardMapping[] = [
  {
    helixIds: ["btc_price_4h"],
    dashboardId: "btc_price",
    name: "BTC Price",
    category: "technical",
    unit: "USDT",
    transform: "dailyLast",
  },
  {
    helixIds: ["ssr"],
    dashboardId: "buying_power",
    name: "Market Buying Power",
    description:
      "Measures how much stablecoin capital is available to enter the crypto market.",
    category: "on_chain",
    unit: "ratio",
  },
  {
    helixIds: ["btc_exchange_netflow"],
    dashboardId: "btc_netflow",
    name: "BTC Netflow",
    description:
      "Tracks Bitcoin moving in and out of exchanges to identify accumulation or selling pressure.",
    category: "on_chain",
    unit: "BTC",
  },
  {
    helixIds: ["btc_funding_rate"],
    dashboardId: "btc_funding_rate",
    name: "BTC Funding Rate",
    description:
      "Indicates whether traders are overly positioned long or short in the market.",
    category: "sentiment",
    unit: "%",
    min_val: -0.05,
    max_val: 0.05,
  },
  {
    helixIds: ["global_m2", "m2"],
    dashboardId: "global_liquidity",
    name: "Global Liquidity",
    description:
      "Shows whether global financial conditions are supporting or limiting risk assets.",
    category: "macro",
    unit: "usd_billions",
  },
  {
    helixIds: ["fear_greed"],
    dashboardId: "crypto_market_sentiment",
    name: "Crypto Market Sentiment",
    description:
      "Reflects whether crypto investors are currently fearful, neutral, or optimistic.",
    category: "sentiment",
    unit: "index",
    min_val: 0,
    max_val: 100,
  },
  {
    helixIds: ["vix"],
    dashboardId: "vix",
    name: "VIX (Global Volatility)",
    description:
      "Measures overall market uncertainty and investor stress outside crypto markets.",
    category: "macro",
    unit: "index",
    min_val: 0,
    max_val: 50,
  },
];

function dateKey(timestamp: string): string {
  return timestamp.slice(0, 10);
}

function toNumericValues(values: HelixSignalValue[]): SignalValue[] {
  return values
    .map((point) => {
      const value = typeof point.value === "number" ? point.value : Number(point.value);
      if (!Number.isFinite(value)) return null;
      return {
        ...point,
        timestamp: dateKey(point.timestamp),
        value,
      } as SignalValue;
    })
    .filter((point): point is SignalValue => point !== null);
}

function downsampleDailyLast(values: SignalValue[]): SignalValue[] {
  const byDay = new Map<string, SignalValue>();
  for (const point of values) {
    byDay.set(point.timestamp, point);
  }
  return [...byDay.values()].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

function toPctFromStart(values: SignalValue[]): SignalValue[] {
  if (!values.length) return values;
  const base = values[0].value;
  if (base === 0) return values;
  return values.map((point) => ({
    ...point,
    value: Number((((point.value - base) / Math.abs(base)) * 100).toFixed(2)),
  }));
}

function transformValues(values: SignalValue[], transform: Transform = "none"): SignalValue[] {
  if (transform === "dailyLast") return downsampleDailyLast(values);
  if (transform === "pctFromStart") return toPctFromStart(values);
  return values;
}

function readInterpretation(signal: HelixSignal): string | undefined {
  const text = signal.interpretation;
  return typeof text === "string" && text.trim() ? text.trim() : undefined;
}

function latestNumeric(values: SignalValue[]): number | undefined {
  if (!values.length) return undefined;
  return values[values.length - 1].value;
}

function average(values: number[]): number | undefined {
  if (!values.length) return undefined;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function inferSentiment(dashboardId: string, latest?: number): SentimentType {
  if (latest === undefined) return "neutral";
  switch (dashboardId) {
    case "crypto_market_sentiment":
      if (latest >= 55) return "positive";
      if (latest <= 45) return "negative";
      return "neutral";
    case "vix":
      if (latest <= 18) return "positive";
      if (latest >= 25) return "negative";
      return "neutral";
    case "btc_netflow":
      if (latest < 0) return "positive";
      if (latest > 0) return "negative";
      return "neutral";
    case "buying_power":
    case "global_liquidity":
      return latest >= 0 ? "positive" : "negative";
    default:
      return "neutral";
  }
}

function netflowStateLabel(values: SignalValue[]): string | undefined {
  const recent = values.slice(-7);
  if (!recent.length) return undefined;
  const avg = average(recent.map((p) => p.value));
  if (avg === undefined) return undefined;
  return avg < 0
    ? "Accumulation (Outflows > Inflows)"
    : "Distribution (Inflows > Outflows)";
}

function liquidityBadge(values: SignalValue[]): string | undefined {
  if (values.length < 2) return undefined;
  const first = values[0].value;
  const last = values[values.length - 1].value;
  if (first === 0) return undefined;
  const pct = ((last - first) / Math.abs(first)) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

function mapFundingExtras(
  funding: SignalValue[],
  openInterestValues: SignalValue[],
): Record<string, unknown> {
  const latest = latestNumeric(funding);
  const last3 = funding.slice(-3).map((p) => p.value);
  const last21 = funding.slice(-21).map((p) => p.value);
  const eight = average(last3);
  const seven = average(last21);
  const oi = latestNumeric(openInterestValues);

  return {
    ...(eight !== undefined ? { eight_hour_avg: eight } : {}),
    ...(seven !== undefined ? { seven_day_avg: seven } : {}),
    ...(latest !== undefined
      ? { annualized_estimate: latest * 3 * 365 * 100 }
      : {}),
    ...(oi !== undefined ? { open_interest: oi } : {}),
  };
}

function mapOne(
  helix: HelixSignal,
  mapping: DashboardMapping,
  lookup: Map<string, HelixSignal>,
): Signal | null {
  const rawValues = helix.values ?? [];
  if (!rawValues.length) return null;

  let values = transformValues(toNumericValues(rawValues), mapping.transform);
  if (!values.length) return null;

  const latest = latestNumeric(values);
  const interpretation = readInterpretation(helix);
  const openInterest = lookup.get("btc_open_interest");

  const signal: Signal = {
    id: mapping.dashboardId,
    name: mapping.name,
    category: mapping.category ?? helix.category,
    description: mapping.description ?? helix.description ?? undefined,
    source: helix.source ?? undefined,
    unit: mapping.unit ?? helix.unit ?? undefined,
    min_val: mapping.min_val ?? helix.min_val ?? undefined,
    max_val: mapping.max_val ?? helix.max_val ?? undefined,
    status: "healthy",
    sentiment: inferSentiment(mapping.dashboardId, latest),
    interpretation,
    values,
    ...(interpretation ? { state_label: interpretation } : {}),
  };

  if (mapping.dashboardId === "btc_netflow") {
    const stateLabel = netflowStateLabel(values);
    if (stateLabel) signal.state_label = stateLabel;
  }

  if (mapping.dashboardId === "global_liquidity") {
    const badge = liquidityBadge(values);
    if (badge) signal.state_label = badge;
  }

  if (mapping.dashboardId === "btc_funding_rate") {
    const oiValues = openInterest?.values?.length
      ? toNumericValues(openInterest.values)
      : [];
    Object.assign(signal, mapFundingExtras(values, oiValues));
  }

  return signal;
}

export function mapHelixSnapshot(signals: HelixSignal[]): Signal[] {
  const lookup = new Map(signals.map((s) => [s.id, s]));
  const mapped: Signal[] = [];

  for (const mapping of DASHBOARD_MAPPINGS) {
    const helix = mapping.helixIds
      .map((id) => lookup.get(id))
      .find((signal) => signal?.values?.length);
    if (!helix) continue;
    const signal = mapOne(helix, mapping, lookup);
    if (signal) mapped.push(signal);
  }

  return mapped;
}
