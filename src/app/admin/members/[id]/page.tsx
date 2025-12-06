import type { Metadata } from "next";
import { MemberDetailPageClient } from "./MemberDetailPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  // For security reasons, we'll just provide generic metadata for admin pages
  return {
    title: `Member Details - Purvanchal Mitra Mahasabha Admin`,
    description:
      "Member details page for Purvanchal Mitra Mahasabha admin panel. Manage and view member information.",
  };
}

export default function MemberDetailPage(props: Props) {
  return <MemberDetailPageClient {...props} />;
}
