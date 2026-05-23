"use client";

import { useMemo } from "react";
import Badge from "@/components/ui/Badge";
import SignalLineChart from "@/components/charts/SignalLineChart";
import SplitFrame from "./SplitFrame";
import { formatValue, getLatestValue } from "@/lib/format";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
  onSelect?: (signal: Signal) => void;
  metricLabel?: string;
}

export default function LiquidityCard({
  signal,
  onSelect,
  metricLabel = "Global M2 money supply",
}: Props) {
  const latest = getLatestValue(signal);
  const change = useMemo(() => {
    if (signal.values.length < 13) return null;
    const last = signal.values[signal.values.length - 1];
    const yearAgo = signal.values[signal.values.length - 13];
    if (!last || !yearAgo || yearAgo.value === 0) return null;
    return ((last.value - yearAgo.value) / Math.abs(yearAgo.value)) * 100;
  }, [signal.values]);

  const tone = change === null ? "muted" : change >= 0 ? "positive" : "negative";

  return (
    <SplitFrame
      signal={signal}
      badge={{
        label: change === null ? "—" : `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`,
        tone,
      }}
      description={signal.description}
      onSelect={onSelect}
    >
      <div className="mt-1 flex flex-wrap items-baseline gap-3">
        <p className="text-[28px] md:text-[32px] font-medium leading-none text-ink">
          {formatValue(latest?.value, signal.unit)}
        </p>
        <Badge tone="muted" className="text-ink-muted">
          {metricLabel}
        </Badge>
      </div>

      <div className="mt-5">
        <SignalLineChart
          values={signal.values}
          unit={signal.unit}
          height={200}
          xAxisMode="year"
          ariaLabel={`${signal.name} long-term chart`}
        />
      </div>
    </SplitFrame>
  );
}
