"use client";

import { useMemo } from "react";
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
import { formatGlobalM2Axis, formatGlobalM2Supply } from "@/lib/format";
import {
  buildLiquidityXAxisTicks,
  buildLiquidityYAxis,
  formatGlobalLiquidityTooltipDate,
  formatGlobalLiquidityXAxisTick,
  toLiquidityChartPoints,
  type LiquidityDateRangeType,
} from "@/lib/liquidity";
import { chartColors } from "@/lib/theme";
import { typography } from "@/lib/typography";
import type { SignalValue } from "@/lib/types";

interface Props {
  values: SignalValue[];
  height?: number;
  ariaLabel?: string;
}

function YAxisTickLeft({
  y = 0,
  payload,
}: {
  y?: number;
  payload?: { value: number };
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
      {formatGlobalM2Axis(payload.value)}
    </text>
  );
}

function TooltipContent({
  active,
  payload,
  rangeType,
}: {
  active?: boolean;
  payload?: Array<{ payload: { x: string; y: number; billions: number } }>;
  rangeType: LiquidityDateRangeType;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-neutral-500/60 bg-white/95 px-3 py-2 text-caption shadow-card backdrop-blur">
      <p className="font-medium text-ink">{formatGlobalM2Supply(point.billions)}</p>
      <p className="text-ink-muted">{formatGlobalLiquidityTooltipDate(point.x, rangeType)}</p>
    </div>
  );
}

function yAxisWidthForTicks(ticks: number[]): number {
  const longest = ticks.reduce(
    (max, tick) => Math.max(max, formatGlobalM2Axis(tick).length),
    1,
  );
  return Math.min(40, Math.max(28, longest * 7 + 8));
}

function LiquidityXAxisTick({
  x = 0,
  y = 0,
  payload,
  xTicks,
  rangeType,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  xTicks: string[];
  rangeType: LiquidityDateRangeType;
}) {
  if (!payload?.value) return null;

  const timestamp = String(payload.value);
  const tickIndex = xTicks.indexOf(timestamp);
  const label = formatGlobalLiquidityXAxisTick(timestamp, rangeType, {
    previousTimestamp: tickIndex > 0 ? xTicks[tickIndex - 1] : undefined,
  });
  const fontSize =
    rangeType === "monthly" && xTicks.length > 12
      ? typography.chart.axis - 1
      : typography.chart.axis;

  return (
    <text
      x={x}
      y={y}
      dy={12}
      textAnchor="middle"
      fill={chartColors.tick}
      fontSize={fontSize}
    >
      {label}
    </text>
  );
}

export default function LiquidityLineChart({
  values,
  height = 200,
  ariaLabel,
}: Props) {
  const data = useMemo(() => {
    return toLiquidityChartPoints(values).map((point) => ({
      ...point,
      billions: point.y * 1000,
    }));
  }, [values]);

  const yAxis = useMemo(() => buildLiquidityYAxis(data), [data]);
  const { rangeType, ticks: xTicks } = useMemo(() => buildLiquidityXAxisTicks(data), [data]);
  const yAxisWidth = useMemo(() => yAxisWidthForTicks(yAxis.ticks), [yAxis.ticks]);
  const xAxisTicks = rangeType === "monthly" ? data.map((point) => point.x) : xTicks;

  if (!data.length) {
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

  return (
    <div className="w-full" role="img" aria-label={ariaLabel ?? "Global M2 money supply chart"}>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
          margin={{ top: 10, right: 12, bottom: rangeType === "monthly" ? 8 : 4, left: 0 }}
        >
          <defs>
            <linearGradient id="dp-liquidity-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.chart} stopOpacity={0.18} />
              <stop offset="100%" stopColor={chartColors.chart} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} strokeDasharray="2 6" vertical={false} />
          <XAxis
            dataKey="x"
            stroke={chartColors.tick}
            tickLine={false}
            axisLine={false}
            ticks={xAxisTicks}
            interval={0}
            tickMargin={8}
            tick={<LiquidityXAxisTick xTicks={xAxisTicks} rangeType={rangeType} />}
          />
          <YAxis
            stroke={chartColors.tick}
            tickLine={false}
            axisLine={false}
            width={yAxisWidth}
            domain={[0, yAxis.max]}
            ticks={yAxis.ticks}
            tick={<YAxisTickLeft />}
          />
          <Tooltip
            content={<TooltipContent rangeType={rangeType} />}
            cursor={{ stroke: chartColors.cursor }}
          />
          <Area
            type="monotone"
            dataKey="y"
            stroke="transparent"
            fill="url(#dp-liquidity-area)"
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke={chartColors.chart}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            activeDot={{
              r: 4,
              stroke: chartColors.chart,
              fill: chartColors.white,
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
