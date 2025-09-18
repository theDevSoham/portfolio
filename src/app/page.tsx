"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden">
      {/* Blobs Behind Everything */}
      <motion.div
        className="absolute -z-20 top-32 w-[500px] h-[500px] rounded-full bg-indigo-400 opacity-30 blur-3xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
      />

      <motion.div
        className="absolute -z-20 top-60 left-40 w-[600px] h-[600px] rounded-full bg-purple-500 opacity-20 blur-3xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8 }}
      />

      {/* Floating Image */}
      <motion.img
        src="/hero.png"
        alt="Hero"
        className="relative z-10 w-64 h-64 object-cover rounded-xl shadow-2xl mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1, // stays at 1 after fade-in
          y: [0, -15, 0], // floating loop
        }}
        transition={{
          opacity: { duration: 1.2, ease: "easeOut" }, // fade-in once
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }, // loop only y
        }}
      />

      {/* Hero Section (on top of blobs, just below image) */}
      <motion.h1
        className="text-4xl md:text-6xl font-extrabold text-white mb-4 relative z-20"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Hi, I’m <span className="text-indigo-400">Soham</span>
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8 relative z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        A Full Stack Developer passionate about building modern web apps,
        interactive UI, and solving real-world problems with clean code.
      </motion.p>

      {/* Call-to-action buttons */}
      <motion.div
        className="flex flex-col md:flex-row gap-4 relative z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Link
          href="/projects"
          className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition flex items-center gap-2"
        >
          View Projects <ArrowRight size={18} />
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 rounded-2xl border border-white/20 text-white hover:text-black font-medium hover:bg-white transition"
        >
          Contact Me
        </Link>
      </motion.div>
    </main>
  );
}
