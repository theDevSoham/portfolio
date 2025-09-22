"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderGit2 } from "lucide-react";
import { iconMap } from "@/lib/iconMap"; // 👈 create a mapping of icon names to Lucide icons
import { Project } from "@/lib/project";
import Image from "next/image";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.25, delayChildren: 0.3 },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 40 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { type: "spring" as const, stiffness: 120, damping: 14 },
//   },
// };

function truncateWords(text: string, wordLimit: number): string {
  if (!text) return "";
  const words = text.split(/\s+/); // split by any whitespace
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "…";
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="min-h-screen bg-transparent py-20 px-6 text-white">
      {/* Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <FolderGit2 className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold">
          My <span className="text-indigo-400">Projects</span>
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          A curated selection of my work — blending clean design, modern
          technologies, and seamless user experiences.
        </p>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-slate-400 text-lg">
          Loading projects...
        </div>
      )}

      {/* Empty State */}
      {!loading && projects.length === 0 && (
        <motion.div
          className="flex flex-col items-center justify-center py-20 text-slate-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <FolderGit2 className="w-10 h-10 text-slate-500 mb-4" />
          <p className="text-lg">No projects found. 🚀</p>
          <p className="text-sm text-slate-500">
            Add a new project to showcase your work.
          </p>
        </motion.div>
      )}

      {/* Project List */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => {
            const Icon = iconMap[project.icon] || FolderGit2;

            return (
              <motion.div
                key={project.id}
                className="flex flex-col overflow-hidden rounded-2xl shadow-lg border border-slate-700 bg-slate-800/70 backdrop-blur-md
            hover:shadow-indigo-500/20 cursor-pointer relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 14,
                  delay: index * 0.15, // stagger by index
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: -1,
                  transition: { type: "spring", stiffness: 200, damping: 15 },
                }}
                whileTap={{ scale: 0.98, transition: { duration: 0.2 } }}
              >
                <a
                  href={`/projects/${project.slug}`}
                  className="absolute w-full h-full top-0 left-0 z-10"
                />
                <div className="relative w-full h-64 md:h-48 lg:h-56">
                  <Image
                    src={project.images[0].url as string}
                    alt={project.title}
                    fill
                    className="object-cover rounded-t-2xl"
                  />
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
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
