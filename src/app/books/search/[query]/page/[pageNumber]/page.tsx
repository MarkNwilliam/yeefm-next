'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchComponent from '@/components/SearchComponent';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import CustomPagination from '@/components/CustomPagination';
import EbookCard from '@/components/EbookCard';

interface EbookItem {
  _id: string;
  title: string;
  description?: string;
  authors?: string[];
  author?: string;
  keywords?: string[];
  categories?: string[];
  subjects?: string[];
  type?: string;
  ebookUrl?: string;
  ebookpdfUrl?: string;
  date_added?: string;
  views?: string | number;
  downloads?: string | number;
  rating?: number;
  thumbnailUrl?: string;
  coverImage?: string;
  accessType?: string;
  PublishedOn?: string;
  statistics?: {
    views?: number;
    downloads?: number;
    rating?: number;
  };
}

interface ApiResponse {
  data: EbookItem[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  message?: string;
}

const DEFAULT_CATEGORIES = [
  'Science',
  'Technology',
  'Mathematics',
  'History',
  'Literature',
  'Business',
  'Art',
  'Philosophy',
  'Physics',
  'Computer Science',
  'Engineering',
  'Medicine'
];

const ITEMS_PER_PAGE = 15;
const BASE_URL = 'https://yeeplatformbackend.azurewebsites.net';

export default function EbooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get URL parameters
  const urlPage = searchParams.get('page');
  const urlSearch = searchParams.get('search');
  const urlCategory = searchParams.get('category');
  
  // State management
  const [searchTerm, setSearchTerm] = useState(urlSearch || '');
  const [currentPage, setCurrentPage] = useState(urlPage ? parseInt(urlPage) : 1);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [ebooks, setEbooks] = useState<EbookItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  // Update URL with current state
  const updateURL = useCallback((page: number, search?: string, category?: string) => {
    const params = new URLSearchParams();
    
    if (page > 1) params.set('page', page.toString());
    if (search && search.trim()) params.set('search', search.trim());
    if (category && category.trim()) params.set('category', category.trim());
    
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : '';
    
    router.push(newUrl, { scroll: false });
  }, [router]);

  // Fetch ebooks from API
  const fetchEbooks = useCallback(async (query: string = '', page: number = 1, category: string = '') => {
    setIsLoading(true);
    setError(null);

    try {
      let url: string;
      
      if (category && category.trim()) {
        url = `${BASE_URL}/categoryindex/ebook/${encodeURIComponent(category.toLowerCase())}?page=${page}&limit=${ITEMS_PER_PAGE}`;
      } else if (query && query.trim()) {
        url = `${BASE_URL}/searchIndexedBooks?query=${encodeURIComponent(query.trim())}&page=${page}&limit=${ITEMS_PER_PAGE}`;
      } else {
        url = `${BASE_URL}/getallfreeebooks?page=${page}&limit=${ITEMS_PER_PAGE}`;
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

      // Update state with fetched data
      setEbooks(data.data);
      setTotalPages(Math.max(data.totalPages || 1, 1));
      setTotalItems(data.totalItems || 0);
      setCurrentPage(data.currentPage || page);

      // Extract and update categories from results
      const uniqueCategories = new Set<string>(DEFAULT_CATEGORIES);
      
      data.data.forEach((ebook: EbookItem) => {
        const categoryFields = [ebook.categories, ebook.subjects].filter(Boolean);
        
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ebooks';
      console.error('Fetch error:', err);
      setError(errorMessage);
      setEbooks([]);
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
    
    // Fetch data
    fetchEbooks(search, page, category);
  }, [urlPage, urlSearch, urlCategory, fetchEbooks]);

  // Handle search submission
  const handleSearch = useCallback(() => {
    const page = 1;
    setCurrentPage(page);
    updateURL(page, searchTerm, selectedCategory);
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

  // Handle ebook download
  const handleDownload = useCallback((ebook: EbookItem) => {
    const downloadUrl = ebook.ebookpdfUrl || ebook.ebookUrl;
    if (downloadUrl) {
      // Create a temporary link for download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('No download URL available for ebook:', ebook.title);
    }
  }, []);

  // Handle ebook view
  const handleView = useCallback((ebook: EbookItem) => {
    const viewUrl = ebook.ebookUrl;
    if (viewUrl) {
      window.open(viewUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('No view URL available for ebook:', ebook.title);
    }
  }, []);

  // Get formatted author name
  const getAuthorName = useCallback((ebook: EbookItem): string => {
    if (Array.isArray(ebook.authors) && ebook.authors.length > 0) {
      return ebook.authors.filter(author => author && author.trim()).join(', ');
    }
    if (ebook.author && typeof ebook.author === 'string') {
      return ebook.author.replace(/\|\|/g, ', ').trim();
    }
    return 'Unknown Author';
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
    updateURL(1);
  }, [updateURL]);

  // Loading state for initial load
  if (isLoading && ebooks.length === 0) {
    return (
      <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Ebooks Library</h1>
          <p className="text-sm sm:text-base text-gray-600">Loading your ebook collection...</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Ebooks Library</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Discover and read from our extensive collection of {totalItems.toLocaleString()} ebooks
        </p>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="w-full">
            <SearchComponent
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearchClick={handleSearch}
              onKeyPress={handleKeyPress}
              placeholder="Search ebooks by title, author, or keywords..."
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
                aria-label="Filter by category"
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
                  aria-label="Clear all filters"
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
                aria-label="Grid view"
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
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 sm:mb-6" role="alert">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 mb-1">Error Loading Ebooks</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={() => fetchEbooks(searchTerm, currentPage, selectedCategory)}
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
            <span>Loading ebooks...</span>
          ) : (
            <>
              <span>
                Showing {ebooks.length.toLocaleString()} of {totalItems.toLocaleString()} ebooks
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
        
        {isLoading && ebooks.length > 0 && (
          <div className="flex items-center text-blue-600 text-sm">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Updating...
          </div>
        )}
      </div>

      {/* Ebooks Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8" 
          : "space-y-3 sm:space-y-4 mb-6 sm:mb-8"
      }>
        {ebooks.map((ebook) => (
          <EbookCard
            key={ebook._id}
            ebook={{
              ...ebook,
              author: getAuthorName(ebook),
              views: ebook.statistics?.views || parseInt(String(ebook.views || 0)) || 0,
              downloads: ebook.statistics?.downloads || parseInt(String(ebook.downloads || 0)) || 0,
              rating: ebook.statistics?.rating || ebook.rating || 0
            }}
            onView={() => handleView(ebook)}
            onDownload={() => handleDownload(ebook)}
            onCategoryClick={handleCategoryChange}
            variant={viewMode}
          />
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && ebooks.length === 0 && !error && (
        <div className="text-center py-8 sm:py-12">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No ebooks found</h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              {searchTerm || selectedCategory
                ? "No ebooks match your current search criteria"
                : "No ebooks are available at the moment"}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View All Ebooks
              </button>
            )}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !isLoading && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </div>
      )}

      {/* SEO-friendly pagination info for screen readers */}
      {totalPages > 1 && (
        <div className="sr-only" aria-live="polite">
          Page {currentPage} of {totalPages}, showing {ebooks.length} ebooks out of {totalItems} total
        </div>
      )}
    </div>
  );
}