"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50
             border-b border-white/10
             bg-white/10 backdrop-blur-lg
             shadow-md"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo / Brand */}
        <motion.a
          href="/"
          className="text-xl font-bold text-indigo-400"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Soham.dev
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-slate-300 hover:text-indigo-600 transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded hover:bg-slate-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t px-6 py-4 space-y-3"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="block text-slate-700 hover:text-indigo-600 transition-colors"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
