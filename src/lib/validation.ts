import { z } from "zod";
import { NextResponse } from "next/server";

/** Treat empty strings as "absent" so optional URL fields validate cleanly. */
const optionalUrl = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.string().url({ message: "Must be a valid URL" }).optional()
);

const optionalText = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.string().max(2000).optional()
);

// ---------- About ----------
export const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1).max(200),
  school: z.string().min(1).max(200),
  startYear: z.coerce.number().int().min(1900).max(2100),
  endYear: z.coerce.number().int().min(1900).max(2100),
  grade: optionalText,
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  role: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  duration: z.string().min(1).max(100),
  desc: z.string().min(1).max(2000),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
});

export const achievementSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1).max(500),
});

const aboutBase = {
  name: z.string().min(1).max(200),
  headline: z.string().min(1).max(300),
  bio: z.string().min(1).max(5000),
  avatarUrl: optionalUrl,
  education: z.array(educationSchema).default([]),
  experiences: z.array(experienceSchema).default([]),
  skills: z.array(skillSchema).default([]),
  achievements: z.array(achievementSchema).default([]),
};

export const aboutCreateSchema = z.object(aboutBase);
export const aboutUpdateSchema = z.object({ id: z.string().min(1), ...aboutBase });
export const aboutDeleteSchema = z.object({
  type: z.enum(["skills", "education", "experiences", "achievements"]),
  id: z.string().min(1),
});

// ---------- Contact ----------
export const socialInlineSchema = z.object({
  platform: z.string().min(1).max(50),
  url: z.string().url(),
});

const contactBase = {
  phone: optionalText,
  email: z.preprocess(
    (v) => (v === "" || v === null ? undefined : v),
    z.string().email().optional()
  ),
  location: optionalText,
  resumeUrl: optionalUrl,
  mediaUrl: optionalUrl,
  socials: z.array(socialInlineSchema).default([]),
};

export const contactCreateSchema = z.object(contactBase);
export const contactUpdateSchema = z.object({ id: z.string().min(1), ...contactBase });
export const idSchema = z.object({ id: z.string().min(1) });

// ---------- Social ----------
export const socialCreateSchema = z.object({
  contactId: z.string().min(1),
  platform: z.string().min(1).max(50),
  url: z.string().url(),
});
export const socialUpdateSchema = z.object({
  id: z.string().min(1),
  platform: z.string().min(1).max(50),
  url: z.string().url(),
});

// ---------- Project ----------
export const projectInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(20000),
  icon: z.string().min(1).max(50),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and hyphens"),
  tags: z.array(z.string().min(1).max(50)).max(30).default([]),
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  images: z.array(z.string().url()).default([]),
});

// ---------- Upload ----------
export const ALLOWED_UPLOAD_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
] as const;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_VIDEO_BYTES = 25 * 1024 * 1024; // 25 MB

/** Returns an error string if the file is not an allowed type/size, else null. */
export function validateUploadFile(file: File): string | null {
  if (!ALLOWED_UPLOAD_TYPES.includes(file.type as (typeof ALLOWED_UPLOAD_TYPES)[number])) {
    return `Unsupported file type: ${file.type || "unknown"}`;
  }
  const isVideo = file.type.startsWith("video/");
  const max = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > max) {
    return `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB; max ${max / 1024 / 1024} MB)`;
  }
  return null;
}

/** Build a 400 response from a Zod error. */
export function badRequest(error: z.ZodError) {
  return NextResponse.json(
    { error: "Invalid input", issues: error.issues.map((i) => ({ path: i.path, message: i.message })) },
    { status: 400 }
  );
}
