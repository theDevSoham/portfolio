"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderGit2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-6 bg-grid">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[40vw] w-[40vw] -translate-x-1/2 rounded-full opacity-30 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
      />

      <div className="relative w-full max-w-lg text-center">
        <p className="eyebrow text-sm">{"// error"}</p>
        <h1 className="glitch-text font-display text-8xl font-extrabold tracking-tight md:text-9xl">
          404
        </h1>

        <div className="mt-8 rounded-xl border border-border bg-card/60 p-4 text-left font-mono text-sm backdrop-blur-md">
          <p>
            <span className="text-red-400">Error</span>: page not found
          </p>
          <p className="text-muted-foreground">
            {"  at "}
            <span className="text-accent">{pathname || "/unknown"}</span>
          </p>
          <p className="text-muted-foreground">
            {"  this route doesn't exist or has moved."}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className={buttonVariants({ variant: "gradient" })}>
            <Home size={18} /> Back home
          </Link>
          <Link href="/projects" className={buttonVariants({ variant: "outline" })}>
            <FolderGit2 size={18} /> View projects
          </Link>
        </div>
      </div>
    </main>
  );
}
