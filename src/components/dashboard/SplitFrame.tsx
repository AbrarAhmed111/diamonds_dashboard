"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
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
  onSelect?: (signal: Signal) => void;
  /** Width fraction of the description column on md+ screens. */
  asideWidth?: "narrow" | "wide";
}

export default function SplitFrame({
  signal,
  badge,
  description,
  children,
  asideExtra,
  onSelect,
  asideWidth = "narrow",
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
          {description ? (
            <p className="mt-3 text-small text-ink-muted leading-6">{description}</p>
          ) : null}
          {asideExtra}
        </aside>

        <div className="flex min-h-[160px] min-w-0 flex-col md:min-h-0">
          {/*
            MVP: progressive disclosure is intentionally disabled.
            Re-enable when the detail view ships.
          <SeeMoreButton onClick={() => onSelect?.(signal)} signalName={signal.name} />
          */}
          {children}
        </div>
      </div>
    </article>
  );
}

function SeeMoreButton({
  signalName,
  onClick,
}: {
  signalName: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-8 items-center gap-1 rounded-full border border-neutral-500/70 bg-white px-3 text-caption text-ink hover:bg-neutral-400 focus-ring"
        aria-label={`See more about ${signalName}`}
      >
        See more
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
