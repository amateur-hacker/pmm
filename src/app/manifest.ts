import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Purvanchal Mitra Mahasabha",
    short_name: "PMM",
    description:
      "Official website of Purvanchal Mitra Mahasabha (Regd.) - A socially committed NGO working tirelessly for the development and well-being of communities across the eastern region of India.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

