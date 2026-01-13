"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import type { auth } from "@/lib/auth";

interface PaymentRecord {
  id: string;
  orderId: string;
  amount: string;
  currency: string;
  paymentDate: string;
  paymentStatus: string;
  paymentMethod: string | null;
}

export default function PaymentHistoryPage() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  const { data: session, isPending, error, refetch } = authClient.useSession();
  const sessionUser =
    (session?.user as typeof auth.$Infer.Session.user) ?? null;

  // Automatically load payment history for logged-in users
  // biome-ignore lint/correctness/useExhaustiveDependencies: <_>
  useEffect(() => {
    if (!isPending && sessionUser?.email) {
      loadPaymentHistory(sessionUser.email);
    } else if (!isPending && !sessionUser) {
      setIsLoading(false);
    }
  }, [sessionUser, isPending]);

  const loadPaymentHistory = async (userEmail: string) => {
    try {
      setIsLoading(true);

      // First, find member by email
      const memberResponse = await fetch(
        `/api/members?email=${encodeURIComponent(userEmail)}`,
      );

      if (!memberResponse.ok) {
        // If member not found for logged-in user, show empty state
        setIsLoading(false);
        return;
      }

      const members = await memberResponse.json();

      if (members.length === 0) {
        setIsLoading(false);
        return;
      }

      const member = members[0];

      // Now fetch payment history for this member
      const paymentResponse = await fetch(
        `/api/payment-history?memberId=${member.id}`,
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to fetch payment history");
      }

      const paymentData = await paymentResponse.json();
      setPayments(paymentData);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load payment history. Please try again.");
      // For logged-in users, show empty state instead of manual lookup
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, find member by email/mobile
      const memberResponse = await fetch(
        `/api/members?email=${encodeURIComponent(email)}`,
      );

      if (!memberResponse.ok) {
        throw new Error("Member not found");
      }

      const members = await memberResponse.json();

      if (members.length === 0) {
        toast.error("No member found with the provided details");
        return;
      }

      const member = members[0];

      // Now fetch payment history for this member
      const paymentResponse = await fetch(
        `/api/payment-history?memberId=${member.id}`,
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to fetch payment history");
      }

      const paymentData = await paymentResponse.json();
      setPayments(paymentData);
      toast.success("Payment history loaded successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load payment history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Loading...</h1>
            <p className="text-muted-foreground">Checking your session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Payment History</h1>
          <p className="text-muted-foreground">
            View your donation and membership payment history
          </p>
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
            <p className="text-muted-foreground">Loading payment history...</p>
          </div>
        ) : sessionUser ? (
          // Logged-in users always see payment history section
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Your Payment History</h2>

            {payments.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    No payment records found.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            Order ID: {payment.orderId}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date:{" "}
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Method: {payment.paymentMethod || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ₹{payment.amount}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Status: {payment.paymentStatus}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Non-logged-in users see manual lookup form
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Find Your Payment History</CardTitle>
              <p className="text-sm text-muted-foreground">
                Please enter your details to view your payment history.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLookup} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Searching..." : "Find My Payments"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
