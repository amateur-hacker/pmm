import { eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { MarkdownViewer } from "./MarkdownViewer";

async function getEvent(id: string) {
  try {
    const db = await getDb();
    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    return event[0] || null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  const event = await getEvent(id);

  if (!event) {
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    };
  }

  return {
    title: `${event.title} - Purvanchal Mitra Mahasabha Events`,
    description: event.excerpt || `${event.content.substring(0, 160)}...`,
    keywords: `${event.title}, Purvanchal Mitra Mahasabha, community development, social welfare`,
    openGraph: {
      title: event.title,
      description: event.excerpt || `${event.content.substring(0, 160)}...`,
      type: "article",
      url: `${process.env.SITE_URL || "https://purvanchalmitramahasabha.in"}/events/${event.id}`,
      images: event.image
        ? [
            {
              url: event.image,
              width: 1200,
              height: 630,
              alt: event.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.excerpt || `${event.content.substring(0, 160)}...`,
      images: event.image ? [event.image] : [],
    },
    alternates: {
      canonical: `${process.env.SITE_URL || "https://purvanchalmitramahasabha.in"}/events/${event.id}`,
    },
  };
}

export default async function EventDetailPage(props: Props) {
  const { id } = await props.params;
  const event = await getEvent(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button asChild variant="outline" className="cursor-pointer">
            <Link href="/events" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm">
          {event.image && (
            <div className="mb-6 overflow-hidden rounded-lg relative h-64">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span>By {event.author}</span>
              <span>•</span>
              <span>
                {new Date(event.createdAt!).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {event.published === 1 && (
                <Badge variant="secondary" className="ml-auto">
                  Published
                </Badge>
              )}
            </div>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <MarkdownViewer content={event.content} />
          </div>
        </div>
      </div>
    </div>
  );
}
