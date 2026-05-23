import AppShell from "@/components/layout/AppShell";
import ComingSoon from "@/components/dashboard/ComingSoon";

export const metadata = {
  title: "Portfolio · Diamond Pigs",
};

export default function PortfolioPage() {
  return (
    <AppShell title="Portfolio" subtitle="Track allocations and performance over time.">
      <ComingSoon
        title="Portfolio is in design review"
        description="Plug in connected wallets or upload a CSV to see allocations and performance scored against the latest sentiment signals."
        bullets={[
          "Hot-wallet and exchange integrations (CSV upload first).",
          "Sentiment-weighted risk scoring.",
          "Drill-down per asset with the same chart language as Sentiment.",
        ]}
      />
    </AppShell>
  );
}
