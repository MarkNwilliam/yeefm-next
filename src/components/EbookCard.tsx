// src/components/EbookCard.tsx
'use client';

interface EbookItem {
  _id: string;
  title: string;
  description?: string;
  authors?: string[];
  author?: string;
  categories?: string[];
  thumbnailUrl?: string;
  coverImage?: string;
  ebookUrl?: string;
  ebookpdfUrl?: string;
  views?: number;
  downloads?: number;
  rating?: number;
  accessType?: string;
  onClick?: () => void;
}

interface EbookCardProps {
  ebook: EbookItem;
  onView: () => void;
  onDownload: () => void;
  onCategoryClick?: (category: string) => void;
  variant: 'grid' | 'list';
}

export default function EbookCard({ 
  ebook, 
  onView, 
  onDownload, 
  onCategoryClick,
  variant = 'grid'
}: EbookCardProps) {
  // Helper functions
  const getAuthorName = () => {
    if (Array.isArray(ebook.authors) && ebook.authors.length > 0) {
      return ebook.authors.join(', ');
    }
    if (ebook.author) {
      return ebook.author.replace(/\|\|/g, ', ');
    }
    return 'Unknown Author';
  };

  const getImageUrl = () => {
    return ebook.coverImage || ebook.thumbnailUrl || 'https://placehold.co/400x200';
  };

  if (variant === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <img
              src={getImageUrl()}
              alt={ebook.title}
              className="w-16 h-20 sm:w-20 sm:h-28 object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/400x200';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer line-clamp-2">
                  {ebook.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-2 truncate">
                  by {getAuthorName()}
                </p>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2 sm:line-clamp-3">
                  {ebook.description || 'No description available'}
                </p>

                {Array.isArray(ebook.categories) && ebook.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {ebook.categories.slice(0, 3).map((category, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded cursor-pointer hover:bg-blue-200"
                        onClick={() => onCategoryClick?.(category)}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  {ebook.views && <span>{ebook.views.toLocaleString()} views</span>}
                  {ebook.downloads && <span>{ebook.downloads.toLocaleString()} downloads</span>}
                  {ebook.rating && <span>{ebook.rating.toFixed(1)}/5 ⭐</span>}
                </div>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0 sm:ml-4">
                <button
                  onClick={onView}
                  className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 rounded transition-colors whitespace-nowrap"
                >
                  Read Now
                </button>
                <button
                  onClick={onDownload}
                  className="flex-1 sm:flex-initial bg-gray-600 hover:bg-gray-700 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 rounded transition-colors whitespace-nowrap"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default grid view
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <div className="aspect-[3/4] relative">
        <img
          src={getImageUrl()}
          alt={ebook.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/400x200';
          }}
        />
        {ebook.accessType && (
          <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {ebook.accessType}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{ebook.title}</h3>
        <p className="text-sm text-gray-600 mb-2">by {getAuthorName()}</p>
        
        {ebook.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-3">
            {ebook.description}
          </p>
        )}

        {/* Categories */}
        {Array.isArray(ebook.categories) && ebook.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {ebook.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 px-2 py-1 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => onCategoryClick?.(category)}
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          {ebook.views && <span>{ebook.views.toLocaleString()} views</span>}
          {ebook.downloads && <span>{ebook.downloads.toLocaleString()} downloads</span>}
          {ebook.rating && <span>{ebook.rating.toFixed(1)}/5 ⭐</span>}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              onView();
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
          >
            Read
          </button>
      
        </div>
      </div>
    </div>
  );
}