"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

import {
  ArrowLeft,
  User,
  FileText,
  Image as ImageIcon,
  FileEdit,
} from "lucide-react";

import Link from "next/link";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

// ----------------- SCHEMA --------------------
const blogSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" }),
  excerpt: z.string().optional(),
  author: z
    .string()
    .min(2, { message: "Author name must be at least 2 characters" }),
  published: z.boolean().default(false),
  image: z.string().optional(),
});

type FormData = z.infer<typeof blogSchema>;

// ----------------- COMPONENT --------------------
export function AddBlogPageClient() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      author: "",
      published: false,
      image: "",
    },
  });

  const { control, handleSubmit } = form;

  // Submit Handler
  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          published: data.published ? 1 : 0,
          image: data.image || null,
        }),
        credentials: "include", // Include cookies by default
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Call logout API to properly delete the server-side cookie
          await fetch("/api/admin/logout", {
            method: "POST",
            credentials: "include",
          });
          return router.push("/admin/login");
        }
        throw new Error("Failed to create blog");
      }

      toast.success("Blog created successfully!");
      router.push("/admin");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create blog");
    }
  };

  // ---------------- UI -------------------
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Button variant="outline" className="cursor-pointer" asChild>
            <Link href="/admin" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Blog</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* TITLE */}
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <FileEdit className="h-4 w-4 text-muted-foreground" />
                            Title <span className="text-destructive">*</span>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter blog title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* AUTHOR */}
                  <FormField
                    control={control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Author <span className="text-destructive">*</span>
                          </div>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter author name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* PUBLISHED */}
                  <FormField
                    control={control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Published</FormLabel>
                          <FormDescription>
                            Check this to publish the blog for public viewing
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* IMAGE */}
                  <FormField
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                            Featured Image
                          </div>
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* EXCERPT */}
                <FormField
                  control={control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          Excerpt
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a short description of the blog (optional)"
                          {...field}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CONTENT */}
                <FormField
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          Content <span className="text-destructive">*</span>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter blog content in markdown format"
                          {...field}
                          rows={12}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <Link href="/admin">Cancel</Link>
                  </Button>

                  <Button type="submit">Create Blog</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}