"use client";

import { Suspense, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

interface PaymentSuccessPageProps {
  searchParams: { order_id?: string };
}

function PaymentSuccessContent({ order_id }: { order_id?: string }) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [memberSaved, setMemberSaved] = useState(false);

  useEffect(() => {
    if (!order_id) {
      redirect("/");
      return;
    }

    // Check if there's pending member data to save
    const pendingData = localStorage.getItem("pendingMemberData");
    if (pendingData) {
      try {
        const memberData = JSON.parse(pendingData);

        // Save member data now that payment is successful
        fetch("/api/register-member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memberData),
        })
          .then((response) => {
            if (response.ok) {
              setMemberSaved(true);
              localStorage.removeItem("pendingMemberData"); // Clean up
              toast.success("Member registration completed successfully!");
            } else {
              throw new Error("Failed to save member data");
            }
          })
          .catch((error) => {
            console.error("Error saving member data:", error);
            toast.error(
              "Payment successful, but there was an issue saving your registration. Please contact support.",
            );
          })
          .finally(() => {
            setIsProcessing(false);
          });
      } catch (error) {
        console.error("Error parsing pending member data:", error);
        setIsProcessing(false);
      }
    } else {
      setIsProcessing(false);
    }
  }, [order_id]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background py-12">
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

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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

          <div className="bg-card p-6 rounded-lg border mb-6">
            <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
            <p className="text-sm text-muted-foreground">
              Order ID: <span className="font-mono">{order_id}</span>
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="/"
              className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent order_id={searchParams.order_id} />
    </Suspense>
  );
}
