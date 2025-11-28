"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Sorry, we couldn't find the page you're looking for.
          </p>
          <Button asChild className="cursor-pointer">
            <Link href="/">Go Back Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

