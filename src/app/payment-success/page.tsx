import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export const metadata: Metadata = {
  title: "Payment Success",
  description:
    "Your payment to Purvanchal Mitra Mahasabha was successful. Thank you for your contribution to community development and social welfare.",
  robots: {
    index: false,
    follow: false,
  },
};

interface PaymentSuccessPageProps {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { order_id } = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessClient order_id={order_id} />
    </Suspense>
  );
}
