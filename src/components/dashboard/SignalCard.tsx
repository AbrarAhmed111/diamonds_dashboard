"use client";

import Badge from "@/components/ui/Badge";
import RangeTabs from "@/components/charts/RangeTabs";
import SignalLineChart from "@/components/charts/SignalLineChart";
import SignalIcon from "./SignalIcon";
import { useSignalRange } from "@/lib/useSignalRange";
import { cn } from "@/lib/utils";
import type { ChartRange, Signal } from "@/lib/types";

interface SignalCardProps {
  signal: Signal;
  defaultRange?: ChartRange;
  rangeCaption?: string;
  valueOverride?: string;
}

export default function SignalCard({
  signal,
  defaultRange = "3M",
  rangeCaption,
  valueOverride,
}: SignalCardProps) {
  const { range, setRange, sliced, changePct, displayValue, caption } = useSignalRange(signal, {
    defaultRange,
  });

  const changeTone =
    changePct === null ? "muted" : changePct >= 0 ? "positive" : "negative";

  const periodCaption = rangeCaption ?? caption;

  return (
    <article className="surface-card surface-card-pad overflow-hidden">
      <header className="flex flex-wrap items-center gap-2 sm:gap-3">
        <SignalIcon id={signal.id} category={signal.category} size="sm" />
        <h3 className="text-body-bold">{signal.name}</h3>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
        <p className="text-metric">{valueOverride ?? displayValue}</p>
        <Badge
          tone={changeTone === "positive" ? "positive" : changeTone === "negative" ? "negative" : "muted"}
          size="md"
          className={cn("px-2.5", changeTone === "muted" && "text-ink-muted")}
        >
          {changePct === null ? "–" : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(1)}%`}
        </Badge>
        <span className="text-meta">{periodCaption}</span>
      </div>

      <div className="mt-3 sm:mt-4">
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="mt-4 sm:mt-6">
        <SignalLineChart
          values={sliced}
          unit={signal.unit}
          height={180}
          ariaLabel={`${signal.name} ${range} chart`}
        />
      </div>
    </article>
  );
}
