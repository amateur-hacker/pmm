import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq, desc, and, sql, SQL } from "drizzle-orm";
import { verifyAdminToken } from "@/lib/auth";
import { cookies } from "next/headers";

const db = getDb();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    const page = Number.parseInt(url.searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(url.searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;
    const search = url.searchParams.get("search")?.trim() || "";

    // ------------------------
    // Admin Auth
    // ------------------------
    const authHeader = request.headers.get("authorization");
    let token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader || null;

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("adminToken")?.value || null;
    }

    // ------------------------
    // Conditions Array
    // ------------------------
    const conditions: SQL<unknown>[] = [];

    // Check if user is admin
    const isAdmin = !!(await verifyAdminToken(token ?? undefined));

    // Only add published condition if user is not an admin
    if (!isAdmin) {
      conditions.push(eq(blogs.published, 1));
    }

    if (search) {
      const like = `%${search}%`;
      conditions.push(
        sql`(
          ${blogs.title} ILIKE ${like} OR
          ${blogs.excerpt} ILIKE ${like} OR
          ${blogs.content} ILIKE ${like} OR
          ${blogs.author} ILIKE ${like}
        )`,
      );
    }

    const finalWhere = conditions.length > 0 ? and(...conditions) : undefined;

    // Check if getAll parameter is true (for admin dashboard)
    const getAll = url.searchParams.get("getAll") === "true";

    if (getAll && isAdmin) {
      // Admin requesting all blogs without pagination
      const allBlogsQuery = finalWhere
        ? db
            .select()
            .from(blogs)
            .where(finalWhere)
            .orderBy(desc(blogs.createdAt))
        : db.select().from(blogs).orderBy(desc(blogs.createdAt));

      const items = await allBlogsQuery;
      return Response.json(items);
    }

    // ------------------------
    // MAIN PAGINATED LIST
    // ------------------------
    const listQuery = finalWhere
      ? db
          .select()
          .from(blogs)
          .where(finalWhere)
          .orderBy(desc(blogs.createdAt))
          .limit(limit)
          .offset(offset)
      : db
          .select()
          .from(blogs)
          .orderBy(desc(blogs.createdAt))
          .limit(limit)
          .offset(offset);

    // ------------------------
    // COUNT QUERY
    // ------------------------
    const countQuery = finalWhere
      ? db
          .select({ count: sql<number>`count(*)` })
          .from(blogs)
          .where(finalWhere)
      : db.select({ count: sql<number>`count(*)` }).from(blogs);

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
    console.error("GET /blogs Error:", err);
    return Response.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    let token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader || null;

    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("adminToken")?.value || null;
    }

    const isAdmin = !!(await verifyAdminToken(token ?? undefined));
    if (!isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, excerpt, author, published, image } =
      await request.json();

    if (!title || !content || !author) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const isPublished = published ? 1 : 0;

    const [result] = await db
      .insert(blogs)
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

    return Response.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /blogs Error:", err);
    return Response.json({ error: "Failed to create blog" }, { status: 500 });
  }
}
