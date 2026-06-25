import { cn } from "@/lib/utils";

/** Frosted surface card. Pass `interactive` for hover lift on links/cards. */
export function Card({
  className,
  interactive,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-lg",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-primary/20",
        className
      )}
      {...props}
    />
  );
}
