import { User } from "lucide-react";
import type { AboutData } from "@/lib/data/about";
import Reveal from "@/components/anim/Reveal";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Section";

function Stat({ value, label }: { value: string; label: string }) {
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
}: {
  about: AboutData | null;
  projectsCount: number;
}) {
  const bio =
    about?.bio ||
    "Full-stack developer with a love for clean architecture, expressive interfaces, and shipping things that feel good to use.";

  return (
    <Container className="py-24">
      <Reveal>
        <SectionHeading
          eyebrow="profile"
          title={
            <>
              Who <span className="text-gradient">I am</span>
            </>
          }
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
          {about?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={about.avatarUrl}
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
        <Stat value={`${projectsCount}`} label="projects shipped" />
        <Stat value={`${about?.skills.length ?? 0}`} label="technologies" />
        <Stat value={`${about?.experiences.length ?? 0}`} label="roles held" />
        <Stat value="∞" label="cups of coffee" />
      </Reveal>
    </Container>
  );
}
