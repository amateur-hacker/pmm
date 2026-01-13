import type { Metadata } from "next";
import FormPageClient from "@/components/form/form-client";

export const metadata: Metadata = {
  title: "Member Registration - Purvanchal Mitra Mahasabha",
  description:
    "Join Purvanchal Mitra Mahasabha as a member. Fill out the registration form to become part of our community development initiatives in eastern India.",
  keywords:
    "NGO membership, Purvanchal Mitra Mahasabha registration, community development membership, social welfare organization",
  openGraph: {
    title: "NGO Membership - Purvanchal Mitra Mahasabha",
    description:
      "Become a member of Purvanchal Mitra Mahasabha. Join our NGO to support community development initiatives in eastern India through membership and donations.",
    type: "website",
    url: `${process.env.SITE_URL || "https://purvanchalmitramahasabha.in"}/membership`,
  },
  twitter: {
    card: "summary_large_image",
    title: "NGO Membership - Purvanchal Mitra Mahasabha",
    description:
      "Become a member of Purvanchal Mitra Mahasabha. Join our NGO to support community development initiatives in eastern India through membership and donations.",
  },
  alternates: {
    canonical: `${process.env.SITE_URL || "https://purvanchalmitramahasabha.in"}/membership`,
  },
};

// Server component that returns the client component
export default function FormPage() {
  return <FormPageClient />;
}
