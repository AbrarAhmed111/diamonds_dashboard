"use client";

import { useId, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartColors } from "@/lib/theme";
import { typography } from "@/lib/typography";
import { buildNetflowYAxis, type NetflowSeriesPoint } from "@/lib/netflow";
import { formatBtcChartAxis, formatBtcVolume } from "@/lib/format";

interface Props {
  data: NetflowSeriesPoint[];
  height?: number;
  ariaLabel?: string;
}

const AXIS_TICK = { fontSize: typography.chart.axis, fill: chartColors.tick };

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
  return Math.min(48, Math.max(34, longest * 7 + 10));
}

/** Figma: pale outflow bar vs solid inflow bar. */
const NETFLOW_BAR = {
  inflow: "#4195E9",
  inflowFade: "rgba(65, 149, 233, 0.08)",
  outflow: "#B6D6F7",
  outflowFade: "rgba(237, 246, 255, 0.15)",
} as const;

const TooltipContent = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const inflows = payload.find((p) => p.name === "Inflows")?.value;
  const outflows = payload.find((p) => p.name === "Outflows")?.value;
  return (
    <div className="rounded-lg border border-neutral-500/60 bg-white/95 px-3 py-2 text-caption shadow-card backdrop-blur">
      <p className="font-medium text-ink">{label}</p>
      <p className="mt-1 flex items-center gap-2 text-ink">
        <span
          aria-hidden
          className="h-[3px] w-4 rounded-full"
          style={{ backgroundColor: NETFLOW_BAR.inflow }}
        />
        Inflows: <span className="font-medium">{formatBtcVolume(inflows ?? 0)}</span>
      </p>
      <p className="flex items-center gap-2 text-ink">
        <span
          aria-hidden
          className="h-[3px] w-4 rounded-full"
          style={{ backgroundColor: NETFLOW_BAR.outflow }}
        />
        Outflows: <span className="font-medium">{formatBtcVolume(outflows ?? 0)}</span>
      </p>
    </div>
  );
};

export default function NetflowBarChart({ data, height = 176, ariaLabel }: Props) {
  const uid = useId().replace(/:/g, "");
  const inflowGradientId = `netflow-inflow-${uid}`;
  const outflowGradientId = `netflow-outflow-${uid}`;
  const yAxis = useMemo(() => buildNetflowYAxis(data), [data]);
  const yAxisWidth = useMemo(() => netflowYAxisWidth(yAxis.ticks), [yAxis.ticks]);

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
    <div className="w-full" role="img" aria-label={ariaLabel ?? "Weekly netflow bar chart"}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 12, bottom: 0, left: 0 }}
          barCategoryGap="22%"
          barGap={3}
        >
          <defs>
            <linearGradient id={inflowGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={NETFLOW_BAR.inflow} stopOpacity={1} />
              <stop offset="55%" stopColor={NETFLOW_BAR.inflow} stopOpacity={0.85} />
              <stop offset="100%" stopColor={NETFLOW_BAR.inflowFade} stopOpacity={0.35} />
            </linearGradient>
            <linearGradient id={outflowGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={NETFLOW_BAR.outflow} stopOpacity={1} />
              <stop offset="55%" stopColor={NETFLOW_BAR.outflow} stopOpacity={0.95} />
              <stop offset="100%" stopColor={NETFLOW_BAR.outflowFade} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={chartColors.grid} strokeDasharray="2 6" vertical={false} />
          <XAxis
            dataKey="label"
            stroke={chartColors.tick}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={AXIS_TICK}
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
            content={<TooltipContent />}
            cursor={{ fill: "rgba(229,229,229,0.25)" }}
          />
          <Bar
            dataKey="outflows"
            name="Outflows"
            fill={`url(#${outflowGradientId})`}
            barSize={13}
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="inflows"
            name="Inflows"
            fill={`url(#${inflowGradientId})`}
            barSize={9}
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
