import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FolderGit2, ArrowUpRight } from "lucide-react";
import { iconMap } from "@/lib/iconMap";
import { getProjects } from "@/lib/data/projects";
import Reveal from "@/components/anim/Reveal";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Projects | Soham Das",
  description: "A curated selection of projects by Soham Das.",
};

export const revalidate = 60;

function truncateWords(text: string, wordLimit: number): string {
  if (!text) return "";
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "…";
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <section className="mx-auto max-w-6xl px-6 pt-32 pb-24">
      <Reveal>
        <SectionHeading
          eyebrow="work"
          title={
            <>
              Selected <span className="text-gradient">Projects</span>
            </>
          }
        />
        <p className="-mt-4 mb-12 text-muted-foreground max-w-2xl">
          A curated selection of my work — blending clean design, modern
          technologies, and seamless user experiences.
        </p>
      </Reveal>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <FolderGit2 className="w-10 h-10 mb-4 opacity-60" />
          <p className="text-lg">No projects found. 🚀</p>
          <p className="text-sm opacity-70">Add a new project to showcase your work.</p>
        </div>
      ) : (
        <Reveal className="grid md:grid-cols-2 gap-6" stagger={0.12}>
          {projects.map((project, i) => {
            const Icon = iconMap[project.icon as keyof typeof iconMap] || FolderGit2;
            const cover = project.images[0]?.url;

            return (
              <Link key={project.id} href={`/projects/${project.slug}`} className="group ring-gradient rounded-2xl">
                <article className="relative h-full overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="relative w-full h-56 bg-muted">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FolderGit2 className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 font-mono text-xs text-muted-foreground bg-background/60 backdrop-blur px-2 py-1 rounded-md">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-accent" />
                      <h3 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight
                        size={18}
                        className="ml-auto text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {truncateWords(project.description, 22)}
                    </p>
                    {project.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </Reveal>
      )}
    </section>
  );
}
