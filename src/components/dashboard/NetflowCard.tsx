"use client";

import { useMemo } from "react";
import NetflowBarChart from "@/components/charts/NetflowBarChart";
import SplitFrame, { SPLIT_CARD_CHART_HEIGHT } from "./SplitFrame";
import { formatBtcNetflow, getLatestValue, plainSignalText } from "@/lib/format";
import { buildNetflowLast7Days } from "@/lib/netflow";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
}

export default function NetflowCard({ signal }: Props) {
  const chartData = useMemo(() => buildNetflowLast7Days(signal.values), [signal.values]);
  const latest = getLatestValue(signal);
  const latestNetflow = latest?.value ?? 0;

  const badge =
    latestNetflow < 0
      ? { label: "Leaving Exchanges (bullish)", tone: "positive" as const }
      : latestNetflow > 0
        ? { label: "Entering Exchanges (bearish)", tone: "negative" as const }
        : { label: "Neutral", tone: "neutral" as const };

  const interpretation = plainSignalText(signal.interpretation);

  return (
    <SplitFrame
      signal={signal}
      badge={badge}
      description={signal.description}
      descriptionExtra={
        interpretation ? (
          <p className="text-small text-ink-muted">
            <span className="font-medium text-ink">Interpretation:</span> {interpretation}
          </p>
        ) : null
      }
    >
      <div>
        <p className="text-stat-value">{formatBtcNetflow(latestNetflow)}</p>
        <p className="mt-1 text-meta sm:mt-2">Netflow</p>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-center sm:mt-5">
        <NetflowBarChart
          data={chartData}
          height={SPLIT_CARD_CHART_HEIGHT}
          ariaLabel={`${signal.name} 7-day netflow`}
        />
      </div>
    </SplitFrame>
  );
}
