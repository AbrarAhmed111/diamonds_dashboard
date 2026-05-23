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

interface Props {
  signal: Signal;
  /** Optional metric label shown under the value (e.g. formula). */
  metricLabel?: string;
  /** Override the value displayed (e.g. derived metrics). */
  valueOverride?: string;
  defaultRange?: ChartRange;
  onSelect?: (signal: Signal) => void;
}

export default function SignalSplitCard({
  signal,
  metricLabel,
  valueOverride,
  defaultRange = "3M",
  onSelect,
}: Props) {
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

  const tone = changePct === null ? "muted" : changePct >= 0 ? "positive" : "negative";

  return (
    <article className="surface-card overflow-hidden p-5 md:p-7">
      <div className="grid gap-6 md:grid-cols-[minmax(260px,_2fr)_3fr] md:gap-10">
        {/* Left: identity + description */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <SignalIcon id={signal.id} category={signal.category} />
            <h3 className="text-h4 font-medium text-ink">{signal.name}</h3>
            <Badge
              tone={tone === "positive" ? "positive" : tone === "negative" ? "negative" : "muted"}
              size="md"
              className={cn("px-2.5", tone === "muted" && "text-ink-muted")}
            >
              {changePct === null ? "–" : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(1)}%`}
            </Badge>
          </div>
          <p className="mt-3 text-small text-ink-muted leading-6">
            {signal.description ?? "No description available."}
          </p>
        </div>

        {/* Right: value, range tabs, chart */}
        <div className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[28px] md:text-[32px] font-medium leading-none text-ink">
                {valueOverride ?? formatValue(latest?.value, signal.unit)}
              </p>
              {metricLabel ? (
                <p className="mt-1 text-small text-ink-muted">{metricLabel}</p>
              ) : null}
            </div>
            {/*
              MVP: progressive disclosure is intentionally disabled.
              Re-enable when the detail view ships.
            <button
              type="button"
              onClick={() => onSelect?.(signal)}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-neutral-500/70 bg-white px-3 text-caption text-ink hover:bg-neutral-400 focus-ring"
              aria-label={`See more about ${signal.name}`}
            >
              See more
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            */}
          </div>

          <div className="mt-3">
            <RangeTabs value={range} onChange={setRange} />
          </div>

          <div className="mt-4">
            <SignalLineChart
              values={sliced}
              unit={signal.unit}
              height={170}
              ariaLabel={`${signal.name} ${range} chart`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
