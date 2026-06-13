import type { Metadata } from "next";
import { EditMemberPageClient } from "./EditMemberPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Edit Member",
    description:
      "Edit member details for Purvanchal Mitra Mahasabha admin panel. Update member information.",
  };
}

export default function EditMemberPage(props: Props) {
  return <EditMemberPageClient {...props} />;
}
