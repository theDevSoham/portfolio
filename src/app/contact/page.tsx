"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Download, Phone, MapPin } from "lucide-react";
import { Contact, SocialLink } from "@/lib/contact";
import { useForm, ValidationError } from "@formspree/react";
import Image from "next/image";

const socialSvgs = {
  Linkedin: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      {" "}
      <path d="M4.98 3.5C3.33 3.5 2 4.83 2 6.48c0 1.65 1.33 2.98 2.98 2.98 1.64 0 2.97-1.33 2.97-2.98A2.98 2.98 0 0 0 4.98 3.5ZM2.4 21h5.16V9.16H2.4V21Zm7.66-11.84V21h5.16v-6.47c0-3.45 4.5-3.73 4.5 0V21h5.16v-7.95c0-6.14-6.73-5.92-8.66-2.9V9.16H10.06Z" />{" "}
    </svg>
  ),
  Github: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      {" "}
      <path d="M12 .5C5.7.5.6 5.6.6 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.5v-1.7c-3.2.7-3.9-1.6-3.9-1.6-.5-1.2-1.1-1.6-1.1-1.6-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.6.4-1.1.7-1.3-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.3.7.9.7 1.8v2.6c0 .3.2.6.8.5a11.5 11.5 0 0 0 7.8-10.9C23.4 5.6 18.3.5 12 .5Z" />{" "}
    </svg>
  ),
};

export default function ContactPage() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [state, handleSubmit] = useForm("YOUR_FORM_ID");

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/contact");
        const data: Contact = await res.json();
        setContact(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContact();
  }, []);

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

  if (!contact)
    return <p className="text-white text-center mt-20">Loading...</p>;

  if (state.succeeded) {
    return alert("Thank you for contacting me. I'll reach out shortly");
  }

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
          onSubmit={handleSubmit}
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
          <ValidationError errors={state.errors} />
          {contact.resumeUrl && (
            <a
              href={contact.resumeUrl}
              download
              className="flex items-center justify-center gap-2 px-6 py-3 border border-indigo-400 rounded-xl font-medium hover:bg-indigo-600 hover:text-white transition"
            >
              Download Resume <Download size={18} />
            </a>
          )}
        </motion.form>

        {/* Decorative Image */}
        <motion.div
          className="flex-1"
          variants={itemVariants}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {contact.mediaUrl?.endsWith(".mp4") ? (
            <video
              src={contact.mediaUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          ) : (
            <Image
              src={contact.mediaUrl as string}
              alt="Decorative media"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
              width={500}
              height={500}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.a
          className="flex flex-col items-center gap-2 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700"
          variants={itemVariants}
          href={`tel:${contact.phone}`}
        >
          <Phone className="w-6 h-6 text-indigo-400" />
          <p>{contact.phone}</p>
        </motion.a>
        <motion.a
          className="flex flex-col items-center gap-2 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700"
          variants={itemVariants}
          href={`mailto:${contact.email}`}
        >
          <Mail className="w-6 h-6 text-indigo-400" />
          <p>{contact.email}</p>
        </motion.a>
        <motion.address
          className="flex flex-col items-center gap-2 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700 cursor-pointer"
          variants={itemVariants}
        >
          <MapPin className="w-6 h-6 text-indigo-400" />
          <p>{contact.location}</p>
        </motion.address>

        {/* Social Links */}
        <motion.div
          className="flex flex-col items-center gap-3 p-6 bg-slate-800/70 rounded-2xl shadow-md border border-slate-700"
          variants={itemVariants}
        >
          <p className="font-semibold text-indigo-400">Find me online</p>
          <div className="flex gap-4">
            {contact.socials.map((s: SocialLink) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-400 transition"
              >
                {socialSvgs[s.platform as keyof typeof socialSvgs]}
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
