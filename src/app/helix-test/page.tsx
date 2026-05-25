"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_SNAPSHOT_PARAMS,
  fetchDashboardSnapshot,
  getHelixApiKey,
  getHelixApiUrl,
  HelixApiError,
  type HelixResponse,
  type HelixSignal,
} from "@/lib/helix";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; response: HelixResponse<HelixSignal[]>; fetchedAt: Date }
  | { status: "error"; message: string; details?: string };

export default function HelixTestPage() {
  const defaultKey = getHelixApiKey() ?? "";
  const defaultUrl = getHelixApiUrl();

  const [apiKey, setApiKey] = useState(defaultKey);
  const [baseUrl, setBaseUrl] = useState(defaultUrl);
  const [outputPromptId, setOutputPromptId] = useState(DEFAULT_SNAPSHOT_PARAMS.output_prompt_id);
  const [limitDays, setLimitDays] = useState(DEFAULT_SNAPSHOT_PARAMS.limit_days);
  const [state, setState] = useState<FetchState>({ status: "idle" });

  const runFetch = useCallback(async () => {
    if (!apiKey.trim()) {
      setState({
        status: "error",
        message: "API key is required.",
        details: "Set NEXT_PUBLIC_HELIX_API_KEY in .env.local or paste the key below.",
      });
      return;
    }

    setState({ status: "loading" });

    try {
      const response = await fetchDashboardSnapshot(
        { output_prompt_id: outputPromptId, limit_days: limitDays },
        { apiKey: apiKey.trim(), baseUrl: baseUrl.trim() || undefined },
      );
      setState({ status: "success", response, fetchedAt: new Date() });
    } catch (error) {
      if (error instanceof HelixApiError) {
        setState({
          status: "error",
          message: error.message,
          details: error.details ? JSON.stringify(error.details, null, 2) : undefined,
        });
        return;
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      setState({ status: "error", message });
    }
  }, [apiKey, baseUrl, limitDays, outputPromptId]);

  const summary = useMemo(() => {
    if (state.status !== "success" || !state.response.ok) return null;
    return state.response.data.map((signal) => ({
      id: signal.id,
      category: signal.category,
      points: signal.values?.length ?? 0,
      latest: signal.values?.[signal.values.length - 1],
    }));
  }, [state]);

  const rawJson =
    state.status === "success"
      ? JSON.stringify(state.response, null, 2)
      : state.status === "error" && state.details
        ? state.details
        : null;

  return (
    <div className="min-h-screen bg-surface-canvas px-4 py-8 sm:px-6 md:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <p className="text-caption font-medium uppercase tracking-wide text-ink-muted">Dev only</p>
          <h1 className="text-page-title">Helix API test</h1>
          <p className="max-w-2xl text-small text-ink-muted">
            Probe <code className="text-ink">dashboard.snapshot</code> before wiring it into the
            dashboard. This page is not linked from navigation.
          </p>
        </header>

        <section className="surface-card surface-card-pad space-y-4">
          <h2 className="text-card-title">Request</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-1.5 md:col-span-2">
              <span className="text-caption text-ink-muted">API URL</span>
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full rounded-lg border border-neutral-500/50 bg-white px-3 py-2 text-small text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            <label className="block space-y-1.5 md:col-span-2">
              <span className="text-caption text-ink-muted">API key</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
                placeholder="dp_..."
                className="w-full rounded-lg border border-neutral-500/50 bg-white px-3 py-2 text-small text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-caption text-ink-muted">output_prompt_id</span>
              <input
                type="number"
                min={1}
                value={outputPromptId}
                onChange={(e) => setOutputPromptId(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-500/50 bg-white px-3 py-2 text-small text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-caption text-ink-muted">limit_days</span>
              <input
                type="number"
                min={1}
                value={limitDays}
                onChange={(e) => setLimitDays(Number(e.target.value))}
                className="w-full rounded-lg border border-neutral-500/50 bg-white px-3 py-2 text-small text-ink outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={runFetch}
            disabled={state.status === "loading"}
            className="rounded-lg bg-neutral-900 px-4 py-2.5 text-btn-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.status === "loading" ? "Fetching…" : "Fetch snapshot"}
          </button>
        </section>

        {state.status === "error" ? (
          <section className="rounded-2xl border border-negative-500/30 bg-negative-50 p-5">
            <h2 className="text-card-title text-negative-700">Request failed</h2>
            <p className="mt-2 text-small text-negative-700">{state.message}</p>
            {state.details ? (
              <pre className="mt-3 overflow-x-auto rounded-lg bg-white/70 p-3 text-caption text-ink">
                {state.details}
              </pre>
            ) : null}
          </section>
        ) : null}

        {summary ? (
          <section className="surface-card surface-card-pad space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-card-title">Summary</h2>
              {state.status === "success" && state.response.ok ? (
                <p className="text-caption text-ink-muted">
                  {state.response.data.length} signals · fetched{" "}
                  {state.fetchedAt.toLocaleTimeString()}
                </p>
              ) : null}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-caption">
                <thead>
                  <tr className="border-b border-neutral-500/40 text-ink-muted">
                    <th className="py-2 pr-4 font-medium">ID</th>
                    <th className="py-2 pr-4 font-medium">Category</th>
                    <th className="py-2 pr-4 font-medium">Points</th>
                    <th className="py-2 font-medium">Latest value</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.map((row) => (
                    <tr key={row.id} className="border-b border-neutral-500/20">
                      <td className="py-2 pr-4 font-mono text-ink">{row.id}</td>
                      <td className="py-2 pr-4 text-ink-muted">{row.category}</td>
                      <td className="py-2 pr-4 text-ink">{row.points}</td>
                      <td className="max-w-md truncate py-2 font-mono text-ink-muted">
                        {row.latest ? String(row.latest.value).slice(0, 120) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {rawJson ? (
          <section className="surface-card surface-card-pad space-y-3">
            <h2 className="text-card-title">Raw response</h2>
            <pre className="max-h-[640px] overflow-auto rounded-xl bg-neutral-900 p-4 text-caption leading-relaxed text-neutral-100">
              {rawJson}
            </pre>
          </section>
        ) : null}
      </div>
    </div>
  );
}
