"use client";

import { cn } from "@/lib/utils";
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
  { label: "Long crowded" },
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
  const histMax = histValues.reduce((acc, v) => Math.max(acc, Math.abs(v.value)), 0) || 1;

  return (
    <div role="img" aria-label={ariaLabel ?? "Funding rate gauge"} className="w-full">
      {/* Zone bar */}
      <div className="relative">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full">
          <div className="flex-1 bg-chart/35" />
          <div className="flex-1 bg-chart-soft" />
          <div className="flex-1 bg-chart/35" />
        </div>
        {/* Marker */}
        <span
          aria-hidden
          className="absolute top-1/2 grid h-4 w-4 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-neutral-900 ring-2 ring-white shadow-card"
          style={{ left: `${pct * 100}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-caption text-ink-muted">
        {zones.map((z, i) => (
          <span key={z.label} className={cn(i === 1 && "text-ink")}>
            {z.label}
          </span>
        ))}
      </div>

      {/* 14-day mini histogram */}
      {histValues.length ? (
        <div className="mt-5">
          <p className="text-caption text-ink-muted">14-day history</p>
          <div className="mt-2 flex h-12 items-end gap-1.5">
            {histValues.map((point, i) => {
              const ratio = Math.abs(point.value) / histMax;
              const positive = point.value >= 0;
              return (
                <span
                  key={`${point.timestamp}-${i}`}
                  className={cn(
                    "block flex-1 rounded-sm",
                    positive ? "bg-chart" : "bg-chart-soft",
                  )}
                  style={{ height: `${Math.max(10, ratio * 100)}%` }}
                  aria-hidden
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
