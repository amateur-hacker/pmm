"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { redirect } from "next/navigation";

import { toast } from "sonner";

import MembershipCard from "@/components/MembershipCard";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface PaymentSuccessClientProps {
  transaction_id?: string;
}

interface MemberData {
  name: string;
  address: string;
  mobile: string;
  email?: string;
  dob: string;
  education: string;
  permanentAddress: string;
  image?: string | null;
  type?: string;
  donated?: number;
}

export default function PaymentSuccessClient({
  transaction_id,
}: PaymentSuccessClientProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [memberSaved, setMemberSaved] = useState(false);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => {
    if (!transaction_id) {
      redirect("/");
    }

    const processPaymentAndRegistration = async () => {
      try {
        const { data: currentSession } = await authClient.getSession();
        const currentUserId = currentSession?.user?.id || null;

        const verifyResponse = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transaction_id }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok || verifyData.order_status !== "PAID") {
          setErrorMessage(
            "Payment verification failed. Please contact support if amount was deducted.",
          );
          setHasError(true);
          setIsProcessing(false);
          return;
        }

        const pendingData = localStorage.getItem("pendingMemberData");
        if (pendingData) {
          const data: MemberData = JSON.parse(pendingData);
          setMemberData(data);

          const registerResponse = await fetch("/api/membership", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (registerResponse.ok) {
            const newMember = await registerResponse.json();

            const paymentHistoryResponse = await fetch("/api/payment-history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                memberId: newMember.id,
                userId: currentUserId,
                transactionId: transaction_id,
                amount: verifyData.order_amount,
                paymentStatus: verifyData.order_status,
                paymentMethod: "Cashfree",
              }),
            });

            if (!paymentHistoryResponse.ok) {
              console.error("Failed to store payment history");
            }

            const validDate = new Date();
            validDate.setFullYear(validDate.getFullYear() + 1);
            setValidUntil(validDate.toISOString());

            setMemberSaved(true);
            setMemberData({
              ...data,
              name: newMember.name,
              address: newMember.address,
              mobile: newMember.mobile,
              email: newMember.email,
              dob: newMember.dob,
              image: newMember.image,
            });
            localStorage.removeItem("pendingMemberData");
            toast.success("Member registration completed successfully!");
          } else {
            throw new Error("Failed to save member data");
          }
        }
      } catch (error) {
        console.error("Error processing payment and registration:", error);
        setErrorMessage(
          "Payment successful, but there was an issue saving your registration. Please contact support.",
        );
        setHasError(true);
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentAndRegistration();
  }, [transaction_id]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <div className="h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2" />
            </div>
            <h1 className="mb-2 font-bold text-2xl">
              Processing Your Registration...
            </h1>
            <p className="text-muted-foreground">
              Please wait while we complete your member registration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="rounded-lg border bg-card p-8 text-center">
            <div className="mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  aria-label="Error cross"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Error Icon</title>
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <h1 className="mb-2 font-bold text-3xl text-red-600">
                Something Went Wrong
              </h1>
              <p className="text-muted-foreground">{errorMessage}</p>
            </div>

            <Button asChild className="cursor-pointer">
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="rounded-lg border bg-card p-8 text-center">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                aria-label="Success checkmark"
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Tick Icon</title>
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <h1 className="mb-2 font-bold text-3xl text-green-600">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your generous donation. Your support helps us
              continue our mission.
            </p>
            {memberSaved && (
              <p className="mt-2 font-medium text-green-600">
                ✓ Member registration completed successfully!
              </p>
            )}
          </div>

          <div className="mb-6 rounded-lg bg-muted/50 p-6">
            <h2 className="mb-2 font-semibold text-lg">Payment Details</h2>
            <p className="text-muted-foreground text-sm">
              Transaction ID:{" "}
              <span className="font-mono">{transaction_id}</span>
            </p>
          </div>

          {/* Membership Card */}
          {memberSaved && memberData && validUntil && (
            <div className="mb-6 flex flex-col items-center">
              <h2 className="mb-4 font-semibold text-lg">
                Your Membership Card
              </h2>
              <MembershipCard
                address={memberData.address}
                dob={memberData.dob}
                image={memberData.image}
                mobile={memberData.mobile}
                name={memberData.name}
                validUntil={validUntil}
              />
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <Button asChild className="cursor-pointer">
              <Link href="/">Return to Home</Link>
            </Button>
            <Button asChild className="cursor-pointer" variant="outline">
              <Link href="/membership">View My Membership</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
