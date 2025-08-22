'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Head from 'next/head';
import Link from 'next/link';
import SearchComponent from '@/components/SearchComponent';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import CustomPagination from '@/components/CustomPagination';
import AudiobookCard from '@/components/AudiobookCard';
import { normalizeForUrl } from '@/utils/normalizeForUrl';

interface AudiobookItem {
  _id: string;
  title: string;
  description?: string;
  author?: string;
  categories?: string[];
  subjects?: string[];
  thumbnailUrl?: string;
  coverImage?: string;
  coverimage?: string;
  audioUrl?: string;
  duration?: string;
  views?: string | number;
  downloads?: string | number;
  rating?: number;
  ratings?: number;
  accessType?: string;
  PublishedOn?: string;
  statistics?: {
    views?: number;
    downloads?: number;
    rating?: number;
  };
}

interface ApiResponse {
  data: AudiobookItem[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  message?: string;
}

interface AudiobooksPageProps {
  initialAudiobooks?: AudiobookItem[];
  initialTotalPages?: number;
  initialTotalItems?: number;
  initialCurrentPage?: number;
}

const DEFAULT_CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Biography',
  'History',
  'Science',
  'Technology',
  'Business',
  'Self-Help',
  'Philosophy',
  'Literature',
  'Education',
  'Health'
];

const ITEMS_PER_PAGE = 15;
const BASE_URL = 'https://yeeplatformbackend.azurewebsites.net';

export const dynamic = 'force-dynamic'

