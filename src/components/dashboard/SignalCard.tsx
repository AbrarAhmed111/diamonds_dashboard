"use client";

import { useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import RangeTabs from "@/components/charts/RangeTabs";
import SignalLineChart from "@/components/charts/SignalLineChart";
import SignalIcon from "./SignalIcon";
import { formatValue, getLatestValue, computeRangeChange } from "@/lib/format";
import { sliceByRange } from "@/lib/sentiment";
import { cn } from "@/lib/utils";
import type { ChartRange, Signal } from "@/lib/types";

interface SignalCardProps {
  signal: Signal;
  defaultRange?: ChartRange;
  onSelect?: (signal: Signal) => void;
  rangeCaption?: string;
  valueOverride?: string;
}

export default function SignalCard({
  signal,
  defaultRange = "3M",
  onSelect,
  rangeCaption,
  valueOverride,
}: SignalCardProps) {
  const [range, setRange] = useState<ChartRange>(defaultRange);
  const sliced = useMemo(() => sliceByRange(signal.values, range), [signal.values, range]);

  const latest = getLatestValue(signal);

  const changePct = useMemo(() => computeRangeChange(sliced), [sliced]);

  const changeTone =
    changePct === null ? "muted" : changePct >= 0 ? "positive" : "negative";

  const caption = rangeCaption ?? rangeCaptionFor(range);

  return (
    <article className="surface-card surface-card-pad overflow-hidden">
      <header className="flex flex-wrap items-center gap-2 sm:gap-3">
        <SignalIcon id={signal.id} category={signal.category} size="sm" />
        <h3 className="text-body-bold">{signal.name}</h3>
        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(signal)}
            className="ml-auto text-caption font-medium text-blue-700 hover:text-blue-800 focus-ring"
          >
            View details
          </button>
        ) : null}
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
        <p className="text-metric">
          {valueOverride ?? formatValue(latest?.value, signal.unit)}
        </p>
        <Badge
          tone={changeTone === "positive" ? "positive" : changeTone === "negative" ? "negative" : "muted"}
          size="md"
          className={cn("px-2.5", changeTone === "muted" && "text-ink-muted")}
        >
          {changePct === null ? "–" : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(1)}%`}
        </Badge>
        <span className="text-meta">{caption}</span>
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

function rangeCaptionFor(range: ChartRange) {
  switch (range) {
    case "1D":
      return "Last 24 hours";
    case "1W":
      return "Last 7 days";
    case "1M":
      return "Last 30 days";
    case "3M":
      return "Last 90 days";
    case "12M":
    default:
      return "Last 12 months";
  }
}
