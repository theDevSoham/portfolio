import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/auth";
import {
  socialCreateSchema,
  socialUpdateSchema,
  idSchema,
  badRequest,
} from "@/lib/validation";

// Add new social link
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  const parsed = socialCreateSchema.safeParse(await req.json());
  if (!parsed.success) return badRequest(parsed.error);
  const { contactId, platform, url } = parsed.data;

  // Ensure the referenced contact actually exists (avoid orphaned links).
  const contact = await prisma.contact.findUnique({ where: { id: contactId } });
  if (!contact)
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });

  const social = await prisma.socialLink.create({
    data: { contactId, platform, url },
  });
  return NextResponse.json(social, { status: 201 });
}

// Update social link
export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  const parsed = socialUpdateSchema.safeParse(await req.json());
  if (!parsed.success) return badRequest(parsed.error);
  const { id, platform, url } = parsed.data;

  const updated = await prisma.socialLink.update({
    where: { id },
    data: { platform, url },
  });

  return NextResponse.json(updated);
}

// Delete social link
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  const parsed = idSchema.safeParse(await req.json());
  if (!parsed.success) return badRequest(parsed.error);

  await prisma.socialLink.delete({ where: { id: parsed.data.id } });
  return NextResponse.json({ message: "Deleted" });
}
