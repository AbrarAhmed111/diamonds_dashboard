"use client";

import { useMemo } from "react";
import HalfGaugeChart from "@/components/charts/HalfGaugeChart";
import GaugeAside, { GAUGE_DISPLAY_SIZE } from "./GaugeAside";
import SplitFrame from "./SplitFrame";
import { computeRangeChange, formatChange, getLatestValue, plainSignalText } from "@/lib/format";
import { sliceByRange } from "@/lib/sentiment";
import { gaugeColorForSentiment } from "@/lib/theme";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
}

export default function MarketSentimentCard({ signal }: Props) {
  const latest = getLatestValue(signal);
  const value = Math.round(latest?.value ?? 0);
  const color = gaugeColorForSentiment(signal.sentiment);
  const gaugeLabel = plainSignalText(signal.interpretation) ?? deriveLabel(value);

  const { change7d, change30d } = useMemo(() => {
    const weekValues = sliceByRange(signal.values, "1W");
    const monthValues = sliceByRange(signal.values, "1M");
    return {
      change7d: computeRangeChange(weekValues, "relative"),
      change30d: computeRangeChange(monthValues, "relative"),
    };
  }, [signal.values]);

  const changeBullets = [
    { label: "7d change", value: formatChange(change7d, "%", 1) },
    { label: "30d change", value: formatChange(change30d, "%", 1) },
  ];

  return (
    <SplitFrame
      signal={signal}
      description={signal.description}
      descriptionExtra={
        <ul className="space-y-1.5 text-small text-ink-muted">
          {changeBullets.map((item) => (
            <li key={item.label} className="flex gap-1.5">
              <span aria-hidden className="text-ink-subtle">
                •
              </span>
              <span>
                <span className="text-ink">{item.label}:</span> {item.value}
              </span>
            </li>
          ))}
        </ul>
      }
    >
      <GaugeAside>
        <HalfGaugeChart
          value={value}
          min={typeof signal.min_val === "number" ? signal.min_val : 0}
          max={typeof signal.max_val === "number" ? signal.max_val : 100}
          label={gaugeLabel}
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
