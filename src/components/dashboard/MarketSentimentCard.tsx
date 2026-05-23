"use client";

import HalfGaugeChart from "@/components/charts/HalfGaugeChart";
import GaugeAside, { GAUGE_DISPLAY_SIZE } from "./GaugeAside";
import SplitFrame from "./SplitFrame";
import { getLatestValue } from "@/lib/format";
import { gaugeColors } from "@/lib/theme";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
}

export default function MarketSentimentCard({ signal }: Props) {
  const latest = getLatestValue(signal);
  const value = Math.round(latest?.value ?? 0);
  const label = (signal.state_label as string | undefined) ?? deriveLabel(value);
  const color = value <= 50 ? gaugeColors.negative : gaugeColors.positive;

  const subStats: Array<[string, number | undefined]> = [
    ["Social Sentiment", signal.social_sentiment as number | undefined],
    ["Volatility", signal.volatility_score as number | undefined],
    ["Market Momentum", signal.market_momentum as number | undefined],
    ["BTC Dominance", signal.btc_dominance_score as number | undefined],
  ];

  return (
    <SplitFrame
      signal={signal}
      description={signal.description}
      asideExtra={
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:mt-6 sm:gap-y-3">
          {subStats.map(([label, val]) => (
            <div key={label} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
              <dt className="text-[11px] text-ink-muted sm:text-caption">{label}</dt>
              <dd className="text-stat-value">
                {val ?? "–"}
              </dd>
            </div>
          ))}
        </dl>
      }
    >
      <GaugeAside>
        <HalfGaugeChart
          value={value}
          min={typeof signal.min_val === "number" ? signal.min_val : 0}
          max={typeof signal.max_val === "number" ? signal.max_val : 100}
          label={label}
          color={color}
          size={GAUGE_DISPLAY_SIZE}
          ariaLabel={`${signal.name} gauge`}
        />
      </GaugeAside>
    </SplitFrame>
  );
}

function deriveLabel(value: number) {
  if (value <= 25) return "Extreme Fear";
  if (value <= 45) return "Fear";
  if (value <= 55) return "Neutral";
  if (value <= 75) return "Greed";
  return "Extreme Greed";
}
