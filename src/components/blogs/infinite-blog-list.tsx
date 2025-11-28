"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, UserIcon, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

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

interface BlogListProps {
  initialData: {
    items: Blog[];
    hasMore: boolean;
  };
  initialSearchQuery?: string;
}

const PAGE_LIMIT = 10;

const InfiniteBlogList = ({ initialData }: BlogListProps) => {
  // state
  const [blogs, setBlogs] = useState<Blog[]>(initialData.items || []);
  const [hasMore, setHasMore] = useState<boolean>(initialData.hasMore ?? false);
  const [loading, setLoading] = useState<boolean>(false);

  // page represents how many pages have been loaded (initial data is treated as page 1)
  const [page, setPage] = useState<number>(1);

  const observer = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // nuqs query state for search (keeps url in sync)
  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
  });

  // debounce timer for search
  const searchDebounceRef = useRef<number | null>(null);

  // Abort controller ref for fetch cancellation
  const abortRef = useRef<AbortController | null>(null);

  // Helper: build API URL
  const buildUrl = useCallback((p: number, q?: string) => {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const params = new URLSearchParams({
      page: String(p),
      limit: String(PAGE_LIMIT),
    });
    if (q) params.set("search", q);
    return `${base}/api/blogs?${params.toString()}`;
  }, []);

  // Fetch a page (pageNumber starts at 1)
  const fetchPage = useCallback(
    async (pageNumber: number, q?: string) => {
      // cancel previous
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const url = buildUrl(pageNumber, q);
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch blogs (status ${res.status})`);
        }
        const data: { items: Blog[]; hasMore: boolean } = await res.json();

        return data;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // fetch aborted — not an error we need to toast
          return null;
        }
        console.error("fetchPage error:", err);
        toast.error("Failed to load blogs");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [buildUrl],
  );

  // Load more (append next page). Uses current page state.
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    const data = await fetchPage(nextPage, searchQuery || undefined);
    if (!data) return;

    setBlogs((prev) => {
      // filter duplicates and append
      const newItems = data.items.filter(
        (nb) => !prev.some((pb) => pb.id === nb.id),
      );
      return [...prev, ...newItems];
    });
    setHasMore(data.hasMore);
    setPage(nextPage);
  }, [loading, hasMore, page, fetchPage, searchQuery]);

  // When searchQuery changes: debounce, reset list and fetch page 1
  useEffect(() => {
    // clear any pending debounce
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }

    // debounce 300ms
    searchDebounceRef.current = window.setTimeout(async () => {
      // fetch page 1 with new query
      const data = await fetchPage(1, searchQuery || undefined);
      console.log(data);
      if (!data) return;

      setBlogs(data.items);
      setHasMore(data.hasMore);
      setPage(1);

      // update URL via nuqs already done by setSearchQuery; router not needed
    }, 300);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
        searchDebounceRef.current = null;
      }
      // abort running fetch if unmounting or query changes
      abortRef.current?.abort();
    };
  }, [searchQuery, fetchPage]);

  // IntersectionObserver setup — observes sentinelRef and calls loadMore when visible
  useEffect(() => {
    // don't create observer until sentinel exists
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    // disconnect previous observer
    observer.current?.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && hasMore) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: "200px", // start loading a bit earlier
        threshold: 0.1,
      },
    );

    observer.current.observe(sentinel);

    return () => {
      observer.current?.disconnect();
      observer.current = null;
    };
  }, [hasMore, loadMore, loading]);

  // handle input change (syncs to URL via nuqs)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // setQuery will update the URL query param via nuqs
    setSearchQuery(value);
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery ?? ""}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-3 text-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="overflow-hidden">
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>

      {/* sentinel for intersection observer */}
      <div ref={sentinelRef} className="h-1 w-full" />

      {loading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {!loading && !hasMore && blogs.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          No results found.
        </div>
      )}
    </div>
  );
};

const BlogCard = ({ blog }: { blog: Blog }) => {
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
          {blog.excerpt ?? `${blog.content.slice(0, 150)}...`}
        </div>
        <Button variant="outline" className="cursor-pointer" asChild>
          <Link href={`/blogs/${blog.id}`}>Read More</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default InfiniteBlogList;
