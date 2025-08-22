'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { replaceWithCDN } from '@/utils/urlUtils';
import Link from 'next/link';
import ContentCard from '@/components/ContentCard';

interface Note {
    _id: string;
    title: string;
    description: string;
    content?: string; // Made optional to match API response
    thumbnailUrl?: string; // Made optional for flexibility
    coverImage?: string;  
    coverimage?: string;
    fileUrl?: string; // Made optional as it might be doc_location instead
    doc_location?: string; // Added to match API response
    fileType?: 'pdf' | 'epub' | string; // Extended to allow other file types
    rating?: number; // Made optional
    createdAt?: string; // Made optional
    updatedAt?: string; // Made optional
    publishedDate?: string; // Added to match API response
    tags?: string[]; // Made optional
    keywords?: string[]; // Added from API response
    categories?: string[]; // Added from API response
    pageCount?: number;
    author?: string;
    course?: string;
    views?: number;
    downloads?: number;
    monetization?: boolean; // Added from API response
    type?: string; // Added from API response
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
  }
  
const DEFAULT_IMAGES = {
  cover: 'https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/Y.webp',
  thumbnail: 'https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/notes-thumbnail.webp'
};

interface Recommendation {
  _id: string;
  title: string;
  thumbnailUrl: string;
  coverImage?: string;  
  coverimage?: string;  
  rating: number;
  slug?: string;
  authors?: string[];
  fileType?: 'pdf' | 'epub';
  itemType: 'notes' | 'ebooks';
}

interface NoteDetailClientProps {
  note: Note;
  recommendations?: Recommendation[];
}

const API_CONFIG = {
  baseUrl: 'https://yeeplatformbackend.azurewebsites.net',
  endpoints: {
    getChapter: '/getChapter',
    searchChapters: '/searchIndexedchapters'
  }
};

const detectFileType = (fileUrl: string, fileType?: string): 'pdf' | 'epub' => {
  if (fileType) return fileType as 'pdf' | 'epub';
  const url = fileUrl.toLowerCase();
  if (url.includes('.epub') || url.endsWith('.epub')) return 'epub';
  return 'pdf';
};

const generateReadingUrl = (item: { _id: string; title: string; fileType?: 'pdf' | 'epub'; itemType?: string }) => {
  const baseSlug = encodeURIComponent(item.title.toLowerCase().replace(/\s+/g, '-'));
  const fileType = item.fileType || 'pdf';
  const itemType = item.itemType || 'notes';
  
  if (fileType === 'epub') {
    return `/${itemType}/${item._id}/read-epub/${baseSlug}`;
  } else {
    return `/${itemType}/${item._id}/read/${baseSlug}`;
  }
};

