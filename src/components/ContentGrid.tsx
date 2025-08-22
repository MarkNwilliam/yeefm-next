'use client';

import ContentCard from './ContentCard';
import LoadingSkeleton from './LoadingSkeleton';

interface ContentItem {
  _id: string;
  title: string;
  authors?: string[];
  coverImage?: string;
  coverimage_optimized_url?: string;
  coverImageMediumUrl?: string;
  thumbnailUrl?: string;
  rating?: number;
  price?: number;
}

interface ContentGridProps {
  items: ContentItem[];
  isLoading: boolean;
  error: Error | null;
  itemType: 'ebook' | 'audiobook';
  onRefresh?: () => void;
}

export default function ContentGrid({ 
  items, 
  isLoading, 
  error, 
  itemType,
  onRefresh 
}: ContentGridProps) {
  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <p className="text-red-800 text-center mb-4">Failed to load content. Please try again.</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="col-span-full flex justify-center py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md text-center">
          <p className="text-yellow-800">No results found. Try a different search term.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item, index) => {
        const coverImage = item.coverimage_optimized_url || 
                          item.coverImageMediumUrl || 
                          item.coverImage || 
                          item.thumbnailUrl;
        
        return (
          <ContentCard
            key={item._id || index}
            title={item.title}
            coverImage={coverImage}
            itemType={itemType}
            itemId={item._id}
            rating={item.rating}
            slug={item.title}
            authors={item.authors}
            price={item.price}
          />
        );
      })}
    </div>
  );
}