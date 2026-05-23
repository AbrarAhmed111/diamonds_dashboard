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
  /** Extra content rendered under the description (e.g. sub-stats grid). */
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
    <article className="surface-card overflow-hidden p-6 md:p-7">
      <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-10">
        <aside className="flex min-w-0 flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <SignalIcon id={signal.id} category={signal.category} />
            <h3 className="text-h4 font-medium text-ink">{signal.name}</h3>
            {badge ? (
              <Badge tone={badge.tone ?? "positive"} size="md" className="px-2.5">
                {badge.label}
              </Badge>
            ) : null}
          </div>
          {(description || asideExtra) ? (
            <div className="mt-3 w-full md:max-w-[75%]">
              {description ? (
                <p className="text-small text-ink-muted leading-6">{description}</p>
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
