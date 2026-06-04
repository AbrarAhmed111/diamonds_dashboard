import type { SentimentType } from "@/lib/types";

export interface ConsolidationSummary {
  position: SentimentType | null;
  description: string | null;
  /** ISO timestamp from consolidation_summary.values[0]. */
  updatedAt: string | null;
  bullets: string[];
}

const EMPTY_CONSOLIDATION: ConsolidationSummary = {
  position: null,
  description: null,
  updatedAt: null,
  bullets: [],
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripPositionBlock(raw: string): string {
  return raw.replace(/<position[^>]*>[\s\S]*?<\/position>/gi, "").trim();
}

/** Read market position from `<position>…</position>` inside consolidation HTML. */
export function extractPosition(raw: string): SentimentType | null {
  const match = raw.match(/<position[^>]*>([\s\S]*?)<\/position>/i);
  if (!match) return null;

  const text = stripHtml(match[1]).trim().toLowerCase();
  if (text === "positive") return "positive";
  if (text === "negative") return "negative";
  if (text === "neutral") return "neutral";
  return null;
}

/** Parse consolidation_summary HTML into plain bullet strings (position block excluded). */
export function parseConsolidationBullets(raw: string): string[] {
  const unwrapped = stripPositionBlock(raw)
    .replace(/^```html\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const liMatches = [...unwrapped.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  if (liMatches.length) {
    return liMatches.map((match) => stripHtml(match[1]).trim()).filter(Boolean);
  }

  const lines = unwrapped
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  return lines.length ? lines.map(stripHtml) : [stripHtml(unwrapped)].filter(Boolean);
}

export function parseConsolidationSummary(
  signals: Array<{
    id: string;
    description?: string | null;
    values?: Array<{ timestamp?: string; value: unknown }>;
  }>,
): ConsolidationSummary {
  const summary = signals.find((s) => s.id === "consolidation_summary");
  if (!summary) return EMPTY_CONSOLIDATION;

  const point = summary.values?.[0];
  const updatedAt = point?.timestamp ?? null;
  const description =
    typeof summary.description === "string" && summary.description.trim()
      ? summary.description.trim()
      : null;

  const raw = point?.value;
  if (typeof raw !== "string" || !raw.trim()) {
    return { position: null, description, updatedAt, bullets: [] };
  }

  return {
    position: extractPosition(raw),
    description,
    updatedAt,
    bullets: parseConsolidationBullets(raw),
  };
}
