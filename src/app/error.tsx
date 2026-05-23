"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-400 px-6">
      <div className="surface-card max-w-md p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-negative-50 text-negative-700">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <h1 className="mt-4 text-h3 font-medium text-ink">Something went wrong</h1>
        <p className="mt-2 text-small text-ink-muted">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset} variant="primary" size="sm">
            Try again
          </Button>
          <Link href="/" className="inline-flex">
            <Button variant="secondary" size="sm">Go home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
