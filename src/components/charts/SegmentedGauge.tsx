"use client";

interface Props {
  value: number;
  min?: number;
  max?: number;
  segments?: number;
  ticks?: number[];
  label?: string;
  /** CSS color for the filled segments. */
  color?: string;
  ariaLabel?: string;
  size?: number;
}

const VIEWBOX_W = 280;
const VIEWBOX_H = 145;

export default function SegmentedGauge({
  value,
  min = 0,
  max = 50,
  segments = 22,
  ticks = [0, 25, 50],
  label,
  color = "#C2F28C",
  ariaLabel,
  size = 320,
}: Props) {
  const span = Math.max(0.000001, max - min);
  const pct = Math.max(0, Math.min(1, (value - min) / span));
  const filledCount = Math.max(0, Math.round(pct * segments));

  const cx = VIEWBOX_W / 2;
  const cy = 125;
  const innerR = 78;
  const outerR = 100;
  const strokeWidth = 10;
  const tickR = outerR + 13;

  return (
    <svg
      role="img"
      aria-label={ariaLabel ?? `Volatility gauge ${value} of ${max}`}
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      width={size}
      height={size * (VIEWBOX_H / VIEWBOX_W)}
      preserveAspectRatio="xMidYMid meet"
      className="block"
    >
      {Array.from({ length: segments }).map((_, i) => {
        const t = segments === 1 ? 0 : i / (segments - 1);
        const angle = (1 - t) * Math.PI;
        const x1 = cx + innerR * Math.cos(angle);
        const y1 = cy - innerR * Math.sin(angle);
        const x2 = cx + outerR * Math.cos(angle);
        const y2 = cy - outerR * Math.sin(angle);
        const filled = i < filledCount;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            strokeWidth={strokeWidth}
            stroke={filled ? color : "#E5E5E5"}
          >
            <animate
              attributeName="stroke"
              from="#E5E5E5"
              to={filled ? color : "#E5E5E5"}
              dur="450ms"
              fill="freeze"
              begin={`${i * 14}ms`}
            />
          </line>
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
            fontSize={8}
            fill="#8B8B8B"
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
        fill="#0D0D0D"
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
          fill="#8B8B8B"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
}
