import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/auth";
import {
  contactCreateSchema,
  contactUpdateSchema,
  idSchema,
  badRequest,
} from "@/lib/validation";

export async function GET() {
  const contact = await prisma.contact.findFirst({
    include: { socials: true },
  });
  return NextResponse.json(contact);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  const parsed = contactCreateSchema.safeParse(await req.json());
  if (!parsed.success) return badRequest(parsed.error);
  const data = parsed.data;

  const contact = await prisma.contact.create({
    data: {
      phone: data.phone,
      email: data.email,
      location: data.location,
      resumeUrl: data.resumeUrl,
      mediaUrl: data.mediaUrl,
      socials: { create: data.socials },
    },
    include: { socials: true },
  });
  return NextResponse.json(contact, { status: 201 });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  const parsed = contactUpdateSchema.safeParse(await req.json());
  if (!parsed.success) return badRequest(parsed.error);
  const data = parsed.data;

  const contact = await prisma.contact.update({
    where: { id: data.id },
    data: {
      phone: data.phone,
      email: data.email,
      location: data.location,
      resumeUrl: data.resumeUrl,
      mediaUrl: data.mediaUrl,
      socials: {
        deleteMany: {}, // removes all old socials
        create: data.socials.map((s) => ({ platform: s.platform, url: s.url })),
      },
    },
    include: { socials: true },
  });

  return NextResponse.json(contact);
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  const parsed = idSchema.safeParse(await req.json());
  if (!parsed.success) return badRequest(parsed.error);

  await prisma.contact.delete({ where: { id: parsed.data.id } });
  return NextResponse.json({ message: "Contact deleted" });
}
