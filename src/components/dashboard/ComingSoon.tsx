import { Sparkles } from "lucide-react";

interface Props {
  title: string;
  description: string;
  bullets?: string[];
}

export default function ComingSoon({ title, description, bullets = [] }: Props) {
  return (
    <section className="surface-card p-6 md:p-8">
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <Sparkles className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-h4 font-medium text-ink">{title}</h2>
          <p className="mt-2 max-w-2xl text-small leading-6 text-ink-muted">{description}</p>
        </div>
      </div>

      {bullets.length ? (
        <ul className="mt-6 max-w-2xl space-y-2.5">
          {bullets.map((line) => (
            <li key={line} className="flex gap-3 text-small text-ink/85">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-chart" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
