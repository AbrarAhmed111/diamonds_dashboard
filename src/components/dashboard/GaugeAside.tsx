"use client";

import type { ReactNode } from "react";

export const GAUGE_DISPLAY_SIZE = 420;

export default function GaugeAside({ children }: { children: ReactNode }) {
  return (
    <div className="gauge-fit flex h-full w-full items-center justify-center md:pr-4">
      {children}
    </div>
  );
}
