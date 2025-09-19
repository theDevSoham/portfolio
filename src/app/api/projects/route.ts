// /app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

// Utility for Cloudinary upload
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

// ---------------- GET ----------------
export async function GET() {
  const projects = await prisma.project.findMany({
    include: { images: true },
  });
  return NextResponse.json(projects);
}

// ---------------- POST ----------------
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const slug = formData.get("slug") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const repoUrl = formData.get("repoUrl") as string;
  const liveUrl = formData.get("liveUrl") as string;

  // Handle images (URLs + uploads)
  const images: string[] = [];
  const urlEntries = [...formData.keys()].filter((k) =>
    k.startsWith("images[")
  );
  for (const key of urlEntries) {
    const val = formData.get(key);
    if (val) images.push(val.toString());
  }

  const fileEntries = formData.getAll("imageFiles") as File[];
  for (const file of fileEntries) {
    const uploaded = await uploadToCloudinary(file);
    images.push(uploaded);
  }

  const project = await prisma.project.create({
    data: {
      title,
      description,
      icon,
      slug,
      tags,
      repoUrl,
      liveUrl,
      images: {
        create: images.map((url) => ({ url })),
      },
    },
    include: { images: true },
  });

  return NextResponse.json(project);
}

// ---------------- PUT ----------------
export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const id = formData.get("id") as string;

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const slug = formData.get("slug") as string;
  const tags = (formData.get("tags") as string)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const repoUrl = formData.get("repoUrl") as string;
  const liveUrl = formData.get("liveUrl") as string;

  // Collect images (URLs + uploads)
  const images: string[] = [];
  const urlEntries = [...formData.keys()].filter((k) =>
    k.startsWith("images[")
  );
  for (const key of urlEntries) {
    const val = formData.get(key);
    if (val) images.push(val.toString());
  }

  const fileEntries = formData.getAll("imageFiles") as File[];
  for (const file of fileEntries) {
    const uploaded = await uploadToCloudinary(file);
    images.push(uploaded);
  }

  // Update project
  const project = await prisma.project.update({
    where: { id },
    data: {
      title,
      description,
      icon,
      slug,
      tags,
      repoUrl,
      liveUrl,
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
  const { id } = await req.json();
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
