import type { NextRequest } from "next/server";

import { desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { members, paymentHistory } from "@/lib/db/schema";

const db = getDb();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      memberId,
      userId,
      transactionId,
      amount,
      paymentStatus,
      paymentMethod,
    } = body;

    // Validate required fields
    if (!memberId || !transactionId || !amount || !paymentStatus) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const [newPayment] = await db
      .insert(paymentHistory)
      .values({
        memberId: memberId,
        userId: userId || null,
        transactionId: transactionId,
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
    const userId = searchParams.get("userId");

    if (!memberId && !userId) {
      return Response.json(
        { error: "memberId or userId is required" },
        { status: 400 },
      );
    }

    if (userId) {
      const rows = await db
        .select()
        .from(paymentHistory)
        .where(eq(paymentHistory.userId, userId))
        .innerJoin(members, eq(paymentHistory.memberId, members.id))
        .orderBy(desc(paymentHistory.createdAt));

      const paymentsWithMember = rows.map((row) => ({
        id: row.payment_history.id,
        transactionId: row.payment_history.transactionId,
        amount: row.payment_history.amount,
        paymentDate: row.payment_history.paymentDate,
        paymentStatus: row.payment_history.paymentStatus,
        paymentMethod: row.payment_history.paymentMethod,
        member: {
          id: row.members.id,
          name: row.members.name,
          address: row.members.address,
          mobile: row.members.mobile,
          dob: row.members.dob,
          image: row.members.image,
          email: row.members.email,
          membershipStartDate: row.members.membershipStartDate,
        },
      }));

      return Response.json({ payments: paymentsWithMember });
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
