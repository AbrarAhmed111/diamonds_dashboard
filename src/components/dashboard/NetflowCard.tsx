"use client";

import Badge from "@/components/ui/Badge";
import BarSeriesChart from "@/components/charts/BarSeriesChart";
import SplitFrame from "./SplitFrame";
import { formatChange } from "@/lib/format";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
  onSelect?: (signal: Signal) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildWeeklyData(signal: Signal) {
  const values = signal.values.slice(-7);
  return values.map((v, i) => {
    const inflows = typeof v.inflows === "number" ? (v.inflows as number) : Math.abs(v.value);
    const outflows =
      typeof v.outflows === "number" ? (v.outflows as number) : Math.max(0, inflows - v.value);
    const dt = new Date(v.timestamp);
    const dayIndex = (dt.getUTCDay() + 6) % 7; // Mon=0..Sun=6
    return {
      label: WEEKDAYS[dayIndex] ?? `D${i}`,
      primary: inflows,
      secondary: outflows,
    };
  });
}

export default function NetflowCard({ signal, onSelect }: Props) {
  const data = buildWeeklyData(signal);
  const totalInflow = data.reduce((acc, d) => acc + d.primary, 0);
  const totalOutflow = data.reduce((acc, d) => acc + d.secondary, 0);
  const netRatio = totalInflow === 0 ? 0 : ((totalInflow - totalOutflow) / totalInflow) * 100;
  const stateLabel =
    typeof signal.state_label === "string"
      ? (signal.state_label as string)
      : netRatio >= 0
        ? "Accumulation (Outflows > Inflows)"
        : "Distribution (Inflows > Outflows)";

  return (
    <SplitFrame
      signal={signal}
      badge={{ label: stateLabel, tone: netRatio >= 0 ? "positive" : "negative" }}
      description={signal.description}
      onSelect={onSelect}
    >
      <div className="mt-1 flex flex-wrap items-baseline gap-3">
        <p className="text-[28px] md:text-[32px] font-medium leading-none text-ink">
          {formatChange(netRatio, "%")}
        </p>
        <span className="text-small text-ink-muted">Last week</span>
      </div>
      <div className="mt-4 -mx-1">
        <BarSeriesChart
          data={data}
          primaryLabel="Inflows"
          secondaryLabel="Outflows"
          height={210}
          ariaLabel={`${signal.name} weekly inflow vs outflow`}
        />
      </div>
    </SplitFrame>
  );
}
