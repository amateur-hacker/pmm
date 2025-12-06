import { put } from "@vercel/blob";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db";

const _db = getDb();

export async function POST(request: NextRequest) {
  try {
    // We need to handle multipart/form-data for file uploads
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: "File size must be less than 5MB" },
        { status: 400 },
      );
    }

    // Generate a unique filename
    const filename = `member-images/${Date.now()}-${file.name}`;

    // Upload to Vercel Blob
    const { url } = await put(filename, file, {
      access: "public",
      contentType: file.type,
    });

    return Response.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
