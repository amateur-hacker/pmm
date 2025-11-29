"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Heart,
} from "lucide-react";
import { useQueryState } from "nuqs";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface Member {
  id: string;
  name: string;
  address: string | null;
  mobile: string | null;
  email: string | null;
  dob: string | null;
  education: string | null;
  permanentAddress: string | null;
  image: string | null;
  donated: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface InfiniteMemberListProps {
  initialData: {
    items: Member[];
    hasMore: boolean;
  };
  initialSearchQuery?: string;
}

const PAGE_LIMIT = 10;

const InfiniteMemberList = ({ initialData }: InfiniteMemberListProps) => {
  // state
  const [members, setMembers] = useState<Member[]>(initialData.items || []);
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
    return `${base}/api/members?${params.toString()}`;
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
          throw new Error(`Failed to fetch members (status ${res.status})`);
        }
        const data: { items: Member[]; hasMore: boolean } = await res.json();

        return data;
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          // fetch aborted — not an error we need to toast
          return null;
        }
        console.error("fetchPage error:", err);
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

    setMembers((prev) => {
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
      if (!data) return;

      setMembers(data.items);
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
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search members by name..."
            value={searchQuery ?? ""}
            onChange={handleSearchChange}
            className="pl-10 py-6 text-lg"
          />
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            {member.image ? (
              <div className="relative w-full h-48">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <Badge variant="secondary">{member.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {member.education || "Not specified"}
                </span>
              </div>

              {member.address && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{member.address}</span>
                </div>
              )}

              {member.mobile && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{member.mobile}</span>
                </div>
              )}

              {member.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{member.email}</span>
                </div>
              )}

              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Donated: ₹{member.donated || 0}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* sentinel for intersection observer */}
      <div ref={sentinelRef} className="h-1 w-full" />

      {loading && (
        <div className="w-full flex justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-2"></div>
            <p>Loading more members...</p>
          </div>
        </div>
      )}

      {/* End of results message */}
      {!loading && !hasMore && members.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No members found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? `No members match your search for "${searchQuery}"`
              : "There are currently no members to display."}
          </p>
        </div>
      )}
    </div>
  );
};

export default InfiniteMemberList;

