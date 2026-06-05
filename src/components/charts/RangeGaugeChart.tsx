"use client";

import { useState } from "react";
import { fundingRateToPercent } from "@/lib/funding";
import { formatChange, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { chartColors } from "@/lib/theme";
import type { SignalValue } from "@/lib/types";

interface ZoneConfig {
  label: string;
}

interface Props {
  value: number;
  min: number;
  max: number;
  zones?: [ZoneConfig, ZoneConfig, ZoneConfig];
  /** Which zone label to emphasize (0 = left, 1 = center, 2 = right). */
  activeZoneIndex?: 0 | 1 | 2;
  history?: SignalValue[];
  ariaLabel?: string;
}

const DEFAULT_ZONES: [ZoneConfig, ZoneConfig, ZoneConfig] = [
  { label: "Shorts crowded" },
  { label: "Neutral" },
  { label: "Longs crowded" },
];

const TOOLTIP_CLASS =
  "pointer-events-none absolute z-10 w-max max-w-[9rem] rounded-lg border border-neutral-500/60 bg-white/95 px-2.5 py-2 text-caption shadow-card backdrop-blur";

function RateTooltip({
  rateLabel,
  dateLabel,
  style,
  placement = "above",
}: {
  rateLabel: string;
  dateLabel?: string;
  style?: React.CSSProperties;
  placement?: "above" | "below";
}) {
  return (
    <div
      role="tooltip"
      className={cn(
        TOOLTIP_CLASS,
        placement === "above"
          ? "bottom-full mb-2 -translate-x-1/2"
          : "top-full mt-2 -translate-x-1/2",
      )}
      style={style}
    >
      {dateLabel ? <p className="font-medium text-ink">{dateLabel}</p> : null}
      <p className={cn("text-ink", dateLabel && "mt-0.5")}>
        {rateLabel} <span className="text-ink-muted">per 8h</span>
      </p>
    </div>
  );
}

export default function RangeGaugeChart({
  value,
  min,
  max,
  zones = DEFAULT_ZONES,
  activeZoneIndex,
  history,
  ariaLabel,
}: Props) {
  const span = Math.max(0.000001, max - min);
  const pct = Math.max(0, Math.min(1, (value - min) / span));
  const activeZone =
    activeZoneIndex ?? (pct < 1 / 3 ? 0 : pct > 2 / 3 ? 2 : 1);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [gaugeHovered, setGaugeHovered] = useState(false);

  const currentRateLabel = formatChange(fundingRateToPercent(value), "%", 3);

  const histValues = (history ?? []).slice(-14);
  const histMax =
    histValues.reduce((acc, v) => Math.max(acc, Math.abs(v.value)), 0) || 1;

  return (
    <div role="img" aria-label={ariaLabel ?? "Funding rate gauge"} className="w-full">
      <div
        className="relative py-2"
        onMouseEnter={() => setGaugeHovered(true)}
        onMouseLeave={() => setGaugeHovered(false)}
      >
        {gaugeHovered ? (
          <RateTooltip
            rateLabel={currentRateLabel}
            style={{ left: `${pct * 100}%` }}
          />
        ) : null}

        <div
          className="h-[9px] w-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${chartColors.chart} 0%, ${chartColors.chartSoft} 38%, ${chartColors.white} 50%, ${chartColors.chartSoft} 62%, ${chartColors.chart} 100%)`,
          }}
        />
        <span
          aria-hidden
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-900 ring-2 ring-white"
          style={{ left: `${pct * 100}%` }}
        />
      </div>

      <div className="mt-2.5 flex justify-between text-caption text-ink-muted">
        {zones.map((z, i) => (
          <span
            key={z.label}
            className={cn(
              i === 0 && "text-left",
              i === 1 && "text-center",
              i === 2 && "text-right",
              i === activeZone ? "font-medium text-ink" : "text-ink-muted",
            )}
          >
            {z.label}
          </span>
        ))}
      </div>

      {histValues.length ? (
        <div className="mt-6 sm:mt-7">
          <div className="relative flex h-[64px] gap-[5px] sm:h-[80px] sm:gap-[6px] md:h-[88px]">
            {histValues.map((point, i) => {
              const positive = point.value >= 0;
              const ratio = Math.abs(point.value) / histMax;
              const barH = `${Math.max(14, ratio * 100)}%`;
              const isLatest = i === histValues.length - 1;
              const isHovered = hoveredIndex === i;
              const rateLabel = formatChange(fundingRateToPercent(point.value), "%", 3);

              return (
                <div
                  key={`${point.timestamp}-${i}`}
                  className="relative flex min-w-0 flex-1 flex-col"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {isHovered ? (
                    <RateTooltip
                      rateLabel={rateLabel}
                      dateLabel={formatDate(point.timestamp)}
                      style={{ left: "50%" }}
                    />
                  ) : null}

                  <div className="flex h-1/2 flex-col justify-end">
                    {positive ? (
                      <div
                        aria-hidden
                        className={cn(
                          "w-full rounded-t-[5px] border border-chart/70 border-b-0 transition-opacity duration-fast",
                          isLatest
                            ? "bg-chart"
                            : "bg-gradient-to-b from-chart/90 via-chart/35 to-white",
                          isHovered && "opacity-90",
                        )}
                        style={{ height: barH }}
                      />
                    ) : null}
                  </div>
                  <div className="flex h-1/2 flex-col justify-start">
                    {!positive ? (
                      <div
                        aria-hidden
                        className={cn(
                          "w-full rounded-b-[5px] border border-chart/70 border-t-0 transition-opacity duration-fast",
                          isLatest
                            ? "bg-chart"
                            : "bg-gradient-to-t from-chart/90 via-chart/35 to-white",
                          isHovered && "opacity-90",
                        )}
                        style={{ height: barH }}
                      />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2.5 text-caption text-ink-muted">14-day history</p>
        </div>
      ) : null}
    </div>
  );
}
