import type { Metadata } from "next";
import { EditMemberPageClient } from "./EditMemberPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  // For security reasons, we'll just provide generic metadata for admin pages
  return {
    title: `Edit Member - Purvanchal Mitra Mahasabha Admin`,
    description:
      "Edit member details for Purvanchal Mitra Mahasabha admin panel. Update member information.",
  };
}

export default function EditMemberPage(props: Props) {
  return <EditMemberPageClient {...props} />;
}
