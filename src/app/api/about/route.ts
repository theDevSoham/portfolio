/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function upsertNested<T extends { id?: string }>(
  items: T[],
  model: any,
  foreignKey: string,
  parentId: string
) {
  for (const item of items) {
    if (item.id) {
      // update existing
      await model.update({
        where: { id: item.id },
        data: { ...item, [foreignKey]: parentId },
      });
    } else {
      // create new
      await model.create({
        data: { ...item, [foreignKey]: parentId },
      });
    }
  }
}

// ✅ GET -> fetch About info with relations
export async function GET() {
  try {
    const about = await prisma.about.findFirst({
      include: {
        education: true,
        experiences: true,
        skills: true,
        achievements: true,
      },
    });

    return NextResponse.json(about || {});
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch About" },
      { status: 500 }
    );
  }
}

// ✅ POST -> create About info with nested relations
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(data);

    const about = await prisma.about.create({
      data: {
        name: data.name,
        headline: data.headline,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        education: { create: data.education || [] },
        experiences: { create: data.experiences || [] },
        skills: { create: data.skills || [] },
        achievements: { create: data.achievements || [] },
      },
      include: {
        education: true,
        experiences: true,
        skills: true,
        achievements: true,
      },
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create About" },
      { status: 500 }
    );
  }
}

// ✅ PUT -> update About info with nested upserts
export async function PUT(req: NextRequest) {
  try {
    const {
      id,
      education = [],
      experiences = [],
      skills = [],
      achievements = [],
      ...rest
    } = await req.json();

    // Update About
    await prisma.about.update({
      where: { id },
      data: {
        name: rest.name,
        headline: rest.headline,
        bio: rest.bio,
        avatarUrl: rest.avatarUrl,
      },
    });

    // Upsert nested arrays
    await upsertNested(education, prisma.education, "aboutId", id);
    await upsertNested(experiences, prisma.experience, "aboutId", id);
    await upsertNested(skills, prisma.skill, "aboutId", id);
    await upsertNested(achievements, prisma.achievement, "aboutId", id);

    // Refetch updated About
    const updatedAbout = await prisma.about.findUnique({
      where: { id },
      include: {
        education: true,
        experiences: true,
        skills: true,
        achievements: true,
      },
    });

    return NextResponse.json(updatedAbout);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update About" },
      { status: 500 }
    );
  }
}

// ✅ DELETE -> delete a nested relation inside About
export async function DELETE(req: NextRequest) {
  try {
    const { type, id } = await req.json();

    if (!type || !id) {
      return NextResponse.json(
        { error: "Missing type or id" },
        { status: 400 }
      );
    }

    switch (type) {
      case "skills":
        await prisma.skill.delete({ where: { id } });
        break;
      case "education":
        await prisma.education.delete({ where: { id } });
        break;
      case "experiences":
        await prisma.experience.delete({ where: { id } });
        break;
      case "achievements":
        await prisma.achievement.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
