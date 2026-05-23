"use client";

import type { ReactNode } from "react";

/** Shared gauge render width so stacked cards align on the same axis. */
export const GAUGE_DISPLAY_SIZE = 420;

/** Shared right-column wrapper so gauge cards align on the same vertical axis. */
export default function GaugeAside({ children }: { children: ReactNode }) {
  return (
    <div className="gauge-fit flex h-full w-full items-center justify-center md:pr-4">
      {children}
    </div>
  );
}
