"use client";

import Select from "@/components/ui/Select";
import SearchInput from "./SearchInput";
import { categoryLabel } from "@/lib/format";
import type { SignalFilters } from "@/lib/types";

interface Props {
  filters: SignalFilters;
  onChange: (next: SignalFilters) => void;
  categories: string[];
  total?: number;
  shown?: number;
}

const SORT_OPTIONS: Array<{ value: SignalFilters["sort"]; label: string }> = [
  { value: "name_asc", label: "Name A–Z" },
  { value: "value_desc", label: "Value (high → low)" },
  { value: "value_asc", label: "Value (low → high)" },
  { value: "category_asc", label: "Category" },
  { value: "status_asc", label: "Status" },
];

export default function FiltersBar({ filters, onChange, categories, shown, total }: Props) {
  const set = <K extends keyof SignalFilters>(key: K, value: SignalFilters[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="surface-card flex flex-col gap-3 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="min-w-0 flex-1">
          <SearchInput value={filters.query} onChange={(v) => set("query", v)} />
        </div>

        <Select
          value={filters.category}
          onChange={(e) => set("category", e.target.value as SignalFilters["category"])}
          aria-label="Filter by category"
          label="Category"
        >
          <option value="all">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </Select>

        <Select
          value={filters.status}
          onChange={(e) => set("status", e.target.value as SignalFilters["status"])}
          aria-label="Filter by status"
          label="Status"
        >
          <option value="all">All</option>
          <option value="healthy">Live</option>
          <option value="stale">Delayed</option>
          <option value="error">Error</option>
          <option value="unknown">Unknown</option>
        </Select>

        <Select
          value={filters.sentiment}
          onChange={(e) => set("sentiment", e.target.value as SignalFilters["sentiment"])}
          aria-label="Filter by sentiment"
          label="Sentiment"
        >
          <option value="all">All</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </Select>

        <Select
          value={filters.sort}
          onChange={(e) => set("sort", e.target.value as SignalFilters["sort"])}
          aria-label="Sort signals"
          label="Sort"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      {typeof shown === "number" && typeof total === "number" ? (
        <p className="text-caption text-ink-muted">
          Showing <span className="text-ink">{shown}</span> of {total} signals
        </p>
      ) : null}
    </div>
  );
}
