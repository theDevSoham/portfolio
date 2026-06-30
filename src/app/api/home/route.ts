import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isAdmin, unauthorized } from "@/lib/auth";
import { homeSchema, badRequest } from "@/lib/validation";

export async function GET() {
  const home = await prisma.home.findFirst();
  return NextResponse.json(home);
}

// Upsert the singleton Home record.
export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized();

  const parsed = homeSchema.safeParse(await req.json());
  if (!parsed.success) return badRequest(parsed.error);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...data } = parsed.data;
  const existing = await prisma.home.findFirst();

  const home = existing
    ? await prisma.home.update({ where: { id: existing.id }, data })
    : await prisma.home.create({ data });

  return NextResponse.json(home);
}
