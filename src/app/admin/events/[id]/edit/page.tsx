import type { Metadata } from "next";
import { EditEventPageClient } from "./EditEventPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Edit Event",
    description:
      "Edit event post for Purvanchal Mitra Mahasabha. Update content, publication status, and featured images.",
  };
}

export default function EditEventPage(props: Props) {
  return <EditEventPageClient {...props} />;
}
