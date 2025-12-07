import { and, desc, type SQL, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { events } from "@/lib/db/schema";

const db = getDb();

export async function GET(request: NextRequest) {
  try {
    // Get session to verify admin access
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.session || session.user.role !== "admin") {
      return new Response("Unauthorized", { status: 403 });
    }

    const url = new URL(request.url);

    // Check if getAll parameter is true (for admin dashboard)
    const getAll = url.searchParams.get("getAll") === "true";

    if (getAll) {
      // Admin requesting all events without pagination
      const allEvents = await db
        .select()
        .from(events)
        .orderBy(desc(events.createdAt));

      const items = allEvents;
      return Response.json(items);
    }

    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;
    const search = url.searchParams.get("search")?.trim() || "";

    // ------------------------
    // Conditions Array
    // ------------------------
    const conditions: SQL<unknown>[] = [];

    if (search) {
      const like = `%${search}%`;
      conditions.push(
        sql`(
          ${events.title} ILIKE ${like} OR
          ${events.excerpt} ILIKE ${like} OR
          ${events.content} ILIKE ${like} OR
          ${events.author} ILIKE ${like}
        )`,
      );
    }

    const finalWhere = conditions.length > 0 ? and(...conditions) : undefined;

    // ------------------------
    // MAIN PAGINATED LIST
    // ------------------------
    const listQuery = finalWhere
      ? db
          .select()
          .from(events)
          .where(finalWhere)
          .orderBy(desc(events.createdAt))
          .limit(limit)
          .offset(offset)
      : db
          .select()
          .from(events)
          .orderBy(desc(events.createdAt))
          .limit(limit)
          .offset(offset);

    // ------------------------
    // COUNT QUERY
    // ------------------------
    const countQuery = finalWhere
      ? db
          .select({ count: sql<number>`count(*)` })
          .from(events)
          .where(finalWhere)
      : db.select({ count: sql<number>`count(*)` }).from(events);

    const [items, countResult] = await Promise.all([listQuery, countQuery]);

    const total = Number(countResult[0]?.count || 0);

    return Response.json({
      items,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    });
  } catch (err) {
    console.error("GET /admin/events Error:", err);
    return Response.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Get session to verify admin access
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.session || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, content, excerpt, author, published, image } = body;

    const isPublished = published ? 1 : 0;

    const [newEvent] = await db
      .insert(events)
      .values({
        title,
        content,
        excerpt: excerpt || null,
        author,
        published: isPublished,
        publishedAt: isPublished ? new Date() : null,
        image: image || null,
      })
      .returning();

    return Response.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error adding event:", error);
    return Response.json({ error: "Failed to add event" }, { status: 500 });
  }
}
