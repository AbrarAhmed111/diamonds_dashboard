"use client";

import RangeGaugeChart from "@/components/charts/RangeGaugeChart";
import SplitFrame from "./SplitFrame";
import { formatChange, formatValue, getLatestValue } from "@/lib/format";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
}

export default function FundingRateCard({ signal }: Props) {
  const latest = getLatestValue(signal);
  const value = latest?.value ?? 0;

  const min = typeof signal.min_val === "number" ? signal.min_val : -0.05;
  const max = typeof signal.max_val === "number" ? signal.max_val : 0.05;

  const eight = (signal.eight_hour_avg as number | undefined) ?? null;
  const seven = (signal.seven_day_avg as number | undefined) ?? null;
  const annualised = (signal.annualized_estimate as number | undefined) ?? null;
  const oi = (signal.open_interest as number | undefined) ?? null;
  const stateLabel = (signal.state_label as string | undefined) ?? "Balanced";

  return (
    <SplitFrame
      signal={signal}
      badge={{ label: stateLabel, tone: "muted" }}
      description={signal.description}
    >
      <div className="mt-1 flex flex-wrap items-baseline gap-2 sm:gap-3">
        <p className="text-stat-value">
          {formatChange(value * 100, "%")}
        </p>
        <span className="text-meta">
          Per 8h{annualised !== null ? ` · annualised ${formatChange(annualised, "%")}` : ""}
        </span>
      </div>

      <div className="mt-5">
        <RangeGaugeChart
          value={value}
          min={min}
          max={max}
          history={signal.values.slice(-14)}
          ariaLabel={`${signal.name} positioning gauge`}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 sm:mt-5 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-3">
        <Stat label="8h avg" value={eight !== null ? formatChange(eight, "%") : "–"} />
        <Stat label="7d avg" value={seven !== null ? formatChange(seven, "%") : "–"} />
        <Stat
          label="Open interest"
          value={oi !== null ? formatValue(oi, "USD") : "–"}
        />
        <Stat label="Last updated" value="2 min ago" />
      </dl>
    </SplitFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-caption text-ink-muted">{label}</dt>
      <dd className="text-small font-medium text-ink">{value}</dd>
    </div>
  );
}
