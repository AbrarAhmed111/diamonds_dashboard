"use client";

import { useMemo } from "react";
import LiquidityLineChart from "@/components/charts/LiquidityLineChart";
import SplitFrame, { SPLIT_CARD_CHART_HEIGHT } from "./SplitFrame";
import { formatGlobalM2Supply, getLatestValue, computePeriodChangePercent } from "@/lib/format";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
  metricLabel?: string;
}

export default function LiquidityCard({
  signal,
  metricLabel = "Global M2 money supply",
}: Props) {
  const latest = getLatestValue(signal);
  const change = useMemo(
    () => computePeriodChangePercent(signal.values),
    [signal.values],
  );

  const tone = change === null ? "muted" : change >= 0 ? "positive" : "negative";

  return (
    <SplitFrame
      signal={signal}
      badge={{
        label: change === null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
        tone,
      }}
      description={signal.description}
    >
      <div>
        <p className="text-stat-value">{formatGlobalM2Supply(latest?.value)}</p>
        <p className="mt-1 text-meta sm:mt-2">{metricLabel}</p>
      </div>

      <div className="mt-4 sm:mt-5">
        <LiquidityLineChart
          values={signal.values}
          height={SPLIT_CARD_CHART_HEIGHT}
          ariaLabel={`${signal.name} long-term chart`}
        />
      </div>
    </SplitFrame>
  );
}
