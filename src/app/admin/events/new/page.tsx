import type { Metadata } from "next";
import { AddEventPageClient } from "./AddEventPageClient";

export const metadata: Metadata = {
  title: "Create New Event - Purvanchal Mitra Mahasabha Admin",
  description:
    "Create a new event post for Purvanchal Mitra Mahasabha. Manage content, set publication status, and add featured images.",
};

export default function AddEventPage() {
  return <AddEventPageClient />;
}
