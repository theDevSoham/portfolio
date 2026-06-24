import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FolderGit2 } from "lucide-react";
import { iconMap } from "@/lib/iconMap";
import { getProjects } from "@/lib/data/projects";
import Reveal from "@/components/anim/Reveal";

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
    <section className="min-h-screen bg-transparent py-20 px-6 text-white">
      {/* Heading */}
      <Reveal className="text-center mb-16">
        <FolderGit2 className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold">
          My <span className="text-indigo-400">Projects</span>
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          A curated selection of my work — blending clean design, modern
          technologies, and seamless user experiences.
        </p>
      </Reveal>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <FolderGit2 className="w-10 h-10 text-slate-500 mb-4" />
          <p className="text-lg">No projects found. 🚀</p>
          <p className="text-sm text-slate-500">
            Add a new project to showcase your work.
          </p>
        </div>
      ) : (
        <Reveal
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          stagger={0.12}
        >
          {projects.map((project) => {
            const Icon = iconMap[project.icon as keyof typeof iconMap] || FolderGit2;
            const cover = project.images[0]?.url;

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl shadow-lg border border-slate-700 bg-slate-800/70 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-indigo-500/20"
              >
                <div className="relative w-full h-64 md:h-48 lg:h-56 bg-slate-700">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover rounded-t-2xl"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FolderGit2 className="w-10 h-10 text-slate-500" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-indigo-400" />
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                  </div>
                  <p className="text-slate-300">
                    {truncateWords(project.description, 20)}
                  </p>
                </div>
              </Link>
            );
          })}
        </Reveal>
      )}
    </section>
  );
}
