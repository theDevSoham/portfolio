import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const contact = await prisma.contact.findFirst({
    include: { socials: true },
  });
  return NextResponse.json(contact);
}

export async function POST(req: Request) {
  const data = await req.json();
  const contact = await prisma.contact.create({
    data: {
      phone: data.phone,
      email: data.email,
      location: data.location,
      resumeUrl: data.resumeUrl,
      mediaUrl: data.mediaUrl,
      socials: { create: data.socials || [] },
    },
    include: { socials: true },
  });
  return NextResponse.json(contact, { status: 201 });
}

export async function PUT(req: Request) {
  const data = await req.json();
  if (!data.id)
    return NextResponse.json({ error: "Contact id required" }, { status: 400 });

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        create: (data.socials || []).map((s: any) => ({
          platform: s.platform,
          url: s.url,
        })),
      },
    },
    include: { socials: true },
  });

  return NextResponse.json(contact);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id)
    return NextResponse.json({ error: "Contact id required" }, { status: 400 });

  await prisma.contact.delete({ where: { id } });
  return NextResponse.json({ message: "Contact deleted" });
}
