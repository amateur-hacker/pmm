import { Metadata } from "next";
import { use } from "react";
import InfiniteBlogList from "@/components/blogs/infinite-blog-list";

export const metadata: Metadata = {
  title: "Blog - Purvanchal Mitra Mahasabha",
  description:
    "Read insights, updates, and stories from Purvanchal Mitra Mahasabha. Learn about our community development initiatives, social welfare activities, and cultural preservation efforts.",
  keywords:
    "NGO blog, Purvanchal Mitra Mahasabha blog, community development articles, social welfare updates, cultural preservation",
  openGraph: {
    title: "Blog - Purvanchal Mitra Mahasabha",
    description:
      "Read insights, updates, and stories from Purvanchal Mitra Mahasabha. Learn about our community development initiatives, social welfare activities, and cultural preservation efforts.",
    type: "website",
    url: "https://purvanchalmitramahasabha.vercel.app/blogs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Purvanchal Mitra Mahasabha",
    description:
      "Read insights, updates, and stories from Purvanchal Mitra Mahasabha. Learn about our community development initiatives, social welfare activities, and cultural preservation efforts.",
  },
  alternates: {
    canonical: "https://purvanchalmitramahasabha.vercel.app/blogs",
  },
};

// We need server component for metadata, so we'll fetch data on the server
// and pass it to a client component for the infinite scroll functionality
async function getBlogs(page: number = 1, searchQuery: string = "") {
  // This is a placeholder until we have the actual API implementation
  // For now, we'll return an empty array and handle the client-side fetch in a child component
  try {
    let url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://purvanchalmitramahasabha.vercel.app"}/api/blogs?page=${page}&limit=10`;
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
      throw new Error("Failed to fetch blogs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { items: [], hasMore: false };
  }
}

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author: string;
  published: number; // 0 for draft, 1 for published
  publishedAt: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export default async function PublicBlogsPage({
  searchParams,
}: {
  searchParams?: Promise<{
    search?: string;
  }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialData = await getBlogs(1, resolvedSearchParams?.search || "");

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Our Blog</h1>
          <p className="text-muted-foreground mt-2">
            Insights, updates, and stories from Purvanchal Mitra Mahasabha
          </p>
        </div>

        <InfiniteBlogList initialData={initialData} />
      </div>
    </div>
  );
}
