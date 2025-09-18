"use client";

import { motion } from "framer-motion";
import { Mail, Download, Phone, MapPin, Star } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
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
        <Mail className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold">
          Contact <span className="text-indigo-400">Me</span>
        </h1>
        <p className="mt-4 text-slate-300 max-w-2xl mx-auto">
          Have a project in mind or want to collaborate? Get in touch or
          download my resume.
        </p>
      </motion.div>

      {/* Contact Form + Image */}
      <motion.div
        className="flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto mb-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Contact Form */}
        <motion.form
          className="flex-1 flex flex-col gap-6 bg-slate-800/70 backdrop-blur-md rounded-2xl p-4 lg:p-8 shadow-lg border border-slate-700"
          variants={itemVariants}
        >
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <textarea
            placeholder="Your Message"
            rows={5}
            className="p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            Send Message <Mail size={18} />
          </button>
          <a
            href="/SohamDas_Resume.pdf"
            download
            className="flex items-center justify-center gap-2 px-6 py-3 border border-indigo-400 rounded-xl font-medium hover:bg-indigo-600 hover:text-white transition"
          >
            Download Resume <Download size={18} />
          </a>
        </motion.form>
        {/* Decorative Image */}
        <motion.div
          className="flex-1"
          variants={itemVariants}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <video
            src="/contact.mp4" // path to your video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
          />
        </motion.div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col items-center gap-2 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700"
          variants={itemVariants}
        >
          <Phone className="w-6 h-6 text-indigo-400" />
          <p>+91 123 456 7890</p>
        </motion.div>
        <motion.div
          className="flex flex-col items-center gap-2 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700"
          variants={itemVariants}
        >
          <Mail className="w-6 h-6 text-indigo-400" />
          <p>soham@example.com</p>
        </motion.div>
        <motion.div
          className="flex flex-col items-center gap-2 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700"
          variants={itemVariants}
        >
          <MapPin className="w-6 h-6 text-indigo-400" />
          <p>Jaipur, India</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