export default function NoteDetailClient({ note, recommendations }: NoteDetailClientProps) {
  const [similarNotes, setSimilarNotes] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const noteFileType = detectFileType(note.fileUrl, note.fileType);
  const readingUrl = generateReadingUrl({ 
    _id: note._id, 
    title: note.title, 
    fileType: noteFileType,
    itemType: 'notes'
  });

  const fetchSimilarNotes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const keywords = [
        ...(note.tags || []),
      ].filter(Boolean).slice(0, 5);

      const searchQuery = keywords.join(' ');
      const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.searchChapters}?query=${encodeURIComponent(searchQuery)}&limit=6`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      const notes = (data.data || [])
        .filter((item: any) => item._id !== note._id)
        .map((item: any) => ({
          _id: item._id,
          title: item.title,
          thumbnailUrl: item.thumbnailUrl || item.coverImage || item.coverimage || DEFAULT_IMAGES.thumbnail,
          rating: item.rating || 0,
          itemType: 'notes' as const
        }));

      setSimilarNotes(notes);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Error fetching similar notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSimilarNotes();
  }, []);

  const allRecommendations = [
    ...(recommendations || []),
    ...similarNotes
  ].filter((item, index, self) => 
    self.findIndex(i => i._id === item._id) === index
  ).slice(0, 6);

  const getImageUrl = (item: Recommendation) => {
    return replaceWithCDN(
      item.thumbnailUrl || 
      item.coverImage || 
      item.coverimage || 
      DEFAULT_IMAGES.thumbnail
    );
  };
  

    // Helper function to get the best available image
    const getCoverImage = () => {
        if (imageError) return DEFAULT_IMAGES.cover;
        return note.coverImage || note.coverimage || note.thumbnailUrl || DEFAULT_IMAGES.cover;
      };
    
      // Helper function to get file URL
      const getFileUrl = () => {
        return note.fileUrl || note.doc_location || '';
      };
    
      // Helper function to get statistics
      const getViews = () => {
        return note.statistics?.views || note.views || 0;
      };
    
      const getDownloads = () => {
        return note.statistics?.downloads || note.downloads || 0;
      };
    
      const getRating = () => {
        return note.statistics?.rating || note.rating || 0;
      };
    
      // Helper function to get page count
      const getPageCount = () => {
        return note.details?.pages || note.pageCount || 0;
      };
    
      // Helper function to get file size
      const getFileSize = () => {
        return note.details?.size || 'Unknown size';
      };
    
      // Helper function to get all tags/keywords
      const getAllTags = () => {
        const allTags = [
          ...(note.tags || []),
          ...(note.keywords || []),
          ...(note.categories || [])
        ];
        // Remove duplicates and empty values
        return [...new Set(allTags.filter(tag => tag && tag.trim()))];
      };
    
      // Helper function to get published date
      const getPublishedDate = () => {
        return note.publishedDate || note.createdAt || new Date().toISOString();
      };
    
      useEffect(() => {
        setIsLoading(false);
      }, []);
    
      const handleImageError = () => {
        setImageError(true);
      };
    
      const handleReadOnline = () => {
        // Navigate to PDF reader
        const slug = encodeURIComponent(note.title.toLowerCase().replace(/\s+/g, '-'));
        window.location.href = `/notes/${note._id}/read/${slug}`;
      };
    

    
      if (isLoading) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-8">
              <div className="animate-pulse">
                <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );
      }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 inline-flex items-center justify-center rounded-md border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M12 19l-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Notes
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            {/* Cover Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <div className="relative h-64 md:h-full min-h-[300px]">
                <img
                  src={getCoverImage()}
                  alt={note.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>

            {/* Content Info */}
            <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {note.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    {note.author && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{note.author}</span>
                      </div>
                    )}

                    {note.course && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>{note.course}</span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(getPublishedDate())}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-6">
                    {note.description || `Comprehensive study material for ${note.title}`}
                  </p>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {getRating() > 0 && (
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 font-semibold text-amber-700">{getRating()}</span>
                        </div>
                        <p className="text-xs text-amber-600">Rating</p>
                      </div>
                    )}

                    {getViews() > 0 && (
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-700 mb-1">
                          {getViews().toLocaleString()}
                        </div>
                        <p className="text-xs text-blue-600">Views</p>
                      </div>
                    )}

                    {getDownloads() > 0 && (
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="font-semibold text-green-700 mb-1">
                          {getDownloads().toLocaleString()}
                        </div>
                        <p className="text-xs text-green-600">Downloads</p>
                      </div>
                    )}

                    {getPageCount() > 0 && (
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-purple-700 mb-1">
                          {getPageCount()}
                        </div>
                        <p className="text-xs text-purple-600">Pages</p>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {getAllTags().length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {getAllTags().slice(0, 8).map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReadOnline}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Read Online
                  </button>

        
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Document Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">File Type:</span>
                <span className="font-medium text-gray-900">
                  {(note.details?.format || note.fileType || 'PDF').toUpperCase()}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">File Size:</span>
                <span className="font-medium text-gray-900">{getFileSize()}</span>
              </div>
              
              {getPageCount() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Pages:</span>
                  <span className="font-medium text-gray-900">{getPageCount()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Access:</span>
                <span className={`font-medium ${note.monetization ? 'text-amber-600' : 'text-green-600'}`}>
                  {note.monetization ? 'Premium' : 'Free'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Published:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(getPublishedDate())}
                </span>
              </div>
              
              {note.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Updated:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(note.updatedAt)}
                  </span>
                </div>
              )}
              
              {getViews() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Views:</span>
                  <span className="font-medium text-gray-900">
                    {getViews().toLocaleString()}
                  </span>
                </div>
              )}
              
              {getDownloads() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads:</span>
                  <span className="font-medium text-gray-900">
                    {getDownloads().toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Preview */}
        {note.content && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Content Preview</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="whitespace-pre-line">{note.content.slice(0, 500)}...</p>
              <button
                onClick={handleReadOnline}
                className="mt-4 text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Read full content →
              </button>
            </div>
          </div>
        )}

        {/* Recommendations Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <svg className="mr-2 h-5 w-5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4l3 3V8l-3 3z"/>
                    <path d="M22 9 12 5 2 9l10 4 10-4z"/>
                  </svg>
                  Recommended for You
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Similar notes based on this topic
                </p>
              </div>
              {isLoading && (
                <svg className="animate-spin h-5 w-5 text-yellow-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-yellow-50 border-b border-yellow-200">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          )}

          {allRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {allRecommendations.map((item) => (
                <div key={item._id} className="relative group">
                  <ContentCard
                    title={item.title}
                    coverImage={getImageUrl(item)}
                    itemType={item.itemType === 'ebooks' ? 'ebook' : item.itemType}
                    itemId={item._id}
                    rating={item.rating}
                    slug={item.slug}
                    authors={item.authors}
                  />
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <span className={`text-xs font-medium ${
                      item.itemType === 'ebooks' ? 'text-green-700' : 'text-blue-700'
                    }`}>
                      {item.itemType === 'ebooks' ? 'E-book' : 'Notes'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : !isLoading ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recommendations available</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for related content</p>
              <div className="mt-4">
                <Link
                  href="/notes"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Browse All Notes
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 text-yellow-500 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span className="text-sm text-gray-600">Loading recommendations...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}