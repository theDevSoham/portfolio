import "server-only";
import { prisma } from "@/lib/prisma";

/** All projects with their images, newest first (server-only read). */
export async function getProjects() {
  return prisma.project.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });
}

/** Single project by slug, or null (server-only read). */
export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: { images: true },
  });
}

/** Slugs for static generation. */
export async function getProjectSlugs() {
  const projects = await prisma.project.findMany({ select: { slug: true } });
  return projects.map((p) => p.slug);
}

export type ProjectData = NonNullable<Awaited<ReturnType<typeof getProjectBySlug>>>;
export type ProjectListItem = Awaited<ReturnType<typeof getProjects>>[number];
