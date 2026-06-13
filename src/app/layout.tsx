import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { BottomNavBar } from "@/components/BottomNavBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Purvanchal Mitra Mahasabha - Home",
    template: "%s | Purvanchal Mitra Mahasabha",
  },
  description:
    "Official website of Purvanchal Mitra Mahasabha - A socially committed NGO working tirelessly for the development and well-being of communities across the eastern region of India.",
  keywords:
    "NGO, Purvanchal Mitra Mahasabha, community development, social welfare, India, membership, eastern India, Delhi NGO",
  authors: [{ name: "Purvanchal Mitra Mahasabha" }],
  creator: "Purvanchal Mitra Mahasabha",
  publisher: "Purvanchal Mitra Mahasabha",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://purvanchalmitramahasabha.in",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url:
      process.env.NEXT_PUBLIC_SITE_URL || "https://purvanchalmitramahasabha.in",
    title: "Purvanchal Mitra Mahasabha",
    description:
      "Official website of Purvanchal Mitra Mahasabha - A socially committed NGO working tirelessly for the development and well-being of communities across the eastern region of India.",
    siteName: "Purvanchal Mitra Mahasabha",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Purvanchal Mitra Mahasabha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Purvanchal Mitra Mahasabha",
    description:
      "Official website of Purvanchal Mitra Mahasabha - A socially committed NGO working tirelessly for the development and well-being of communities across the eastern region of India.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
  },
  alternates: {
    canonical:
      process.env.NEXT_PUBLIC_SITE_URL || "https://purvanchalmitramahasabha.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth overflow-x-hidden`}
      >
        <NuqsAdapter>
          <div className="flex min-h-dvh w-full flex-col">
            <Navbar />
            <main
              className="flex-1"
              style={{
                paddingTop: "calc(var(--navbar-height, 64px))",
                paddingBottom: "calc(var(--bottom-nav-height, 0px))",
              }}
            >
              {children}
            </main>
            <Footer />
          </div>
          <div className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-end">
            <BottomNavBar />
          </div>
          <Toaster closeButton />
          <NextTopLoader color={"var(--primary)"} showSpinner={false} />
          <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" />
        </NuqsAdapter>
      </body>
    </html>
  );
}
