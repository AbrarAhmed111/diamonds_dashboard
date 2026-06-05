"use client";

import RangeGaugeChart from "@/components/charts/RangeGaugeChart";
import SplitFrame from "./SplitFrame";
import {
  FUNDING_RATE_GAUGE_MAX,
  FUNDING_RATE_GAUGE_MIN,
  annualizeFundingRate,
  fundingGaugeZone,
  fundingRateToPercent,
} from "@/lib/funding";
import { formatChange, formatValue, getLatestValue, plainSignalText } from "@/lib/format";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
}

export default function FundingRateCard({ signal }: Props) {
  const latest = getLatestValue(signal);
  const value = latest?.value ?? 0;

  const seven = (signal.seven_day_avg as number | undefined) ?? null;
  const annualized =
    (signal.annualized_estimate as number | undefined) ??
    (Number.isFinite(value) ? annualizeFundingRate(value) : null);
  const oi = (signal.open_interest as number | undefined) ?? null;
  const oiInterpretation = plainSignalText(
    signal.open_interest_interpretation as string | undefined,
  );
  const badgeLabel =
    plainSignalText(signal.interpretation) ?? (signal.state_label as string | undefined) ?? "–";

  return (
    <SplitFrame
      signal={signal}
      badge={{ label: badgeLabel, tone: "muted" }}
      description={signal.description}
    >
      <div className="mt-1 flex flex-wrap items-baseline gap-2 sm:gap-3">
        <p className="text-stat-value">
          {formatChange(fundingRateToPercent(value), "%", 3)}
        </p>
        <span className="text-meta">Per 8h</span>
      </div>

      <div className="mt-4 flex flex-1 flex-col justify-center sm:mt-5">
        <RangeGaugeChart
          value={value}
          min={FUNDING_RATE_GAUGE_MIN}
          max={FUNDING_RATE_GAUGE_MAX}
          activeZoneIndex={fundingGaugeZone(value)}
          history={signal.values.slice(-14)}
          ariaLabel={`${signal.name} positioning gauge`}
        />
      </div>

      <dl className="mt-4 space-y-3 sm:mt-5">
        <Stat
          label="7d avg"
          value={seven !== null ? formatChange(fundingRateToPercent(seven), "%", 3) : "–"}
        />
        <Stat
          label="Annualized"
          value={annualized !== null ? formatChange(annualized, "%", 2) : "–"}
        />
        <div>
          <dt className="text-caption text-ink-muted">Open Interest</dt>
          <dd className="mt-0.5 flex flex-wrap items-baseline gap-2 text-small font-medium text-ink">
            <span>{oi !== null ? formatValue(oi, "USD") : "–"}</span>
            {oiInterpretation ? (
              <span className="font-normal text-ink-muted">{oiInterpretation}</span>
            ) : null}
          </dd>
        </div>
      </dl>
    </SplitFrame>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-caption text-ink-muted">{label}</dt>
      <dd className="mt-0.5 text-small font-medium text-ink">{value}</dd>
    </div>
  );
}
