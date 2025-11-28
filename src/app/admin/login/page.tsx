import { AdminLoginPageClient } from "./AdminLoginPageClient";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Login - Purvanchal Mitra Mahasabha",
  description:
    "Admin login page for Purvanchal Mitra Mahasabha. Access the admin panel to manage members, blogs, and website content.",
};

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken")?.value;

  if (token) {
    redirect("/admin");
  }

  return <AdminLoginPageClient />;
}
