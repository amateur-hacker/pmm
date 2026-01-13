import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

interface PaymentSuccessPageProps {
  searchParams: Promise<{ order_id?: string }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessClient order_id={resolvedSearchParams.order_id} />
    </Suspense>
  );
}
