"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ExternalLink,
  Tag,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Project } from "@/lib/project";
import { useRouter } from "next/navigation";

export default function ProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${slug}`);
        const data = await res.json();
        console.log(data);
        setProject(data);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    if (slug) fetchProject();
  }, [slug]);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading project...
      </div>
    );
  }

  const handlePrev = () => {
    setCurrentImage((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImage((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="min-h-screen bg-transparent text-white py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl mx-auto"
      >
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-indigo-400 mb-6 hover:text-indigo-300 transition"
        >
          <ChevronLeft className="w-5 h-5" /> Go to Projects
        </button>
        {/* Hero */}
        <div className="relative mb-12">
          {project.images.length > 0 && (
            <motion.img
              key={project.images[currentImage].id}
              src={project.images[currentImage].url}
              alt={project.images[currentImage].alt || project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full h-72 md:h-96 object-contain rounded-2xl shadow-2xl"
            />
          )}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-4 left-6 text-3xl md:text-5xl font-bold text-indigo-400 drop-shadow-lg"
          >
            {project.title}
          </motion.h1>

          {/* Carousel Controls */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60 transition"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-2 rounded-full hover:bg-black/60 transition"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {project.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto mb-8 pb-2">
            {project.images.map((img, idx) => (
              <motion.img
                key={img.id}
                src={img.url}
                alt={img.alt || `${project.title} image ${idx + 1}`}
                onClick={() => setCurrentImage(idx)}
                whileHover={{ scale: 1.05 }}
                className={`w-24 h-20 object-contain rounded-lg cursor-pointer border-2 transition ${
                  idx === currentImage
                    ? "border-indigo-400"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>
        )}

        {/* Meta info */}
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

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="linkify text-lg leading-relaxed text-slate-300 mb-10 whitespace-pre-line "
          dangerouslySetInnerHTML={{ __html: project.description }}
        />

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full text-sm text-indigo-300"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
