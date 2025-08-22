'use client';

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Star, ArrowLeft, Clock, User, Tag, DollarSign, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ContentCard from './ContentCard';
import { Skeleton } from './ui/skeleton';
import { ObjectId } from 'bson';

const DEFAULT_COVER_IMAGE = "https://yeeplatformstorage.blob.core.windows.net/assets/images/yeeplatform_book_cover.png";
const REVIEWS_PER_PAGE = 2;
const RELATED_CONTENT_PER_PAGE = 10;

interface EbookDetailClientProps {
  id: string;
  slug: string;
}

interface Review {
  rating: number;
  comment: string;
  createdAt: string;
  userEmail?: string;
}

interface Ebook {
  _id: string;
  title: string;
  description?: string;
  authors?: string[] | string;
  author?: string[] | string;
  categories?: string[];
  coverImage?: string;
  coverImage_optimized_url?: string;
  coverimage?: string;
  cover_url?: string;
  ebookUrl?: string;
  ebookurl?: string;
  ebook_url?: string;
  ratings?: string | number;
  price?: number;
  monetization?: boolean;
  publishedDate?: string;
}

interface EbookState {
  ebook: Ebook | null;
  loading: boolean;
  error: string | null;
  reviews: {
    reviews: Review[];
    totalPages: number;
  };
  relatedContent: Ebook[];
  reviewsPage: number;
  relatedContentPage: number;
  relatedContentLoading: boolean;
}

// Helper functions
const replaceWithCDN = (url: string): string => {
  if (!url) return DEFAULT_COVER_IMAGE;
  return url.replace('https://yeeplatformstorage.blob.core.windows.net', 'https://yeeplatform.azureedge.net');
};

const normalizeForUrl = (str: string): string => {
  return str.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
};

const normalizeAuthors = (authorData: any): string => {
  if (!authorData) return 'Unknown';
  if (Array.isArray(authorData)) return authorData.length > 0 ? authorData.join(', ') : 'Unknown';
  if (typeof authorData === 'string') {
    const authors = authorData.split(',').map((author: string) => author.trim()).filter(Boolean);
    return authors.length > 0 ? authors.join(', ') : 'Unknown';
  }
  return 'Unknown';
};

const normalizeCategories = (categoryData: any): string => {
  if (!categoryData) return 'Uncategorized';
  
  if (Array.isArray(categoryData)) {
    const processedCategories = categoryData
      .map(category => {
        if (!category) return '';
        const parts = category.split(',');
        const lastPart = parts[parts.length - 1].trim();
        return lastPart.replace(/^bic Book Industry Communication,?\s*/, '').trim();
      })
      .filter(category => category && category.trim());

    return processedCategories.length > 0 
      ? [...new Set(processedCategories)].join(', ')
      : 'Uncategorized';
  }
  
  if (typeof categoryData === 'string') {
    const category = categoryData.trim();
    return category ? category : 'Uncategorized';
  }
  
  return 'Uncategorized';
};

const isPdf = (url: string): boolean => url && url.toLowerCase().endsWith('.pdf');

const getFileType = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    return extension || null;
  } catch (error) {
    console.error("Error parsing URL:", error);
    return null;
  }
};

// Loading skeleton components
const EbookDetailSkeleton = () => (
  <div className="flex flex-col lg:flex-row items-start bg-white rounded-lg shadow p-6">
    <div className="w-full lg:w-1/4 mb-6 lg:mb-0">
      <Skeleton className="aspect-[2/3] w-full max-h-[50vh] rounded-lg" />
    </div>
    <div className="w-full lg:w-3/4 lg:ml-6">
      <Skeleton className="h-8 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-6 w-6 mr-1" />
        ))}
      </div>
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="flex gap-4 mt-6">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-24" />
      </div>
    </div>
  </div>
);

const RelatedBooksLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-md p-4">
        <Skeleton className="aspect-[2/3] w-full rounded-lg mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>
    ))}
  </div>
);

// Cover Image Component
const CoverImage: React.FC<{ src: string; alt: string; onClick: () => void }> = ({ src, alt, onClick }) => (
  <div className="aspect-[2/3] max-h-[50vh] w-full relative mx-auto">
    {src ? (
      <img
        src={src}
        alt={alt}
        onClick={onClick}
        className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300"
        loading="lazy"
      />
    ) : (
      <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
    )}
  </div>
);

