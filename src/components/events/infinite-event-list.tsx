"use client";

import { CalendarIcon, Search, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Event {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  author: string;
  published: number;
  publishedAt: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EventListProps {
  initialData: {
    items: Event[];
    hasMore: boolean;
  };
  initialSearchQuery?: string;
}

const PAGE_LIMIT = 10;

const InfiniteEventList = ({ initialData }: EventListProps) => {
  // state
  const [events, setEvents] = useState<Event[]>(initialData.items || []);
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
  const [yearFilter, setYearFilter] = useState<string>("all");

  // Calculate years of experience: 13+ for 2025, +1 each year after
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = 13 + Math.max(0, currentYear - 2025);

  // debounce timer for search
  const searchDebounceRef = useRef<number | null>(null);

  // Abort controller ref for fetch cancellation
  const abortRef = useRef<AbortController | null>(null);

  // Helper: build API URL
  const buildUrl = useCallback((p: number, q?: string, year?: string) => {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const params = new URLSearchParams({
      page: String(p),
      limit: String(PAGE_LIMIT),
    });
    if (q) params.set("search", q);
    if (year && year !== "all") params.set("year", year);
    return `${base}/api/events?${params.toString()}`;
  }, []);

  // Fetch a page (pageNumber starts at 1)
  const fetchPage = useCallback(
    async (pageNumber: number, q?: string, year?: string) => {
      // cancel previous
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const url = buildUrl(pageNumber, q, year);
        const res = await fetch(url, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch events (status ${res.status})`);
        }
        const data: { items: Event[]; hasMore: boolean } = await res.json();

        return data;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // fetch aborted — not an error we need to toast
          return null;
        }
        console.error("fetchPage error:", err);
        toast.error("Failed to load events");
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
    const data = await fetchPage(
      nextPage,
      searchQuery || undefined,
      yearFilter,
    );
    if (!data) return;

    setEvents((prev) => {
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
      const data = await fetchPage(1, searchQuery || undefined, yearFilter);
      console.log(data);
      if (!data) return;

      setEvents(data.items);
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

  // When yearFilter changes: reset list and fetch page 1
  useEffect(() => {
    const fetchNewYear = async () => {
      setLoading(true);
      const data = await fetchPage(1, searchQuery || undefined, yearFilter);
      if (!data) {
        setLoading(false);
        return;
      }
      setEvents(data.items);
      setHasMore(data.hasMore);
      setPage(1);
      setLoading(false);
    };
    fetchNewYear();
  }, [yearFilter, fetchPage, searchQuery]);

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
      {/* Search and Filter */}
      <div className="mb-8 max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search events..."
            value={searchQuery ?? ""}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-3 text-lg"
          />
        </div>
        <div className="flex justify-center">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {Array.from({ length: yearsOfExperience }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="overflow-hidden">
            <EventCard event={event} />
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

      {!loading && !hasMore && events.length === 0 && (
        <div className="text-center text-muted-foreground mt-8">
          No results found.
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event }: { event: Event }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {event.image && (
        <div className="h-48 overflow-hidden relative">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs">
            {event.published ? "Published" : "Draft"}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground ml-2">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{new Date(event.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <CardTitle className="text-xl line-clamp-2 mb-2">
          {event.title}
        </CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <UserIcon className="h-4 w-4 mr-1" />
          <span>{event.author}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="prose prose-sm max-w-none mb-4 flex-1 line-clamp-3">
          {event.excerpt ?? `${event.content.slice(0, 150)}...`}
        </div>
        <Button variant="outline" className="cursor-pointer" asChild>
          <Link href={`/events/${event.id}`}>Read More</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default InfiniteEventList;
