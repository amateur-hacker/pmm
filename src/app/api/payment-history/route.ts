import { desc, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { paymentHistory } from "@/lib/db/schema";

const db = getDb();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, orderId, amount, paymentStatus, paymentMethod } = body;

    // Validate required fields
    if (!memberId || !orderId || !amount || !paymentStatus) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const [newPayment] = await db
      .insert(paymentHistory)
      .values({
        memberId: memberId,
        orderId: orderId,
        amount: amount.toString(),
        paymentStatus: paymentStatus,
        paymentMethod: paymentMethod || null,
      })
      .returning();

    return Response.json(newPayment, { status: 201 });
  } catch (error) {
    console.error("Error storing payment history:", error);
    return Response.json(
      { error: "Failed to store payment history" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");

    if (!memberId) {
      return Response.json({ error: "memberId is required" }, { status: 400 });
    }

    const payments = await db
      .select()
      .from(paymentHistory)
      .where(eq(paymentHistory.memberId, memberId))
      .orderBy(desc(paymentHistory.createdAt));

    return Response.json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return Response.json(
      { error: "Failed to fetch payment history" },
      { status: 500 },
    );
  }
}
