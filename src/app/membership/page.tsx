"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import MembershipCard from "@/components/MembershipCard";
import { Card, CardContent } from "@/components/ui/card";
import type { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";

interface PaymentRecord {
  id: string;
  transactionId: string;
  amount: string;
  currency: string;
  paymentDate: string;
  paymentStatus: string;
  paymentMethod: string | null;
}

interface PaymentWithMember extends PaymentRecord {
  member: {
    id: string;
    name: string;
    address: string;
    mobile: string;
    dob: string;
    image: string | null;
  };
}

interface MemberData {
  id: string;
  name: string;
  address: string;
  mobile: string;
  dob: string;
  image: string | null;
}

export default function MembershipPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [paymentsByMember, setPaymentsByMember] = useState<
    Record<string, PaymentRecord[]>
  >({});

  const { data: session, isPending } = authClient.useSession();
  const sessionUser =
    (session?.user as typeof auth.$Infer.Session.user) ?? null;

  useEffect(() => {
    if (!isPending && sessionUser?.id) {
      loadMembership(sessionUser.id);
    } else if (!isPending && !sessionUser) {
      setIsLoading(false);
    }
  }, [sessionUser, isPending]);

  const loadMembership = async (userId: string) => {
    try {
      setIsLoading(true);

      const paymentResponse = await fetch(
        `/api/payment-history?userId=${encodeURIComponent(userId)}`,
      );

      if (!paymentResponse.ok) {
        setIsLoading(false);
        return;
      }

      const { payments: paymentsWithMember } =
        (await paymentResponse.json()) as {
          payments: PaymentWithMember[];
        };

      if (paymentsWithMember.length === 0) {
        setIsLoading(false);
        return;
      }

      const seenMembers = new Set<string>();
      const membersList: MemberData[] = [];
      const paymentsMap: Record<string, PaymentRecord[]> = {};
      const allPayments: PaymentRecord[] = [];

      for (const pm of paymentsWithMember) {
        allPayments.push(pm);

        if (!paymentsMap[pm.member.id]) {
          paymentsMap[pm.member.id] = [];
        }
        paymentsMap[pm.member.id].push(pm);

        if (!seenMembers.has(pm.member.id)) {
          seenMembers.add(pm.member.id);
          membersList.push(pm.member);
        }
      }

      setMembers(membersList);
      setPaymentsByMember(paymentsMap);
      setPayments(allPayments);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load membership data. Please try again.");
      setPayments([]);
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
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <div className="h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2" />
            </div>
            <h1 className="mb-2 font-bold text-2xl">Loading...</h1>
            <p className="text-muted-foreground">Checking your session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-bold text-3xl">My Memberships</h1>
          <p className="text-muted-foreground">
            View your membership cards and payment history
          </p>
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
            </div>
            <p className="text-muted-foreground">Loading membership data...</p>
          </div>
        ) : sessionUser ? (
          <div className="space-y-6">
            <h2 className="font-semibold text-2xl">Membership Card</h2>

            {members.length > 0 &&
              members.map((member) => {
                const memberPayments = paymentsByMember[member.id] || [];
                return (
                  <div className="mb-8" key={member.id}>
                    <h3 className="mb-4 font-semibold text-xl">
                      {member.name}
                    </h3>
                    {memberPayments.length > 0 ? (
                      <div className="grid gap-6">
                        {memberPayments.map((payment) => (
                          <div
                            className="flex flex-col items-center overflow-x-auto"
                            key={payment.id}
                          >
                            <MembershipCard
                              address={member.address}
                              dob={member.dob}
                              image={member.image}
                              mobile={member.mobile}
                              name={member.name}
                              validUntil={getValidUntil(payment.paymentDate)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center">
                          <p className="text-muted-foreground">
                            No payment records found.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                );
              })}

            <h3 className="mt-8 font-semibold text-xl">Payment History</h3>
            {payments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
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
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">
                            Transaction ID: {payment.transactionId}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Date:{" "}
                            {new Date(payment.paymentDate).toLocaleDateString(
                              "en-US",
                            )}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Method: {payment.paymentMethod || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-2xl text-green-600">
                            ₹{payment.amount}
                          </p>
                          <p className="text-muted-foreground text-sm">
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
          <Card className="mx-auto w-full max-w-md text-center">
            <CardContent className="py-12">
              <p className="text-muted-foreground">
                Please log in to view your membership.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
