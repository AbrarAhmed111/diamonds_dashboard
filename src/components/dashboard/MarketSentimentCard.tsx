"use client";

import HalfGaugeChart from "@/components/charts/HalfGaugeChart";
import GaugeAside, { GAUGE_DISPLAY_SIZE } from "./GaugeAside";
import SplitFrame from "./SplitFrame";
import { getLatestValue } from "@/lib/format";
import { gaugeColorForSentiment } from "@/lib/theme";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
}

export default function MarketSentimentCard({ signal }: Props) {
  const latest = getLatestValue(signal);
  const value = Math.round(latest?.value ?? 0);
  const label = (signal.state_label as string | undefined) ?? deriveLabel(value);
  const color = gaugeColorForSentiment(signal.sentiment);

  return (
    <SplitFrame signal={signal} description={signal.description}>
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
