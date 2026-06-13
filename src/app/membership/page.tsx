"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import MembershipCard from "@/components/MembershipCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

interface PaymentRecord {
  id: string;
  orderId: string;
  amount: string;
  currency: string;
  paymentDate: string;
  paymentStatus: string;
  paymentMethod: string | null;
}

interface MemberData {
  id: string;
  name: string;
  address: string;
  mobile: string;
  email: string;
  dob: string;
  image: string | null;
  membershipStartDate: string;
}

export default function MembershipPage() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [member, setMember] = useState<MemberData | null>(null);

  const { data: session, isPending } = authClient.useSession();
  const sessionUser =
    (session?.user as typeof auth.$Infer.Session.user) ?? null;

  useEffect(() => {
    if (!isPending && sessionUser?.email) {
      loadMembership(sessionUser.email);
    } else if (!isPending && !sessionUser) {
      setIsLoading(false);
    }
  }, [sessionUser, isPending]);

  const loadMembership = async (userEmail: string) => {
    try {
      setIsLoading(true);

      const memberResponse = await fetch(
        `/api/members?email=${encodeURIComponent(userEmail)}`,
      );

      if (!memberResponse.ok) {
        setIsLoading(false);
        return;
      }

      const members = await memberResponse.json();

      if (members.length === 0) {
        setIsLoading(false);
        return;
      }

      const memberData = members[0];
      setMember(memberData);

      const paymentResponse = await fetch(
        `/api/payment-history?memberId=${memberData.id}`,
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to fetch payment history");
      }

      const paymentData = await paymentResponse.json();
      setPayments(paymentData);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load membership data. Please try again.");
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const memberResponse = await fetch(
        `/api/members?email=${encodeURIComponent(email)}`,
      );

      if (!memberResponse.ok) {
        throw new Error("Member not found");
      }

      const members = await memberResponse.json();

      if (members.length === 0) {
        toast.error("No member found with the provided details");
        setIsLoading(false);
        return;
      }

      const memberData = members[0];
      setMember(memberData);

      const paymentResponse = await fetch(
        `/api/payment-history?memberId=${memberData.id}`,
      );

      if (!paymentResponse.ok) {
        throw new Error("Failed to fetch payment history");
      }

      const paymentData = await paymentResponse.json();
      setPayments(paymentData);
      toast.success("Membership data loaded successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load membership data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getValidUntil = (paymentDate: string) => {
    const date = new Date(paymentDate);
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString();
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Loading...</h1>
            <p className="text-muted-foreground">Checking your session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 overflow-x-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">My Membership</h1>
          <p className="text-muted-foreground">
            View your membership cards and payment history
          </p>
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
            <p className="text-muted-foreground">Loading membership data...</p>
          </div>
        ) : sessionUser ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Membership Card</h2>

            {member && (
              <div className="mb-8">
                {payments.length > 0 ? (
                  <div className="grid gap-6">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex flex-col items-center overflow-x-auto"
                      >
                        <MembershipCard
                          name={member.name}
                          address={member.address}
                          mobile={member.mobile}
                          dob={member.dob}
                          image={member.image}
                          validUntil={getValidUntil(payment.paymentDate)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">
                        No payment records found.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <h3 className="text-xl font-semibold mt-8">Payment History</h3>
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
                            Transaction ID: {payment.orderId}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date:{" "}
                            {new Date(payment.paymentDate).toLocaleDateString("en-US")}
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
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Find Your Membership</CardTitle>
              <p className="text-sm text-muted-foreground">
                Please enter your details to view your membership.
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
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Find My Membership"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
