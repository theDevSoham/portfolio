import type { ReactNode } from "react";

export function Timeline({ children }: { children: ReactNode }) {
  return <div className="relative ml-3 border-l border-border pl-8 space-y-8">{children}</div>;
}

export function TimelineItem({
  title,
  subtitle,
  meta,
  children,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative">
      <span className="absolute -left-[2.6rem] top-1.5 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-background" />
      {meta && (
        <p className="font-mono text-xs uppercase tracking-widest text-accent mb-1">{meta}</p>
      )}
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      {children && <div className="mt-2 text-muted-foreground">{children}</div>}
    </div>
  );
}
