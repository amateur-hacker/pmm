import { Metadata } from 'next';
import FormPageClient from '@/components/form/form-client';

export const metadata: Metadata = {
  title: "Member Registration - Purvanchal Mitra Mahasabha",
  description: "Join Purvanchal Mitra Mahasabha as a member. Fill out the registration form to become part of our community development initiatives in eastern India.",
  keywords: "NGO membership, Purvanchal Mitra Mahasabha registration, community development membership, social welfare organization",
  openGraph: {
    title: "Member Registration - Purvanchal Mitra Mahasabha",
    description: "Join Purvanchal Mitra Mahasabha as a member. Fill out the registration form to become part of our community development initiatives in eastern India.",
    type: "website",
    url: "https://purvanchalmitramahasabha.vercel.app/form",
  },
  twitter: {
    card: "summary_large_image",
    title: "Member Registration - Purvanchal Mitra Mahasabha",
    description: "Join Purvanchal Mitra Mahasabha as a member. Fill out the registration form to become part of our community development initiatives in eastern India.",
  },
  alternates: {
    canonical: "https://purvanchalmitramahasabha.vercel.app/form",
  }
};

// Server component that returns the client component
export default function FormPage() {
  return (
    <FormPageClient />
  );
}
