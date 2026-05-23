"use client";

import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function ErrorState({
  title = "We couldn't load the data",
  description = "The dashboard tried to fetch indicators.json but the request failed.",
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "surface-card flex flex-col items-center justify-center px-6 py-12 text-center",
        className,
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-negative-50 text-negative-700">
        <AlertTriangle className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-h4 font-medium text-ink">{title}</h3>
      <p className="mt-1 max-w-md text-small text-ink-muted">{description}</p>
      {onRetry ? (
        <Button onClick={onRetry} className="mt-5" variant="primary" size="sm">
          Try again
        </Button>
      ) : null}
    </div>
  );
}
