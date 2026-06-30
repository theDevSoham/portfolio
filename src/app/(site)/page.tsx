import Hero from "@/components/home/Hero";
import { StatsBento } from "@/components/home/StatsBento";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Marquee } from "@/components/visual/Marquee";
import { getAbout } from "@/lib/data/about";
import { getProjects, type ProjectListItem } from "@/lib/data/projects";
import { getHome } from "@/lib/data/home";
import { HOME_DEFAULTS } from "@/lib/homeDefaults";

export const revalidate = 60;

export default async function Home() {
  const [about, projects, home] = await Promise.all([
    getAbout(),
    getProjects(),
    getHome(),
  ]);

  // Marquee: admin items → About skills → fallback list.
  const stack = home?.marqueeItems?.length
    ? home.marqueeItems
    : about && about.skills.length > 0
    ? about.skills.map((s) => s.name)
    : [...HOME_DEFAULTS.marqueeFallback];

  // Featured: projects flagged featured (by manual order) → else newest 3.
  const flagged = projects.filter((p) => p.featured);
  const featured: ProjectListItem[] = flagged.length
    ? [...flagged].sort((a, b) => a.featuredOrder - b.featuredOrder)
    : projects.slice(0, 3);

  const heroImage = home?.heroImage ?? about?.avatarUrl ?? null;
  const statsImage = home?.statsImage ?? about?.avatarUrl ?? null;

  return (
    <>
      <Hero
        name={about?.name ?? "Soham Das"}
        image={heroImage}
        badge={home?.heroBadge}
        headline={home?.heroHeadline}
        highlight={home?.heroHighlight}
        tagline={home?.heroTagline}
        roles={home?.heroRoles}
      />

      <div className="border-y border-border bg-card/30 py-5">
        <Marquee items={stack} />
      </div>

      <StatsBento
        about={about}
        projectsCount={projects.length}
        home={home}
        statsImage={statsImage}
      />
      <FeaturedProjects projects={featured} />
      <ContactCTA home={home} />
    </>
  );
}
