import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/dashboard/ComingSoon";

export const metadata = {
  title: "Dashboard · Diamond Pigs",
};

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="Your personal market overview.">
      <ComingSoon
        title="Personal dashboard is on the way"
        description="Snapshots of your watchlists, alerts, and positioning will live here. The current POC focuses on sentiment-driven discovery."
        bullets={[
          "Watchlists pinned from the Sentiment page.",
          "Quick-glance KPI tiles (PnL, exposure, latest moves).",
          "Custom alerts when a signal flips state.",
        ]}
      />
    </AppShell>
  );
}
