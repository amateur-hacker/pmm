import type { Metadata } from "next";
import MembershipForm from "@/components/form/membership-form";

export const metadata: Metadata = {
  title: "Member Registration",
  description:
    "Join Purvanchal Mitra Mahasabha as a member. Fill out the registration form to become part of our community development initiatives in eastern India.",
  keywords:
    "NGO membership, Purvanchal Mitra Mahasabha registration, community development membership, social welfare organization",
};

export default function RegistrationPage() {
  return <MembershipForm />;
}
