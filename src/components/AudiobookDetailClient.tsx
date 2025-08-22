"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ObjectId } from 'bson';

interface Audiobook {
  _id: string;
  title: string;
  description: string;
  author: string;
  ISBN?: string;
  categories: string[];
  coverImage?: string;
  coverImage_optimized_url?: string;
  cover_url?: string;
  coverimage?: string;
  audioUrl: string;
  ratings: number;
  keywords?: string;
  genre?: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userEmail: string;
}

interface ReviewsResponse {
  reviews: Review[];
  totalPages: number;
  currentPage: number;
}

interface RelatedContent {
  _id: string;
  title: string;
  coverImage: string;
  rating: number;
}

const normalizeForUrl = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default function AudiobookPage() {
  const router = useRouter();
  const params = useParams();
  const { id, slug } = params as { id: string; slug: string };

  const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
  const [audiobookDate, setAudiobookDate] = useState<string>('');
  const [reviews, setReviews] = useState<ReviewsResponse>({ 
    reviews: [], 
    totalPages: 0, 
    currentPage: 1 
  });
  const [relatedContent, setRelatedContent] = useState<RelatedContent[]>([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultCoverImage = "https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/yeeplatform_book_cover.png";

  const replaceWithFrontDoor = (url: string): string => {
    if (!url) return defaultCoverImage;
    return url.replace(
      'yeeplatformstorage.blob.core.windows.net', 
      'yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net'
    );
  };

  // Fetch audiobook data
  useEffect(() => {
    const fetchAudiobook = async () => {
      try {
        setLoading(true);
        
        if (!ObjectId.isValid(id)) {
          throw new Error('Invalid audiobook ID');
        }

        const response = await fetch(
          `https://yeeplatformbackend.azurewebsites.net/getAudiobook/${id}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch audiobook');
        }

        const data = await response.json();
        setAudiobook(data);

        // Generate creation date from ObjectId
        const objectId = new ObjectId(data._id);
        setAudiobookDate(objectId.getTimestamp().toISOString());

        // Check and redirect if slug is incorrect
        const expectedSlug = normalizeForUrl(data.title);
        if (slug !== expectedSlug) {
          router.replace(`/audiobooks/${id}/${expectedSlug}`);
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load audiobook');
        router.push('/audiobooks');
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobook();
  }, [id, slug, router]);

  // Fetch reviews
  useEffect(() => {
    if (!audiobook) return;

    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://yeeplatformbackend.azurewebsites.net/reviews/audiobook/${id}/reviews?page=${reviewsPage}&limit=2`
        );
        const data: ReviewsResponse = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [audiobook, id, reviewsPage]);

  // Fetch related content
  useEffect(() => {
    if (!audiobook) return;

    const fetchRelatedContent = async () => {
        try {
          setLoading(true);
          let relatedContentData: RelatedContent[] = [];
          
          if (audiobook.categories?.length > 0) {
            const categoryQuery = audiobook.categories.join(',');
            const response = await fetch(
              `https://yeeplatformbackend.azurewebsites.net/categoryindex/audiobook/${categoryQuery}?page=1&limit=10`
            );
            const data = await response.json();
            // Ensure we're working with an array
            relatedContentData = Array.isArray(data) ? data : (data.data || []);
          }
      
          if (relatedContentData.length < 5 && audiobook.title) {
            const response = await fetch(
              `https://yeeplatformbackend.azurewebsites.net/getallaudiobooks?search=${normalizeForUrl(audiobook.title)}&page=1&limit=10`
            );
            const data = await response.json();
            // Ensure we're working with an array and combine with previous results
            const additionalContent = Array.isArray(data) ? data : (data.data || []);
            relatedContentData = [...new Set([...relatedContentData, ...additionalContent])];
          }
      
          setRelatedContent(
            relatedContentData
              .filter((book: any) => book._id !== id) // Add type assertion if needed
              .slice(0, 10)
          );
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch related content');
        } finally {
          setLoading(false);
        }
      };

    fetchRelatedContent();
  }, [audiobook, id]);

  const handleListen = () => {
    if (!audiobook) return;
    router.push(`/audiobooks/${id}/${normalizeForUrl(audiobook.title)}/listen`);
  };

  const handleReviewsPageChange = (newPage: number) => {
    setReviewsPage(newPage);
  };

  if (loading && !audiobook) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => router.push('/audiobooks')}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Audiobooks
          </button>
        </div>
      </div>
    );
  }

  if (!audiobook) {
    return null;
  }

  const coverImageUrl = replaceWithFrontDoor(
    audiobook.coverImage_optimized_url || 
    audiobook.coverImage || 
    audiobook.cover_url || 
    audiobook.coverimage || 
    defaultCoverImage
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Audiobook",
    "name": audiobook.title,
    "description": audiobook.description,
    "image": coverImageUrl,
    "author": {
      "@type": "Person",
      "name": audiobook.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Yee FM"
    },
    "datePublished": audiobookDate,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": audiobook.ratings,
      "bestRating": 5,
      "worstRating": 1,
      "ratingCount": reviews.reviews?.length || 0
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Head>
        <title>Listen to {audiobook.title} - Free Audiobook | Yee FM</title>
        <meta 
          name="description" 
          content={`Listen to ${audiobook.title} by ${audiobook.author} for free on Yee FM. ${audiobook.description?.substring(0, 120)}...`} 
        />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <div className="container mx-auto p-4 max-w-7xl">
        <nav className="mb-6">
          <Link 
            href="/audiobooks" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Audiobooks
          </Link>
        </nav>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/3 p-6">
              <div className="relative aspect-[3/4] w-full max-w-sm mx-auto">
                <Image
                  src={coverImageUrl}
                  alt={`${audiobook.title} cover`}
                  fill
                  className="object-cover rounded-lg shadow-xl cursor-pointer transition-transform hover:scale-105"
                  onClick={handleListen}
                  priority
                />
              </div>
            </div>

            <div className="lg:w-2/3 p-6">
              <header className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {audiobook.title}
                </h1>
                <p className="text-lg text-gray-600 mb-2">
                  by {audiobook.author}
                </p>
                
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(audiobook.ratings) ? 'fill-current' : 'fill-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    ({audiobook.ratings}/5)
                  </span>
                </div>

                <button
                  onClick={handleListen}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span>Listen Now</span>
                </button>
              </header>

              <section className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {audiobook.description || 'No description available.'}
                </p>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Details
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="font-semibold text-gray-900">Author:</dt>
                    <dd className="text-gray-700">{audiobook.author || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">ISBN:</dt>
                    <dd className="text-gray-700">{audiobook.ISBN || 'N/A'}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-gray-900">Categories:</dt>
                    <dd className="text-gray-700">
                      {audiobook.categories?.join(', ') || 'N/A'}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>
        </article>

        {/* Reviews Section */}
        <section className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Add Review
            </button>
          </div>

          {reviews.reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.reviews.map((review) => (
                <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-800">{review.comment}</p>
                </div>
              ))}

              {reviews.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex space-x-2">
                    {[...Array(reviews.totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handleReviewsPageChange(pageNum)}
                          className={`px-3 py-2 rounded ${
                            reviewsPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No reviews yet. Be the first to review this audiobook!
            </p>
          )}
        </section>

        {/* Related Audiobooks */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Related Audiobooks
          </h2>
          
          {relatedContent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedContent.map((book) => (
                <Link
                  key={book._id}
                  href={`/audiobooks/${book._id}/${normalizeForUrl(book.title)}`}
                  className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="aspect-[3/4] relative overflow-hidden rounded-t-lg">
                    <Image
                      src={replaceWithFrontDoor(book.coverImage || defaultCoverImage)}
                      alt={`${book.title} cover`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(book.rating) ? 'fill-current' : 'fill-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No related audiobooks found.
            </p>
          )}
        </section>
      </div>
    </>
  );
}