export default function AudiobooksPage({ 
  initialAudiobooks = [],
  initialTotalPages = 1,
  initialTotalItems = 0,
  initialCurrentPage = 1 
}: AudiobooksPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const urlPage = searchParams.get('page');
  const urlSearch = searchParams.get('search');
  const urlCategory = searchParams.get('category');
  
  // State management
  const [searchTerm, setSearchTerm] = useState(urlSearch || '');
  const [currentPage, setCurrentPage] = useState(urlPage ? parseInt(urlPage) : initialCurrentPage);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [audiobooks, setAudiobooks] = useState<AudiobookItem[]>(initialAudiobooks);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate SEO metadata based on current state
  const generateMetadata = () => {
    const baseTitle = "Free Audiobooks Library | Yee FM";
    const baseDescription = "Discover and listen to thousands of free audiobooks online. Fiction, non-fiction, classics, and contemporary works available for streaming.";
    
    let title = baseTitle;
    let description = baseDescription;
    let keywords = "free audiobooks, online audiobooks, listen audiobooks free, audiobook streaming, digital library";

    if (searchTerm) {
      title = `"${searchTerm}" - Search Results | Audiobooks | Yee FM`;
      description = `Find audiobooks matching "${searchTerm}". Listen to free audiobooks online at Yee FM.`;
      keywords = `${searchTerm}, audiobook search, ${keywords}`;
    }

    if (selectedCategory) {
      title = `${selectedCategory} Audiobooks | Free Online Library | Yee FM`;
      description = `Browse our collection of ${selectedCategory.toLowerCase()} audiobooks. Listen to free ${selectedCategory.toLowerCase()} audiobooks online.`;
      keywords = `${selectedCategory.toLowerCase()} audiobooks, ${keywords}`;
    }

    if (currentPage > 1) {
      title = `${title} - Page ${currentPage}`;
      description = `${description} Page ${currentPage} of ${totalPages}.`;
    }

    return { title, description, keywords };
  };

  const metadata = generateMetadata();

  // Generate canonical URL following Google's best practices
  const generateCanonicalUrl = () => {
    const baseUrl = 'https://www.yeefm.com/audiobooks';
    const params = new URLSearchParams();
    
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (searchTerm && searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedCategory && selectedCategory.trim()) params.set('category', selectedCategory.trim());
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Generate structured data for SEO
  const generateStructuredData = () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": metadata.title,
      "description": metadata.description,
      "url": generateCanonicalUrl(),
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": totalItems,
        "itemListElement": audiobooks.map((audiobook, index) => ({
          "@type": "ListItem",
          "position": (currentPage - 1) * ITEMS_PER_PAGE + index + 1,
          "item": {
            "@type": "Audiobook",
            "@id": `https://www.yeefm.com/audiobooks/${audiobook._id}/${normalizeForUrl(audiobook.title)}`,
            "name": audiobook.title,
            "author": {
              "@type": "Person",
              "name": audiobook.author || "Unknown Author"
            },
            "description": audiobook.description,
            "image": audiobook.coverImage || audiobook.coverimage,
            "aggregateRating": audiobook.rating ? {
              "@type": "AggregateRating",
              "ratingValue": audiobook.rating,
              "bestRating": 5
            } : undefined
          }
        }))
      },
      "breadcrumb": {
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
            "name": "Audiobooks",
            "item": "https://www.yeefm.com/audiobooks"
          }
        ]
      }
    };

    if (selectedCategory) {
      structuredData.breadcrumb.itemListElement.push({
        "@type": "ListItem",
        "position": 3,
        "name": selectedCategory,
        "item": `https://www.yeefm.com/audiobooks?category=${encodeURIComponent(selectedCategory)}`
      });
    }

    return structuredData;
  };

  // Update URL with current state (following Google's query parameter recommendations)
  const updateURL = useCallback((page: number, search?: string, category?: string) => {
    const params = new URLSearchParams();
    
    // Use descriptive query parameters as recommended by Google
    if (page > 1) params.set('page', page.toString());
    if (search && search.trim()) params.set('search', search.trim());
    if (category && category.trim()) params.set('category', category.trim());
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;
    
    router.push(newUrl, { scroll: false });
  }, [router]);

  // Fetch audiobooks from API
  const fetchAudiobooks = useCallback(async (query: string = '', page: number = 1, category: string = '') => {
    setIsLoading(true);
    setError(null);

    try {
      let url: string;
      
      // Use clean, descriptive API endpoints
      if (category && category.trim()) {
        url = `${BASE_URL}/categoryindex/audiobook/${encodeURIComponent(category.toLowerCase())}?page=${page}&limit=${ITEMS_PER_PAGE}`;
      } else if (query && query.trim()) {
        url = `${BASE_URL}/searchIndexedAudiobooks?query=${encodeURIComponent(query.trim())}&page=${page}&limit=${ITEMS_PER_PAGE}`;
      } else {
        url = `${BASE_URL}/getallaudiobooks?page=${page}&limit=${ITEMS_PER_PAGE}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }
        throw new Error(errorMessage);
      }

      const data: ApiResponse = await response.json();

      if (!data || !Array.isArray(data.data)) {
        throw new Error('Invalid API response structure');
      }

      // Process and normalize audiobook data
      const validAudiobooks = data.data
        .filter((item: any) => item && item._id && item.title)
        .map((audiobook: any) => ({
          _id: audiobook._id,
          title: audiobook.title || 'Untitled',
          description: audiobook.description,
          author: audiobook.author || 'Unknown Author',
          categories: audiobook.categories || audiobook.subjects || [],
          thumbnailUrl: audiobook.thumbnailUrl,
          coverImage: audiobook.coverImage || audiobook.coverimage,
          audioUrl: audiobook.audioUrl,
          duration: audiobook.duration,
          views: audiobook.statistics?.views || parseInt(String(audiobook.views || 0)) || 0,
          downloads: audiobook.statistics?.downloads || parseInt(String(audiobook.downloads || 0)) || 0,
          rating: audiobook.statistics?.rating || audiobook.rating || audiobook.ratings || 0,
          accessType: audiobook.accessType,
          PublishedOn: audiobook.PublishedOn,
        }));

      // Update state with fetched data
      setAudiobooks(validAudiobooks);
      setTotalPages(Math.max(data.totalPages || Math.ceil((data.totalItems || validAudiobooks.length) / ITEMS_PER_PAGE), 1));
      setTotalItems(data.totalItems || validAudiobooks.length);
      setCurrentPage(data.currentPage || page);

      // Extract and update categories from results
      const uniqueCategories = new Set<string>(DEFAULT_CATEGORIES);
      
      validAudiobooks.forEach((audiobook: AudiobookItem) => {
        const categoryFields = [audiobook.categories, audiobook.subjects].filter(Boolean);
        
        categoryFields.forEach((field) => {
          if (Array.isArray(field)) {
            field.forEach(item => {
              if (typeof item === 'string' && item.trim()) {
                uniqueCategories.add(item.trim());
              }
            });
          }
        });
      });
      
      setCategories(Array.from(uniqueCategories).sort());

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch audiobooks';
      console.error('Fetch error:', err);
      setError(errorMessage);
      setAudiobooks([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load and URL parameter changes
  useEffect(() => {
    const page = urlPage ? Math.max(parseInt(urlPage), 1) : 1;
    const search = urlSearch || '';
    const category = urlCategory || '';
    
    // Update state to match URL
    setCurrentPage(page);
    setSearchTerm(search);
    setSelectedCategory(category);
    
    // Only fetch if we don't have initial data or parameters changed
    if (initialAudiobooks.length === 0 || urlPage || urlSearch || urlCategory) {
      fetchAudiobooks(search, page, category);
    }
  }, [urlPage, urlSearch, urlCategory, fetchAudiobooks, initialAudiobooks.length]);

  // Handle search submission
  const handleSearch = useCallback(() => {
    const page = 1;
    const trimmedSearch = searchTerm.trim();
    
    setCurrentPage(page);
    
    // If search is empty, clear the search parameter completely
    if (!trimmedSearch) {
      updateURL(page, '', selectedCategory);
    } else {
      updateURL(page, trimmedSearch, selectedCategory);
    }
  }, [searchTerm, selectedCategory, updateURL]);

  // Handle Enter key in search
  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Handle page navigation
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    updateURL(page, searchTerm, selectedCategory);
    
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchTerm, selectedCategory, updateURL]);

  // Handle category filter change
  const handleCategoryChange = useCallback((category: string) => {
    const page = 1;
    setSelectedCategory(category);
    setCurrentPage(page);
    updateURL(page, searchTerm, category);
  }, [searchTerm, updateURL]);

  // Handle audiobook play - navigate to detail page with SEO-friendly URL
  const handlePlay = useCallback((audiobook: AudiobookItem) => {
    const slug = normalizeForUrl(audiobook.title);
    router.push(`/audiobooks/${audiobook._id}/${slug}`);
  }, [router]);

  // Handle audiobook download
  const handleDownload = useCallback((audiobook: AudiobookItem) => {
    const downloadUrl = audiobook.audioUrl;
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `${audiobook.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('No audio URL available for audiobook:', audiobook.title);
    }
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
    updateURL(1);
  }, [updateURL]);

  // Generate breadcrumb for current state
  const generateBreadcrumb = () => {
    const breadcrumb = [
      { name: 'Home', href: '/' },
      { name: 'Audiobooks', href: '/audiobooks' }
    ];

    if (selectedCategory) {
      breadcrumb.push({
        name: selectedCategory,
        href: `/audiobooks?category=${encodeURIComponent(selectedCategory)}`
      });
    }

    return breadcrumb;
  };

  const breadcrumb = generateBreadcrumb();

  // Loading state for initial load
  if (isLoading && audiobooks.length === 0) {
    return (
      <>
        <Head>
          <title>Loading Audiobooks | Yee FM</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Audiobooks Library</h1>
            <p className="text-sm sm:text-base text-gray-600">Loading your audiobook collection...</p>
          </div>
          <LoadingSkeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content="Yee FM" />
        
        {/* Canonical URL - avoiding duplicate content */}
        <link rel="canonical" href={generateCanonicalUrl()} />
        
        {/* Pagination Meta Tags */}
        {currentPage > 1 && (
          <link rel="prev" href={generateCanonicalUrl().replace(`page=${currentPage}`, `page=${currentPage - 1}`)} />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={generateCanonicalUrl().replace(`page=${currentPage}`, `page=${currentPage + 1}`)} />
        )}
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content={generateCanonicalUrl()} />
        <meta property="og:site_name" content="Yee FM" />
        <meta property="og:image" content="https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/yee-fm-audiobooks-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/yee-fm-audiobooks-twitter.jpg" />
        <meta name="twitter:site" content="@YeeFM" />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1e40af" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Structured Data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
        />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://yeeplatformbackend.azurewebsites.net" />
        <link rel="preconnect" href="https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net" />
      </Head>

      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 sm:mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumb.map((item, index) => (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {index === breadcrumb.length - 1 ? (
                  <span className="text-gray-500 font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link 
                    href={item.href}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Header Section */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {selectedCategory ? `${selectedCategory} Audiobooks` : 'Free Audiobooks Library'}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            {selectedCategory 
              ? `Discover ${selectedCategory.toLowerCase()} audiobooks in our collection of ${totalItems.toLocaleString()} titles`
              : `Discover and listen to our extensive collection of ${totalItems.toLocaleString()} free audiobooks`
            }
          </p>
        </header>

        {/* Search and Filters Section */}
        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="w-full">
              <SearchComponent
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onSearchClick={handleSearch}
                onKeyPress={handleKeyPress}
                placeholder="Search audiobooks by title, author, or keywords..."
              />
            </div>

            {/* Filters and View Mode */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full sm:w-auto min-w-[200px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                  aria-label="Filter audiobooks by category"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {/* Clear Filters Button */}
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg border border-gray-300 transition-colors"
                    aria-label="Clear all filters and show all audiobooks"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden self-center sm:self-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label="Switch to grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  aria-label="Switch to list view"
                  aria-pressed={viewMode === 'list'}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 sm:mb-6" role="alert">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 mb-1">Error Loading Audiobooks</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button 
                  onClick={() => fetchAudiobooks(searchTerm, currentPage, selectedCategory)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <div className="text-gray-600 text-sm sm:text-base">
            {isLoading ? (
              <span>Loading audiobooks...</span>
            ) : (
              <>
                <span>
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE + 1).toLocaleString()}–{Math.min(currentPage * ITEMS_PER_PAGE, totalItems).toLocaleString()} of {totalItems.toLocaleString()} audiobooks
                </span>
                {searchTerm && (
                  <span className="block sm:inline">
                    {' '}matching "<span className="font-medium text-gray-900">{searchTerm}</span>"
                  </span>
                )}
                {selectedCategory && (
                  <span className="block sm:inline">
                    {' '}in "<span className="font-medium text-gray-900">{selectedCategory}</span>"
                  </span>
                )}
                {totalPages > 1 && (
                  <span className="block sm:inline text-gray-500">
                    {' '}(Page {currentPage} of {totalPages})
                  </span>
                )}
              </>
            )}
          </div>
          
          {isLoading && audiobooks.length > 0 && (
            <div className="flex items-center text-blue-600 text-sm">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </div>
          )}
        </div>

        {/* Main Content */}
        <main>
          {/* Audiobooks Grid/List */}
          {audiobooks.length > 0 ? (
            <section 
              className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8" 
                  : "space-y-3 sm:space-y-4 mb-6 sm:mb-8"
              }
              aria-label={`Audiobooks displayed in ${viewMode} view`}
            >
              {audiobooks.map((audiobook) => (
                <AudiobookCard
                  key={audiobook._id}
                  audiobook={{
                    ...audiobook,
                    views: typeof audiobook.views === 'string' ? parseInt(audiobook.views) || 0 : audiobook.views || 0,
                    downloads: typeof audiobook.downloads === 'string' ? parseInt(audiobook.downloads) || 0 : audiobook.downloads || 0,
                    rating: audiobook.rating || audiobook.ratings || 0
                  }}
                  variant={viewMode}
                  onPlay={() => handlePlay(audiobook)}
                  onDownload={() => handleDownload(audiobook)}
                  onCategoryClick={handleCategoryChange}
                />
              ))}
            </section>
          ) : (
            /* Empty State */
            <section className="text-center py-8 sm:py-12" aria-label="No audiobooks found">
              <div className="max-w-md mx-auto px-4">
                <svg 
                  className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                  />
                </svg>
                <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No audiobooks found</h2>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  {searchTerm || selectedCategory
                    ? "No audiobooks match your current search criteria. Try adjusting your filters or search terms."
                    : "No audiobooks are available at the moment. Please check back later."}
                </p>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    View All Audiobooks
                  </button>
                )}
              </div>
            </section>
          )}
        </main>

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <nav className="flex justify-center mt-6 sm:mt-8" aria-label="Audiobooks pagination">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </nav>
        )}

        {/* SEO-friendly pagination info for screen readers */}
        {totalPages > 1 && (
          <div className="sr-only" aria-live="polite">
            Page {currentPage} of {totalPages}, showing {audiobooks.length} audiobooks out of {totalItems} total
          </div>
        )}

        {/* Featured Categories Section for SEO */}
        {!searchTerm && !selectedCategory && currentPage === 1 && (
          <section className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
              {DEFAULT_CATEGORIES.slice(0, 12).map((category) => (
                <Link
                  key={category}
                  href={`/audiobooks?category=${encodeURIComponent(category)}`}
                  className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 text-center hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-blue-600">
                    {category}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* About Section for Homepage SEO */}
        {!searchTerm && !selectedCategory && currentPage === 1 && (
          <section className="mt-8 sm:mt-12 bg-white rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
              About Our Audiobook Library
            </h2>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Welcome to Yee FM's comprehensive audiobook library featuring thousands of titles across all genres. 
                Our collection includes classic literature, contemporary fiction, educational content, business books, 
                and much more - all available for free streaming.
              </p>
              <p className="mb-4">
                Whether you're commuting, exercising, or relaxing at home, our high-quality audiobooks provide 
                an immersive listening experience. Discover new authors, revisit beloved classics, or explore 
                educational content that fits your interests.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Free Access</h3>
                  <p className="text-sm text-gray-600">Stream unlimited audiobooks at no cost</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">High Quality</h3>
                  <p className="text-sm text-gray-600">Crystal clear audio in multiple formats</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Vast Collection</h3>
                  <p className="text-sm text-gray-600">Thousands of titles across all genres</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

// Helper function to generate canonical URL
function generateCanonicalUrl() {
  if (typeof window === 'undefined') return 'https://www.yeefm.com/audiobooks';
  
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  
  // Clean up parameters for canonical URL
  const cleanParams = new URLSearchParams();
  if (params.get('page') && parseInt(params.get('page')!) > 1) {
    cleanParams.set('page', params.get('page')!);
  }
  if (params.get('search')) {
    cleanParams.set('search', params.get('search')!);
  }
  if (params.get('category')) {
    cleanParams.set('category', params.get('category')!);
  }
  
  const queryString = cleanParams.toString();
  return queryString ? `https://www.yeefm.com/audiobooks?${queryString}` : 'https://www.yeefm.com/audiobooks';
}