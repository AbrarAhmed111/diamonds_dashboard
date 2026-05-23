import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface Props {
  title: string;
  description: string;
  bullets?: string[];
}

export default function ComingSoon({ title, description, bullets = [] }: Props) {
  return (
    <Card className="p-8 md:p-10">
      <Badge tone="info" size="md" icon={<Sparkles className="h-3 w-3" />}>
        Coming soon
      </Badge>
      <h2 className="mt-4 text-h3 font-medium text-ink">{title}</h2>
      <p className="mt-2 max-w-xl text-body text-ink/80">{description}</p>
      {bullets.length ? (
        <ul className="mt-5 space-y-2 max-w-2xl">
          {bullets.map((line, i) => (
            <li key={i} className="flex gap-3 text-small text-ink/85">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-400" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-6">
        <Link href="/" className="inline-flex">
          <Button variant="primary" size="sm">
            Back to Sentiment
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
