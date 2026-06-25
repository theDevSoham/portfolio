"use client";

import Link from "next/link";
import { ArrowRight, ArrowDown, Code2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { buttonVariants } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { Container } from "@/components/ui/Container";

const ROLES = ["react", "next.js", "node.js", "typescript", "react native"];

export default function Hero({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) {
  const root = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const [role, setRole] = useState(0);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-el", { opacity: 0, y: 24, duration: 0.8, stagger: 0.12, delay: 0.1 })
        .from(".hero-portrait", { opacity: 0, scale: 0.9, duration: 1 }, "-=0.7")
        .from(".hero-float", { opacity: 0, y: 12, scale: 0.8, duration: 0.6, stagger: 0.15 }, "-=0.4");

      // Gentle float on the portrait
      gsap.to(".hero-portrait", {
        y: -14,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      // Mouse-parallax tilt
      const portrait = portraitRef.current;
      if (portrait) {
        const rotX = gsap.quickTo(portrait, "rotationX", { duration: 0.6, ease: "power3" });
        const rotY = gsap.quickTo(portrait, "rotationY", { duration: 0.6, ease: "power3" });
        const onMove = (e: MouseEvent) => {
          const r = root.current!.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          rotY(nx * 12);
          rotX(-ny * 12);
        };
        root.current!.addEventListener("mousemove", onMove);
        return () => root.current?.removeEventListener("mousemove", onMove);
      }
    },
    { scope: root }
  );

  useEffect(() => {
    const i = setInterval(() => setRole((r) => (r + 1) % ROLES.length), 2000);
    return () => clearInterval(i);
  }, []);

  useGSAP(
    () => {
      if (!roleRef.current) return;
      gsap.fromTo(roleRef.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4 });
    },
    { dependencies: [role] }
  );

  return (
    <section ref={root} className="relative min-h-screen flex items-center">
      <Container className="py-32">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
          {/* Text */}
          <div className="max-w-2xl">
            <div className="hero-el">
              <StatusPill label="available for work" />
            </div>

            <h1 className="hero-el font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.95] mt-6">
              Building <span className="text-gradient">modern web</span>
              <br />
              experiences.
            </h1>

            <p className="hero-el mt-6 text-lg text-muted-foreground max-w-xl">
              I&rsquo;m {name || "Soham Das"} — a full-stack developer crafting fast,
              delightful, and scalable products from pixel to deploy.
            </p>

            <div className="hero-el mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-2 font-mono text-sm backdrop-blur-md">
              <span className="text-muted-foreground">~/stack</span>
              <span className="text-border">·</span>
              <span ref={roleRef} className="text-accent">
                {ROLES[role]}
              </span>
              <span className="ml-0.5 inline-block w-2 animate-pulse text-primary">▋</span>
            </div>

            <div className="hero-el mt-9 flex flex-wrap gap-4">
              <Link href="/projects" className={buttonVariants({ variant: "gradient", size: "lg" })}>
                View Projects <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Get in touch
              </Link>
            </div>
          </div>

          {/* Animated portrait */}
          <div className="relative flex justify-center lg:justify-end" style={{ perspective: 1000 }}>
            <div ref={portraitRef} className="hero-portrait relative will-change-transform">
              {/* Glow */}
              <div
                aria-hidden
                className="absolute -inset-6 rounded-[2rem] blur-3xl opacity-50"
                style={{
                  background:
                    "conic-gradient(from 180deg, var(--primary), var(--violet), var(--accent), var(--primary))",
                }}
              />
              {/* Frame */}
              <div className="ring-gradient relative w-64 h-80 sm:w-72 sm:h-96 rounded-[2rem] overflow-hidden border border-border bg-card/60 backdrop-blur-md">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={name || "Soham Das"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/hero.png"
                    alt={name || "Soham Das"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>

              {/* Floating chips */}
              <div className="hero-float absolute -left-6 top-10 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
                <Code2 size={16} className="text-accent" />
                <span className="font-mono text-xs">full-stack</span>
              </div>
              <div className="hero-float absolute -right-4 bottom-12 glass rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg">
                <Sparkles size={16} className="text-primary" />
                <span className="font-mono text-xs">open to work</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground">
        <span className="font-mono text-xs tracking-widest uppercase">scroll</span>
        <ArrowDown size={16} />
      </div>
    </section>
  );
}
