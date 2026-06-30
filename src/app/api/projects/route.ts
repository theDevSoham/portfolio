// /app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { isAdmin, unauthorized } from "@/lib/auth";
import {
  projectInputSchema,
  validateUploadFile,
  badRequest,
  featuredPatchSchema,
} from "@/lib/validation";

// Utility for Cloudinary upload (validates type/size before sending)
async function uploadToCloudinary(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "portfolio" }, (err, result) => {
        if (err || !result) reject(err);
        else resolve(result.secure_url);
      })
      .end(buffer);
  });
}

/** Parse the multipart form into a plain object and collect/validate image files. */
async function readProjectForm(req: NextRequest) {
  const formData = await req.formData();

  const tagsRaw = (formData.get("tags") as string) ?? "";
  const images: string[] = [];

  // Existing image URLs passed back from the client
  for (const key of [...formData.keys()].filter((k) => k.startsWith("images["))) {
    const val = formData.get(key);
    if (val) images.push(val.toString());
  }

  // New uploads — validate each before hitting Cloudinary
  const fileEntries = (formData.getAll("imageFiles") as File[]).filter(
    (f) => f && typeof f === "object" && f.size > 0
  );
  for (const file of fileEntries) {
    const err = validateUploadFile(file);
    if (err) return { error: err as string };
  }
  for (const file of fileEntries) {
    images.push(await uploadToCloudinary(file));
  }

  const input = {
    id: (formData.get("id") as string) || undefined,
    title: (formData.get("title") as string) ?? "",
    description: (formData.get("description") as string) ?? "",
    icon: (formData.get("icon") as string) ?? "",
    slug: (formData.get("slug") as string) ?? "",
    tags: tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
    repoUrl: (formData.get("repoUrl") as string) ?? "",
    liveUrl: (formData.get("liveUrl") as string) ?? "",
    images,
  };

  return { input };
}

// ---------------- GET ----------------
export async function GET() {
  const projects = await prisma.project.findMany({
    include: { images: true },
  });
  return NextResponse.json(projects);
}

// ---------------- POST ----------------
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return unauthorized();

  const form = await readProjectForm(req);
  if ("error" in form)
    return NextResponse.json({ error: form.error }, { status: 400 });

  const parsed = projectInputSchema.safeParse(form.input);
  if (!parsed.success) return badRequest(parsed.error);
  const { images, ...rest } = parsed.data;
  delete rest.id;

  const project = await prisma.project.create({
    data: {
      ...rest,
      images: { create: images.map((url) => ({ url })) },
    },
    include: { images: true },
  });

  return NextResponse.json(project);
}

// ---------------- PUT ----------------
export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return unauthorized();

  const form = await readProjectForm(req);
  if ("error" in form)
    return NextResponse.json({ error: form.error }, { status: 400 });

  const parsed = projectInputSchema.safeParse(form.input);
  if (!parsed.success) return badRequest(parsed.error);
  const { images, id, ...data } = parsed.data;
  if (!id)
    return NextResponse.json({ error: "Project id required" }, { status: 400 });

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...data,
      images: {
        deleteMany: {}, // clear old images
        create: images.map((url) => ({ url })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json(project);
}

// ---------------- DELETE ----------------
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) return unauthorized();

  const body = await req.json();
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id)
    return NextResponse.json({ error: "Project id required" }, { status: 400 });

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

// ---------------- PATCH (featured flag / order) ----------------
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) return unauthorized();

  const parsed = featuredPatchSchema.safeParse(await req.json());
  if (!parsed.success) return badRequest(parsed.error);
  const { id, featured, featuredOrder } = parsed.data;

  const data: { featured?: boolean; featuredOrder?: number } = {};
  if (featuredOrder !== undefined) data.featuredOrder = featuredOrder;
  if (featured !== undefined) {
    data.featured = featured;
    // Newly featured with no explicit order → append to the end.
    if (featured && featuredOrder === undefined) {
      const max = await prisma.project.aggregate({
        where: { featured: true },
        _max: { featuredOrder: true },
      });
      data.featuredOrder = (max._max.featuredOrder ?? 0) + 1;
    }
  }

  const project = await prisma.project.update({
    where: { id },
    data,
    include: { images: true },
  });
  return NextResponse.json(project);
}
