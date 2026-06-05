export const MONTH_LABELS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

export function parseDateParts(timestamp: string) {
  const [ys, ms, ds] = timestamp.slice(0, 10).split("-");
  return { year: Number(ys), month: Number(ms) - 1, day: Number(ds) };
}

export function formatMonthAxisTick(value: string | number): string {
  const { month } = parseDateParts(String(value));
  return MONTH_LABELS[month] ?? "";
}
