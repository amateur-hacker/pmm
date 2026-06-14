import crypto from "node:crypto";

import { type NextRequest, NextResponse } from "next/server";

import cashfree from "@/lib/cashfree";

const generateLinkId = () => {
  const uniqueId = crypto.randomBytes(8).toString("hex");
  return `donate_${uniqueId}`;
};

export async function POST(request: NextRequest) {
  try {
    const { amount } = (await request.json()) as { amount: number };

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Amount must be at least ₹1" },
        { status: 400 },
      );
    }

    const linkId = generateLinkId();

    const response = await cashfree.PGCreateLink({
      link_id: linkId,
      link_amount: amount,
      link_currency: "INR",
      link_purpose: "Donation to Purvanchal Mitra Mahasabha",
      customer_details: {
        customer_phone: "8000000000",
        customer_email: "support@purvanchalmitramahasabha.in",
        customer_name: "Guest Donor",
      },
    });

    if (!response?.data?.link_url) {
      throw new Error("No payment link in response");
    }

    return NextResponse.json({
      link_id: response.data.link_id,
      link_url: response.data.link_url,
      link_qrcode: response.data.link_qrcode,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Donation link creation error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
