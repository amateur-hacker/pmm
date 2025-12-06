"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            An unexpected error occurred. Please try again later.
          </p>
          <div className="space-x-4">
            <Button variant="outline" className="cursor-pointer" asChild>
              <Link href="/">Go Back Home</Link>
            </Button>
            <Button onClick={() => reset()}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
