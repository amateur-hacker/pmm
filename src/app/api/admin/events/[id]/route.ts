import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { events } from "@/lib/db/schema";

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
      return Response.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (event.length === 0) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    return Response.json(event[0]);
  } catch (error) {
    console.error("Error fetching event:", error);
    return Response.json({ error: "Failed to fetch event" }, { status: 500 });
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
      return Response.json({ error: "Invalid event ID" }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, excerpt, author, published, image } = body;

    const isPublished = published ? 1 : 0;

    // Fetch current event to check if publish status is changing
    const [currentEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!currentEvent) {
      return Response.json({ error: "Event not found" }, { status: 404 });
    }

    // Set publishedAt only if becoming published for the first time
    let publishedAtValue = currentEvent.publishedAt;
    if (isPublished && !currentEvent.published) {
      publishedAtValue = new Date();
    } else if (!isPublished) {
      publishedAtValue = null;
    }

    const [updatedEvent] = await db
      .update(events)
      .set({
        title,
        content,
        excerpt: excerpt || null,
        author,
        published: isPublished,
        publishedAt: publishedAtValue,
        image: image || null,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id))
      .returning();

    return Response.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return Response.json({ error: "Failed to update event" }, { status: 500 });
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
      return Response.json({ error: "Invalid event ID" }, { status: 400 });
    }

    await db.delete(events).where(eq(events.id, id));

    return Response.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return Response.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
