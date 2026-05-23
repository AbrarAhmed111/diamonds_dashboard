"use client";

import { chartColors, gaugeColors } from "@/lib/theme";

interface Props {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  ticks?: number[];
  /** CSS color for the filled arc. */
  color?: string;
  ariaLabel?: string;
  size?: number;
}

const VIEWBOX_W = 280;
const VIEWBOX_H = 160;

function arcPath(percent: number, radius: number, cx: number, cy: number) {
  const p = Math.max(0, Math.min(1, percent));
  const angle = (1 - p) * Math.PI;
  const x = cx + radius * Math.cos(angle);
  const y = cy - radius * Math.sin(angle);
  return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${x} ${y}`;
}

export default function HalfGaugeChart({
  value,
  min = 0,
  max = 100,
  label,
  ticks = [0, 20, 40, 60, 80, 100],
  color = gaugeColors.positive,
  ariaLabel,
  size = 260,
}: Props) {
  const span = Math.max(0.000001, max - min);
  const pct = Math.max(0, Math.min(1, (value - min) / span));

  const cx = VIEWBOX_W / 2;
  const cy = 145;
  const radius = 100;
  const stroke = 13;
  const tickR = radius + 28;

  return (
    <svg
      role="img"
      aria-label={ariaLabel ?? `Gauge showing ${value} of ${max}`}
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      className="block h-auto w-full"
      style={{ maxWidth: size }}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={arcPath(1, radius, cx, cy)}
        stroke={chartColors.grid}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      {pct > 0 ? (
        <path
          d={arcPath(pct, radius, cx, cy)}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}

      {ticks.map((t) => {
        const tp = (t - min) / span;
        const a = (1 - tp) * Math.PI;
        const sinA = Math.sin(a);
        const x = cx + tickR * Math.cos(a);
        const y = cy - tickR * sinA;
        const anchor = tp < 0.05 ? "start" : tp > 0.95 ? "end" : "middle";
        const baseline = sinA > 0.3 ? "auto" : "hanging";
        return (
          <text
            key={t}
            x={x}
            y={y}
            fontSize={8}
            fill={chartColors.tick}
            textAnchor={anchor}
            dominantBaseline={baseline}
          >
            {t}
          </text>
        );
      })}

      <text
        x={cx}
        y={cy - 5}
        fontSize={23}
        fill={chartColors.ink}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight={500}
      >
        {value}
      </text>
      {label ? (
        <text
          x={cx}
          y={cy + 11}
          fontSize={9}
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
