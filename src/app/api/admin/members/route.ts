import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { verifyAdminToken } from "@/lib/auth";
import { cookies } from "next/headers";

const db = getDb();

export async function GET(request: NextRequest) {
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
    const membersList = await db
      .select()
      .from(members)
      .orderBy(desc(members.createdAt));

    return Response.json(membersList);
  } catch (error) {
    console.error("Error fetching members:", error);
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

