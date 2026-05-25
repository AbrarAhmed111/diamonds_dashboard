"use client";

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
  history?: SignalValue[];
  ariaLabel?: string;
}

const DEFAULT_ZONES: [ZoneConfig, ZoneConfig, ZoneConfig] = [
  { label: "Shorts crowded" },
  { label: "Neutral" },
  { label: "Longs crowded" },
];

export default function RangeGaugeChart({
  value,
  min,
  max,
  zones = DEFAULT_ZONES,
  history,
  ariaLabel,
}: Props) {
  const span = Math.max(0.000001, max - min);
  const pct = Math.max(0, Math.min(1, (value - min) / span));

  const histValues = (history ?? []).slice(-14);
  const histMax =
    histValues.reduce((acc, v) => Math.max(acc, Math.abs(v.value)), 0) || 1;

  return (
    <div role="img" aria-label={ariaLabel ?? "Funding rate gauge"} className="w-full">
      <div className="relative pt-1">
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
              i === 1 && "text-center text-ink",
              i === 2 && "text-right",
            )}
          >
            {z.label}
          </span>
        ))}
      </div>

      {histValues.length ? (
        <div className="mt-6 sm:mt-7">
          <div className="flex h-[56px] gap-[5px] sm:h-[68px] sm:gap-[6px]">
            {histValues.map((point, i) => {
              const positive = point.value >= 0;
              const ratio = Math.abs(point.value) / histMax;
              const barH = `${Math.max(14, ratio * 100)}%`;
              const isLatest = i === histValues.length - 1;

              return (
                <div key={`${point.timestamp}-${i}`} className="flex min-w-0 flex-1 flex-col">
                  <div className="flex h-1/2 flex-col justify-end">
                    {positive ? (
                      <div
                        aria-hidden
                        className={cn(
                          "w-full rounded-t-[5px] border border-chart/70 border-b-0",
                          isLatest
                            ? "bg-chart"
                            : "bg-gradient-to-b from-chart/90 via-chart/35 to-white",
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
                          "w-full rounded-b-[5px] border border-chart/70 border-t-0",
                          isLatest
                            ? "bg-chart"
                            : "bg-gradient-to-t from-chart/90 via-chart/35 to-white",
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
