"use client";

import Badge from "@/components/ui/Badge";
import type { Signal, SentimentType } from "@/lib/types";
import { SENTIMENT_LABEL, getOverallSentiment } from "@/lib/sentiment";
import { formatDateTime } from "@/lib/format";

interface Props {
  signals: Signal[];
  lastFetchedAt: Date | null;
  bullets?: string[];
}

const FALLBACK_BULLETS: Record<SentimentType, string[]> = {
  positive: [
    "Diamond Pigs is reading this as a cautious long signal.",
    "On-chain accumulation is strong, macro conditions are supportive, and traders are heavily positioned short, which creates squeeze potential.",
    "Momentum and volatility signals are still mixed, so patience matters.",
    "Stay grounded, manage your risk, and let the data lead the way.",
  ],
  neutral: [
    "Signals are mixed; the market is between regimes and decisive trades carry low expected value.",
    "Wait for confirmation across at least two of macro, on-chain, and technicals before sizing up.",
    "Use this period to rebalance, set alerts, and let the data speak first.",
  ],
  negative: [
    "Diamond Pigs is reading this as a defensive signal.",
    "Macro liquidity is tightening and on-chain demand is fading, while price momentum is rolling over.",
    "Reduce leverage, raise cash, and avoid trying to catch a falling knife.",
    "Reassess once at least one macro and one on-chain signal flip back to neutral.",
  ],
};

export default function MarketSummary({ signals, lastFetchedAt, bullets }: Props) {
  const sentiment = getOverallSentiment(signals);
  const bulletList = bullets?.length ? bullets : FALLBACK_BULLETS[sentiment];

  return (
    <section
      aria-labelledby="market-sentiment-heading"
      className="surface-card surface-card-pad"
    >
      <p className="text-meta">Market data updated:</p>
      <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
        <h2
          id="market-sentiment-heading"
          className="text-section-date"
        >
          {formatDateTime(lastFetchedAt)}
        </h2>
        <Badge tone="sentiment" size="md" className="px-3 py-0.5">
          {SENTIMENT_LABEL[sentiment]}
        </Badge>
      </div>

      <ul className="mt-4 max-w-3xl space-y-2 sm:mt-5">
        {bulletList.map((line, i) => (
          <li key={i} className="flex gap-2.5 text-small text-ink/85 sm:gap-3 md:text-body">
            <span
              aria-hidden
              className="mt-[10px] h-2 w-2 shrink-0 rounded-full bg-sentiment"
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