// Rating Component
const RatingDisplay: React.FC<{ rating: number; showValue?: boolean }> = ({ rating, showValue = true }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
    {showValue && <span className="text-sm text-gray-600">({rating.toFixed(1)})</span>}
  </div>
);

const EbookDetailClient: React.FC<EbookDetailClientProps> = ({ id, slug }) => {
  const router = useRouter();
  const { user } = useAuth();
  const relatedContentRef = useRef<HTMLDivElement>(null);
  
  const [ebookDate, setEbookDate] = useState<string>('');
  const [isRented, setIsRented] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [state, setState] = useState<EbookState>({
    ebook: null,
    loading: true,
    error: null,
    reviews: { reviews: [], totalPages: 0 },
    relatedContent: [],
    reviewsPage: 1,
    relatedContentPage: 1,
    relatedContentLoading: false,
  });

  const maxDescriptionLength = 800;

  // Memoized cover image URL
  const coverImageUrl = useMemo(() => {
    if (!state.ebook) return DEFAULT_COVER_IMAGE;
    const imageUrl = state.ebook.coverImage_optimized_url || 
                    state.ebook.coverImage || 
                    state.ebook.coverimage || 
                    state.ebook.cover_url || 
                    DEFAULT_COVER_IMAGE;
    return isPdf(imageUrl) ? DEFAULT_COVER_IMAGE : replaceWithCDN(imageUrl);
  }, [state.ebook]);

  // Check rental status
  const checkRentalStatus = useCallback(async () => {
    if (!user?.uid || !id) return;

    try {
      const response = await fetch(
        `https://yeeplatformbackend.azurewebsites.net/getrentalstatus/${user.uid}/${id}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setIsRented(data.paid);
      }
    } catch (error) {
      console.error('Error checking rental status:', error);
      setIsRented(false);
    }
  }, [user?.uid, id]);

  // Fetch related content
  const fetchRelatedContent = useCallback(async (categories: string[] = [], title: string = '') => {
    setState(prev => ({ ...prev, relatedContentLoading: true }));

    let relatedContentData: Ebook[] = [];

    // Try to fetch by categories first
    for (const category of categories) {
      if (!category) continue;
      try {
        const response = await fetch(
          `https://yeeplatformbackend.azurewebsites.net/categoryindex/ebook/${normalizeForUrl(category)}?page=${state.relatedContentPage}&limit=${RELATED_CONTENT_PER_PAGE}`
        );
        
        if (response.ok) {
          const data = await response.json();
          relatedContentData = Array.isArray(data) ? data : [];
          if (relatedContentData.length > 0) break;
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
      }
    }

    // If no results from categories, try by title
    if (relatedContentData.length === 0 && title) {
      try {
        const response = await fetch(
          `https://yeeplatformbackend.azurewebsites.net/searchIndexedbooks?query=${normalizeForUrl(title)}&page=${state.relatedContentPage}&limit=${RELATED_CONTENT_PER_PAGE}`
        );
        
        if (response.ok) {
          const data = await response.json();
          relatedContentData = Array.isArray(data.data) ? data.data : [];
          relatedContentData = relatedContentData.filter(book => book._id !== id);
        }
      } catch (err) {
        console.error('Error fetching by title:', err);
      }
    }

    // If still no results, fetch general ebooks
    if (relatedContentData.length === 0) {
      try {
        const response = await fetch(
          `https://yeeplatformbackend.azurewebsites.net/getallebooks?page=${state.relatedContentPage}&limit=${RELATED_CONTENT_PER_PAGE}`
        );
        
        if (response.ok) {
          const data = await response.json();
          relatedContentData = Array.isArray(data.data) ? data.data : [];
          relatedContentData = relatedContentData.filter(book => book._id !== id);
        }
      } catch (err) {
        console.error('Error fetching all ebooks:', err);
      }
    }

    setState(prev => ({ 
      ...prev, 
      relatedContent: relatedContentData,
      relatedContentLoading: false 
    }));
  }, [id, state.relatedContentPage]);

  // Fetch main ebook data
  const fetchEbookData = useCallback(async () => {
    try {
      const [ebookResponse, reviewsResponse] = await Promise.all([
        fetch(`https://yeeplatformbackend.azurewebsites.net/getEbook/${id}`),
        fetch(`https://yeeplatformbackend.azurewebsites.net/reviews/ebook/${id}/reviews?page=${state.reviewsPage}&limit=${REVIEWS_PER_PAGE}`)
      ]);

      if (!ebookResponse.ok) {
        throw new Error(ebookResponse.status === 404 ? 'Ebook not found' : 'Failed to fetch ebook');
      }

      const [ebookData, reviewsData] = await Promise.all([
        ebookResponse.json(),
        reviewsResponse.json()
      ]);

      // Generate creation date from ObjectId
      try {
        const objectId = new ObjectId(ebookData._id);
        const idTimestamp = objectId.getTimestamp();
        setEbookDate(idTimestamp.toISOString());
      } catch (err) {
        console.error('Error parsing ObjectId:', err);
        setEbookDate(new Date().toISOString());
      }

      setState(prev => ({
        ...prev,
        ebook: ebookData,
        reviews: reviewsData,
        loading: false,
        error: null
      }));

      // Check if slug matches expected slug
      const expectedSlug = normalizeForUrl(ebookData.title);
      if (slug !== expectedSlug) {
        router.replace(`/books/${id}/${expectedSlug}`);
      }

    } catch (error) {
      console.error('Error fetching ebook data:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch ebook',
        loading: false
      }));
    }
  }, [id, slug, router, state.reviewsPage]);

  // Handle reading the book
  const handleReadBook = useCallback(() => {
    if (!state.ebook) return;

    const fileType = getFileType(
      state.ebook.ebookUrl || state.ebook.ebookurl || state.ebook.ebook_url || ''
    );

    if (state.ebook.monetization) {
      if (fileType === 'pdf') {
        router.push(`/premium-books/${id}/read/${normalizeForUrl(slug)}`);
        return;
      }
      if (fileType === 'epub') {
        router.push(`/premium-books/read-epub/${id}/${normalizeForUrl(slug)}`);
        return;
      }
    }

    // Handle non-monetized books
    if (fileType === 'pdf' || !fileType) {
      router.push(`/books/${id}/read/${normalizeForUrl(slug)}`);
    } else if (fileType === 'epub') {
      router.push(`/books/${id}/read-epub/${normalizeForUrl(slug)}`);
    }
  }, [state.ebook, id, slug, router]);

  // Initial data fetch
  useEffect(() => {
    fetchEbookData();
  }, [fetchEbookData]);

  // Check rental status when user or id changes
  useEffect(() => {
    checkRentalStatus();
  }, [checkRentalStatus]);

  // Fetch related content when ebook data is available
  useEffect(() => {
    if (state.ebook) {
      fetchRelatedContent(state.ebook.categories, state.ebook.title);
    }
  }, [state.ebook, fetchRelatedContent]);

  // Toggle description
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  // Handle back navigation
  const handleBack = () => {
    router.back();
  };

  // Error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <BookOpen className="h-12 w-12 text-red-500" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Book Not Found</h1>
            <p className="text-gray-600 mb-8">
              We couldn't find the book you're looking for. It may have been removed or the URL might be incorrect.
            </p>
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4 justify-center">
              <button 
                onClick={handleBack}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Back to Books
              </button>
              <button 
                onClick={() => router.push('/')}
                className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200"
              >
                Go to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (state.loading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <EbookDetailSkeleton />
      </div>
    );
  }

  // No ebook found
  if (!state.ebook) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <BookOpen className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Book Not Available</h1>
          <p className="text-gray-600 mb-6">
            This book is currently not available in our library.
          </p>
          <button 
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Browse Other Books
          </button>
        </div>
      </div>
    );
  }

  const { ebook, reviews, relatedContent } = state;
  const priceInSelectedCurrency = (ebook.price || 0) * 1; // Assuming 1:1 exchange rate for now

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-start bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="w-full lg:w-1/4 p-6">
          <CoverImage
            src={coverImageUrl}
            alt={ebook.title}
            onClick={handleReadBook}
          />
        </div>
        
        {/* Book Details */}
        <div className="w-full lg:w-3/4 p-6">
          <div className="space-y-4">
            {/* Title and Date */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {ebook.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Clock className="h-4 w-4" />
                <span>
                  {ebook.publishedDate 
                    ? `Published: ${new Date(ebookDate).toLocaleDateString()}`
                    : `Added: ${new Date(ebookDate).toLocaleDateString()}`
                  }
                </span>
              </div>
              <RatingDisplay rating={parseFloat(ebook.ratings?.toString() || '0')} />
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Description
              </h2>
              <div className="text-gray-700 leading-relaxed">
                <p>
                  {showFullDescription || !ebook.description || ebook.description.length <= maxDescriptionLength
                    ? (ebook.description || 'No description available')
                    : `${ebook.description.substring(0, maxDescriptionLength)}...`}
                </p>
                {ebook.description && ebook.description.length > maxDescriptionLength && (
                  <button
                    onClick={toggleDescription}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-2 transition-colors"
                  >
                    {showFullDescription ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show More
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Book Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Author
                </h3>
                <p className="text-gray-700">{normalizeAuthors(ebook.authors || ebook.author)}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Categories
                </h3>
                <p className="text-gray-700">{normalizeCategories(ebook.categories)}</p>
              </div>
            </div>

            {/* Price and Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t">
              {ebook.monetization && !isRented && (
                <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">
                    Price: ${priceInSelectedCurrency.toFixed(2)}
                  </span>
                </div>
              )}

              <button
                onClick={handleReadBook}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                {isRented ? 'Read Book' : (ebook.monetization ? 'Read Preview' : 'Read Book')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Star className="h-5 w-5" />
            Reviews ({reviews.reviews?.length || 0})
          </h3>
          <button 
            className="text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
            onClick={() => {
              if (user) {
                // Handle add review - you'll need to implement this
                console.log('Add review clicked');
              } else {
                // Handle signup/login
                console.log('Please log in to add review');
              }
            }}
          >
            Add Review
          </button>
        </div>

        <div className="space-y-4">
          {reviews.reviews && reviews.reviews.length > 0 ? (
            reviews.reviews.map((review, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <RatingDisplay rating={review.rating || 0} showValue={false} />
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                {review.userEmail && (
                  <p className="text-xs text-gray-500 mt-2">
                    By: {review.userEmail}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No reviews yet</p>
              <p className="text-gray-400">Be the first to review this book!</p>
            </div>
          )}
        </div>

        {/* Reviews Pagination */}
        {reviews.reviews && reviews.reviews.length > 0 && reviews.totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  reviewsPage: Math.max(1, prev.reviewsPage - 1) 
                }))}
                disabled={state.reviewsPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                {state.reviewsPage} of {reviews.totalPages}
              </span>
              <button
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  reviewsPage: Math.min(reviews.totalPages, prev.reviewsPage + 1) 
                }))}
                disabled={state.reviewsPage === reviews.totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Related Books Section */}
      <div className="bg-white rounded-lg shadow-lg p-6" ref={relatedContentRef}>
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Related Books
        </h3>
        
        {state.relatedContentLoading ? (
          <RelatedBooksLoadingSkeleton />
        ) : relatedContent.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedContent.map((content, index) => (
                <div key={index} className="transform hover:scale-105 transition-transform duration-200">
                  <ContentCard
                    title={content.title}
                    coverImage={replaceWithCDN(
                      content.coverImage_optimized_url ||
                      content.coverImage ||
                      content.coverimage ||
                      content.cover_url ||
                      DEFAULT_COVER_IMAGE
                    )}
                    author={Array.isArray(content.authors) ? content.authors.join(', ') : content.authors}
                    publishedDate={content.publishedDate}
                    description={content.description}
                    itemType="ebook"
                    itemId={content._id}
                    onClick={() => {
                      router.push(`/books/${content._id}/${normalizeForUrl(content.title)}`);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Related Content Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setState(prev => ({ 
                      ...prev, 
                      relatedContentPage: Math.max(1, prev.relatedContentPage - 1) 
                    }));
                  }}
                  disabled={state.relatedContentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {state.relatedContentPage}
                </span>
                <button
                  onClick={() => {
                    setState(prev => ({ 
                      ...prev, 
                      relatedContentPage: prev.relatedContentPage + 1 
                    }));
                  }}
                  disabled={relatedContent.length < RELATED_CONTENT_PER_PAGE}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No related books found</p>
            <p className="text-gray-400">Check back later for more recommendations</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookDetailClient;