import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmptyState({
  title = "No signals to show",
  description = "Adjust your filters or refresh the data.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "surface-card flex flex-col items-center justify-center px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-neutral-400 text-ink-muted">
        <Inbox className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-h4 font-medium text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-small text-ink-muted">{description}</p>
    </div>
  );
}
