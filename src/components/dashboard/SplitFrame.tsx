"use client";

import type { ReactNode } from "react";
import Badge from "@/components/ui/Badge";
import SignalIcon from "./SignalIcon";
import SignalDescription from "./SignalDescription";
import type { Signal } from "@/lib/types";

type BadgeTone = "positive" | "negative" | "neutral" | "muted" | "info";

/** Line/bar chart height for split signal cards (matches taller card layout). */
export const SPLIT_CARD_CHART_HEIGHT = 260;
/** Semi-circle / segmented gauge display width (px). */
export const SPLIT_CARD_GAUGE_SIZE = 500;

interface Props {
  signal: Signal;
  badge?: { label: string; tone?: BadgeTone };
  description?: string;
  descriptionExtra?: ReactNode;
  children: ReactNode;
}

export default function SplitFrame({
  signal,
  badge,
  description,
  descriptionExtra,
  children,
}: Props) {
  return (
    <article className="signal-split-card surface-card surface-card-pad overflow-hidden">
      <div className="grid items-start gap-5 sm:gap-6 md:grid-cols-2 md:items-stretch md:gap-10">
        <aside className="signal-split-card__aside">
          <div className="w-full md:max-w-[90%]">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <SignalIcon id={signal.id} category={signal.category} />
              <h3 className="text-body-bold">{signal.name}</h3>
              {badge ? (
                <Badge tone={badge.tone ?? "positive"} size="md" className="px-2.5">
                  {badge.label}
                </Badge>
              ) : null}
            </div>
            {description ? (
              <SignalDescription html={description} className="mt-5 flex-1 sm:mt-6" />
            ) : null}
            {descriptionExtra ? (
              <div className="mt-4 sm:mt-5">{descriptionExtra}</div>
            ) : null}
          </div>
        </aside>

        <div className="signal-split-card__chart">{children}</div>
      </div>
    </article>
  );
}
