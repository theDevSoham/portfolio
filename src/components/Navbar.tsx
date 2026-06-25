"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ThemeToggle from "@/components/ThemeToggle";

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
  const pillRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const mobileRef = useRef<HTMLDivElement>(null);

  // Entrance
  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.from(headerRef.current, { y: -24, opacity: 0, duration: 0.6, ease: "power3.out" });
    },
    { scope: headerRef }
  );

  // Sliding active pill behind the current link
  useGSAP(
    () => {
      const pill = pillRef.current;
      if (!pill) return;
      const active = linkRefs.current[pathname];
      if (!active) {
        gsap.to(pill, { opacity: 0, duration: 0.2 });
        return;
      }
      const vars = { x: active.offsetLeft, width: active.offsetWidth, opacity: 1 };
      if (prefersReduced()) gsap.set(pill, vars);
      else gsap.to(pill, { ...vars, duration: 0.4, ease: "power3.out" });
    },
    { dependencies: [pathname] }
  );

  // Mobile menu
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
          y: -10,
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
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(94%,52rem)]"
    >
      <div className="glass flex items-center justify-between gap-2 rounded-2xl px-4 py-2.5 shadow-xl">
        <Link href="/" className="font-display text-lg font-bold tracking-tight px-2">
          <span className="text-gradient">Soham</span>
          <span className="text-muted-foreground">.dev</span>
        </Link>

        {/* Desktop links */}
        <nav className="relative hidden md:flex items-center">
          <span
            ref={pillRef}
            className="pointer-events-none absolute left-0 top-0 h-full w-0 rounded-xl bg-primary/15 opacity-0"
          />
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[link.href] = el;
                }}
                className={`relative z-10 px-4 py-2 text-sm rounded-xl transition-colors ${
                  isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div ref={mobileRef} className="md:hidden h-0 opacity-0 overflow-hidden">
        <nav className="glass mt-2 rounded-2xl p-3 flex flex-col">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "text-foreground font-semibold bg-primary/15"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
