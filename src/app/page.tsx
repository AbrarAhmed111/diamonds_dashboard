"use client";

import { useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import MarketSummary from "@/components/dashboard/MarketSummary";
import SignalCard from "@/components/dashboard/SignalCard";
import SignalSplitCard from "@/components/dashboard/SignalSplitCard";
import NetflowCard from "@/components/dashboard/NetflowCard";
import FundingRateCard from "@/components/dashboard/FundingRateCard";
import LiquidityCard from "@/components/dashboard/LiquidityCard";
import MarketSentimentCard from "@/components/dashboard/MarketSentimentCard";
import VolatilityCard from "@/components/dashboard/VolatilityCard";
import SignalDetailPanel from "@/components/dashboard/SignalDetailPanel";
import ErrorState from "@/components/dashboard/ErrorState";
import { SkeletonCard, SkeletonHero } from "@/components/dashboard/LoadingState";
import { useSignals } from "@/lib/data";
import type { Signal } from "@/lib/types";

export default function SentimentPage() {
  const { signals, status, error, lastFetchedAt, refresh } = useSignals();
  const [active, setActive] = useState<Signal | null>(null);

  const byId = useMemo(() => {
    const map = new Map<string, Signal>();
    for (const s of signals) map.set(s.id, s);
    return map;
  }, [signals]);

  const get = (id: string) => byId.get(id);

  return (
    <AppShell title="Market sentiment" subtitle="Understand the mood before you make a move.">
      {status === "loading" && !signals.length ? (
        <div className="space-y-5">
          <SkeletonHero />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : status === "error" ? (
        <ErrorState
          description={error ?? "Could not load indicators.json. Check the file and try again."}
          onRetry={refresh}
        />
      ) : (
        <div className="space-y-5">
          <MarketSummary signals={signals} lastFetchedAt={lastFetchedAt} />

          {get("btc_price") ? (
            <SignalCard signal={get("btc_price")!} onSelect={setActive} />
          ) : null}

          {get("buying_power") ? (
            <SignalSplitCard
              signal={get("buying_power")!}
              metricLabel="Stablecoin Supply / Total Crypto Market Cap"
              onSelect={setActive}
            />
          ) : null}

          {get("btc_netflow") ? (
            <NetflowCard signal={get("btc_netflow")!} onSelect={setActive} />
          ) : null}

          {get("btc_funding_rate") ? (
            <FundingRateCard signal={get("btc_funding_rate")!} onSelect={setActive} />
          ) : null}

          {get("global_liquidity") ? (
            <LiquidityCard signal={get("global_liquidity")!} onSelect={setActive} />
          ) : null}

          {get("crypto_market_sentiment") ? (
            <MarketSentimentCard
              signal={get("crypto_market_sentiment")!}
              onSelect={setActive}
            />
          ) : null}

          {get("vix") ? (
            <VolatilityCard signal={get("vix")!} onSelect={setActive} />
          ) : null}
        </div>
      )}

      <SignalDetailPanel signal={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
