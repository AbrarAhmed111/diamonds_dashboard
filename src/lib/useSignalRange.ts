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

const ALL_CHART_RANGES: ChartRange[] = ["1D", "1W", "1M", "3M", "12M"];

interface UseSignalRangeOptions {
  defaultRange?: ChartRange;
  allowedRanges?: ChartRange[];
  changeMode?: RangeChangeMode;
  valueMode?: RangeValueMode;
}

export function useSignalRange(
  signal: Signal,
  {
    defaultRange = "3M",
    allowedRanges = ALL_CHART_RANGES,
    changeMode = "relative",
    valueMode = "end",
  }: UseSignalRangeOptions = {},
) {
  const initialRange = allowedRanges.includes(defaultRange)
    ? defaultRange
    : allowedRanges[0];
  const [range, setRange] = useState<ChartRange>(initialRange);

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
