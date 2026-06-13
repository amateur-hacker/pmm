import type { Metadata } from "next";
import { EventDetailPageClient } from "./EventDetailPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Event Details",
    description:
      "Event details page for Purvanchal Mitra Mahasabha admin panel. Manage and view event information.",
  };
}

export default function EventDetailPage(props: Props) {
  return <EventDetailPageClient {...props} />;
}
