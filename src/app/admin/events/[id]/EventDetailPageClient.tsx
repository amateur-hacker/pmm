"use client";

import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  FileText,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

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

type Props = {
  params: Promise<{ id: string }>;
};

export function EventDetailPageClient(props: Props) {
  const [event, setEvent] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Use a useEffect to extract the id from async params
  useEffect(() => {
    const extractParams = async () => {
      const { id } = await props.params;
      const eventId = id;

      const fetchBlog = async () => {
        try {
          const response = await fetch(`/api/events/${eventId}`);

          if (!response.ok) {
            throw new Error("Failed to fetch event");
          }

          const data = await response.json();
          setEvent(data);
        } catch (error) {
          console.error("Error fetching event:", error);
          toast.error("Failed to load event details. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
    };

    extractParams();
  }, [props.params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Blog not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button asChild className="cursor-pointer">
            <Link href="/admin" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <div>
                {event.published === 1 ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="h-3 w-3 mr-1" />
                    Draft
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Author
                    </h3>
                    <p className="font-medium">{event.author}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Created Date
                    </h3>
                    <p className="font-medium">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {event.publishedAt && (
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Published Date
                      </h3>
                      <p className="font-medium">
                        {new Date(event.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-muted-foreground mr-3 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Excerpt
                    </h3>
                    <p className="font-medium">
                      {event.excerpt || "No excerpt available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {event.image && (
              <div className="mb-6 relative h-64">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Featured Image
                </h3>
                <Image
                  src={event.image}
                  alt="Event featured img"
                  fill
                  className="object-cover rounded-md border"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Content
              </h3>
              <div className="prose max-w-none dark:prose-invert">
                <Markdown remarkPlugins={[remarkGfm]}>{event.content}</Markdown>
              </div>
            </div>

            <div className="flex space-x-4 mt-8 pt-6 border-t">
              <Button asChild className="cursor-pointer">
                <Link
                  href={`/events/${event.id}`}
                  target="_blank"
                  className="flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View on Site
                </Link>
              </Button>
              <Button asChild className="cursor-pointer">
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
