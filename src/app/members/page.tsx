import { Metadata } from "next";
import { use } from "react";
import InfiniteMemberList from "@/components/members/infinite-member-list";

export const metadata: Metadata = {
  title: "Members - Purvanchal Mitra Mahasabha",
  description:
    "Meet our valued members of Purvanchal Mitra Mahasabha. Learn about the individuals who contribute to our community development initiatives, social welfare activities, and cultural preservation efforts.",
  keywords:
    "NGO members, Purvanchal Mitra Mahasabha members, community contributors",
  openGraph: {
    title: "Members - Purvanchal Mitra Mahasabha",
    description:
      "Meet our valued members of Purvanchal Mitra Mahasabha. Learn about the individuals who contribute to our community development initiatives, social welfare activities, and cultural preservation efforts.",
    type: "website",
    url: "https://purvanchalmitramahasabha.vercel.app/members",
  },
  twitter: {
    card: "summary_large_image",
    title: "Members - Purvanchal Mitra Mahasabha",
    description:
      "Meet our valued members of Purvanchal Mitra Mahasabha. Learn about the individuals who contribute to our community development initiatives, social welfare activities, and cultural preservation efforts.",
  },
  alternates: {
    canonical: "https://purvanchalmitramahasabha.vercel.app/members",
  },
};

// We need server component for metadata, so we'll fetch data on the server
// and pass it to a client component for the infinite scroll functionality
async function getMembers(page: number = 1, searchQuery: string = "") {
  // This is a placeholder until we have the actual API implementation
  // For now, we'll return an empty array and handle the client-side fetch in a child component
  try {
    let url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://purvanchalmitramahasabha.vercel.app"}/api/members?page=${page}&limit=10`;
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Don't cache for now
    });

    if (!response.ok) {
      throw new Error("Failed to fetch members");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching members:", error);
    return { items: [], hasMore: false };
  }
}

interface Member {
  id: string;
  name: string;
  address: string;
  mobile: string;
  email: string;
  dob: string;
  education: string;
  permanentAddress: string;
  image: string | null;
  donated: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export default async function PublicMembersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialData = await getMembers(1, resolvedSearchParams?.search || "");

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Our Members</h1>
          <p className="text-muted-foreground mt-2">
            Meet the individuals who contribute to Purvanchal Mitra Mahasabha
          </p>
        </div>

        <InfiniteMemberList initialData={initialData} />
      </div>
    </div>
  );
}

