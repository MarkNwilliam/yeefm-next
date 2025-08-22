// src/app/ebooks/[id]/read/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ObjectId } from 'bson';
import { normalizeForUrl } from '@/utils/normalizeForUrl';
import { replaceWithFrontDoor } from '@/utils/urlUtils';
import EbookReaderClient from '@/components/EbookReaderClient';

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
    
    return await response.json();
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
    };
  }

  const title = `Reading ${ebookContent.title} with an AI teacher`;
  const description = ebookContent.description || 'Read your favorite ebooks on Yee FM.';
  const image = replaceWithFrontDoor(
    ebookContent.coverImage_optimized_url ||
    ebookContent.coverImage ||
    ebookContent.coverimage ||
    ebookContent.cover_url ||
    'https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/Y.webp'
  );
  const keywords = ebookContent.categories.join(', ');

  // Generate creation date from ObjectId
  let datePublished = '';
  try {
    const objectId = new ObjectId(ebookContent._id);
    datePublished = objectId.getTimestamp().toISOString();
  } catch (error) {
    console.error('Error parsing ObjectId:', error);
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": ebookContent.title,
    "author": ebookContent.author,
    "description": ebookContent.description,
    "image": image,
    "url": `https://www.yeefm.com/ebooks/${params.id}/read/${normalizeForUrl(ebookContent.title)}`,
    "datePublished": datePublished,
  };

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      type: 'book',
      url: `https://www.yeefm.com/ebooks/${params.id}/read/${params.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}

export default async function EbookReaderPage({ params }: PageProps) {
  const ebookContent = await getEbookContent(params.id);
  
  if (!ebookContent) {
    notFound();
  }

  // Check if slug matches the normalized title
  const expectedSlug = normalizeForUrl(ebookContent.title.toLowerCase().replace(/ /g, '-'));
  if (params.slug !== expectedSlug) {
    // In a real app, you might want to redirect here
    // For now, we'll just continue with the correct content
  }

  // Generate creation date from ObjectId
  let ebookDate = '';
  try {
    const objectId = new ObjectId(ebookContent._id);
    ebookDate = objectId.getTimestamp().toISOString();
  } catch (error) {
    console.error('Error parsing ObjectId:', error);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            "name": ebookContent.title,
            "author": ebookContent.author,
            "description": ebookContent.description,
            "image": replaceWithFrontDoor(
              ebookContent.coverImage_optimized_url ||
              ebookContent.coverImage ||
              ebookContent.coverimage ||
              ebookContent.cover_url ||
              'https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/Y.webp'
            ),
            "url": `https://www.yeefm.com/ebooks/${params.id}/read/${normalizeForUrl(ebookContent.title)}`,
            "datePublished": ebookDate,
          }),
        }}
      />
      <EbookReaderClient 
        initialEbookContent={ebookContent}
        id={params.id}
        slug={params.slug}
        ebookDate={ebookDate}
      />
    </>
  );
}