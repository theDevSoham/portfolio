"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const headerRef = useRef<HTMLElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const mobileRef = useRef<HTMLDivElement>(null);

  // Entrance (once on mount)
  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.from(".nav-intro", {
        opacity: 0,
        y: -12,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
      });
    },
    { scope: headerRef }
  );

  // Active underline — slides to the active link (replaces Framer layoutId)
  useGSAP(
    () => {
      const underline = underlineRef.current;
      if (!underline) return;
      const active = linkRefs.current[pathname];
      if (!active) {
        gsap.set(underline, { opacity: 0 });
        return;
      }
      const vars = { x: active.offsetLeft, width: active.offsetWidth, opacity: 1 };
      if (prefersReduced()) gsap.set(underline, vars);
      else gsap.to(underline, { ...vars, duration: 0.35, ease: "power2.out" });
    },
    { dependencies: [pathname] }
  );

  // Mobile menu open/close (replaces AnimatePresence height collapse)
  useGSAP(
    () => {
      const el = mobileRef.current;
      if (!el) return;
      if (prefersReduced()) {
        gsap.set(el, { height: open ? "auto" : 0, opacity: open ? 1 : 0 });
        return;
      }
      if (open) {
        gsap.set(el, { height: "auto", opacity: 1 });
        gsap.from(el, { height: 0, opacity: 0, duration: 0.3, ease: "power2.out" });
        gsap.from(el.querySelectorAll("a"), {
          x: -20,
          opacity: 0,
          duration: 0.3,
          stagger: 0.07,
          ease: "power2.out",
        });
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: "power2.in" });
      }
    },
    { dependencies: [open] }
  );

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-white/10 backdrop-blur-lg shadow-md"
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="nav-intro text-xl font-bold text-indigo-400">
          Soham.dev
        </Link>

        {/* Desktop nav */}
        <nav className="relative hidden md:flex space-x-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[link.href] = el;
                }}
                className={`nav-intro relative text-slate-300 hover:text-indigo-400 transition-colors ${
                  isActive ? "text-indigo-500 font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <span
            ref={underlineRef}
            className="pointer-events-none absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-500 rounded-full opacity-0"
          />
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded hover:bg-white/10"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav (always mounted; GSAP animates height) */}
      <div
        ref={mobileRef}
        className="md:hidden h-0 opacity-0 overflow-hidden bg-slate-900/95 border-t border-white/10"
      >
        <nav className="px-6 py-4 space-y-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block transition-colors ${
                  isActive
                    ? "text-indigo-400 font-semibold"
                    : "text-slate-300 hover:text-indigo-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
