import type { Metadata } from "next";
import { MemberDetailPageClient } from "./MemberDetailPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Member Details",
    description:
      "Member details page for Purvanchal Mitra Mahasabha admin panel. Manage and view member information.",
  };
}

export default function MemberDetailPage(props: Props) {
  return <MemberDetailPageClient {...props} />;
}
