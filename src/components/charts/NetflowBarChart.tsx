"use client";

import { useId, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RectangleProps } from "recharts";
import { formatBtcChartAxis, formatBtcNetflow } from "@/lib/format";
import { buildNetflowSignedYAxis, type NetflowChartPoint } from "@/lib/netflow";
import { chartColors, gaugeColors } from "@/lib/theme";
import { typography } from "@/lib/typography";

interface Props {
  data: NetflowChartPoint[];
  height?: number;
  ariaLabel?: string;
}

const AXIS_TICK = { fontSize: typography.chart.axis, fill: chartColors.tick };

/** Figma-style gradients: saturated at the bar tip, fading toward the zero line. */
const NETFLOW_GRADIENT = {
  bullish: gaugeColors.positive,
  bullishFade: "rgba(194, 242, 140, 0.12)",
  bearish: gaugeColors.negative,
  bearishFade: "rgba(226, 106, 69, 0.15)",
} as const;

const BAR_SIZE = 13;
const BAR_RADIUS = 6;

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
      {formatBtcChartAxis(payload.value)}
    </text>
  );
}

function netflowYAxisWidth(ticks: number[]): number {
  const longest = ticks.reduce(
    (max, tick) => Math.max(max, formatBtcChartAxis(tick).length),
    1,
  );
  return Math.min(52, Math.max(36, longest * 7 + 10));
}

const TooltipContent = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const netflow = payload[0].value;
  return (
    <div className="rounded-lg border border-neutral-500/60 bg-white/95 px-3 py-2 text-caption shadow-card backdrop-blur">
      <p className="font-medium text-ink">{label}</p>
      <p className="mt-1 text-ink">Netflow: {formatBtcNetflow(netflow)}</p>
    </div>
  );
};

type BarShapeProps = RectangleProps & {
  payload?: NetflowChartPoint;
  bullishGradientId: string;
  bearishGradientId: string;
};

function NetflowBarShape({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  payload,
  bullishGradientId,
  bearishGradientId,
}: BarShapeProps) {
  if (!payload || !width || !height) return null;

  const isNegative = payload.netflow < 0;
  const h = Math.abs(height);
  const r = Math.min(BAR_RADIUS, width / 2, h / 2);
  const fill = isNegative
    ? `url(#${bullishGradientId})`
    : `url(#${bearishGradientId})`;

  if (isNegative) {
    const bottom = y + h;
    const path = [
      `M ${x} ${y}`,
      `L ${x + width} ${y}`,
      `L ${x + width} ${bottom - r}`,
      `Q ${x + width} ${bottom} ${x + width - r} ${bottom}`,
      `L ${x + r} ${bottom}`,
      `Q ${x} ${bottom} ${x} ${bottom - r}`,
      "Z",
    ].join(" ");
    return <path d={path} fill={fill} />;
  }

  const path = [
    `M ${x} ${y + r}`,
    `Q ${x} ${y} ${x + r} ${y}`,
    `L ${x + width - r} ${y}`,
    `Q ${x + width} ${y} ${x + width} ${y + r}`,
    `L ${x + width} ${y + h}`,
    `L ${x} ${y + h}`,
    "Z",
  ].join(" ");
  return <path d={path} fill={fill} />;
}

export default function NetflowBarChart({ data, height = 260, ariaLabel }: Props) {
  const uid = useId().replace(/:/g, "");
  const bullishGradientId = `netflow-bullish-${uid}`;
  const bearishGradientId = `netflow-bearish-${uid}`;
  const yAxis = useMemo(() => buildNetflowSignedYAxis(data), [data]);
  const yAxisWidth = useMemo(() => netflowYAxisWidth(yAxis.ticks), [yAxis.ticks]);

  const barShape = useMemo(
    () =>
      function Shape(props: RectangleProps) {
        return (
          <NetflowBarShape
            {...props}
            bullishGradientId={bullishGradientId}
            bearishGradientId={bearishGradientId}
          />
        );
      },
    [bullishGradientId, bearishGradientId],
  );

  if (!data?.length) {
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
    <div className="w-full" role="img" aria-label={ariaLabel ?? "Weekly BTC netflow chart"}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 12, bottom: 0, left: 0 }}
          barCategoryGap="22%"
        >
          <defs>
            <linearGradient id={bearishGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={NETFLOW_GRADIENT.bearish} stopOpacity={1} />
              <stop offset="55%" stopColor={NETFLOW_GRADIENT.bearish} stopOpacity={0.85} />
              <stop offset="100%" stopColor={NETFLOW_GRADIENT.bearishFade} stopOpacity={0.35} />
            </linearGradient>
            <linearGradient id={bullishGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={NETFLOW_GRADIENT.bullishFade} stopOpacity={0.35} />
              <stop offset="45%" stopColor={NETFLOW_GRADIENT.bullish} stopOpacity={0.85} />
              <stop offset="100%" stopColor={NETFLOW_GRADIENT.bullish} stopOpacity={1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} strokeDasharray="2 6" vertical={false} />
          <ReferenceLine y={0} stroke={chartColors.tick} strokeWidth={1} />
          <XAxis
            dataKey="label"
            stroke={chartColors.tick}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={AXIS_TICK}
            interval={0}
          />
          <YAxis
            stroke={chartColors.tick}
            tickLine={false}
            axisLine={false}
            width={yAxisWidth}
            domain={[yAxis.min, yAxis.max]}
            ticks={yAxis.ticks}
            tick={<YAxisTickLeft />}
          />
          <Tooltip
            content={<TooltipContent />}
            cursor={{ fill: "rgba(229,229,229,0.25)" }}
          />
          <Bar
            dataKey="netflow"
            name="Netflow"
            barSize={BAR_SIZE}
            shape={barShape}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
