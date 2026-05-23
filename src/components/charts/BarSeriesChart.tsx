"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SeriesPoint {
  label: string;
  primary: number;
  secondary: number;
}

interface Props {
  data: SeriesPoint[];
  primaryLabel?: string;
  secondaryLabel?: string;
  height?: number;
  ariaLabel?: string;
}

const TooltipContent = ({
  active,
  payload,
  label,
  primaryLabel,
  secondaryLabel,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-neutral-500/60 bg-white/95 px-3 py-2 text-caption shadow-card backdrop-blur">
      <p className="text-ink">{label}</p>
      <p className="mt-1 flex items-center gap-2 text-ink">
        <span aria-hidden className="h-2 w-2 rounded-sm bg-chart" />
        {primaryLabel ?? "Series A"}: <span className="font-medium">{payload[0]?.value}</span>
      </p>
      <p className="flex items-center gap-2 text-ink">
        <span aria-hidden className="h-2 w-2 rounded-sm bg-chart-soft" />
        {secondaryLabel ?? "Series B"}: <span className="font-medium">{payload[1]?.value}</span>
      </p>
    </div>
  );
};

export default function BarSeriesChart({
  data,
  primaryLabel = "Inflows",
  secondaryLabel = "Outflows",
  height = 200,
  ariaLabel,
}: Props) {
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
    <div className="w-full" role="img" aria-label={ariaLabel ?? "Daily bar chart"}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 24, right: 12, bottom: 8, left: 0 }} barCategoryGap="22%">
          <CartesianGrid stroke="#E5E5E5" strokeDasharray="2 6" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#8B8B8B"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11, fill: "#8B8B8B" }}
          />
          <YAxis
            stroke="#8B8B8B"
            tickLine={false}
            axisLine={false}
            width={40}
            tick={{ fontSize: 11, fill: "#8B8B8B" }}
          />
          <Tooltip
            content={
              <TooltipContent primaryLabel={primaryLabel} secondaryLabel={secondaryLabel} />
            }
            cursor={{ fill: "rgba(229,229,229,0.5)" }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            height={20}
            iconType="square"
            iconSize={8}
            wrapperStyle={{ paddingBottom: 6, fontSize: 11, color: "#6A6A6A" }}
          />
          <Bar
            dataKey="primary"
            name={primaryLabel}
            fill="rgb(var(--chart-rgb))"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="secondary"
            name={secondaryLabel}
            fill="rgb(var(--chart-soft-rgb))"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
