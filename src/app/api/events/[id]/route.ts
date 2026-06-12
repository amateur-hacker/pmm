import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { events } from "@/lib/db/schema";

const db = getDb();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (result.length === 0) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (err) {
    console.error("GET /events/[id] Error:", err);
    return Response.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 403 });
    }

    const { id } = await params;
    const { title, content, excerpt, author, published, image } =
      await request.json();

    if (!title || !content || !author) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const isPublished = published ? 1 : 0;

    const [updated] = await db
      .update(events)
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
      .where(eq(events.id, id))
      .returning();

    return Response.json(updated);
  } catch (err) {
    console.error("PUT /events/[id] Error:", err);
    return Response.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 403 });
    }

    const { id } = await params;

    await db.delete(events).where(eq(events.id, id));

    return Response.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("DELETE /events/[id] Error:", err);
    return Response.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
