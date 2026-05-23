"use client";

import SegmentedGauge from "@/components/charts/SegmentedGauge";
import GaugeAside, { GAUGE_DISPLAY_SIZE } from "./GaugeAside";
import SplitFrame from "./SplitFrame";
import { getLatestValue } from "@/lib/format";
import { gaugeColors } from "@/lib/theme";
import type { Signal } from "@/lib/types";

interface Props {
  signal: Signal;
}

export default function VolatilityCard({ signal }: Props) {
  const latest = getLatestValue(signal);
  const value = Math.round(latest?.value ?? 0);
  const stateLabel =
    (signal.state_label as string | undefined) ?? deriveLabel(value);
  const color = value <= 25 ? gaugeColors.positive : gaugeColors.negative;
  const tone = value <= 25 ? "positive" : "negative";

  return (
    <SplitFrame
      signal={signal}
      badge={{ label: stateLabel, tone }}
      description={signal.description}
    >
      <GaugeAside>
        <SegmentedGauge
          value={value}
          min={typeof signal.min_val === "number" ? signal.min_val : 0}
          max={typeof signal.max_val === "number" ? signal.max_val : 50}
          label={stateLabel}
          color={color}
          size={GAUGE_DISPLAY_SIZE}
          ariaLabel={`${signal.name} segmented gauge`}
        />
      </GaugeAside>
    </SplitFrame>
  );
}

function deriveLabel(value: number) {
  if (value <= 25) return "Calm Markets";
  if (value < 35) return "Elevated";
  return "Stressed";
}
