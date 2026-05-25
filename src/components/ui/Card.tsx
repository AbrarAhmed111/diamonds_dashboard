import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article";
  padded?: boolean;
}

export function Card({ className, padded = true, children, ...rest }: CardProps) {
  return (
    <section
      className={cn(
        "surface-card",
        padded && "p-5 md:p-6",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="flex items-start gap-3">
        {icon ? (
          <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-neutral-400 text-neutral-800">
            {icon}
          </span>
        ) : null}
        <div>
          <h3 className="text-h4 text-ink">{title}</h3>
          {subtitle ? <p className="text-small text-ink-muted mt-0.5">{subtitle}</p> : null}
        </div>
      </div>
      {action ? <div className="ml-auto flex items-center gap-2">{action}</div> : null}
    </header>
  );
}
