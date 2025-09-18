"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, GraduationCap, Code, Trophy } from "lucide-react";
import type { About } from "@/lib/about"; // types from step 1

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 14 },
  },
};

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => setAbout(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white">
        <p className="text-slate-400 animate-pulse">Loading about info...</p>
      </section>
    );
  }

  if (!about) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white">
        <p className="text-slate-400">
          No about info found. Add details in admin.
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-transparent text-white py-20 px-6">
      {/* Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <User className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold">
          About <span className="text-indigo-400">Me</span>
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          {about.headline}
        </p>
      </motion.div>

      {/* Bio */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto mb-20"
        initial="hidden"
        whileInView="show"
        variants={containerVariants}
      >
        {about.avatarUrl ? (
          <motion.img
            src={about.avatarUrl}
            alt={about.name}
            className="w-64 h-64 object-cover rounded-2xl shadow-2xl"
            variants={itemVariants}
          />
        ) : (
          <div className="w-64 h-64 bg-slate-700 rounded-2xl flex items-center justify-center">
            <User className="w-20 h-20 text-slate-500" />
          </div>
        )}
        <motion.div className="flex-1 space-y-4" variants={itemVariants}>
          <p className="text-slate-300">{about.bio}</p>
        </motion.div>
      </motion.div>

      {/* Education */}
      <motion.div
        className="max-w-6xl mx-auto mb-20"
        initial="hidden"
        whileInView="show"
        variants={containerVariants}
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <GraduationCap className="text-indigo-400" /> Education
        </h2>
        {about.education.length === 0 ? (
          <p className="text-slate-500">No education details yet.</p>
        ) : (
          about.education.map((edu) => (
            <motion.div
              key={edu.id}
              className="p-6 bg-slate-800/70 rounded-2xl border border-slate-700 shadow-lg mb-4"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold">{edu.degree}</h3>
              <p className="text-slate-300">
                {edu.school} ({edu.startYear} - {edu.endYear})
                {edu.grade && (
                  <span className="text-indigo-400"> — {edu.grade}</span>
                )}
              </p>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Experience */}
      <motion.div
        className="max-w-6xl mx-auto mb-20"
        initial="hidden"
        whileInView="show"
        variants={containerVariants}
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Briefcase className="text-indigo-400" /> Experience
        </h2>
        {about.experiences.length === 0 ? (
          <p className="text-slate-500">No experience added.</p>
        ) : (
          about.experiences.map((exp) => (
            <motion.div
              key={exp.id}
              className="p-6 bg-slate-800/70 rounded-2xl border border-slate-700 shadow-lg mb-4"
              variants={itemVariants}
            >
              <h3 className="text-xl font-semibold">
                {exp.role} - {exp.company}
              </h3>
              <p className="text-slate-400">{exp.duration}</p>
              <p className="mt-2 text-slate-300">{exp.desc}</p>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Skills */}
      <motion.div
        className="max-w-6xl mx-auto mb-20"
        initial="hidden"
        whileInView="show"
        variants={containerVariants}
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Code className="text-indigo-400" /> Skills
        </h2>
        {about.skills.length === 0 ? (
          <p className="text-slate-500">No skills added.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {about.skills.map((skill) => (
              <motion.div
                key={skill.id}
                className="p-4 bg-slate-800/70 rounded-xl text-center border border-slate-700 hover:shadow-indigo-500/20"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                {skill.name}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Achievements */}
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="show"
        variants={containerVariants}
      >
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Trophy className="text-indigo-400" /> Achievements
        </h2>
        {about.achievements.length === 0 ? (
          <p className="text-slate-500">No achievements yet.</p>
        ) : (
          <ul className="space-y-4 list-disc list-inside text-slate-300">
            {about.achievements.map((ach) => (
              <motion.li key={ach.id} variants={itemVariants}>
                {ach.text}
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </section>
  );
}
