"use client";

import { Database, Github, Globe, RefreshCcw, Server } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { Card, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useSignals } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

const APP_VERSION = "0.1.0 (POC)";

export default function SettingsPage() {
  const { lastFetchedAt, status, refresh, signals } = useSignals();

  return (
    <AppShell
      title="Settings"
      subtitle="Manage data sources and review POC information."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader
            icon={<Database className="h-4 w-4" />}
            title="Data source"
            subtitle="Static JSON file served from the public folder."
          />
          <div className="mt-4 space-y-3 text-small">
            <Row label="Path">
              <code className="rounded bg-neutral-400 px-2 py-0.5 text-caption">
                /data/indicators.json
              </code>
            </Row>
            <Row label="Last fetched">{formatDateTime(lastFetchedAt)}</Row>
            <Row label="Signals loaded">{signals.length}</Row>
          </div>
          <div className="mt-5">
            <Button onClick={refresh} loading={status === "loading"} variant="primary" size="sm">
              <RefreshCcw className="h-3.5 w-3.5" />
              Refresh data now
            </Button>
          </div>
        </Card>

        <Card>
          <CardHeader
            icon={<Server className="h-4 w-4" />}
            title="Update workflow"
            subtitle="How fresh data lands in this dashboard."
          />
          <ol className="mt-4 space-y-3 text-small text-ink/80">
            <Step n={1}>
              Backend script generates a fresh <code>indicators.json</code> via{" "}
              <code>indicators_export.py</code>.
            </Step>
            <Step n={2}>The file is committed to the repo or uploaded to static hosting.</Step>
            <Step n={3}>
              The dashboard refetches the JSON on next load or when you press <em>Refresh</em>.
            </Step>
          </ol>
        </Card>

        <Card>
          <CardHeader
            icon={<Globe className="h-4 w-4" />}
            title="Hosting"
            subtitle="Deployment targets for this static export."
          />
          <ul className="mt-4 space-y-2 text-small text-ink/80">
            <li className="flex items-center gap-2">
              <Badge tone="info">Recommended</Badge> Vercel / Netlify
            </li>
            <li className="flex items-center gap-2">
              <Badge tone="muted">Alt</Badge> GitHub Pages (static export)
            </li>
            <li className="text-ink-muted">
              The Next.js config uses <code>output: &quot;export&quot;</code> for portability.
            </li>
          </ul>
        </Card>

        <Card>
          <CardHeader
            icon={<Github className="h-4 w-4" />}
            title="App information"
            subtitle="POC build metadata."
          />
          <div className="mt-4 grid grid-cols-2 gap-3 text-small">
            <Row label="App version">{APP_VERSION}</Row>
            <Row label="Stage">
              <Badge tone="warning">Proof of concept</Badge>
            </Row>
            <Row label="Backend">None (static)</Row>
            <Row label="Daily refresh">Auto on load + 24h</Row>
          </div>
          <p className="mt-4 text-caption text-ink-muted">
            This is a frontend prototype. None of the controls below mutate live systems and there
            is no authentication wired up.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-muted">{label}</span>
      <span className="text-ink">{children}</span>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-neutral-400 text-caption font-medium text-ink">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}
