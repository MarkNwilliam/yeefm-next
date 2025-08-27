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

// Fetch ebook content securely
async function getEbookContent(id: string): Promise<EbookContent | null> {
  try {
    // ✅ Fixed: Removed space in URL
    const response = await fetch(
      `https://yeeplatformbackend.azurewebsites.net/getEbook/${id}`,
      {
        cache: 'force-cache',
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      console.warn(`Failed to fetch ebook ${id}: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: EbookContent = await response.json();

    // Validate required fields
    if (!data._id || !data.title || !data.author) {
      console.warn(`Invalid ebook data for ID: ${id}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching ebook content:', error);
    return null;
  }
}

// Generate SEO metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ebookContent = await getEbookContent(params.id);

  if (!ebookContent) {
    return {
      title: 'Ebook Not Found - Yee FM',
      description: 'The requested ebook could not be found in our library.',
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const title = `Read "${ebookContent.title}" by ${ebookContent.author} | Yee FM`;
  const description = ebookContent.description
    ? `${ebookContent.description.substring(0, 150)}...`
    : `Read "${ebookContent.title}" by ${ebookContent.author} – a free ebook on Yee FM.`;

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
    'free books',
    'interactive reading',
  ].join(', ');

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
    dateCreated = new Date().toISOString();
    datePublished = dateCreated;
  }

  const canonicalUrl = `https://www.yeefm.com/books/${params.id}/read/${params.slug}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: ebookContent.author }],
    category: ebookContent.categories[0] || 'Books',
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
          alt: `Cover of "${ebookContent.title}" by ${ebookContent.author}`,
        },
      ],
      type: 'book',
      url: canonicalUrl,
      siteName: 'Yee FM',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@YeeFM',
      site: '@YeeFM',
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
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

  // Validate slug to prevent tampering
  const expectedSlug = normalizeForUrl(ebookContent.title);
  if (params.slug !== expectedSlug) {
    // Redirect to correct slug
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.location.replace("/books/${params.id}/read/${expectedSlug}");
          `,
        }}
      />
    );
  }

  // Check if it's an EPUB
  const hasEpubUrl = Boolean(
    ebookContent.ebookepubImagesUrl ||
    ebookContent.ebook_url ||
    ebookContent.ebookUrl
  );

  if (!hasEpubUrl) {
    notFound();
  }

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

  // ✅ Structured Data: Book
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': canonicalUrl,
    name: ebookContent.title,
    author: {
      '@type': 'Person',
      name: ebookContent.author,
    },
    description: ebookContent.description,
    image: [image],
    url: canonicalUrl,
    datePublished: ebookContent.publicationYear
      ? new Date(ebookContent.publicationYear, 0, 1).toISOString()
      : ebookDate,
    dateCreated: ebookDate,
    inLanguage: ebookContent.language || 'en',
    bookFormat: 'EBook',
    encodingFormat: 'application/epub+zip',
    genre: ebookContent.categories,
    keywords: ebookContent.categories.join(', '),
    publisher: {
      '@type': 'Organization',
      name: ebookContent.publisher || 'Yee FM',
      url: 'https://www.yeefm.com',
    },
    isAccessibleForFree: true,
    potentialAction: {
      '@type': 'ReadAction',
      target: canonicalUrl,
    },
    ...(ebookContent.isbn && { isbn: ebookContent.isbn }),
    ...(ebookContent.pageCount && { numberOfPages: ebookContent.pageCount }),
  };

  // ✅ Breadcrumb Structured Data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.yeefm.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Books',
        item: 'https://www.yeefm.com/books',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: ebookContent.title,
        item: `https://www.yeefm.com/books/${params.id}/${normalizeForUrl(ebookContent.title)}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Read',
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      {/* ✅ JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Preload cover image */}
      <link rel="preload" as="image" href={image} />

      {/* EPUB Reader */}
      <EpubReaderClient
        initialEbookContent={ebookContent}
        id={params.id}
        slug={params.slug}
        ebookDate={ebookDate}
      />
    </>
  );
}