import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyAdminToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = getDb();

  try {
    const { id } = await params;
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return Response.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    // Check for admin authentication
    // First try to get token from Authorization header, then from cookie
    const authHeader = request.headers.get("authorization");
    let token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader || null;

    if (!token) {
      // Try getting token from cookies
      const cookieStore = await cookies();
      token = cookieStore.get("adminToken")?.value || null;
    }

    const adminToken = await verifyAdminToken(token || undefined);
    const isAdmin = !!adminToken;

    let blog: any;
    if (isAdmin) {
      // Admin can see any blog (published or draft)
      blog = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
    } else {
      // Regular users can only see published blogs
      blog = await db
        .select()
        .from(blogs)
        .where(and(eq(blogs.id, id), eq(blogs.published, 1)))
        .limit(1);
    }

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

  // Check for admin authentication
  // First try to get token from Authorization header, then from cookie
  const authHeader = request.headers.get("authorization");
  let token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader || null;

  if (!token) {
    // Try getting token from cookies
    const cookieStore = await cookies();
    token = cookieStore.get("adminToken")?.value || null;
  }

  const adminToken = await verifyAdminToken(token || undefined);

  if (!adminToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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

    const parsedPublished = published ? 1 : 0;
    const publishedAt = parsedPublished ? new Date() : null;

    const [updatedBlog] = await db
      .update(blogs)
      .set({
        title,
        content,
        excerpt,
        author,
        published: parsedPublished,
        publishedAt,
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

  // Check for admin authentication
  // First try to get token from Authorization header, then from cookie
  const authHeader = request.headers.get("authorization");
  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (authHeader) {
    token = authHeader;
  }

  if (!token) {
    // Try getting token from cookies
    const cookieStore = await cookies();
    token = cookieStore.get("adminToken")?.value || null;
  }

  const adminToken = await verifyAdminToken(token || undefined);

  if (!adminToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
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
