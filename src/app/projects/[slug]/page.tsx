import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Tag, Calendar, ChevronLeft } from "lucide-react";
import { getProjectBySlug, getProjectSlugs } from "@/lib/data/projects";
import ProjectGallery from "@/components/projects/ProjectGallery";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await getProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // DB unavailable at build → render detail pages on demand (ISR) instead.
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found | Soham Das" };
  return {
    title: `${project.title} | Soham Das`,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <section className="min-h-screen bg-transparent text-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link
          href="/projects"
          className="flex items-center gap-2 text-indigo-400 mb-6 hover:text-indigo-300 transition w-fit"
        >
          <ChevronLeft className="w-5 h-5" /> Go to Projects
        </Link>

        {/* Gallery (client island) */}
        <ProjectGallery images={project.images} title={project.title} />

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(project.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .5C5.7.5.6 5.6.6 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.5v-1.7c-3.2.7-3.9-1.6-3.9-1.6-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.6.4-1.1.7-1.3-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.3.7.9.7 1.8v2.6c0 .3.2.6.8.5a11.5 11.5 0 0 0 7.8-10.9C23.4 5.6 18.3.5 12 .5Z" />
              </svg>
              Repo
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Live
            </a>
          )}
        </div>

        {/* Description — rendered as text (no raw HTML) to avoid XSS */}
        <p className="text-lg leading-relaxed text-slate-300 mb-10 whitespace-pre-line">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full text-sm text-indigo-300"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
