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

type AxisMode = "auto" | "day" | "month" | "year";

interface Props {
  values: SignalValue[];
  unit?: string;
  height?: number;
  ariaLabel?: string;
  showAxes?: boolean;
  xAxisMode?: AxisMode;
}

const DAY_TICK_DAYS = new Set([1, 9, 15, 29]);

const MONTH_LABELS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

function parseDateParts(timestamp: string) {
  const [ys, ms, ds] = timestamp.slice(0, 10).split("-");
  return { year: Number(ys), month: Number(ms) - 1, day: Number(ds) };
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

function detectMode(values: SignalValue[], requested: AxisMode): "day" | "month" | "year" {
  if (requested === "year") return "year";
  if (requested === "month") return "month";
  if (requested === "day") return "day";
  if (!values?.length) return "day";
  const first = new Date(values[0].timestamp).getTime();
  const last = new Date(values[values.length - 1].timestamp).getTime();
  const days = (last - first) / (1000 * 60 * 60 * 24);
  if (days > 730) return "year";
  if (days > 90) return "month";
  return "day";
}

function buildMonthTicks(data: Array<{ x: string; y: number }>) {
  if (!data.length) return [];

  const first = parseDateParts(data[0].x);
  const last = parseDateParts(data[data.length - 1].x);

  let year = first.year;
  let month = first.month;

  if (first.day > 1) {
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  const ticks: string[] = [];
  while (year < last.year || (year === last.year && month <= last.month)) {
    const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
    const firstOfMonth = `${monthPrefix}-01`;
    const monthPoints = data.filter((d) => d.x.startsWith(monthPrefix));
    if (monthPoints.length) {
      ticks.push(monthPoints.some((d) => d.x === firstOfMonth) ? firstOfMonth : monthPoints[0].x);
    }
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return ticks;
}

function formatMonthTick(value: string | number) {
  const { month } = parseDateParts(String(value));
  return MONTH_LABELS[month] ?? "";
}

function buildDayTicks(data: Array<{ x: string; y: number }>) {
  return data
    .map((d, i) => {
      const { day } = parseDateParts(d.x);
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

  const { day, month } = parseDateParts(String(payload.value));
  const monthLabel = MONTH_LABELS[month] ?? "";

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill={chartColors.tick} fontSize={11} dy={8}>
        {day}
      </text>
      {day === 1 ? (
        <text textAnchor="middle" fill={chartColors.tick} fontSize={10} dy={22}>
          {monthLabel}
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
  let monthTicks: string[] = [];
  let yearTicks: string[] = [];

  if (mode === "day") {
    dayTicks = buildDayTicks(data);
  } else if (mode === "month") {
    monthTicks = buildMonthTicks(data);
  } else {
    const seenYears = new Set<number>();
    for (const d of data) {
      const { year } = parseDateParts(d.x);
      if (!seenYears.has(year)) {
        if (year % 2 === 0) yearTicks.push(d.x);
        seenYears.add(year);
      }
    }
  }

  const yDomainMax = percentTicks?.length ? percentTicks[percentTicks.length - 1] : "auto";

  const xAxisTicks =
    mode === "day" ? dayTicks : mode === "month" ? monthTicks : yearTicks;
  const bottomMargin =
    showAxes && mode === "day" ? 34 : showAxes && mode === "month" ? 22 : 4;

  return (
    <div className="w-full" role="img" aria-label={ariaLabel ?? "Time-series chart"}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{
            top: 10,
            right: 12,
            bottom: bottomMargin,
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
              ticks={xAxisTicks}
              tickMargin={mode === "month" ? 8 : 0}
              minTickGap={mode === "month" ? 16 : 0}
              interval={0}
              tick={
                mode === "day" ? (
                  <DayAxisTick />
                ) : (
                  { fontSize: 11, fill: chartColors.tick }
                )
              }
              tickFormatter={
                mode === "day"
                  ? undefined
                  : mode === "month"
                    ? formatMonthTick
                    : (v) => `${parseDateParts(String(v)).year}`
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
