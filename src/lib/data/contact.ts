import "server-only";
import { prisma } from "@/lib/prisma";

/** Single Contact document with social links (server-only read). */
export async function getContact() {
  return prisma.contact.findFirst({
    include: { socials: true },
  });
}

export type ContactData = NonNullable<Awaited<ReturnType<typeof getContact>>>;
