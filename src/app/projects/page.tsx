"use client";

import { motion } from "framer-motion";
import { FolderGit2, Star, Rocket, Code, Globe } from "lucide-react";

const projects = [
  {
    title: "AI Writing Assistant",
    description:
      "An AI-powered text editor that helps users write, summarize, and generate creative content in real-time.",
    icon: <Rocket className="w-6 h-6 text-indigo-400" />,
  },
  {
    title: "Next.js SaaS Dashboard",
    description:
      "A modern dashboard with charts, authentication, and billing built using Next.js and Tailwind.",
    icon: <Globe className="w-6 h-6 text-green-400" />,
  },
  {
    title: "Open Source CLI Tool",
    description:
      "A command-line utility for developers to scaffold projects quickly with best practices.",
    icon: <Code className="w-6 h-6 text-orange-400" />,
  },
  {
    title: "Portfolio Website",
    description:
      "A sleek and animated personal portfolio showcasing projects, blogs, and design work.",
    icon: <Star className="w-6 h-6 text-yellow-400" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14 },
  },
};

export default function ProjectsPage() {
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

      {/* Project List */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.2 }}
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            className="p-6 bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-lg 
             border border-slate-700 hover:shadow-indigo-500/20 cursor-pointer"
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              rotate: -1,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 15, // smooth spring
              },
            }}
            whileTap={{
              scale: 0.98,
              transition: { duration: 0.2 },
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {project.icon}
              <h3 className="text-xl font-semibold">{project.title}</h3>
            </div>
            <p className="text-slate-300">{project.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
