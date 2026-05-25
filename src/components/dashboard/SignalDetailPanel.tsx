"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import StatusBadge from "./StatusBadge";
import SentimentBadge from "./SentimentBadge";
import RangeTabs from "@/components/charts/RangeTabs";
import SignalLineChart from "@/components/charts/SignalLineChart";
import {
  categoryLabel,
  formatDate,
  formatValue,
  getLatestValue,
} from "@/lib/format";
import { sliceByRange } from "@/lib/sentiment";
import type { ChartRange, Signal } from "@/lib/types";

interface Props {
  signal: Signal | null;
  onClose: () => void;
}

export default function SignalDetailPanel({ signal, onClose }: Props) {
  const [range, setRange] = useState<ChartRange>("12M");
  const sliced = useMemo(
    () => (signal ? sliceByRange(signal.values, range) : []),
    [signal, range],
  );

  useEffect(() => {
    if (!signal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [signal, onClose]);

  if (!signal) return null;
  const latest = getLatestValue(signal);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal aria-labelledby="signal-detail-title">
      <button
        type="button"
        aria-label="Close detail"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
      />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-white shadow-card">
        <header className="flex items-start justify-between gap-3 border-b border-neutral-500/40 p-4 sm:p-5">
          <div className="min-w-0">
            <h2 id="signal-detail-title" className="truncate text-h4-m font-medium text-ink md:text-h3">
              {signal.name}
            </h2>
            <p className="text-small text-ink-muted">
              {categoryLabel(signal.category)} · {signal.source ?? "Unknown source"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <SentimentBadge sentiment={signal.sentiment} />
              <StatusBadge status={signal.status} />
              {signal.unit ? <Badge tone="muted">{signal.unit}</Badge> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-muted hover:bg-neutral-400 focus-ring"
            aria-label="Close detail"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:space-y-5 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div>
              <p className="text-caption text-ink-muted">Latest value</p>
              <p className="text-metric md:text-h2">
                {formatValue(latest?.value, signal.unit)}
              </p>
              <p className="text-caption text-ink-muted">{formatDate(latest?.timestamp)}</p>
            </div>
            <RangeTabs value={range} onChange={setRange} />
          </div>

          <div className="rounded-2xl border border-neutral-500/40 bg-neutral-400/30 p-3">
            <SignalLineChart
              values={sliced}
              unit={signal.unit}
              height={200}
              ariaLabel={`${signal.name} ${range} chart`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-small">
            <Field label="Category" value={categoryLabel(signal.category)} />
            <Field label="Source" value={signal.source ?? "Unknown source"} />
            <Field
              label="Min observed"
              value={
                typeof signal.min_val === "number"
                  ? formatValue(signal.min_val, signal.unit)
                  : "–"
              }
            />
            <Field
              label="Max observed"
              value={
                typeof signal.max_val === "number"
                  ? formatValue(signal.max_val, signal.unit)
                  : "–"
              }
            />
          </div>

          <Section title="Description">
            <p className="text-body text-ink/85">{signal.description ?? "No description available."}</p>
          </Section>

          <Section title="Interpretation">
            <p className="text-body text-ink/85">
              {signal.interpretation ?? "No interpretation available."}
            </p>
          </Section>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-500/40 bg-white px-3 py-2">
      <p className="text-caption text-ink-muted">{label}</p>
      <p className="text-small text-ink">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-small font-medium uppercase tracking-[0.12em] text-ink-muted">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}
