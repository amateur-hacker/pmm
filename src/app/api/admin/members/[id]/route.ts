import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { members } from "@/lib/db/schema";

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
      return Response.json({ error: "Invalid member ID" }, { status: 400 });
    }

    await db.delete(members).where(eq(members.id, id));

    return Response.json({ message: "Member deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    return Response.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
