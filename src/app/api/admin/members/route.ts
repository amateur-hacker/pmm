import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { members } from "@/lib/db/schema";
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

    const isAdmin = !!(await verifyAdminToken(token ?? undefined));
    if (!isAdmin) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Check if getAll parameter is true (for admin dashboard)
    const getAll = url.searchParams.get("getAll") === "true";

    if (getAll) {
      // Admin requesting all members without pagination
      const allMembersQuery = finalWhere
        ? db
            .select()
            .from(members)
            .where(finalWhere)
            .orderBy(desc(members.createdAt))
        : db.select().from(members).orderBy(desc(members.createdAt));

      const items = await allMembersQuery;
      return Response.json(items);
    }

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
    console.error("GET /admin/members Error:", err);
    return Response.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Check for admin authentication
  // First try to get token from Authorization header, then from cookie
  const authHeader = request.headers.get("authorization");
  let token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

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
    const body = await request.json();
    const {
      name,
      address,
      mobile,
      email,
      dob,
      education,
      permanentAddress,
      image,
      donated,
      type,
    } = body;

    const parsedDob = dob ? new Date(dob) : null;
    const formattedDob = parsedDob
      ? parsedDob.toISOString().split("T")[0]
      : null;

    const [newMember] = await db
      .insert(members)
      .values({
        name,
        address,
        mobile,
        email,
        dob: formattedDob,
        education,
        permanentAddress,
        image: image || null,
        donated: donated !== undefined ? donated : 0,
        type: type || "member",
      })
      .returning();

    return Response.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Error adding member:", error);
    return Response.json({ error: "Failed to add member" }, { status: 500 });
  }
}

