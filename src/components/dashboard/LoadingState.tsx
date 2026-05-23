import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "surface-card animate-pulse p-5 md:p-6",
        className,
      )}
      aria-hidden
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-neutral-400" />
        <div className="space-y-2">
          <div className="h-3 w-40 rounded-full bg-neutral-400" />
          <div className="h-2 w-24 rounded-full bg-neutral-400" />
        </div>
      </div>
      <div className="mt-6 h-7 w-32 rounded bg-neutral-400" />
      <div className="mt-3 h-2 w-44 rounded bg-neutral-400" />
      <div className="mt-6 h-32 rounded-xl bg-neutral-400/70" />
      <div className="mt-4 space-y-2">
        <div className="h-2 w-3/4 rounded bg-neutral-400" />
        <div className="h-2 w-2/3 rounded bg-neutral-400" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2" aria-busy>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="surface-card animate-pulse p-7" aria-hidden>
      <div className="h-3 w-40 rounded-full bg-neutral-400" />
      <div className="mt-3 h-7 w-72 rounded bg-neutral-400" />
      <div className="mt-6 space-y-2">
        <div className="h-2 w-3/4 rounded bg-neutral-400" />
        <div className="h-2 w-2/3 rounded bg-neutral-400" />
        <div className="h-2 w-1/2 rounded bg-neutral-400" />
      </div>
    </div>
  );
}
