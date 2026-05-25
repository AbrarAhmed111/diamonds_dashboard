"use client";

import { useMemo, useState } from "react";
import {
  computeRangeChange,
  formatChange,
  formatValue,
  getRangeEndValue,
  getRangeStartValue,
  type RangeChangeMode,
} from "@/lib/format";
import { rangeCaptionFor, sliceByRange } from "@/lib/sentiment";
import type { ChartRange, Signal } from "@/lib/types";

export type RangeValueMode = "end" | "change";

interface UseSignalRangeOptions {
  defaultRange?: ChartRange;
  changeMode?: RangeChangeMode;
  valueMode?: RangeValueMode;
}

export function useSignalRange(
  signal: Signal,
  {
    defaultRange = "3M",
    changeMode = "relative",
    valueMode = "end",
  }: UseSignalRangeOptions = {},
) {
  const [range, setRange] = useState<ChartRange>(defaultRange);

  const sliced = useMemo(
    () => sliceByRange(signal.values, range),
    [signal.values, range],
  );

  const rangeStart = useMemo(() => getRangeStartValue(sliced), [sliced]);
  const rangeEnd = useMemo(() => getRangeEndValue(sliced), [sliced]);

  const changePct = useMemo(
    () => computeRangeChange(sliced, changeMode),
    [sliced, changeMode],
  );

  const displayValue = useMemo(() => {
    if (valueMode === "change") {
      if (changePct === null) return "–";
      return formatChange(changePct, "%", 1);
    }
    return formatValue(rangeEnd?.value, signal.unit);
  }, [valueMode, changePct, rangeEnd, signal.unit]);

  return {
    range,
    setRange,
    sliced,
    rangeStart,
    rangeEnd,
    changePct,
    displayValue,
    caption: rangeCaptionFor(range),
  };
}
