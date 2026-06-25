import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Section heading with a mono eyebrow ("// about") and optional icon. */
export function SectionHeading({
  eyebrow,
  title,
  icon,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8", className)}>
      {eyebrow && <p className="eyebrow text-sm mb-2">{`// ${eyebrow}`}</p>}
      <h2 className="font-display text-3xl font-bold flex items-center gap-3">
        {icon}
        {title}
      </h2>
    </div>
  );
}
