"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Eye,
  Edit,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

export default function BlogDetailPage(props: Props) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Use a useEffect to extract the id from async params
  useEffect(() => {
    const extractParams = async () => {
      const { id } = await props.params;
      const blogId = id;

      const fetchBlog = async () => {
        try {
          const token = localStorage.getItem("adminToken");
          if (!token) {
            router.push("/admin/login");
            return;
          }

          const response = await fetch(`/api/blogs/${blogId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              localStorage.removeItem("adminToken");
              router.push("/admin/login");
              return;
            }
            if (response.status === 404) {
              toast.error("Blog not found.");
              router.push("/admin");
              return;
            }
            throw new Error("Failed to fetch blog");
          }

          const data = await response.json();
          setBlog(data);
        } catch (error) {
          console.error("Error fetching blog:", error);
          toast.error("Failed to load blog details. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
    };

    extractParams();
  }, [props.params, router]);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return;
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!blog) {
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
              <CardTitle className="text-2xl">{blog.title}</CardTitle>
              <div>
                {blog.published === 1 ? (
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
                    <p className="font-medium">{blog.author}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Created Date
                    </h3>
                    <p className="font-medium">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {blog.publishedAt && (
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Published Date
                      </h3>
                      <p className="font-medium">
                        {new Date(blog.publishedAt).toLocaleDateString()}
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
                      {blog.excerpt || "No excerpt available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {blog.image && (
              <div className="mb-6 relative h-64">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Featured Image
                </h3>
                <Image
                  src={blog.image}
                  alt="Blog featured img"
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
                <Markdown remarkPlugins={[remarkGfm]}>{blog.content}</Markdown>
              </div>
            </div>

            <div className="flex space-x-4 mt-8 pt-6 border-t">
              <Button asChild className="cursor-pointer">
                <Link
                  href={`/blogs/${blog.id}`}
                  target="_blank"
                  className="flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View on Site
                </Link>
              </Button>
              <Button asChild className="cursor-pointer">
                <Link
                  href={`/admin/blogs/${blog.id}/edit`}
                  className="flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Blog
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

