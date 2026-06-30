/**
 * Built-in home page copy. Components fall back to these, and the admin Home
 * editor pre-fills its fields with them so the editor always shows the live
 * content. Edit here to change the out-of-the-box defaults.
 */
export const HOME_DEFAULTS = {
  heroBadge: "available for work",
  heroHeadline: "Building modern web experiences",
  heroHighlight: "modern web",
  heroTagline:
    "I'm Soham Das — a full-stack developer crafting fast, delightful, and scalable products from pixel to deploy.",
  heroRoles: ["react", "next.js", "node.js", "typescript", "react native"],
  marqueeFallback: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "React Native",
    "Tailwind",
    "Prisma",
    "MongoDB",
    "GSAP",
  ],
  statsEyebrow: "profile",
  statsTitle: "Who I am",
  statsHighlight: "I am",
  funStatValue: "∞",
  funStatLabel: "cups of coffee",
  ctaEyebrow: "let's talk",
  ctaHeading: "Let's build something together",
  ctaHighlight: "together",
  ctaSubtext: "Have an idea, a role, or a project in mind? I'm one message away.",
  ctaButton: "Start a conversation",
  heroImageFallback: "/hero.png",
} as const;
