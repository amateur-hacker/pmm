import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

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
