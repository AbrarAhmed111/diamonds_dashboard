import type { SentimentType } from "./types";

/** Figma default chart blue — never tied to overall market sentiment. */
export const chartPalette = {
  primary: "#4195E9",
  primarySoft: "#B6D6F7",
} as const;

export const gaugeColors = {
  positive: "#C2F28C",
  negative: "#E26A45",
  neutral: chartPalette.primary,
} as const;

export const chartColors = {
  grid: "#E5E5E5",
  tick: "#8B8B8B",
  cursor: "#B3B3B3",
  ink: "#0D0D0D",
  white: "#FFFFFF",
  chart: chartPalette.primary,
  chartSoft: chartPalette.primarySoft,
} as const;

export function gaugeColorForSentiment(sentiment?: SentimentType): string {
  switch (sentiment) {
    case "positive":
      return gaugeColors.positive;
    case "negative":
      return gaugeColors.negative;
    default:
      return gaugeColors.neutral;
  }
}

export function badgeToneForSentiment(
  sentiment?: SentimentType,
): "positive" | "negative" | "muted" {
  switch (sentiment) {
    case "positive":
      return "positive";
    case "negative":
      return "negative";
    default:
      return "muted";
  }
}
