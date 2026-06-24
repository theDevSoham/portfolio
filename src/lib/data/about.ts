import "server-only";
import { prisma } from "@/lib/prisma";

/** Single About document with all nested relations (server-only read). */
export async function getAbout() {
  return prisma.about.findFirst({
    include: {
      education: true,
      experiences: true,
      skills: true,
      achievements: true,
    },
  });
}

export type AboutData = NonNullable<Awaited<ReturnType<typeof getAbout>>>;
