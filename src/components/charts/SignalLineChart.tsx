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
import { typography } from "@/lib/typography";
import type { ChartRange, SignalValue } from "@/lib/types";
import { formatDate, formatValue } from "@/lib/format";

type AxisMode = "auto" | "day" | "month" | "year";

interface Props {
  values: SignalValue[];
  unit?: string;
  height?: number;
  ariaLabel?: string;
  showAxes?: boolean;
  xAxisMode?: AxisMode;
  chartRange?: ChartRange;
}

function spanDaysFromData(data: Array<{ x: string; y: number }>): number {
  if (data.length < 2) return 1;
  const first = new Date(`${data[0].x.slice(0, 10)}T00:00:00.000Z`).getTime();
  const last = new Date(`${data[data.length - 1].x.slice(0, 10)}T00:00:00.000Z`).getTime();
  return Math.max(1, Math.round((last - first) / (1000 * 60 * 60 * 24)) + 1);
}

function pickEvenlySpacedTicks(data: Array<{ x: string; y: number }>, maxTicks: number): string[] {
  if (!data.length) return [];
  if (maxTicks <= 1) return [data[0].x];
  if (data.length <= maxTicks) return data.map((d) => d.x);

  const ticks: string[] = [];
  for (let i = 0; i < maxTicks; i++) {
    const idx = Math.round((i / (maxTicks - 1)) * (data.length - 1));
    ticks.push(data[idx].x);
  }
  return [...new Set(ticks)];
}

function maxDayTicks(span: number, pointCount: number, range?: ChartRange): number {
  if (range === "1D") return Math.min(pointCount, 4);
  if (range === "1W") return Math.min(pointCount, 7);
  if (range === "1M") return Math.min(pointCount, 6);
  if (range === "3M") return Math.min(pointCount, 6);
  if (span <= 1) return Math.min(pointCount, 4);
  if (span <= 7) return Math.min(pointCount, 7);
  if (span <= 31) return Math.min(pointCount, 6);
  return Math.min(pointCount, 6);
}

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

function detectMode(
  data: Array<{ x: string; y: number }>,
  requested: AxisMode,
  range?: ChartRange,
): "day" | "month" | "year" {
  if (requested === "year") return "year";
  if (requested === "month") return "month";
  if (requested === "day") return "day";
  if (!data.length) return "day";

  const days = spanDaysFromData(data);
  if (days > 730) return "year";
  if (range === "3M" || range === "12M") {
    if (days > 31) return "month";
  } else if (days > 90) {
    return "month";
  }
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

function buildDayTicks(data: Array<{ x: string; y: number }>, range?: ChartRange) {
  const span = spanDaysFromData(data);
  const maxTicks = maxDayTicks(span, data.length, range);
  return pickEvenlySpacedTicks(data, maxTicks);
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
  index = 0,
  visibleTicks = [],
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  index?: number;
  visibleTicks?: Array<{ value: string }>;
}) {
  if (!payload?.value) return null;

  const { day, month } = parseDateParts(String(payload.value));
  const monthLabel = MONTH_LABELS[month] ?? "";
  const prev =
    index > 0 ? parseDateParts(String(visibleTicks[index - 1]?.value ?? "")) : null;
  const showMonth = index === 0 || !prev || prev.month !== month;

  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill={chartColors.tick} fontSize={typography.chart.axis} dy={12}>
        {day}
      </text>
      {showMonth ? (
        <text textAnchor="middle" fill={chartColors.tick} fontSize={typography.chart.label} dy={26}>
          {monthLabel}
        </text>
      ) : null}
    </g>
  );
}

function YAxisTickLeft({
  y = 0,
  payload,
  unit,
}: {
  y?: number;
  payload?: { value: number };
  unit?: string;
}) {
  if (payload == null) return null;

  return (
    <text
      x={0}
      y={y}
      dy={4}
      textAnchor="start"
      fill={chartColors.tick}
      fontSize={typography.chart.axis}
    >
      {formatValue(payload.value, unit)}
    </text>
  );
}

export default function SignalLineChart({
  values,
  unit,
  height = 220,
  ariaLabel,
  showAxes = true,
  xAxisMode = "auto",
  chartRange,
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
  const mode = detectMode(data, xAxisMode, chartRange);
  const isPercent = (unit || "").toLowerCase() === "%";
  const percentTicks = isPercent ? buildPercentTicks(data.map((d) => d.y)) : null;

  let dayTicks: string[] = [];
  let monthTicks: string[] = [];
  let yearTicks: string[] = [];

  if (mode === "day") {
    dayTicks = buildDayTicks(data, chartRange);
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
    showAxes && mode === "day" ? 38 : showAxes && mode === "month" ? 26 : 4;
  const yAxisWidth = isPercent ? 34 : 44;

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
              tickMargin={mode === "day" || mode === "month" ? 10 : 0}
              minTickGap={mode === "month" ? 16 : 0}
              interval={0}
              tick={
                mode === "day" ? (
                  <DayAxisTick />
                ) : (
                  { fontSize: typography.chart.axis, fill: chartColors.tick }
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
              width={yAxisWidth}
              domain={isPercent ? [0, yDomainMax] : ["auto", "auto"]}
              ticks={percentTicks ?? undefined}
              tick={<YAxisTickLeft unit={unit} />}
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
