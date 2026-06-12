import { del } from "@vercel/blob";
import { eq, or } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { events, members } from "@/lib/db/schema";

const db = getDb();

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const inMembers = await db
      .select({ id: members.id })
      .from(members)
      .where(eq(members.image, url))
      .limit(1);

    const inEvents = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.image, url))
      .limit(1);

    if (inMembers.length === 0 && inEvents.length === 0) {
      await del(url);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
