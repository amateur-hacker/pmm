import { NextRequest, NextResponse } from "next/server";
import cashfree from "@/lib/cashfree";

type VerifyPaymentBody = {
  order_id: string;
};

export async function POST(request: NextRequest) {
  try {
    const { order_id } = (await request.json()) as VerifyPaymentBody;

    if (!order_id) {
      return NextResponse.json(
        { error: "order_id is required" },
        { status: 400 },
      );
    }

    // Fetch order details from Cashfree
    const response = await cashfree.PGFetchOrder(order_id);

    if (!response?.data) {
      throw new Error("Unable to fetch order from Cashfree");
    }

    const order = response.data;

    /**
     * order_status values:
     * - PAID
     * - ACTIVE
     * - PENDING
     * - EXPIRED
     * - CANCELLED
     */
    return NextResponse.json({
      order_id: order.order_id,
      order_status: order.order_status,
      order_amount: order.order_amount,
      payment_status: order.order_status === "PAID" ? "SUCCESS" : "NOT_SUCCESS",
      raw: order, // optional: remove in prod if you want
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
