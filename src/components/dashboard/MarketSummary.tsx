"use client";

import Badge from "@/components/ui/Badge";
import SignalDescription from "@/components/dashboard/SignalDescription";
import type { ConsolidationSummary } from "@/lib/dashboard";
import type { Signal, SentimentType } from "@/lib/types";
import { SENTIMENT_LABEL, getOverallSentiment } from "@/lib/sentiment";
import { formatDateTime } from "@/lib/format";

interface Props {
  signals: Signal[];
  consolidation: ConsolidationSummary;
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

export default function MarketSummary({ signals, consolidation }: Props) {
  const summary = consolidation ?? {
    position: null,
    description: null,
    updatedAt: null,
    bullets: [],
  };
  const fallbackSentiment = getOverallSentiment(signals);
  const bulletSentiment = summary.position ?? fallbackSentiment;
  const bulletList = summary.bullets.length
    ? summary.bullets
    : FALLBACK_BULLETS[bulletSentiment];
  const updatedLabel = summary.updatedAt ? formatDateTime(summary.updatedAt) : "–";
  const positionLabel = summary.position ? SENTIMENT_LABEL[summary.position] : null;

  return (
    <section
      aria-labelledby="market-sentiment-heading"
      className="signal-split-card surface-card surface-card-pad"
    >
      <p className="text-meta">Market data updated:</p>

      <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3">
        <h2 id="market-sentiment-heading" className="text-section-date">
          {updatedLabel}
        </h2>
        {positionLabel && summary.position ? (
          <Badge tone={summary.position} size="md">
            {positionLabel}
          </Badge>
        ) : null}
      </div>

      {summary.description ? (
        <SignalDescription
          html={summary.description}
          className="mt-5 text-card-body sm:mt-6 [&_*]:text-ink-muted"
        />
      ) : null}

      <ul className="market-summary-bullets">
        {bulletList.map((line, i) => (
          <li key={i}>
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
