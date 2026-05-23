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
import { chartColors } from "@/lib/theme";
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

const DAY_TICK_DAYS = new Set([1, 9, 15, 29]);

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

function buildDayTicks(data: Array<{ x: string; y: number }>) {
  return data
    .map((d, i) => {
      const day = new Date(d.x).getUTCDate();
      return i === 0 || DAY_TICK_DAYS.has(day) ? d.x : null;
    })
    .filter((v): v is string => Boolean(v));
}

function buildPercentTicks(values: number[]) {
  const maxVal = Math.max(...values, 0);
  const top = Math.max(12, Math.ceil(maxVal / 2) * 2);
  return Array.from({ length: top / 2 + 1 }, (_, i) => i * 2);
}

function DayAxisTick({
  x = 0,
  y = 0,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  if (!payload?.value) return null;

  const dt = new Date(payload.value);
  const day = dt.getUTCDate();
  const month = dt.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill={chartColors.tick} fontSize={11} dy={8}>
        {day}
      </text>
      {day === 1 ? (
        <text textAnchor="middle" fill={chartColors.tick} fontSize={10} dy={22}>
          {month}
        </text>
      ) : null}
    </g>
  );
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
  const isPercent = (unit || "").toLowerCase() === "%";
  const percentTicks = isPercent ? buildPercentTicks(data.map((d) => d.y)) : null;

  let dayTicks: string[] = [];
  let yearTicks: string[] = [];

  if (mode === "day") {
    dayTicks = buildDayTicks(data);
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

  const yDomainMax = percentTicks?.length ? percentTicks[percentTicks.length - 1] : "auto";

  return (
    <div className="w-full" role="img" aria-label={ariaLabel ?? "Time-series chart"}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{
            top: 10,
            right: 12,
            bottom: showAxes && mode === "day" ? 34 : 4,
            left: 0,
          }}
        >
          <defs>
            <linearGradient id="dp-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--chart-rgb))" stopOpacity={0.18} />
              <stop offset="100%" stopColor="rgb(var(--chart-rgb))" stopOpacity={0} />
            </linearGradient>
          </defs>
          {showAxes ? (
            <CartesianGrid stroke={chartColors.grid} strokeDasharray="2 6" vertical={false} />
          ) : null}
          {showAxes ? (
            <XAxis
              dataKey="x"
              stroke={chartColors.tick}
              tickLine={false}
              axisLine={false}
              ticks={mode === "day" ? dayTicks : yearTicks}
              tickMargin={0}
              interval={0}
              tick={mode === "day" ? <DayAxisTick /> : { fontSize: 11, fill: chartColors.tick }}
              tickFormatter={
                mode === "day"
                  ? undefined
                  : (v) => `${new Date(v).getUTCFullYear()}`
              }
            />
          ) : (
            <XAxis dataKey="x" hide />
          )}
          {showAxes ? (
            <YAxis
              stroke={chartColors.tick}
              tickLine={false}
              axisLine={false}
              width={56}
              domain={isPercent ? [0, yDomainMax] : ["auto", "auto"]}
              ticks={percentTicks ?? undefined}
              tick={{ fontSize: 11, fill: chartColors.tick }}
              tickFormatter={(v) => formatValue(v, unit)}
            />
          ) : (
            <YAxis hide />
          )}
          <Tooltip content={<ChartTooltip unit={unit} />} cursor={{ stroke: chartColors.cursor }} />
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
              fill: chartColors.white,
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
