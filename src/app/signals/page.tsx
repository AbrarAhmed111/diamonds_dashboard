"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import FiltersBar from "@/components/filters/FiltersBar";
import SignalGrid from "@/components/dashboard/SignalGrid";
import SignalDetailPanel from "@/components/dashboard/SignalDetailPanel";
import ErrorState from "@/components/dashboard/ErrorState";
import { SkeletonGrid } from "@/components/dashboard/LoadingState";
import { DEFAULT_FILTERS, type Signal, type SignalFilters } from "@/lib/types";
import { filterSignals, sortSignals } from "@/lib/sentiment";
import { useSignals } from "@/lib/data";
import { uniq } from "@/lib/utils";

export default function SignalsPage() {
  const { signals, status, error, refresh } = useSignals();
  const [filters, setFilters] = useState<SignalFilters>(DEFAULT_FILTERS);
  const [active, setActive] = useState<Signal | null>(null);

  const categories = useMemo(() => uniq(signals.map((s) => s.category)).sort(), [signals]);
  const visible = useMemo(
    () => sortSignals(filterSignals(signals, filters), filters.sort),
    [signals, filters],
  );

  return (
    <AppShell
      title="All signals"
      subtitle="Browse, search, and filter every market signal in one place."
    >
      <div className="space-y-5">
        <FiltersBar
          filters={filters}
          onChange={setFilters}
          categories={categories}
          shown={visible.length}
          total={signals.length}
        />

        {status === "loading" && !signals.length ? (
          <SkeletonGrid count={6} />
        ) : status === "error" ? (
          <ErrorState description={error ?? "Failed to load signals."} onRetry={refresh} />
        ) : (
          <SignalGrid
            signals={visible}
            onSelect={setActive}
            emptyTitle="No matching signals"
            emptyDescription="Try clearing filters or refining your search."
          />
        )}
      </div>

      <SignalDetailPanel signal={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
