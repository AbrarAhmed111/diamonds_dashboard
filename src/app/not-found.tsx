import Link from "next/link";
import { Compass } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Not found · Diamond Pigs",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-400 px-6">
      <div className="surface-card max-w-md p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
          <Compass className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-h3 font-medium text-ink">Page not found</h1>
        <p className="mt-2 text-small text-ink-muted">
          The page you are looking for has moved or never existed.
        </p>
        <div className="mt-6">
          <Link href="/" className="inline-flex">
            <Button variant="primary" size="sm">Back to dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
