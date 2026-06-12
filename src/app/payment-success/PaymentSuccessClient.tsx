"use client";

import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PaymentSuccessClientProps {
  order_id?: string;
}

export default function PaymentSuccessClient({
  order_id,
}: PaymentSuccessClientProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [memberSaved, setMemberSaved] = useState(false);

  useEffect(() => {
    if (!order_id) {
      redirect("/");
    }

    const processPaymentAndRegistration = async () => {
      try {
        // First, verify the payment status
        const verifyResponse = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id }),
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

        // Payment verified successfully, now check for pending member data
        const pendingData = localStorage.getItem("pendingMemberData");
        if (pendingData) {
          const memberData = JSON.parse(pendingData);

          // Save member data now that payment is verified successful
          const registerResponse = await fetch("/api/membership", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(memberData),
          });

          if (registerResponse.ok) {
            const newMember = await registerResponse.json();

            // Store payment history
            const paymentHistoryResponse = await fetch("/api/payment-history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                memberId: newMember.id,
                orderId: order_id,
                amount: verifyData.order_amount,
                paymentStatus: verifyData.order_status,
                paymentMethod: "Cashfree", // You can enhance this based on payment data
              }),
            });

            if (!paymentHistoryResponse.ok) {
              console.error("Failed to store payment history");
              // Don't throw error here, member is saved successfully
            }

            setMemberSaved(true);
            localStorage.removeItem("pendingMemberData"); // Clean up
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
  }, [order_id]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center border rounded-lg p-8 bg-card">
            <div className="mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Error cross"
                >
                  <title>Error Icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-red-600 mb-2">
                Something Went Wrong
              </h1>
              <p className="text-muted-foreground">{errorMessage}</p>
            </div>

            <Button className="cursor-pointer" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center border rounded-lg p-8 bg-card">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Success checkmark"
              >
                <title>Tick Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground">
              Thank you for your generous donation. Your support helps us
              continue our mission.
            </p>
            {memberSaved && (
              <p className="text-green-600 font-medium mt-2">
                ✓ Member registration completed successfully!
              </p>
            )}
          </div>

          <div className="bg-muted/50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
            <p className="text-sm text-muted-foreground">
              Order ID: <span className="font-mono">{order_id}</span>
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button className="cursor-pointer" asChild>
              <Link href="/">Return to Home</Link>
            </Button>
            <Button variant="outline" className="cursor-pointer" asChild>
              <Link href="/payment-history">Payment History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
