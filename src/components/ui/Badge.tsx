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
  positive: "bg-positive-50 text-positive-700 border border-positive-100/80",
  neutral: "bg-blue-50 text-blue-700 border border-blue-100/60",
  negative: "bg-negative-50 text-negative-700 border border-negative-100",
  warning: "bg-warning-50 text-warning-700 border border-warning-100",
  info: "bg-blue-50 text-blue-700 border border-blue-100/60",
  muted: "bg-neutral-400 text-neutral-800 border border-neutral-500/60",
  sentiment:
    "bg-sentiment-soft text-sentiment-ink border border-sentiment/20",
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
        "inline-flex items-center gap-1.5 rounded-full font-medium",
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
