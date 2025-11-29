import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { eq, desc, and, sql, SQL } from "drizzle-orm";

const db = getDb();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

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
          ${members.name} ILIKE ${like} OR
          ${members.address} ILIKE ${like} OR
          ${members.mobile} ILIKE ${like} OR
          ${members.email} ILIKE ${like} OR
          ${members.education} ILIKE ${like}
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
          .from(members)
          .where(finalWhere)
          .orderBy(desc(members.createdAt))
          .limit(limit)
          .offset(offset)
      : db
          .select()
          .from(members)
          .orderBy(desc(members.createdAt))
          .limit(limit)
          .offset(offset);

    // ------------------------
    // COUNT QUERY
    // ------------------------
    const countQuery = finalWhere
      ? db
          .select({ count: sql<number>`count(*)` })
          .from(members)
          .where(finalWhere)
      : db.select({ count: sql<number>`count(*)` }).from(members);

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
    console.error("GET /members Error:", err);
    return Response.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}