import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NoteDetailClient from '@/components/NoteDetailClient';
import { BACKEND_URL } from '@/lib/constants';

interface NoteData {
  _id: string;
  title: string;
  description: string;
  content?: string;
  thumbnailUrl?: string;
  coverImage?: string;
  coverimage?: string;
  fileUrl?: string;
  doc_location?: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
  publishedDate?: string;
  author?: string;
  course?: string;
  keywords?: string[];
  categories?: string[];
  tags?: string[];
  fileType?: string;
  monetization?: boolean;
  type?: string;
  details?: {
    type?: string;
    pages?: number;
    size?: string;
    format?: string;
  };
  statistics?: {
    views?: number;
    downloads?: number;
    rating?: number;
    likes?: number;
    shares?: number;
  };
  pageCount?: number;
}

async function fetchNoteWithRetry(id: string, retries = 3): Promise<NoteData | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${BACKEND_URL}/getchapter/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'max-age=3600',
          'User-Agent': 'YeeFM-WebApp/1.0',
        },
        next: { revalidate: 3600 }
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) return null;
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return null;
}

function generateSEOKeywords(note: NoteData): string[] {
  const keywords = new Set<string>();
  
  // Add existing keywords/tags
  [note.keywords, note.categories, note.tags].forEach(arr => {
    if (Array.isArray(arr)) {
      arr.forEach(item => keywords.add(item.toLowerCase().trim()));
    }
  });
  
  // Extract from title with better processing
  const titleKeywords = note.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/[\s\-_]+/)
    .filter(word => word.length > 2 && !['and', 'the', 'for', 'with', 'from'].includes(word));
  titleKeywords.forEach(word => keywords.add(word));
  
  // Add educational context keywords
  const contextKeywords = [
    'study notes', 'education', 'learning resources', 'academic material',
    'student resources', 'exam preparation', 'educational content'
  ];
  contextKeywords.forEach(keyword => keywords.add(keyword));
  
  // Add subject-specific keywords based on title
  const subjectMatchers = {
    'math': ['mathematics', 'calculus', 'algebra', 'geometry'],
    'science': ['physics', 'chemistry', 'biology', 'scientific'],
    'engineering': ['technical', 'mechanical', 'electrical', 'civil'],
    'business': ['management', 'economics', 'finance', 'marketing'],
    'literature': ['english', 'writing', 'essay', 'analysis'],
    'history': ['historical', 'social studies', 'world history'],
    'computer': ['programming', 'coding', 'software', 'technology']
  };
  
  Object.entries(subjectMatchers).forEach(([subject, related]) => {
    if (note.title.toLowerCase().includes(subject) || 
        related.some(term => note.title.toLowerCase().includes(term))) {
      keywords.add(subject);
      related.forEach(term => keywords.add(term));
    }
  });
  
  // Add format-specific keywords
  if (note.fileType) keywords.add(note.fileType.toLowerCase());
  if (note.details?.format) keywords.add(note.details.format.toLowerCase());
  if (note.type) keywords.add(note.type.toLowerCase());
  
  // Add author-based keywords
  if (note.author) {
    keywords.add(`${note.author.toLowerCase()} notes`);
    keywords.add(`notes by ${note.author.toLowerCase()}`);
  }
  
  // Add course-specific keywords
  if (note.course) {
    keywords.add(note.course.toLowerCase());
    keywords.add(`${note.course.toLowerCase()} notes`);
  }
  
  return Array.from(keywords).slice(0, 25); // Limit to 25 keywords
}

function createRichDescription(note: NoteData): string {
  let description = note.description || `Comprehensive study notes on ${note.title}`;
  
  // Ensure description is compelling and informative
  if (description.length < 50) {
    description = `Discover comprehensive study material for ${note.title}. Perfect for students and professionals looking to master this subject.`;
  }
  
  // Add value propositions
  const enhancements = [];
  
  if (note.statistics?.rating && note.statistics.rating > 4) {
    enhancements.push(`⭐ Highly rated (${note.statistics.rating}/5)`);
  }
  
  if (note.statistics?.views && note.statistics.views > 100) {
    enhancements.push(`📖 ${note.statistics.views.toLocaleString()} students helped`);
  }
  
  if (note.details?.pages || note.pageCount) {
    const pages = note.details?.pages || note.pageCount;
    enhancements.push(`📄 ${pages} pages of content`);
  }
  
  if (note.author) {
    enhancements.push(`👨‍🏫 By ${note.author}`);
  }
  
  if (note.course) {
    enhancements.push(`🎓 ${note.course}`);
  }
  
  if (enhancements.length > 0) {
    description += ` • ${enhancements.slice(0, 3).join(' • ')}`;
  }
  
  return description.slice(0, 160); // SEO optimal length
}

