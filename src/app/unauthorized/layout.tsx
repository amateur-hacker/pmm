import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied",
  description:
    "You do not have permission to access this resource. Contact your administrator if you believe this is an error.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnauthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
