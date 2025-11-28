import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { members } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyAdminToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const db = getDb();

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
    const { id } = await params;
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return Response.json({ error: "Invalid member ID" }, { status: 400 });
    }

    const member = await db
      .select()
      .from(members)
      .where(eq(members.id, id))
      .limit(1);

    if (member.length === 0) {
      return Response.json({ error: "Member not found" }, { status: 404 });
    }

    return Response.json(member[0]);
  } catch (error) {
    console.error("Error fetching member:", error);
    return Response.json({ error: "Failed to fetch member" }, { status: 500 });
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
    const { id } = await params;
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return Response.json({ error: "Invalid member ID" }, { status: 400 });
    }

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

    const [updatedMember] = await db
      .update(members)
      .set({
        name,
        address,
        mobile,
        email,
        dob: formattedDob,
        education,
        permanentAddress,
        image: image || null,
        donated: donated !== undefined ? donated : 0,
        type,
        updatedAt: new Date(),
      })
      .where(eq(members.id, id))
      .returning();

    return Response.json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    return Response.json({ error: "Failed to update member" }, { status: 500 });
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
    const { id } = await params;
    // Validate UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return Response.json({ error: "Invalid member ID" }, { status: 400 });
    }

    await db.delete(members).where(eq(members.id, id));

    return Response.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    return Response.json({ error: "Failed to delete member" }, { status: 500 });
  }
}

