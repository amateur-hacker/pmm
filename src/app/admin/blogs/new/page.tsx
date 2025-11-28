import { AddBlogPageClient } from "./AddBlogPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Blog - Purvanchal Mitra Mahasabha Admin",
  description: "Create a new blog post for Purvanchal Mitra Mahasabha. Manage content, set publication status, and add featured images.",
};

export default function AddBlogPage() {
  return <AddBlogPageClient />;
}
