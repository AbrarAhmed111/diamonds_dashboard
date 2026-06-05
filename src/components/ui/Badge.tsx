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
  positive: "border-green-400 bg-green-50",
  neutral: "border-neutral-500 bg-neutral-400",
  negative: "border-negative-500 bg-negative-50",
  warning: "border-warning-500 bg-warning-50",
  info: "border-blue-300 bg-blue-50",
  muted: "border-neutral-500 bg-neutral-400",
  sentiment: "border-neutral-500 bg-neutral-400",
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
        "inline-flex items-center gap-1.5 rounded-full border font-normal text-ink",
        size === "sm" ? "px-3 py-0.5 text-caption" : "px-5 py-1 text-small",
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
