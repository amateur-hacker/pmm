import { NextRequest, NextResponse } from "next/server";
import cashfree from "@/lib/cashfree";
import crypto from "node:crypto";

type CreateOrderBody = {
  amount: string;
  customerDetails: {
    customer_id: string;
    customer_email: string;
    customer_phone: string;
    customer_name: string;
  };
};

const generateOrderId = () => {
  const uniqueId = crypto.randomBytes(16).toString("hex");

  const hash = crypto.createHash("sha256");
  hash.update(uniqueId);
  const orderId = hash.digest("hex");
  return `order_${orderId.slice(0, 6)}`;
};
export async function POST(request: NextRequest) {
  try {
    const { amount, customerDetails } =
      (await request.json()) as CreateOrderBody;

    if (!amount || !customerDetails) {
      return NextResponse.json(
        { error: "Amount and customer details are required" },
        { status: 400 },
      );
    }

    console.log(amount, customerDetails);

    const isProduction = process.env.NODE_ENV === "production";
    const orderId = generateOrderId();

    // Create order using Cashfree SDK
    const orderData = {
      order_id: orderId,
      order_amount: parseFloat(amount),
      order_currency: "INR",
      customer_details: {
        customer_id: customerDetails.customer_id,
        customer_email: customerDetails.customer_email,
        customer_phone: customerDetails.customer_phone,
        customer_name: customerDetails.customer_name,
      },
      // order_meta: {
      //   // return_url: `${process.env.SITE_URL || "https://purvanchalmitramahasabha.in"}/payment-success?order_id={order_id}`,
      //   return_url:
      //     "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}",
      //   // return_url:
      //   //   "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}",
      //   // notify_url: `${process.env.SITE_URL || "https://purvanchalmitramahasabha.in"}/api/payment-webhook`,
      // },
    };
    const response = await cashfree.PGCreateOrder(orderData);

    console.log(response);
    if (!response || !response.data) {
      throw new Error("Failed to create payment order");
    }

    // For hosted checkout, construct the payment link using payment_session_id
    // const baseUrl = isProduction
    //   ? "https://www.cashfree.com/checkout/"
    //   : "https://sandbox.cashfree.com/checkout/";
    // const paymentLink = `${baseUrl}${response.data.payment_session_id}`;
    //
    // console.log("Payment link generated:", paymentLink);

    return NextResponse.json({
      order_id: response.data.order_id,
      payment_session_id: response.data.payment_session_id,
      // payment_link: paymentLink,
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 },
    );
  }
}
