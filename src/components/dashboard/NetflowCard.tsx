"use client";

import { useMemo } from "react";
import NetflowBarChart from "@/components/charts/NetflowBarChart";
import SplitFrame from "./SplitFrame";
import { formatChange, getValueChangePercent } from "@/lib/format";
import { buildNetflowWeek } from "@/lib/netflow";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
}

export default function NetflowCard({ signal }: Props) {
  const weekData = useMemo(() => buildNetflowWeek(signal.values), [signal.values]);
  const weekChange = useMemo(() => getValueChangePercent(signal, 6), [signal]);

  const stateLabel =
    typeof signal.state_label === "string"
      ? signal.state_label
      : "Accumulation (Outflows > Inflows)";

  return (
    <SplitFrame
      signal={signal}
      badge={{ label: stateLabel, tone: "positive" }}
      description={signal.description}
    >
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
        <div>
          <p className="text-[28px] font-medium leading-none text-ink md:text-[32px]">
            {formatChange(weekChange, "%", 3)}
          </p>
          <p className="mt-2 text-small text-ink-muted">Last week</p>
        </div>

        <div className="flex flex-col gap-2 pt-0.5 text-caption text-ink-muted">
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1 w-5 rounded-full bg-chart" />
            Inflows
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden className="h-1 w-5 rounded-full bg-chart-soft" />
            Outflows
          </span>
        </div>
      </div>

      <div className="mt-4">
        <NetflowBarChart
          data={weekData}
          ariaLabel={`${signal.name} weekly inflow vs outflow`}
        />
      </div>
    </SplitFrame>
  );
}
