// /app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // import prisma
import cloudinary from "@/lib/cloudinary";

// GET -> fetch all projects
export async function GET() {
  const projects = await prisma.project.findMany();
  return NextResponse.json(projects);
}

// POST -> add new project
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const slug = formData.get("slug") as string;
  const tags = (formData.get("tags") as string).split(",").map((t) => t.trim());
  const repoUrl = formData.get("repoUrl") as string;
  const liveUrl = formData.get("liveUrl") as string;

  let imageUrl = formData.get("imageUrl") as string | null;

  const imageFile = formData.get("imageFile") as File | null;

  if (imageFile) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadRes = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "portfolio" }, (err, result) => {
            if (err || !result) reject(err);
            else resolve(result as { secure_url: string });
          })
          .end(buffer);
      }
    );

    imageUrl = uploadRes.secure_url;
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
      imageUrl: imageUrl || "",
    },
  });

  return NextResponse.json(project);
}

// PUT -> update project
export async function PUT(req: NextRequest) {
  const formData = await req.formData();
  const id = formData.get("id") as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = {
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    slug: formData.get("slug"),
    tags: (formData.get("tags") as string).split(",").map((t) => t.trim()),
    repoUrl: formData.get("repoUrl"),
    liveUrl: formData.get("liveUrl"),
  };

  let imageUrl = formData.get("imageUrl") as string | null;
  const imageFile = formData.get("imageFile") as File | null;

  if (imageFile) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadRes = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "portfolio" }, (err, result) => {
            if (err || !result) reject(err);
            else resolve(result as { secure_url: string });
          })
          .end(buffer);
      }
    );
    imageUrl = uploadRes.secure_url;
  }

  if (imageUrl) data.imageUrl = imageUrl;

  const project = await prisma.project.update({
    where: { id },
    data,
  });

  return NextResponse.json(project);
}

// DELETE -> delete project
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