function getImageUrl(note: NoteData): string {
  // Priority order for images
  const imageUrl = note.coverImage || note.coverimage || note.thumbnailUrl;
  
  if (imageUrl) {
    return imageUrl;
  }
  
  // Generate dynamic OG image with note details
  const params = new URLSearchParams({
    title: note.title,
    type: 'note',
    author: note.author || '',
    rating: note.statistics?.rating?.toString() || '',
    theme: 'educational'
  });
  
  return `https://yeefm.com/api/og-image?${params.toString()}`;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string; slug: string };
}): Promise<Metadata> {
  const note = await fetchNoteWithRetry(params.id);

  if (!note) {
    return {
      title: 'Note Not Found - Yee FM',
      description: 'The requested study note could not be found. Browse our collection of educational materials.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const keywords = generateSEOKeywords(note);
  const description = createRichDescription(note);
  const title = `${note.title} - Study Notes | Yee FM`;
  const canonicalUrl = `https://yeefm.com/notes/${note._id}/${encodeURIComponent(note.title.toLowerCase().replace(/\s+/g, '-'))}`;
  const imageUrl = getImageUrl(note);
  const publishDate = note.publishedDate || note.createdAt || new Date().toISOString();
  const modifiedDate = note.updatedAt || new Date().toISOString();

  return {
    title,
    description,
    keywords: keywords.join(', '),
    
    // Enhanced authorship
    authors: note.author ? [{ name: note.author, url: `https://yeefm.com/authors/${encodeURIComponent(note.author.toLowerCase())}` }] : undefined,
    category: 'Education',
    classification: 'Educational Resource',
    
    // Comprehensive Open Graph
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalUrl,
      siteName: 'Yee FM - Educational Resources',
      locale: 'en_US',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Study notes for ${note.title}`,
          type: 'image/jpeg',
        },
        // Additional image sizes for different platforms
        {
          url: imageUrl.replace('1200x630', '800x600'),
          width: 800,
          height: 600,
          alt: `${note.title} - Educational Content`,
        }
      ],
      publishedTime: publishDate,
      modifiedTime: modifiedDate,
      section: 'Education',
      tags: keywords,
      authors: note.author ? [note.author] : undefined,
    },

    // Enhanced Twitter Cards
    twitter: {
      card: 'summary_large_image',
      site: '@YeeFM',
      creator: note.author ? `@${note.author.replace(/\s+/g, '')}` : '@YeeFM',
      title: title.length > 70 ? `${note.title} | Yee FM` : title,
      description: description.slice(0, 200),
      images: [
        {
          url: imageUrl,
          alt: `Study notes: ${note.title}`,
        }
      ],
    },

    // Advanced SEO settings
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

    // Rich metadata for better search appearance
    other: {
      // Article metadata
      'article:published_time': publishDate,
      'article:modified_time': modifiedDate,
      'article:section': 'Educational Resources',
      'article:tag': keywords.join(','),
      'article:author': note.author || 'Yee FM',
      
      // Educational metadata
      'dc.type': 'Text.Educational',
      'dc.format': note.details?.format || note.fileType || 'Digital',
      'dc.language': 'en',
      'dc.subject': keywords.slice(0, 5).join(';'),
      'dc.creator': note.author || 'Yee FM',
      'dc.publisher': 'Yee FM',
      'dc.rights': 'Educational Use Permitted',
      'dc.audience': 'Students, Educators, Professionals',
      
      // Social optimization
      'fb:app_id': '1234567890', // Replace with your Facebook App ID
      'og:rich_attachment': 'true',
      'og:see_also': `https://yeefm.com/notes?search=${encodeURIComponent(note.title)}`,
      
      // Platform-specific enhancements
      'telegram:channel': '@YeeFM', // Replace with your Telegram channel
      'whatsapp:title': note.title,
      'whatsapp:description': description,
      
      // JSON-LD structured data
      'application/ld+json': JSON.stringify([
        // Main educational resource
        {
          "@context": "https://schema.org",
          "@type": "EducationalResource",
          "@id": canonicalUrl,
          "name": note.title,
          "description": note.description,
          "url": canonicalUrl,
          "image": imageUrl,
          "thumbnailUrl": note.thumbnailUrl,
          "datePublished": publishDate,
          "dateModified": modifiedDate,
          "inLanguage": "en",
          "isAccessibleForFree": !note.monetization,
          "learningResourceType": ["Reading", "Reference"],
          "educationalLevel": "Higher Education",
          "author": note.author ? {
            "@type": "Person",
            "name": note.author,
            "url": `https://yeefm.com/authors/${encodeURIComponent(note.author.toLowerCase())}`
          } : {
            "@type": "Organization",
            "name": "Yee FM",
            "url": "https://yeefm.com"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Yee FM",
            "url": "https://yeefm.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://yeefm.com/logo.png"
            }
          },
          "mainEntity": {
            "@type": "Article",
            "headline": note.title,
            "description": note.description,
            "image": imageUrl,
            "datePublished": publishDate,
            "dateModified": modifiedDate
          },
          "audience": {
            "@type": "EducationalAudience",
            "educationalRole": ["student", "teacher"]
          },
          "aggregateRating": note.statistics?.rating ? {
            "@type": "AggregateRating",
            "ratingValue": note.statistics.rating,
            "ratingCount": note.statistics.views || 1,
            "bestRating": 5,
            "worstRating": 1
          } : undefined,
          "interactionStatistic": [
            note.statistics?.views ? {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/ReadAction",
              "userInteractionCount": note.statistics.views
            } : null,
            note.statistics?.downloads ? {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/DownloadAction", 
              "userInteractionCount": note.statistics.downloads
            } : null,
            note.statistics?.likes ? {
              "@type": "InteractionCounter",
              "interactionType": "https://schema.org/LikeAction",
              "userInteractionCount": note.statistics.likes
            } : null
          ].filter(Boolean),
          "encoding": note.fileUrl || note.doc_location ? {
            "@type": "MediaObject",
            "contentUrl": note.fileUrl || note.doc_location,
            "encodingFormat": note.details?.format || "application/pdf",
            "contentSize": note.details?.size,
            "name": `${note.title} - Full Document`
          } : undefined
        },
        // Website breadcrumb
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://yeefm.com"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Study Notes",
              "item": "https://yeefm.com/notes"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": note.title,
              "item": canonicalUrl
            }
          ]
        },
        // Organization info
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Yee FM",
          "url": "https://yeefm.com",
          "logo": "https://yeefm.com/logo.png",
          "description": "Educational resources and study materials for students worldwide",
          "sameAs": [
            "https://facebook.com/YeeFM",
            "https://twitter.com/YeeFM",
            "https://linkedin.com/company/yeefm"
          ]
        }
      ]),
    },

    // Canonical and alternates
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': canonicalUrl,
      },
    },

    // Verification
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      other: {
        'msvalidate.01': 'your-bing-verification-code',
        'p:domain_verify': 'your-pinterest-verification-code',
      }
    },

    // App links
    appLinks: {
      web: {
        url: canonicalUrl,
      },
      ios: {
        url: `yeefm://notes/${note._id}`,
        app_name: 'Yee FM',
      },
      android: {
        package: 'com.yeefm.app',
        url: `yeefm://notes/${note._id}`,
        app_name: 'Yee FM',
      }
    },

    // Icons and manifest
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

async function getNote(id: string): Promise<NoteData | null> {
  return await fetchNoteWithRetry(id);
}

export default async function NoteDetailPage({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const note = await getNote(params.id);

  if (!note) {
    notFound();
  }

  return (
    <>
      {/* Additional JSON-LD for FAQ if note has common questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": `What is ${note.title}?`,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": note.description
                }
              },
              {
                "@type": "Question",
                "name": "Is this resource free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": note.monetization ? "This is a premium educational resource." : "This educational resource is available for free."
                }
              },
              note.author ? {
                "@type": "Question",
                "name": "Who created this content?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": `This educational content was created by ${note.author}.`
                }
              } : null
            ].filter(Boolean)
          })
        }}
      />
      
      <NoteDetailClient note={note} />
    </>
  );
}