import type { Metadata } from "next";
import { EditEventPageClient } from "./EditEventPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  // For security reasons, we'll just provide generic metadata for admin pages
  return {
    title: `Edit Event - Purvanchal Mitra Mahasabha Admin`,
    description:
      "Edit event post for Purvanchal Mitra Mahasabha. Update content, publication status, and featured images.",
  };
}

export default function EditEventPage(props: Props) {
  return <EditEventPageClient {...props} />;
}
