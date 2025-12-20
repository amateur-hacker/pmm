import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the webhook data for debugging
    console.log("Payment webhook received:", body);

    // Verify the payment status
    if (body.order_status === "PAID") {
      // Payment successful - update member record
      console.log(`Payment successful for order: ${body.order_id}`);

      // Here you could update the database to mark the payment as completed
      // For now, just log it
    } else {
      console.log(`Payment failed or pending for order: ${body.order_id}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
