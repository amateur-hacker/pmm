import { getDb } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

async function getBlog(id: string) {
  try {
    const db = await getDb();
    const blog = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);

    return blog[0] || null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BlogDetailPage(props: Props) {
  const { id } = await props.params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button asChild variant="outline" className="cursor-pointer">
            <Link href="/blogs" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-xl p-8 shadow-sm">
          {blog.image && (
            <div className="mb-6 overflow-hidden rounded-lg relative h-64">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span>By {blog.author}</span>
              <span>•</span>
              <span>
                {new Date(blog.createdAt!).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              {blog.published === 1 && (
                <Badge variant="secondary" className="ml-auto">
                  Published
                </Badge>
              )}
            </div>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <Markdown remarkPlugins={[remarkGfm]}>{blog.content}</Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}

