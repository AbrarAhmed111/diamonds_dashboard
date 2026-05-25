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
        <div className="h-9 w-9 rounded-[8px] bg-neutral-400" />
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

function SkeletonSplitCard() {
  return (
    <div className="surface-card animate-pulse p-5 md:p-6" aria-hidden>
      <div className="grid items-start gap-4 sm:gap-5 md:grid-cols-2 md:gap-10">
        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-9 w-9 rounded-[8px] bg-neutral-400" />
            <div className="h-4 w-36 rounded bg-neutral-400" />
            <div className="h-6 w-14 rounded-full bg-neutral-400" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-neutral-400/80" />
            <div className="h-3 w-11/12 rounded bg-neutral-400/80" />
            <div className="h-3 w-4/5 rounded bg-neutral-400/70" />
          </div>
        </div>
        <div className="min-w-0">
          <div className="h-8 w-28 rounded bg-neutral-400" />
          <div className="mt-2 h-2 w-48 rounded bg-neutral-400/70" />
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-7 w-10 rounded bg-neutral-400/60" />
            ))}
          </div>
          <div className="mt-4 h-[200px] rounded-xl bg-neutral-400/70" />
        </div>
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
    <div className="surface-card animate-pulse p-5 md:p-7" aria-hidden>
      <div className="h-3 w-40 rounded-full bg-neutral-400" />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="h-7 w-56 rounded bg-neutral-400 sm:w-72" />
        <div className="h-6 w-20 rounded-full bg-neutral-400" />
      </div>
      <div className="mt-5 space-y-3 sm:mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-neutral-400" />
            <div
              className={cn(
                "h-3 rounded bg-neutral-400/80",
                i % 2 === 0 ? "w-full" : "w-11/12",
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function OverviewSkeleton({ cards = 7 }: { cards?: number }) {
  return (
    <div className="space-y-4 sm:space-y-5" aria-busy="true" aria-label="Loading dashboard">
      <SkeletonHero />
      <SkeletonCard />
      {Array.from({ length: Math.max(0, cards - 2) }).map((_, i) => (
        <SkeletonSplitCard key={i} />
      ))}
    </div>
  );
}
