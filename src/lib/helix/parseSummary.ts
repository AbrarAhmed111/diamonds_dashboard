/** Parse consolidation_summary HTML markdown into plain bullet strings. */
export function parseConsolidationBullets(raw: string): string[] {
  const unwrapped = raw
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

  return lines.length ? lines.map(stripHtml) : [stripHtml(unwrapped)];
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractConsolidationBullets(
  signals: Array<{ id: string; values?: Array<{ value: unknown }> }>,
): string[] {
  const summary = signals.find((s) => s.id === "consolidation_summary");
  const raw = summary?.values?.[0]?.value;
  if (typeof raw !== "string" || !raw.trim()) return [];
  return parseConsolidationBullets(raw);
}
