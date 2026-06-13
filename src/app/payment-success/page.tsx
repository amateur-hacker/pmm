import { Suspense } from "react";

import type { Metadata } from "next";

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
  searchParams: Promise<{ transaction_id?: string }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { transaction_id } = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessClient transaction_id={transaction_id} />
    </Suspense>
  );
}
