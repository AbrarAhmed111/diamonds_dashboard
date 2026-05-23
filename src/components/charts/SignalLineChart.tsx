"use client";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SignalValue } from "@/lib/types";
import { formatDate, formatValue } from "@/lib/format";

type AxisMode = "auto" | "day" | "year";

interface Props {
  values: SignalValue[];
  unit?: string;
  height?: number;
  ariaLabel?: string;
  showAxes?: boolean;
  xAxisMode?: AxisMode;
}

const ChartTooltip = ({
  active,
  payload,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ payload: { x: string; y: number } }>;
  unit?: string;
}) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-neutral-500/60 bg-white/95 px-3 py-2 text-caption shadow-card backdrop-blur">
      <p className="font-medium text-ink">{formatValue(point.y, unit)}</p>
      <p className="text-ink-muted">{formatDate(point.x)}</p>
    </div>
  );
};

function detectMode(values: SignalValue[], requested: AxisMode): "day" | "year" {
  if (requested !== "auto") return requested;
  if (!values?.length) return "day";
  const first = new Date(values[0].timestamp).getTime();
  const last = new Date(values[values.length - 1].timestamp).getTime();
  const days = (last - first) / (1000 * 60 * 60 * 24);
  return days > 730 ? "year" : "day";
}

export default function SignalLineChart({
  values,
  unit,
  height = 220,
  ariaLabel,
  showAxes = true,
  xAxisMode = "auto",
}: Props) {
  if (!values?.length) {
    return (
      <div
        className="flex h-40 items-center justify-center rounded-xl border border-dashed border-neutral-500 text-small text-ink-muted"
        role="img"
        aria-label="No chart data available"
      >
        No chart data available
      </div>
    );
  }

  const data = values.map((v) => ({ x: v.timestamp, y: v.value }));
  const mode = detectMode(values, xAxisMode);

  let dayTicks: string[] = [];
  let monthAnchors: { x: string; label: string }[] = [];
  let yearTicks: string[] = [];

  if (mode === "day") {
    dayTicks = data
      .map((d, i) => {
        const day = new Date(d.x).getUTCDate();
        return i === 0 || day === 1 || day === 9 || day === 15 || day === 22 || day === 29
          ? d.x
          : null;
      })
      .filter((v): v is string => Boolean(v));

    const seen = new Set<string>();
    for (const d of data) {
      const dt = new Date(d.x);
      const key = `${dt.getUTCFullYear()}-${dt.getUTCMonth()}`;
      if (!seen.has(key)) {
        seen.add(key);
        monthAnchors.push({
          x: d.x,
          label: dt.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
        });
      }
    }
  } else {
    const seenYears = new Set<number>();
    for (const d of data) {
      const year = new Date(d.x).getUTCFullYear();
      if (!seenYears.has(year)) {
        if (year % 2 === 0) yearTicks.push(d.x);
        seenYears.add(year);
      }
    }
  }

  return (
    <div className="w-full" role="img" aria-label={ariaLabel ?? "Time-series chart"}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 10, right: 12, bottom: showAxes && mode === "day" ? 28 : 4, left: 0 }}>
          <defs>
            <linearGradient id="dp-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--chart-rgb))" stopOpacity={0.18} />
              <stop offset="100%" stopColor="rgb(var(--chart-rgb))" stopOpacity={0} />
            </linearGradient>
          </defs>
          {showAxes ? (
            <CartesianGrid stroke="#E5E5E5" strokeDasharray="2 6" vertical={false} />
          ) : null}
          {showAxes ? (
            <XAxis
              dataKey="x"
              stroke="#8B8B8B"
              tickLine={false}
              axisLine={false}
              ticks={mode === "day" ? dayTicks : yearTicks}
              tickMargin={8}
              tick={{ fontSize: 11, fill: "#8B8B8B" }}
              tickFormatter={(v) =>
                mode === "day" ? `${new Date(v).getUTCDate()}` : `${new Date(v).getUTCFullYear()}`
              }
            />
          ) : (
            <XAxis dataKey="x" hide />
          )}
          {showAxes ? (
            <YAxis
              stroke="#8B8B8B"
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fontSize: 11, fill: "#8B8B8B" }}
              tickFormatter={(v) => formatValue(v, unit)}
            />
          ) : (
            <YAxis hide />
          )}
          <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: "#B3B3B3" }} />
          <Area
            type="monotone"
            dataKey="y"
            stroke="transparent"
            fill="url(#dp-area)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="rgb(var(--chart-rgb))"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            activeDot={{
              r: 4,
              stroke: "rgb(var(--chart-rgb))",
              fill: "#FFFFFF",
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {showAxes && mode === "day" && monthAnchors.length > 1 ? (
        <div className="-mt-3 flex justify-between pl-14 pr-3 text-[10px] uppercase tracking-[0.16em] text-ink-muted">
          {monthAnchors.map((m) => (
            <span key={m.x}>{m.label}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
