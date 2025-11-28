"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, UserIcon } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

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

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastBlogRef = useRef<HTMLDivElement>(null);

  // Fetch initial blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`/api/blogs?page=${page}&limit=10`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        setBlogs((prev) => [...prev, ...data.items]);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchBlogs();
  }, [page]);

  // Observer to detect when we reach the last blog
  const lastBlogElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setIsLoadingMore(true);
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, isLoadingMore, hasMore],
  );

  // Reset page when component unmounts
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Our Blog</h1>
          <p className="text-muted-foreground mt-2">
            Insights, updates, and stories from Purvanchal Mitra Mahasabha
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No blogs available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => {
              const isLastItem = blogs.length === index + 1;

              return (
                <div
                  key={`${blog.id}-${index}`}
                  ref={isLastItem ? lastBlogElementRef : null}
                  className="overflow-hidden"
                >
                  <BlogCard blog={blog} />
                </div>
              );
            })}
          </div>
        )}

        {isLoadingMore && (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Loading more blogs...</p>
          </div>
        )}

        {!hasMore && !isLoadingMore && blogs.length > 0 && (
          <div className="text-center py-6">
            <p className="text-muted-foreground">You've reached the end!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {blog.image && (
        <div className="h-48 overflow-hidden relative">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs">
            {blog.published ? "Published" : "Draft"}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground ml-2">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <CardTitle className="text-xl line-clamp-2 mb-2">
          {blog.title}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <UserIcon className="h-4 w-4 mr-1" />
          <span>{blog.author}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="prose prose-sm max-w-none mb-4 flex-1 line-clamp-3">
          <Markdown remarkPlugins={[remarkGfm]}>
            {blog.excerpt || blog.content.substring(0, 150) + "..."}
          </Markdown>
        </div>
        <Link
          href={`/blogs/${blog.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-2 cursor-pointer",
          )}
        >
          Read More
        </Link>
      </CardContent>
    </Card>
  );
}

