import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ObjectId } from 'bson';
import { normalizeForUrl } from '@/utils/normalizeForUrl';
import { replaceWithFrontDoor } from '@/utils/urlUtils';
import EpubReaderClient from '@/components/EpubReaderClient';

interface EbookContent {
  _id: string;
  title: string;
  description: string;
  author: string;
  categories: string[];
  coverImage_optimized_url?: string;
  coverImage?: string;
  coverimage?: string;
  cover_url?: string;
  optimized_url?: string;
  ebookUrl?: string;
  ebookepubImagesUrl?: string;
  ebook_url?: string;
  fileType?: 'epub' | 'pdf';
  pageCount?: number;
  language?: string;
  publisher?: string;
  isbn?: string;
  publicationYear?: number;
}

interface PageProps {
  params: {
    id: string;
    slug: string;
  };
}

async function getEbookContent(id: string): Promise<EbookContent | null> {
  try {
    const response = await fetch(
      `https://yeeplatformbackend.azurewebsites.net/getEbook/${id}`,
      { 
        cache: 'force-cache',
        next: { revalidate: 3600 } // Revalidate every hour
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ebook content:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ebookContent = await getEbookContent(params.id);
  
  if (!ebookContent) {
    return {
      title: 'Ebook Not Found - Yee FM',
      description: 'The requested ebook could not be found.',
      robots: 'noindex, nofollow',
    };
  }

  const title = `Reading "${ebookContent.title}" by ${ebookContent.author} - Yee FM`;
  const description = ebookContent.description 
    ? `Read "${ebookContent.title}" by ${ebookContent.author}. ${ebookContent.description.substring(0, 150)}...`
    : `Read "${ebookContent.title}" by ${ebookContent.author} on Yee FM - Your digital library for ebooks and audiobooks.`;
  
  const image = replaceWithFrontDoor(
    ebookContent.coverImage_optimized_url ||
    ebookContent.coverImage ||
    ebookContent.coverimage ||
    ebookContent.cover_url ||
    ebookContent.optimized_url ||
    'https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/Y.webp'
  );
  
  const keywords = [
    'ebook reader',
    'digital books',
    'online reading',
    ebookContent.title,
    ebookContent.author,
    ...ebookContent.categories,
    'EPUB reader',
    'interactive reading'
  ].join(', ');

  // Generate creation date from ObjectId
  let datePublished = '';
  let dateCreated = '';
  try {
    const objectId = new ObjectId(ebookContent._id);
    const timestamp = objectId.getTimestamp();
    datePublished = ebookContent.publicationYear 
      ? new Date(ebookContent.publicationYear, 0, 1).toISOString()
      : timestamp.toISOString();
    dateCreated = timestamp.toISOString();
  } catch (error) {
    console.error('Error parsing ObjectId:', error);
  }

  const canonicalUrl = `https://www.yeefm.com/books/${params.id}/read/${params.slug}`;

  return {
    title,
    description,
    keywords,
    // Fix: Create proper Author objects instead of strings
    authors: [{ name: ebookContent.author }],
    category: ebookContent.categories[0],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: `Cover of ${ebookContent.title}`,
        }
      ],
      type: 'book',
      url: canonicalUrl,
      siteName: 'Yee FM',
      locale: 'en_US',
      // Fix: Remove authors from openGraph as it's not supported for 'book' type
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
      },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@YeeFM',
      site: '@YeeFM',
    },
    other: {
      'article:author': ebookContent.author,
      'book:author': ebookContent.author,
      'book:isbn': ebookContent.isbn || '',
      'book:release_date': datePublished,
      'book:tag': ebookContent.categories.join(','),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function EbookReaderPage({ params }: PageProps) {
  const ebookContent = await getEbookContent(params.id);
  
  if (!ebookContent) {
    notFound();
  }

  // Validate that this is an EPUB file
  const hasEpubUrl = Boolean(
    ebookContent.ebookepubImagesUrl || 
    ebookContent.ebook_url || 
    ebookContent.ebookUrl
  );

  if (!hasEpubUrl) {
    notFound();
  }

  // Generate creation date from ObjectId
  let ebookDate = '';
  try {
    const objectId = new ObjectId(ebookContent._id);
    ebookDate = objectId.getTimestamp().toISOString();
  } catch (error) {
    console.error('Error parsing ObjectId:', error);
    ebookDate = new Date().toISOString();
  }

  const canonicalUrl = `https://www.yeefm.com/books/${params.id}/read/${params.slug}`;
  const image = replaceWithFrontDoor(
    ebookContent.coverImage_optimized_url ||
    ebookContent.coverImage ||
    ebookContent.coverimage ||
    ebookContent.cover_url ||
    ebookContent.optimized_url ||
    'https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/Y.webp'
  );

  // Create structured data with all properties upfront to avoid TypeScript errors
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": canonicalUrl,
    "name": ebookContent.title,
    "author": {
      "@type": "Person",
      "name": ebookContent.author
    },
    "description": ebookContent.description,
    "image": [image],
    "url": canonicalUrl,
    "datePublished": ebookContent.publicationYear 
      ? new Date(ebookContent.publicationYear, 0, 1).toISOString()
      : ebookDate,
    "dateCreated": ebookDate,
    "inLanguage": ebookContent.language || "en",
    "bookFormat": "EBook",
    "encodingFormat": "application/epub+zip",
    "genre": ebookContent.categories,
    "keywords": ebookContent.categories.join(", "),
    "publisher": {
      "@type": "Organization",
      "name": ebookContent.publisher || "Yee FM",
      "url": "https://www.yeefm.com"
    },
    "isAccessibleForFree": true,
    "potentialAction": {
      "@type": "ReadAction",
      "target": canonicalUrl,
      "actionStatus": "PotentialActionStatus"
    },
    "mainEntity": {
      "@type": "DigitalDocument",
      "name": ebookContent.title,
      "encodingFormat": "application/epub+zip",
      "url": canonicalUrl
    }
  };

  // Add optional fields if available
  if (ebookContent.isbn) {
    structuredData.isbn = ebookContent.isbn;
  }
  if (ebookContent.pageCount) {
    structuredData.numberOfPages = ebookContent.pageCount;
  }

  return (
    <>
      {/* Enhanced JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.yeefm.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Books",
                "item": "https://www.yeefm.com/books"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": ebookContent.title,
                "item": `https://www.yeefm.com/books/${params.id}/${normalizeForUrl(ebookContent.title)}`
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Read",
                "item": canonicalUrl
              }
            ]
          }),
        }}
      />

      {/* Preload critical resources */}
      <link
        rel="preload"
        as="image"
        href={image}
        fetchPriority="high"
      />

      {/* EPUB Reader Component */}
      <EpubReaderClient 
        initialEbookContent={ebookContent}
        id={params.id}
        slug={params.slug}
        ebookDate={ebookDate}
      />
    </>
  );
}