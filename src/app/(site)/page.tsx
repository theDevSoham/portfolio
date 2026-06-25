import Hero from "@/components/home/Hero";
import { StatsBento } from "@/components/home/StatsBento";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Marquee } from "@/components/visual/Marquee";
import { getAbout } from "@/lib/data/about";
import { getProjects } from "@/lib/data/projects";

export const revalidate = 60;

const FALLBACK_STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "React Native",
  "Tailwind",
  "Prisma",
  "MongoDB",
  "GSAP",
];

export default async function Home() {
  const [about, projects] = await Promise.all([getAbout(), getProjects()]);

  const stack =
    about && about.skills.length > 0
      ? about.skills.map((s) => s.name)
      : FALLBACK_STACK;

  return (
    <>
      <Hero name={about?.name ?? "Soham Das"} avatarUrl={about?.avatarUrl} />

      <div className="border-y border-border bg-card/30 py-5">
        <Marquee items={stack} />
      </div>

      <StatsBento about={about} projectsCount={projects.length} />
      <FeaturedProjects projects={projects.slice(0, 3)} />
      <ContactCTA />
    </>
  );
}
