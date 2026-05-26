"use client";

import { useMemo } from "react";
import NetflowBarChart from "@/components/charts/NetflowBarChart";
import SplitFrame, { SPLIT_CARD_CHART_HEIGHT } from "./SplitFrame";
import { formatBtcNetflow, formatBtcVolume, formatChange } from "@/lib/format";
import { buildNetflowWeek, computeNetflowWeekMetrics } from "@/lib/netflow";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
}

export default function NetflowCard({ signal }: Props) {
  const weekData = useMemo(() => buildNetflowWeek(signal.values), [signal.values]);
  const metrics = useMemo(
    () => computeNetflowWeekMetrics(signal.values),
    [signal.values],
  );

  const exchangeBalanceChange = metrics.exchangeBalanceChangeWoW;
  const exchangeBalanceLabel = formatChange(exchangeBalanceChange, "%", 1);

  const stateLabel =
    typeof signal.state_label === "string"
      ? signal.state_label
      : "Accumulation (Outflows > Inflows)";

  const badgeTone =
    signal.sentiment === "negative"
      ? "negative"
      : signal.sentiment === "positive"
        ? "positive"
        : "muted";

  const breakdown = [
    { label: "Netflow", value: formatBtcNetflow(metrics.netflowWeek) },
    { label: "Net Outflow", value: formatBtcVolume(metrics.grossOutflow) },
    {
      label: "Exchange Balance Change",
      value: `${exchangeBalanceLabel} Week over Week`,
    },
  ];

  return (
    <SplitFrame
      signal={signal}
      badge={{ label: stateLabel, tone: badgeTone }}
      description={signal.description}
      descriptionExtra={
        <ul className="space-y-1.5 text-small text-ink-muted">
          {breakdown.map((item) => (
            <li key={item.label} className="flex gap-1.5">
              <span aria-hidden className="text-ink-subtle">
                •
              </span>
              <span>
                <span className="text-ink">{item.label}:</span> {item.value}
              </span>
            </li>
          ))}
        </ul>
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 sm:gap-x-6">
        <div className="min-w-[7rem]">
          <p className="text-stat-value">{exchangeBalanceLabel}</p>
          <p className="mt-1 text-meta sm:mt-2">Exchange balance change · Week over Week</p>
        </div>

        <div className="flex flex-col gap-2.5 pt-0.5 text-caption text-ink-muted">
          <span className="inline-flex items-center gap-2.5">
            <span
              aria-hidden
              className="h-[3px] w-5 rounded-full"
              style={{ backgroundColor: "#4195E9" }}
            />
            Inflows
          </span>
          <span className="inline-flex items-center gap-2.5">
            <span
              aria-hidden
              className="h-[3px] w-5 rounded-full"
              style={{ backgroundColor: "#B6D6F7" }}
            />
            Outflows
          </span>
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        <NetflowBarChart
          data={weekData}
          height={SPLIT_CARD_CHART_HEIGHT}
          ariaLabel={`${signal.name} weekly inflow vs outflow`}
        />
      </div>
    </SplitFrame>
  );
}
