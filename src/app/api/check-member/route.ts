import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { members } from "@/lib/db/schema";

const db = getDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return Response.json(
      { error: "Name parameter is required" },
      { status: 400 },
    );
  }

  try {
    const existingMembers = await db
      .select()
      .from(members)
      .where(eq(members.name, name));

    return Response.json({ exists: existingMembers.length > 0 });
  } catch (error) {
    console.error("Error checking member:", error);
    return Response.json({ error: "Failed to check member" }, { status: 500 });
  }
}
