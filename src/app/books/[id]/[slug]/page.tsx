import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EbookDetailClient from '@/components/EbookDetailClient';

const DEFAULT_COVER_IMAGE = "https://yeeplatform.azureedge.net/assets/images/yeeplatform_book_cover.png";

interface EbookDetailPageProps {
  params: {
    id: string;
    slug: string;
  };
}

// Function to fetch ebook data for metadata
async function getEbookData(id: string) {
  try {
    const response = await fetch(`https://yeeplatformbackend.azurewebsites.net/getEbook/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching ebook data for metadata:', error);
    return null;
  }
}

// Helper function to replace with CDN
function replaceWithCDN(url: string): string {
  if (!url) return DEFAULT_COVER_IMAGE;
  return url.replace('https://yeeplatformstorage.blob.core.windows.net', 'https://yeeplatform.azureedge.net');
}

// Helper function to replace with front door
function replaceWithFrontDoor(url: string): string {
  if (!url) return DEFAULT_COVER_IMAGE;
  return url.replace('https://yeeplatformstorage.blob.core.windows.net', 'https://yeeplatform-frontdoor.azurefd.net');
}

// Helper function to normalize URL
function normalizeForUrl(str: string): string {
  return str.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
}

// Helper function to normalize authors
function normalizeAuthors(authorData: any): string {
  if (!authorData) return 'Unknown';
  if (Array.isArray(authorData)) return authorData.length > 0 ? authorData.join(', ') : 'Unknown';
  if (typeof authorData === 'string') {
    const authors = authorData.split(',').map((author: string) => author.trim()).filter(Boolean);
    return authors.length > 0 ? authors.join(', ') : 'Unknown';
  }
  return 'Unknown';
}

// Helper function to ensure image URL is accessible
function getOptimalImageUrl(ebook: any): string {
  const coverImageUrl = ebook.coverImage_optimized_url || ebook.coverImage || ebook.coverimage || ebook.cover_url;
  
  if (!coverImageUrl) {
    return DEFAULT_COVER_IMAGE;
  }

  // For OpenGraph, use Front Door for better global performance
  return replaceWithFrontDoor(coverImageUrl);
}

// Generate metadata for the page
export async function generateMetadata({ params }: EbookDetailPageProps): Promise<Metadata> {
  const { id, slug } = params;
  const ebook = await getEbookData(id);

  if (!ebook) {
    return {
      title: 'Book Not Found | Yee FM',
      description: 'The book you\'re looking for couldn\'t be found on Yee FM',
      robots: {
        index: false,
        follow: false,
      },
      alternates: {
        canonical: 'https://www.yeefm.com/books',
      },
      openGraph: {
        title: 'Book Not Found | Yee FM',
        description: 'The book you\'re looking for couldn\'t be found',
        images: [{
          url: DEFAULT_COVER_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Book not found',
        }],
        type: 'website',
        url: 'https://www.yeefm.com/books',
        siteName: 'Yee FM',
      },
      icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Book Not Found | Yee FM',
        description: 'The book you\'re looking for couldn\'t be found',
        images: [DEFAULT_COVER_IMAGE],
      },
    };
  }

  const imageUrl = getOptimalImageUrl(ebook);
  const canonicalUrl = `https://www.yeefm.com/books/${id}/${normalizeForUrl(ebook.title)}`;
  const authors = normalizeAuthors(ebook.authors || ebook.author);
  const description = ebook.description || `Read ${ebook.title} by ${authors} on Yee FM`;

  // Debug logging (remove in production)
  console.log('Ebook metadata debug:', {
    title: ebook.title,
    imageUrl,
    description,
    authors,
  });

  return {
    title: `${ebook.title} - Read on Yee FM`,
    description,
    keywords: ebook.categories?.join(', ') || 'ebook, digital book',
    authors: [{ name: authors }],
    publisher: 'Yee FM',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${ebook.title} - Yee FM`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${ebook.title} book cover`,
          type: 'image/jpeg', // Add explicit type
        }
      ],
      type: 'book',
      url: canonicalUrl,
      siteName: 'Yee FM',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${ebook.title} - Yee FM`,
      description,
      images: [
        {
          url: imageUrl,
          alt: `${ebook.title} book cover`,
        }
      ],
    },
    // Add proper favicon
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    // Book-specific metadata
    other: {
      'book:author': authors,
      'book:isbn': ebook.isbn || '',
      'book:tag': ebook.categories?.join(', ') || '',
      'og:image:secure_url': imageUrl, // Add secure URL
    },
  };
}

export default async function EbookDetailPage({ params }: EbookDetailPageProps) {
  const { id, slug } = params;
  
  // Validate the ID format (basic validation)
  if (!id || id.length < 10) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EbookDetailClient id={id} slug={slug} />
    </div>
  );
}