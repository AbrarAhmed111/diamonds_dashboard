"use client";

import type { ReactNode } from "react";

import { SPLIT_CARD_GAUGE_SIZE } from "./SplitFrame";

export const GAUGE_DISPLAY_SIZE = SPLIT_CARD_GAUGE_SIZE;

export default function GaugeAside({ children }: { children: ReactNode }) {
  return (
    <div className="gauge-fit flex w-full flex-1 items-center justify-center py-2 md:py-4 md:pr-2">
      {children}
    </div>
  );
}
