"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".blob", { scale: 0, duration: 1.4, stagger: 0.2 })
        .from(".hero-img", { opacity: 0, y: 20, duration: 1 }, "-=1")
        .from(".hero-title", { opacity: 0, y: -40, duration: 0.8 }, "-=0.6")
        .from(".hero-sub", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
        .from(".hero-cta", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5");

      // Gentle float once the intro has settled.
      gsap.to(".hero-img", {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.4,
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden"
    >
      {/* Background blobs */}
      <div className="blob absolute -z-20 top-32 w-[500px] h-[500px] rounded-full bg-indigo-400 opacity-30 blur-3xl" />
      <div className="blob absolute -z-20 top-60 left-40 w-[600px] h-[600px] rounded-full bg-purple-500 opacity-20 blur-3xl" />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero.png"
        alt="Hero"
        className="hero-img relative z-10 w-64 h-64 object-cover rounded-xl shadow-2xl mb-8"
      />

      <h1 className="hero-title text-4xl md:text-6xl font-extrabold text-white mb-4 relative z-20">
        Hi, I&rsquo;m <span className="text-indigo-400">Soham</span>
      </h1>

      <p className="hero-sub text-lg md:text-xl text-gray-300 max-w-2xl mb-8 relative z-20">
        A Full Stack Developer passionate about building modern web apps,
        interactive UI, and solving real-world problems with clean code.
      </p>

      <div className="hero-cta flex flex-col md:flex-row gap-4 relative z-20">
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
      </div>
    </section>
  );
}
