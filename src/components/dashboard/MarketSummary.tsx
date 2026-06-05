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
  const sentiment = summary.position ?? fallbackSentiment;
  const bulletList = summary.bullets.length
    ? summary.bullets
    : FALLBACK_BULLETS[sentiment];
  const updatedLabel = summary.updatedAt ? formatDateTime(summary.updatedAt) : "–";

  return (
    <section
      aria-labelledby={summary.description ? "market-sentiment-heading" : undefined}
      aria-label={summary.description ? undefined : "Market consensus summary"}
      className="signal-split-card surface-card surface-card-pad"
    >
      <p className="text-meta">
        Market data updated at {updatedLabel}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 items-center sm:mt-4">
        {summary.description ? (
          <SignalDescription
            html={summary.description}
            id="market-sentiment-heading"
            className="text-card-title [&_*]:m-0 [&_*]:font-inherit [&_*]:text-inherit [&_p]:inline"
          />
        ) : null}
        <Badge tone={sentiment} size="md" className="shrink-0">
          {SENTIMENT_LABEL[sentiment]}
        </Badge>
      </div>

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
