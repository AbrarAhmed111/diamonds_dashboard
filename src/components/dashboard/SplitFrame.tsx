"use client";

import type { ReactNode } from "react";
import Badge from "@/components/ui/Badge";
import SignalIcon from "./SignalIcon";
import type { Signal } from "@/lib/types";

type BadgeTone = "positive" | "negative" | "neutral" | "muted" | "info";

export const SPLIT_CARD_CHART_HEIGHT = 200;

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
    <article className="surface-card surface-card-pad overflow-hidden">
      <div className="grid items-start gap-4 sm:gap-5 md:grid-cols-2 md:gap-10">
        <aside className="flex min-w-0 flex-col">
          <div className="md:max-w-[75%]">
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
              <p className="mt-5 text-card-body sm:mt-6">{description}</p>
            ) : null}
            {descriptionExtra ? (
              <div className="mt-4 sm:mt-5">{descriptionExtra}</div>
            ) : null}
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">{children}</div>
      </div>
    </article>
  );
}
