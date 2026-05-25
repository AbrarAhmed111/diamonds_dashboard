"use client";

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
import type { NetflowSeriesPoint } from "@/lib/netflow";

interface Props {
  data: NetflowSeriesPoint[];
  height?: number;
  ariaLabel?: string;
}

const Y_TICKS = [0, 20, 40, 60, 80, 100, 120];
const AXIS_TICK = { fontSize: typography.chart.axis, fill: chartColors.tick };

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
      <p className="text-ink">{label}</p>
      <p className="mt-1 flex items-center gap-2 text-ink">
        <span aria-hidden className="h-0.5 w-3 rounded-full bg-chart" />
        Inflows: <span className="font-medium">{inflows}</span>
      </p>
      <p className="flex items-center gap-2 text-ink">
        <span aria-hidden className="h-0.5 w-3 rounded-full bg-chart-soft" />
        Outflows: <span className="font-medium">{outflows}</span>
      </p>
    </div>
  );
};

export default function NetflowBarChart({ data, height = 176, ariaLabel }: Props) {
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
          margin={{ top: 4, right: 8, bottom: 0, left: -6 }}
          barCategoryGap="28%"
          barGap={3}
        >
          <defs>
            <linearGradient id="netflow-inflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--chart-rgb))" stopOpacity={1} />
              <stop offset="100%" stopColor="rgb(var(--chart-rgb))" stopOpacity={0.28} />
            </linearGradient>
            <linearGradient id="netflow-outflow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--chart-soft-rgb))" stopOpacity={1} />
              <stop offset="100%" stopColor="rgb(var(--chart-soft-rgb))" stopOpacity={0.22} />
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
            width={32}
            domain={[0, 140]}
            ticks={Y_TICKS}
            tick={AXIS_TICK}
          />
          <Tooltip
            content={<TooltipContent />}
            cursor={{ fill: "rgba(229,229,229,0.35)" }}
          />
          <Bar
            dataKey="outflows"
            name="Outflows"
            fill="url(#netflow-outflow)"
            barSize={10}
            radius={[5, 5, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="inflows"
            name="Inflows"
            fill="url(#netflow-inflow)"
            barSize={10}
            radius={[5, 5, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
