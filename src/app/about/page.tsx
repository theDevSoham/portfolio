"use client";

import { motion } from "framer-motion";
import { User, Code, Globe, Star } from "lucide-react";

const skills = [
  { name: "Web Development", icon: <Code className="w-6 h-6 text-indigo-400" /> },
  { name: "Full Stack Apps", icon: <Globe className="w-6 h-6 text-green-400" /> },
  { name: "UI/UX Design", icon: <Star className="w-6 h-6 text-yellow-400" /> },
];

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 14 } },
  };

  return (
    <section className="min-h-screen bg-transparent text-white py-20 px-6">
      {/* Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <User className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold">
          About <span className="text-indigo-400">Me</span>
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          I’m Soham, a Full Stack Developer passionate about building beautiful, modern web
          applications with interactive UI, seamless performance, and scalable architecture.
        </p>
      </motion.div>

      {/* Image + Bio */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto mb-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.img
          src="/placeholder-profile.png"
          alt="Soham Das"
          className="w-64 h-64 object-cover rounded-2xl shadow-2xl"
          variants={itemVariants}
        />
        <motion.div className="flex-1" variants={itemVariants}>
          <p className="mb-4 text-slate-300">
            I specialize in developing modern web applications using technologies like Next.js,
            React, Node.js, and Tailwind CSS. I love creating interactive interfaces, optimizing
            performance, and ensuring great user experiences.
          </p>
          <p className="text-slate-400">
            My work spans projects from sleek personal portfolios to complex SaaS dashboards and
            AI-powered tools. I enjoy collaborating, learning new technologies, and building
            things that solve real-world problems.
          </p>
        </motion.div>
      </motion.div>

      {/* Skills */}
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">
          My <span className="text-indigo-400">Skills</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center p-6 bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-lg border border-slate-700 hover:shadow-indigo-500/20 transition"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-4">{skill.icon}</div>
              <h3 className="text-xl font-semibold">{skill.name}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
