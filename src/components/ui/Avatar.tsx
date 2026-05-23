import { cn } from "@/lib/utils";

export default function Avatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid h-7 w-7 place-items-center rounded-full bg-blue-100 text-caption font-medium text-blue-800",
        className,
      )}
      aria-hidden
    >
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}
