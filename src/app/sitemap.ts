import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { events } from "@/lib/db/schema";

export default async function sitemap() {
  const db = getDb();

  // Get all published events from the database
  const publishedEvents = await db
    .select({
      id: events.id,
      updatedAt: events.updatedAt,
    })
    .from(events)
    .where(eq(events.published, 1)) // Only published events
    .orderBy(desc(events.updatedAt));

  // Base site URL
  const siteUrl = process.env.SITE_URL || "https://purvanchalmitramahasabha.in";

  // Generate sitemap entries
  const eventEntries = publishedEvents.map((event) => ({
    url: `${siteUrl}/events/${event.id}`,
    lastModified: event.updatedAt,
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
      url: `${siteUrl}/membership`,
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
      url: `${siteUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  // Combine static pages and event entries
  return [...staticPages, ...eventEntries];
}
