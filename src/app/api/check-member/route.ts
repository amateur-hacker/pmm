import type { NextRequest } from "next/server";

import { eq, or } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { members } from "@/lib/db/schema";

const db = getDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const mobile = searchParams.get("mobile");

  if (!name && !mobile) {
    return Response.json(
      { error: "Name or mobile parameter is required" },
      { status: 400 },
    );
  }

  try {
    const conditions = [];
    if (name) conditions.push(eq(members.name, name));
    if (mobile) conditions.push(eq(members.mobile, mobile));

    const existingMembers = await db
      .select()
      .from(members)
      .where(or(...conditions));

    return Response.json({ exists: existingMembers.length > 0 });
  } catch (error) {
    console.error("Error checking member:", error);
    return Response.json({ error: "Failed to check member" }, { status: 500 });
  }
}
