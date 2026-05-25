"use client";

import { cn } from "@/lib/utils";
import type { ChartRange } from "@/lib/types";

const RANGES: ChartRange[] = ["1D", "1W", "1M", "3M", "12M"];

export default function RangeTabs({
  value,
  onChange,
  size = "sm",
  className,
}: {
  value: ChartRange;
  onChange: (range: ChartRange) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Time range"
      className={cn(
        "inline-flex rounded-full border border-neutral-500/70 bg-white p-1",
        className,
      )}
    >
      {RANGES.map((r) => {
        const active = r === value;
        return (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(r)}
            className={cn(
              "rounded-full font-medium transition-colors duration-fast ease-standard focus-ring",
              size === "sm" ? "h-7 px-3 text-caption" : "h-8 px-4 text-caption",
              active
                ? "bg-neutral-900 text-white"
                : "text-ink-muted hover:bg-neutral-400 hover:text-ink",
            )}
          >
            {r}
          </button>
        );
      })}
    </div>
  );
}
