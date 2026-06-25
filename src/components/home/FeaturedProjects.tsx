import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderGit2 } from "lucide-react";
import type { ProjectListItem } from "@/lib/data/projects";
import { iconMap } from "@/lib/iconMap";
import Reveal from "@/components/anim/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";

export function FeaturedProjects({ projects }: { projects: ProjectListItem[] }) {
  if (projects.length === 0) return null;

  return (
    <Container className="py-24">
      <Reveal className="flex items-end justify-between gap-4 flex-wrap">
        <SectionHeading
          className="mb-0"
          eyebrow="work"
          title={
            <>
              Featured <span className="text-gradient">Projects</span>
            </>
          }
        />
        <Link href="/projects" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          All projects <ArrowUpRight size={16} />
        </Link>
      </Reveal>

      <Reveal className="grid md:grid-cols-2 gap-6 mt-10" stagger={0.12}>
        {projects.map((project, i) => {
          const Icon = iconMap[project.icon as keyof typeof iconMap] || FolderGit2;
          const cover = project.images[0]?.url;
          const featured = i === 0;

          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className={`group ring-gradient rounded-2xl ${featured ? "md:col-span-2" : ""}`}
            >
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-md h-full transition-transform duration-300 group-hover:-translate-y-1">
                <div className={`relative w-full ${featured ? "h-72 md:h-80" : "h-52"} bg-muted`}>
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
                      <FolderGit2 className="h-10 w-10 text-muted-foreground" />
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
                  {project.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </Reveal>
    </Container>
  );
}
