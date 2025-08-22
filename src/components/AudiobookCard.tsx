// src/components/AudiobookCard.tsx
'use client';

interface AudiobookItem {
  _id: string;
  title: string;
  description?: string;
  author?: string;
  categories?: string[];
  thumbnailUrl?: string;
  coverImage?: string;
  audioUrl?: string;
  duration?: string;
  views?: number;
  downloads?: number;
  rating?: number;
  accessType?: string;
}

interface AudiobookCardProps {
  audiobook: AudiobookItem;
  onPlay: () => void;
  onDownload: () => void;
  onCategoryClick?: (category: string) => void;
  variant: 'grid' | 'list';
}

export default function AudiobookCard({ 
  audiobook, 
  onPlay, 
  onDownload, 
  onCategoryClick,
  variant = 'grid'
}: AudiobookCardProps) {
  if (!audiobook) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
        <p>Audiobook data not available</p>
      </div>
    );
  }

  const getImageUrl = () => {
    return audiobook.coverImage || audiobook.thumbnailUrl || 'https://placehold.co/400x200';
  };

  if (variant === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <img
              src={getImageUrl()}
              alt={audiobook.title || 'Audiobook cover'}
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
                  {audiobook.title || 'Untitled'}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-2 truncate">
                  by {audiobook.author || 'Unknown Author'}
                </p>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2 sm:line-clamp-3">
                  {audiobook.description || 'No description available'}
                </p>

                {audiobook.duration && (
                  <p className="text-sm text-gray-500 mb-2">
                    Duration: {audiobook.duration}
                  </p>
                )}

                {Array.isArray(audiobook.categories) && audiobook.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {audiobook.categories.slice(0, 3).map((category, index) => (
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
                  {audiobook.views && <span>{audiobook.views.toLocaleString()} listens</span>}
                  {audiobook.downloads && <span>{audiobook.downloads.toLocaleString()} downloads</span>}
                  {audiobook.rating && <span>{audiobook.rating.toFixed(1)}/5 ⭐</span>}
                </div>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0 sm:ml-4">
                <button
                  onClick={onPlay}
                  className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 rounded transition-colors whitespace-nowrap"
                >
                  Play
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

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="aspect-[3/4] relative">
        <img
          src={getImageUrl()}
          alt={audiobook.title || 'Audiobook cover'}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/400x200';
          }}
        />
        {audiobook.accessType && (
          <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {audiobook.accessType}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{audiobook.title || 'Untitled'}</h3>
        <p className="text-sm text-gray-600 mb-2">by {audiobook.author || 'Unknown Author'}</p>
        
        {audiobook.duration && (
          <p className="text-sm text-gray-500 mb-2">
            Duration: {audiobook.duration}
          </p>
        )}

        {audiobook.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-3">
            {audiobook.description}
          </p>
        )}

        {Array.isArray(audiobook.categories) && audiobook.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {audiobook.categories.slice(0, 2).map((category, index) => (
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

        <div className="flex justify-between text-xs text-gray-500 mb-4">
          {audiobook.views && <span>{audiobook.views.toLocaleString()} listens</span>}
          {audiobook.downloads && <span>{audiobook.downloads.toLocaleString()} downloads</span>}
          {audiobook.rating && <span>{audiobook.rating.toFixed(1)}/5 ⭐</span>}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onPlay}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm"
          >
            Play
          </button>
          <button
            onClick={onDownload}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}