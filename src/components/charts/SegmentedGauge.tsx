"use client";

import { chartColors, gaugeColors } from "@/lib/theme";
import { typography } from "@/lib/typography";

interface Props {
  value: number;
  min?: number;
  max?: number;
  segments?: number;
  ticks?: number[];
  label?: string;
  color?: string;
  ariaLabel?: string;
  size?: number;
}

const GAUGE_PAD_SIDE = 14;
const GAUGE_PAD_TOP = 12;
const GAUGE_PAD_BOTTOM = 34;
/** Figma segment spec (screen px at gauge display width). */
const FIGMA_BAR_WIDTH = 20.57;
const FIGMA_BAR_HEIGHT = 50.57;
const FIGMA_BAR_RADIUS = 4;
const FIGMA_SEGMENT_GAP = 7;
const ARC_MID_R = 89;

export default function SegmentedGauge({
  value,
  min = 0,
  max = 50,
  segments = 22,
  ticks = [0, 25, 50],
  label,
  color = gaugeColors.neutral,
  ariaLabel,
  size = 320,
}: Props) {
  const span = Math.max(0.000001, max - min);
  const pct = Math.max(0, Math.min(1, (value - min) / span));
  const filledCount = Math.max(0, Math.round(pct * segments));

  const unitScale = 280 / size;
  const barThickness = FIGMA_BAR_WIDTH * unitScale;
  const barLength = FIGMA_BAR_HEIGHT * unitScale;
  const segmentRadius = FIGMA_BAR_RADIUS * unitScale;
  const segmentGap = FIGMA_SEGMENT_GAP * unitScale;
  const centerSpacing = barThickness + segmentGap;
  const arcMidR =
    centerSpacing * (segments - 1) <= Math.PI * ARC_MID_R
      ? ARC_MID_R
      : (centerSpacing * (segments - 1)) / Math.PI;
  const centerSpacingRad = centerSpacing / arcMidR;
  const innerR = arcMidR - barLength / 2;
  const outerR = arcMidR + barLength / 2;
  const tickR = outerR + 13;
  const cx = tickR + GAUGE_PAD_SIDE;
  const viewBoxW = cx * 2;
  const cy = tickR + GAUGE_PAD_TOP;
  const viewBoxH = cy + GAUGE_PAD_BOTTOM;
  const trackColor = chartColors.grid;

  return (
    <svg
      role="img"
      aria-label={ariaLabel ?? `Volatility gauge ${value} of ${max}`}
      viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
      className="block h-auto w-full"
      style={{ maxWidth: size }}
      preserveAspectRatio="xMidYMid meet"
    >
      {Array.from({ length: segments }).map((_, i) => {
        const angle = Math.PI - i * centerSpacingRad;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const x1 = cx + innerR * cosA;
        const y1 = cy - innerR * sinA;
        const x2 = cx + outerR * cosA;
        const y2 = cy - outerR * sinA;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const rotate = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
        const filled = i < filledCount;
        const fill = filled ? color : trackColor;

        return (
          <rect
            key={i}
            x={midX - barLength / 2}
            y={midY - barThickness / 2}
            width={barLength}
            height={barThickness}
            rx={segmentRadius}
            ry={segmentRadius}
            fill={fill}
            transform={`rotate(${rotate}, ${midX}, ${midY})`}
          >
            <animate
              attributeName="fill"
              from={trackColor}
              to={fill}
              dur="450ms"
              fill="freeze"
              begin={`${i * 14}ms`}
            />
          </rect>
        );
      })}

      {ticks.map((t) => {
        const tp = (t - min) / span;
        const a = (1 - tp) * Math.PI;
        const sinA = Math.sin(a);
        const x = cx + tickR * Math.cos(a);
        const y = cy - tickR * sinA;
        const anchor = tp < 0.15 ? "start" : tp > 0.85 ? "end" : "middle";
        const baseline = sinA > 0.7 ? "auto" : "hanging";
        return (
          <text
            key={t}
            x={x}
            y={y}
            fontSize={typography.gauge.tick}
            fill={chartColors.tick}
            textAnchor={anchor}
            dominantBaseline={baseline}
          >
            {t}
          </text>
        );
      })}

      <foreignObject x={0} y={cy - 30} width={viewBoxW} height={36} xmlns="http://www.w3.org/1999/xhtml">
        <div className="flex h-full items-center justify-center text-stat-value tabular-nums">
          {value}
        </div>
      </foreignObject>
      {label ? (
        <text
          x={cx}
          y={cy + 11}
          fontSize={typography.gauge.label}
          fill={chartColors.tick}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}
