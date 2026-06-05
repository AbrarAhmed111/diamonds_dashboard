"use client";

import Badge from "@/components/ui/Badge";
import RangeTabs from "@/components/charts/RangeTabs";
import SignalLineChart from "@/components/charts/SignalLineChart";
import SignalIcon from "./SignalIcon";
import SignalDescription from "./SignalDescription";
import { SPLIT_CARD_CHART_HEIGHT } from "./SplitFrame";
import { type RangeChangeMode } from "@/lib/format";
import { useSignalRange, type RangeValueMode } from "@/lib/useSignalRange";
import type { ChartRange, Signal } from "@/lib/types";

interface Props {
  signal: Signal;
  metricLabel?: string;
  valueOverride?: string;
  defaultRange?: ChartRange;
  ranges?: ChartRange[];
  rangeChangeMode?: RangeChangeMode;
  valueMode?: RangeValueMode;
}

export default function SignalSplitCard({
  signal,
  metricLabel,
  valueOverride,
  defaultRange = "3M",
  ranges,
  rangeChangeMode = "relative",
  valueMode = "end",
}: Props) {
  const { range, setRange, sliced, changePct, displayValue } = useSignalRange(signal, {
    defaultRange,
    allowedRanges: ranges,
    changeMode: rangeChangeMode,
    valueMode,
  });

  const tone = changePct === null ? "muted" : changePct >= 0 ? "positive" : "negative";

  return (
    <article className="signal-split-card surface-card surface-card-pad overflow-hidden">
      <div className="grid items-start gap-5 sm:gap-6 md:grid-cols-2 md:items-stretch md:gap-10">
        <aside className="signal-split-card__aside">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <SignalIcon id={signal.id} category={signal.category} size="sm" />
            <h3 className="text-card-title">{signal.name}</h3>
            <Badge
              tone={
                tone === "positive" ? "positive" : tone === "negative" ? "negative" : "neutral"
              }
              size="md"
              className="px-3"
            >
              {changePct === null ? "–" : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(1)}%`}
            </Badge>
          </div>
          <SignalDescription
            html={signal.description ?? "No description available."}
            className="mt-5 flex-1 w-full sm:mt-6 md:max-w-[90%]"
          />
        </aside>

        <div className="signal-split-card__chart">
          <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
            <div>
              <p className="text-stat-value">{valueOverride ?? displayValue}</p>
              {metricLabel ? (
                <p className="mt-1 text-meta">{metricLabel}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-3">
            <RangeTabs value={range} onChange={setRange} ranges={ranges} />
          </div>

          <div className="mt-4 flex flex-1 flex-col justify-center">
            <SignalLineChart
              values={sliced}
              unit={signal.unit}
              height={SPLIT_CARD_CHART_HEIGHT}
              ariaLabel={`${signal.name} ${range} chart`}
              chartRange={range}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
