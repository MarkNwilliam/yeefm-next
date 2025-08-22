import { Metadata } from 'next';
import AudiobookPage from '@/components/AudiobookDetailClient';

interface Props {
  params: { id: string; slug: string };
}

interface Audiobook {
  _id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  coverimage?: string;
  audio_files: string[];
  genre?: string;
  categories?: string[];
  keywords?: string;
}

// Helper functions
const replaceWithCDN = (url: string) => {
  // Your CDN replacement logic - implement your actual CDN logic here
  return url;
};

const normalizeForUrl = (str: string) => {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
};

// This runs on the server and generates metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const response = await fetch(`https://yeeplatformbackend.azurewebsites.net/getAudiobook/${params.id}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch audiobook');
    }
    
    const audiobook: Audiobook = await response.json();
    
    const coverImageUrl = replaceWithCDN(
      audiobook.coverImage || 
      audiobook.coverimage || 
      'https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/Y.webp'
    );
    
    const url = `https://www.yeefm.com/audiobooks/${params.id}/${params.slug}/listen`;
    
    // Structured data for rich results
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "AudioObject",
      "name": audiobook.title,
      "author": {
        "@type": "Person",
        "name": audiobook.author
      },
      "description": audiobook.description || `Listen to ${audiobook.title} by ${audiobook.author}`,
      "image": coverImageUrl,
      "url": url,
      "contentUrl": audiobook.audio_files[0], // First audio file
      "encodingFormat": "audio/mpeg",
      "duration": `PT${audiobook.audio_files.length * 30}M`, // Estimated duration
      "inLanguage": "en",
      "genre": audiobook.genre || "Audiobook",
      "publisher": {
        "@type": "Organization",
        "name": "YeeFM",
        "url": "https://www.yeefm.com"
      }
    };

    return {
      title: `Listening to ${audiobook.title} on YeeFM`,
      description: audiobook.description || `Listen to ${audiobook.title} by ${audiobook.author} on YeeFM - Free audiobooks online`,
      keywords: audiobook.keywords || audiobook.genre || (audiobook.categories ? audiobook.categories.join(', ') : "audiobook, YeeFM, reading, literature, free audiobooks"),
      
      // Open Graph tags for social media
      openGraph: {
        title: `Listening to ${audiobook.title} on YeeFM`,
        description: audiobook.description || `Listen to ${audiobook.title} by ${audiobook.author}`,
        images: [
          {
            url: coverImageUrl,
            width: 1200,
            height: 630,
            alt: `Cover for ${audiobook.title} by ${audiobook.author}`,
            type: 'image/jpeg',
          }
        ],
        url: url,
        siteName: 'YeeFM',
        type: 'website',
        locale: 'en_US',
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        site: '@yeefm',
        title: `Listening to ${audiobook.title} on YeeFM`,
        description: audiobook.description || `Listen to ${audiobook.title} by ${audiobook.author}`,
        images: [coverImageUrl],
      },
      
      // Additional meta tags
      other: {
        // Structured data
        'application/ld+json': JSON.stringify(structuredData),
        // Additional meta tags
        'theme-color': '#8b5cf6',
        'msapplication-TileColor': '#8b5cf6',
        'apple-mobile-web-app-title': 'YeeFM',
        'application-name': 'YeeFM',
      },
      
      // Icons (use your site's favicon, not the book cover)
      icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
      },
      
      // Viewport and other meta
      viewport: 'width=device-width, initial-scale=1',
      robots: 'index, follow',
      authors: [{ name: 'YeeFM' }],
      creator: 'YeeFM',
      publisher: 'YeeFM',
      
      // Additional metadata for better SEO
      alternates: {
        canonical: url,
      },
    };
  } catch (error) {
    console.error("Error fetching audiobook metadata:", error);
    
    // Fallback metadata if fetch fails
    return {
      title: 'Audiobook - YeeFM',
      description: 'Listen to free audiobooks on YeeFM',
      openGraph: {
        title: 'Audiobook - YeeFM',
        description: 'Listen to free audiobooks on YeeFM',
        images: [
          {
            url: 'https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/Y.webp',
            width: 1200,
            height: 630,
            alt: 'YeeFM Audiobooks',
          }
        ],
        siteName: 'YeeFM',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        site: '@yeefm',
        title: 'Audiobook - YeeFM',
        description: 'Listen to free audiobooks on YeeFM',
      },
    };
  }
}

// Server component that renders the client component
export default function AudiobookdetailPage({ params }: Props) {
  return <AudiobookPage />;
}