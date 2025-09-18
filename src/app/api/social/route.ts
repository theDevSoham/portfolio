import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Add new social link
export async function POST(req: Request) {
  const { contactId, platform, url } = await req.json();
  if (!contactId)
    return NextResponse.json({ error: "ContactId required" }, { status: 400 });

  const social = await prisma.socialLink.create({
    data: { contactId, platform, url },
  });
  return NextResponse.json(social, { status: 201 });
}

// Update social link
export async function PUT(req: Request) {
  const { id, platform, url } = await req.json();
  if (!id)
    return NextResponse.json({ error: "Social id required" }, { status: 400 });

  const updated = await prisma.socialLink.update({
    where: { id },
    data: { platform, url },
  });

  return NextResponse.json(updated);
}

// Delete social link
export async function DELETE(req: Request) {
  const { id } = await req.json();
  if (!id)
    return NextResponse.json({ error: "Social id required" }, { status: 400 });

  await prisma.socialLink.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
