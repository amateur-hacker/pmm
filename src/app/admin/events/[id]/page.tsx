import type { Metadata } from "next";
import { EventDetailPageClient } from "./EventDetailPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  // For security reasons, we'll just provide generic metadata for admin pages
  return {
    title: `Event Details - Purvanchal Mitra Mahasabha Admin`,
    description:
      "Event details page for Purvanchal Mitra Mahasabha admin panel. Manage and view event information.",
  };
}

export default function EventDetailPage(props: Props) {
  return <EventDetailPageClient {...props} />;
}
