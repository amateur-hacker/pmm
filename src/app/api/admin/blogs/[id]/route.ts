import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { blogs } from "@/lib/db/schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = getDb();

  // Get session to verify admin access
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.session || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    const { id } = await params;
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return Response.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const blog = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);

    if (blog.length === 0) {
      return Response.json({ error: "Blog not found" }, { status: 404 });
    }

    return Response.json(blog[0]);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return Response.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = getDb();

  // Get session to verify admin access
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.session || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    const { id } = await params;
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return Response.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, excerpt, author, published, image } = body;

    const isPublished = published ? 1 : 0;

    const [updatedBlog] = await db
      .update(blogs)
      .set({
        title,
        content,
        excerpt: excerpt || null,
        author,
        published: isPublished,
        publishedAt: isPublished ? new Date() : null,
        image: image || null,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id))
      .returning();

    return Response.json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    return Response.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = getDb();

  // Get session to verify admin access
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.session || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    const { id } = await params;
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return Response.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    await db.delete(blogs).where(eq(blogs.id, id));

    return Response.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return Response.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
