import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "positive"
  | "neutral"
  | "negative"
  | "warning"
  | "info"
  | "muted"
  | "sentiment";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  icon?: ReactNode;
  size?: "sm" | "md";
}

const toneClasses: Record<Tone, string> = {
  positive: "border border-positive-500/40 bg-positive-50 text-positive-700",
  neutral: "border border-blue-500/35 bg-blue-50 text-blue-700",
  negative: "border border-negative-500/40 bg-negative-50 text-negative-700",
  warning: "border border-warning-500/40 bg-warning-50 text-warning-700",
  info: "border border-blue-500/35 bg-blue-50 text-blue-700",
  muted: "border border-neutral-500/70 bg-neutral-400 text-neutral-800",
  sentiment:
    "border border-sentiment/35 bg-sentiment-soft text-sentiment-ink",
};

export default function Badge({
  className,
  tone = "muted",
  icon,
  size = "sm",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[50px] font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-caption" : "px-3 py-1 text-small",
        toneClasses[tone],
        className,
      )}
      {...rest}
    >
      {icon ? <span aria-hidden>{icon}</span> : null}
      {children}
    </span>
  );
}
