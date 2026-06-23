import { NextRequest, NextResponse } from "next/server";
import cloudinary, { UploadApiResponse } from "@/lib/cloudinary";
import { isAdmin, unauthorized } from "@/lib/auth";
import { validateUploadFile } from "@/lib/validation";

export const runtime = "nodejs"; // Add this at the top of your file

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) return unauthorized();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || typeof file !== "object" || file.size === 0) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validationError = validateUploadFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Convert file to base64 buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const uploadRes = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "portfolio" }, (err, result) => {
            if (err || !result) reject(err);
            else resolve(result);
          })
          .end(buffer);
      }
    );

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
