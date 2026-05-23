"use client";

import { cn } from "@/lib/utils";
import type { Signal } from "@/lib/types";
import SignalCard from "./SignalCard";
import EmptyState from "./EmptyState";

interface Props {
  signals: Signal[];
  onSelect?: (signal: Signal) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export default function SignalGrid({
  signals,
  onSelect,
  emptyTitle,
  emptyDescription,
  className,
}: Props) {
  if (!signals.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }
  return (
    <div className={cn("grid gap-4 md:gap-5 grid-cols-1 xl:grid-cols-2", className)}>
      {signals.map((s) => (
        <SignalCard key={s.id} signal={s} onSelect={onSelect} />
      ))}
    </div>
  );
}
