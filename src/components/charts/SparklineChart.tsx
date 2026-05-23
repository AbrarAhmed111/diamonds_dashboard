"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { SignalValue } from "@/lib/types";

export default function SparklineChart({
  values,
  height = 64,
  ariaLabel,
}: {
  values: SignalValue[];
  height?: number;
  ariaLabel?: string;
}) {
  if (!values?.length) {
    return (
      <div
        className="flex h-16 items-center justify-center text-caption text-ink-muted"
        role="img"
        aria-label="No chart data available"
      >
        No chart data
      </div>
    );
  }
  const data = values.map((v) => ({ x: v.timestamp, y: v.value }));
  return (
    <div className="w-full" role="img" aria-label={ariaLabel ?? "Time-series sparkline"}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
          <defs>
            <linearGradient id="dp-spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--chart-rgb))" stopOpacity={0.32} />
              <stop offset="100%" stopColor="rgb(var(--chart-rgb))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="y"
            stroke="rgb(var(--chart-rgb))"
            strokeWidth={1.6}
            fill="url(#dp-spark)"
            isAnimationActive={false}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
