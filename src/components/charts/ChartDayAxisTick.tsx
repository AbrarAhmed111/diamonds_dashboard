"use client";

import { MONTH_LABELS, parseDateParts } from "@/lib/chartAxis";
import { chartColors } from "@/lib/theme";
import { typography } from "@/lib/typography";

export default function ChartDayAxisTick({
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
