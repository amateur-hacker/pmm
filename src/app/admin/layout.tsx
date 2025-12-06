import AdminAuthGuard from "@/components/AdminAuthGuard";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Checking Admin Access...</div>
        </div>
      }
    >
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </Suspense>
  );
}
