import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/data/projects";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let slugs: string[] = [];
  try {
    slugs = await getProjectSlugs();
  } catch {
    // DB unavailable at build — ship the static routes only.
  }

  const now = new Date();
  const staticRoutes = ["", "/projects", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));
  const projectRoutes = slugs.map((slug) => ({
    url: `${base}/projects/${slug}`,
    lastModified: now,
  }));

  return [...staticRoutes, ...projectRoutes];
}
