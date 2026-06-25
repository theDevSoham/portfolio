import { cn } from "@/lib/utils";

/** Infinite horizontal marquee. Duplicates items so the loop is seamless. */
export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div
      className={cn("relative flex overflow-hidden select-none", className)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="flex shrink-0 items-center gap-8 pr-8 animate-marquee">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-mono text-sm uppercase tracking-widest text-muted-foreground"
          >
            {item}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
