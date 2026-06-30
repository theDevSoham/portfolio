import type { ReactNode } from "react";
import { User } from "lucide-react";
import type { AboutData } from "@/lib/data/about";
import type { HomeData } from "@/lib/data/home";
import Reveal from "@/components/anim/Reveal";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Section";
import { CountUp } from "@/components/ui/CountUp";
import { Highlight } from "@/components/ui/Highlight";
import { HOME_DEFAULTS } from "@/lib/homeDefaults";

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <Card className="p-6 flex flex-col justify-center gap-1">
      <span className="stat-number text-4xl">{value}</span>
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </Card>
  );
}

export function StatsBento({
  about,
  projectsCount,
  home,
  statsImage,
}: {
  about: AboutData | null;
  projectsCount: number;
  home?: HomeData | null;
  statsImage?: string | null;
}) {
  const bio =
    about?.bio ||
    "Full-stack developer with a love for clean architecture, expressive interfaces, and shipping things that feel good to use.";

  const eyebrow = home?.statsEyebrow || HOME_DEFAULTS.statsEyebrow;
  const title = home?.statsTitle || HOME_DEFAULTS.statsTitle;
  const highlight = home?.statsHighlight || (home?.statsTitle ? "" : HOME_DEFAULTS.statsHighlight);
  const funValue = home?.funStatValue || HOME_DEFAULTS.funStatValue;
  const funLabel = home?.funStatLabel || HOME_DEFAULTS.funStatLabel;

  return (
    <Container className="py-24">
      <Reveal>
        <SectionHeading
          eyebrow={eyebrow}
          title={<Highlight text={title} phrase={highlight} />}
        />
      </Reveal>

      <Reveal className="grid md:grid-cols-3 gap-4" stagger={0.1}>
        {/* Bio */}
        <Card className="md:col-span-2 p-8 flex flex-col justify-center">
          <p className="text-lg leading-relaxed text-foreground/90">{bio}</p>
          <p className="mt-6 font-mono text-sm text-accent">
            — {about?.name || "Soham Das"}, {about?.headline || "Full-Stack Developer"}
          </p>
        </Card>

        {/* Avatar */}
        <Card className="overflow-hidden p-0 min-h-[220px] relative">
          {statsImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={statsImage}
              alt={about?.name || "Avatar"}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <User className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </Card>
      </Reveal>

      <Reveal className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4" stagger={0.08}>
        <Stat value={<CountUp value={projectsCount} />} label="projects shipped" />
        <Stat value={<CountUp value={about?.skills.length ?? 0} />} label="technologies" />
        <Stat value={<CountUp value={about?.experiences.length ?? 0} />} label="roles held" />
        <Stat value={funValue} label={funLabel} />
      </Reveal>
    </Container>
  );
}
