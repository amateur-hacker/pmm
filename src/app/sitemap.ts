import { getDb } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function sitemap() {
  const db = getDb();

  // Get all published blogs from the database
  const publishedBlogs = await db
    .select({
      id: blogs.id,
      updatedAt: blogs.updatedAt,
    })
    .from(blogs)
    .where(eq(blogs.published, 1)) // Only published blogs
    .orderBy(desc(blogs.updatedAt));

  // Base site URL
  const siteUrl =
    process.env.SITE_URL || "https://purvanchalmitramahasabha.vercel.app";

  // Generate sitemap entries
  const blogEntries = publishedBlogs.map((blog) => ({
    url: `${siteUrl}/blogs/${blog.id}`,
    lastModified: blog.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Add static pages
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/register-member`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/members`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  // Combine static pages and blog entries
  return [...staticPages, ...blogEntries];
}

