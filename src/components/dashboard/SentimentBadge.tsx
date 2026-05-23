import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { SentimentType } from "@/lib/types";
import { SENTIMENT_LABEL } from "@/lib/sentiment";

const TONE: Record<SentimentType, "positive" | "neutral" | "negative"> = {
  positive: "positive",
  neutral: "neutral",
  negative: "negative",
};

const ICON: Record<SentimentType, React.ComponentType<{ className?: string }>> = {
  positive: ArrowUpRight,
  neutral: Minus,
  negative: ArrowDownRight,
};

export default function SentimentBadge({
  sentiment,
  showLabel = true,
}: {
  sentiment?: SentimentType;
  showLabel?: boolean;
}) {
  const s: SentimentType = sentiment ?? "neutral";
  const Icon = ICON[s];
  return (
    <Badge tone={TONE[s]} icon={<Icon className="h-3 w-3" />}>
      {showLabel ? SENTIMENT_LABEL[s] : null}
    </Badge>
  );
}
