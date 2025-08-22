import { Suspense } from "react";
import type { Metadata } from "next";
import AudiobooksPageClient from "@/components/AudiobooksPageClient";
export const dynamic = 'force-dynamic'
// --- Meta for this page ---
export const metadata: Metadata = {
  title: "Audiobooks | YeeFM",
  description: "Discover African and global audiobooks on YeeFM.",
  openGraph: {
    title: "Audiobooks | YeeFM",
    description: "Stream and enjoy thousands of audiobooks.",
    url: "https://www.yeefm.com/audiobooks",
    siteName: "YeeFM",
    images: [
      {
        url: "/favicons.ico",
        width: 1200,
        height: 630,
        alt: "YeeFM Audiobooks",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function AudiobooksPage() {
  return (
    <Suspense fallback={<div>Loading audiobooks...</div>}>
      <AudiobooksPageClient />
    </Suspense>
  );
}
