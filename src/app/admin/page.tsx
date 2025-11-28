import { AdminDashboardClient } from "./AdminDashboardClient";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Dashboard - Purvanchal Mitra Mahasabha",
  description:
    "Admin dashboard for Purvanchal Mitra Mahasabha. Manage members, blogs, and website content.",
};

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  return <AdminDashboardClient />;
}
