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
import { formatDate, formatGlobalM2Axis, formatGlobalM2Supply } from "@/lib/format";
import {
  buildLiquidityYearTicks,
  buildLiquidityYAxis,
  toLiquidityChartPoints,
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

const TooltipContent = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { x: string; y: number; billions: number } }>;
}) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-neutral-500/60 bg-white/95 px-3 py-2 text-caption shadow-card backdrop-blur">
      <p className="font-medium text-ink">{formatGlobalM2Supply(point.billions)}</p>
      <p className="text-ink-muted">{formatDate(point.x)}</p>
    </div>
  );
};

function yAxisWidthForTicks(ticks: number[]): number {
  const longest = ticks.reduce(
    (max, tick) => Math.max(max, formatGlobalM2Axis(tick).length),
    1,
  );
  return Math.min(40, Math.max(28, longest * 7 + 8));
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
  const yearTicks = useMemo(() => buildLiquidityYearTicks(data), [data]);
  const yAxisWidth = useMemo(() => yAxisWidthForTicks(yAxis.ticks), [yAxis.ticks]);

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
          margin={{ top: 10, right: 12, bottom: 4, left: 0 }}
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
            ticks={yearTicks}
            interval={0}
            tickMargin={8}
            tick={{ fontSize: typography.chart.axis, fill: chartColors.tick }}
            tickFormatter={(value) => `${parseYear(String(value))}`}
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
          <Tooltip content={<TooltipContent />} cursor={{ stroke: chartColors.cursor }} />
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

function parseYear(timestamp: string): number {
  return Number(timestamp.slice(0, 4));
}
