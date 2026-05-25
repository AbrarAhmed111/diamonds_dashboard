"use client";

import { useMemo } from "react";
import AppShell from "@/components/layout/AppShell";
import MarketSummary from "@/components/dashboard/MarketSummary";
import SignalCard from "@/components/dashboard/SignalCard";
import SignalSplitCard from "@/components/dashboard/SignalSplitCard";
import NetflowCard from "@/components/dashboard/NetflowCard";
import FundingRateCard from "@/components/dashboard/FundingRateCard";
import LiquidityCard from "@/components/dashboard/LiquidityCard";
import MarketSentimentCard from "@/components/dashboard/MarketSentimentCard";
import VolatilityCard from "@/components/dashboard/VolatilityCard";
import ErrorState from "@/components/dashboard/ErrorState";
import { OverviewSkeleton } from "@/components/dashboard/LoadingState";
import { useSignals } from "@/lib/data";
import type { Signal } from "@/lib/types";

export default function SentimentPage() {
  const { signals, consolidationBullets, status, isLoading, error, lastFetchedAt, refresh } =
    useSignals();

  const byId = useMemo(() => {
    const map = new Map<string, Signal>();
    for (const s of signals) map.set(s.id, s);
    return map;
  }, [signals]);

  const get = (id: string) => byId.get(id);

  return (
    <AppShell title="Market sentiment" subtitle="Understand the mood before you make a move.">
      {isLoading ? (
        <OverviewSkeleton />
      ) : status === "error" ? (
        <ErrorState
          description={error ?? "Could not load market data from the Helix API."}
          onRetry={refresh}
        />
      ) : (
        <div className="space-y-4 sm:space-y-5">
          <MarketSummary
            signals={signals}
            lastFetchedAt={lastFetchedAt}
            bullets={consolidationBullets}
          />

          {get("btc_price") ? (
            <SignalCard signal={get("btc_price")!} />
          ) : null}

          {get("buying_power") ? (
            <SignalSplitCard
              signal={get("buying_power")!}
              metricLabel="Stablecoin Supply / Total Crypto Market Cap"
              valueMode="change"
            />
          ) : null}

          {get("btc_netflow") ? <NetflowCard signal={get("btc_netflow")!} /> : null}

          {get("btc_funding_rate") ? (
            <FundingRateCard signal={get("btc_funding_rate")!} />
          ) : null}

          {get("global_liquidity") ? (
            <LiquidityCard signal={get("global_liquidity")!} />
          ) : null}

          {get("crypto_market_sentiment") ? (
            <MarketSentimentCard signal={get("crypto_market_sentiment")!} />
          ) : null}

          {get("vix") ? <VolatilityCard signal={get("vix")!} /> : null}
        </div>
      )}
    </AppShell>
  );
}
