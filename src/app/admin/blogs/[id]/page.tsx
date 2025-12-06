import type { Metadata } from "next";
import { BlogDetailPageClient } from "./BlogDetailPageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  // For security reasons, we'll just provide generic metadata for admin pages
  return {
    title: `Blog Details - Purvanchal Mitra Mahasabha Admin`,
    description:
      "Blog details page for Purvanchal Mitra Mahasabha admin panel. Manage and view blog information.",
  };
}

export default function BlogDetailPage(props: Props) {
  return <BlogDetailPageClient {...props} />;
}
