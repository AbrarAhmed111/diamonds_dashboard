"use client";

import { useMemo, useState } from "react";
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
}

export default function SignalSplitCard({
  signal,
  metricLabel,
  valueOverride,
  defaultRange = "3M",
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
    <article className="surface-card surface-card-pad overflow-hidden">
      <div className="grid items-stretch gap-4 sm:gap-5 md:grid-cols-2 md:gap-10">
        <aside className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <SignalIcon id={signal.id} category={signal.category} size="sm" />
            <h3 className="text-card-title">{signal.name}</h3>
            <Badge
              tone={tone === "positive" ? "positive" : tone === "negative" ? "negative" : "muted"}
              size="md"
              className={cn("px-2.5", tone === "muted" && "text-ink-muted")}
            >
              {changePct === null ? "–" : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(1)}%`}
            </Badge>
          </div>
          <p className="mt-2 w-full text-card-body sm:mt-3 md:max-w-[75%]">
            {signal.description ?? "No description available."}
          </p>
        </aside>

        <div className="flex min-w-0 flex-col md:min-h-0">
          <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
            <div>
              <p className="text-metric">
                {valueOverride ?? formatValue(latest?.value, signal.unit)}
              </p>
              {metricLabel ? (
                <p className="mt-1 text-[13px] text-ink-muted sm:text-small">{metricLabel}</p>
              ) : null}
            </div>
          </div>

          <div className="mt-3">
            <RangeTabs value={range} onChange={setRange} />
          </div>

          <div className="mt-4">
            <SignalLineChart
              values={sliced}
              unit={signal.unit}
              height={150}
              ariaLabel={`${signal.name} ${range} chart`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
