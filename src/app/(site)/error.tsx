"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw, Home } from "lucide-react";
import Button, { buttonVariants } from "@/components/ui/Button";

export default function Error({
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
    <main className="grid min-h-[80vh] place-items-center px-6">
      <div className="w-full max-w-lg text-center">
        <p className="eyebrow text-sm">{"// runtime error"}</p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Something <span className="text-gradient">broke</span>.
        </h1>
        <p className="mt-4 text-muted-foreground">
          An unexpected error occurred. You can retry, or head back home.
        </p>
        {error?.digest && (
          <p className="mt-3 font-mono text-xs text-muted-foreground">ref: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button onClick={reset} variant="gradient">
            <RotateCcw size={18} /> Try again
          </Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            <Home size={18} /> Home
          </Link>
        </div>
      </div>
    </main>
  );
}
