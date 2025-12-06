"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You do not have permission to access this resource.
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <p className="text-gray-600">
            Contact your administrator if you believe this is an error.
          </p>
          <Button
            className="mt-4 w-full"
            onClick={async () => {
              await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
              });
            }}
          >
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
