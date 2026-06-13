import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Membership",
  description:
    "View your Purvanchal Mitra Mahasabha membership card, payment history, and manage your membership details.",
};

export default function MembershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
