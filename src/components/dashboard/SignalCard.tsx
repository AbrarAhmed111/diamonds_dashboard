"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import RangeTabs from "@/components/charts/RangeTabs";
import SignalLineChart from "@/components/charts/SignalLineChart";
import SignalIcon from "./SignalIcon";
import { formatValue, getLatestValue } from "@/lib/format";
import { sliceByRange } from "@/lib/sentiment";
import { cn } from "@/lib/utils";
import type { ChartRange, Signal } from "@/lib/types";

interface SignalCardProps {
  signal: Signal;
  defaultRange?: ChartRange;
  onSelect?: (signal: Signal) => void;
  /** Override the label below the change pill (e.g. "Last 90 days"). */
  rangeCaption?: string;
  /** Override the value displayed (e.g. derived metrics). */
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

  const changePct = useMemo(() => {
    if (!sliced.length) return null;
    const first = sliced[0];
    const last = sliced[sliced.length - 1];
    if (!first || !last || first.value === 0) return null;
    return ((last.value - first.value) / Math.abs(first.value)) * 100;
  }, [sliced]);

  const changeTone =
    changePct === null ? "muted" : changePct >= 0 ? "positive" : "negative";

  const caption = rangeCaption ?? rangeCaptionFor(range);

  return (
    <article className="surface-card overflow-hidden p-5 md:p-7">
      <header className="flex flex-wrap items-center gap-3">
        <SignalIcon id={signal.id} category={signal.category} />
        <h3 className="text-h4 font-medium text-ink">{signal.name}</h3>
        {/*
          MVP: progressive disclosure is intentionally disabled.
          Re-enable this button when the detail view ships.
        <button
          type="button"
          onClick={() => onSelect?.(signal)}
          className="ml-auto inline-flex h-8 items-center gap-1 rounded-full border border-neutral-500/70 bg-white px-3 text-caption text-ink hover:bg-neutral-400 focus-ring"
          aria-label={`See more about ${signal.name}`}
        >
          See more
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        */}
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <p className="text-[28px] md:text-[32px] font-medium leading-none text-ink">
          {valueOverride ?? formatValue(latest?.value, signal.unit)}
        </p>
        <Badge
          tone={changeTone === "positive" ? "positive" : changeTone === "negative" ? "negative" : "muted"}
          size="md"
          className={cn("px-2.5", changeTone === "muted" && "text-ink-muted")}
        >
          {changePct === null ? "–" : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(1)}%`}
        </Badge>
        <span className="text-small text-ink-muted">{caption}</span>
      </div>

      <div className="mt-4">
        <RangeTabs value={range} onChange={setRange} />
      </div>

      <div className="mt-6">
        <SignalLineChart
          values={sliced}
          unit={signal.unit}
          height={210}
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
