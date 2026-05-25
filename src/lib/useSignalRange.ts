"use client";

import { useEffect, useMemo, useState } from "react";
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

const DEBUG_RANGE_SIGNALS = new Set(["btc_price", "buying_power"]);

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

  const displayedChangePct =
    changePct === null ? null : `${changePct >= 0 ? "+" : ""}${changePct.toFixed(1)}%`;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!DEBUG_RANGE_SIGNALS.has(signal.id)) return;

    console.log(`[range-sync:${signal.id}]`, {
      selectedRange: range,
      originalValuesLength: signal.values.length,
      filteredValuesLength: sliced.length,
      firstFilteredValue: rangeStart,
      lastFilteredValue: rangeEnd,
      calculatedPercentageChange: changePct,
      calculatedPercentageChangeFull:
        changePct === null ? null : Number(changePct.toFixed(4)),
      displayedPercentageChange: displayedChangePct,
      changeMode,
      valueMode,
    });
  }, [
    signal.id,
    signal.values.length,
    range,
    sliced.length,
    rangeStart,
    rangeEnd,
    changePct,
    displayedChangePct,
    changeMode,
    valueMode,
  ]);

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
