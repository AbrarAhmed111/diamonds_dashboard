"use client";

import type { ReactNode } from "react";
import Badge from "@/components/ui/Badge";
import SignalIcon from "./SignalIcon";
import type { Signal } from "@/lib/types";

type BadgeTone = "positive" | "negative" | "neutral" | "muted" | "info";

interface Props {
  signal: Signal;
  badge?: { label: string; tone?: BadgeTone };
  description?: string;
  children: ReactNode;
  asideExtra?: ReactNode;
}

export default function SplitFrame({
  signal,
  badge,
  description,
  children,
  asideExtra,
}: Props) {
  return (
    <article className="surface-card surface-card-pad overflow-hidden">
      <div className="grid items-stretch gap-4 sm:gap-5 md:grid-cols-2 md:gap-10">
        <aside className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <SignalIcon id={signal.id} category={signal.category} />
            <h3 className="text-card-title">{signal.name}</h3>
            {badge ? (
              <Badge tone={badge.tone ?? "positive"} size="md" className="px-2.5">
                {badge.label}
              </Badge>
            ) : null}
          </div>
          {(description || asideExtra) ? (
            <div className="mt-2 w-full sm:mt-3 md:max-w-[75%]">
              {description ? (
                <p className="text-card-body">{description}</p>
              ) : null}
              {asideExtra}
            </div>
          ) : null}
        </aside>

        <div className="flex min-h-[160px] min-w-0 flex-col md:min-h-0">{children}</div>
      </div>
    </article>
  );
}
