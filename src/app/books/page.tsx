// src/app/books/page.tsx
import type { Metadata } from 'next';
import BooksPageClient from '@/components/BooksPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ebooks Library | YEE Platform',
  description: 'Discover and read from our extensive collection of free ebooks on various topics including science, technology, literature, and more.',
  keywords: 'ebooks, free ebooks, digital library, science ebooks, technology ebooks, literature ebooks',
  openGraph: {
    title: 'Ebooks Library | YEE Platform',
    description: 'Discover and read from our extensive collection of free ebooks',
    url: 'https://yourdomain.com/books',
    siteName: 'YEE Platform',
    images: [
      {
        url: 'https://yourdomain.com/images/ebooks-og.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ebooks Library | YEE Platform',
    description: 'Discover and read from our extensive collection of free ebooks',
    images: ['https://yourdomain.com/images/ebooks-twitter.jpg'],
  },
};

export default function BooksPage() {
  return <BooksPageClient />;
}