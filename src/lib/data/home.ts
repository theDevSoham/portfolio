import "server-only";
import { prisma } from "@/lib/prisma";

/** Singleton Home (landing page) copy (server-only read). */
export async function getHome() {
  return prisma.home.findFirst();
}

export type HomeData = NonNullable<Awaited<ReturnType<typeof getHome>>>;
