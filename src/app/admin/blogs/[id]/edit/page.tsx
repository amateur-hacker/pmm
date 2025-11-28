import { EditBlogPageClient } from "./EditBlogPageClient";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { id } = await props.params;
  // For security reasons, we'll just provide generic metadata for admin pages
  return {
    title: `Edit Blog - Purvanchal Mitra Mahasabha Admin`,
    description: "Edit blog post for Purvanchal Mitra Mahasabha. Update content, publication status, and featured images.",
  };
}

export default function EditBlogPage(props: Props) {
  return <EditBlogPageClient {...props} />;
}
