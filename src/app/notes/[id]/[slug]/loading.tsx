'use client'; // Required for loading components in Next.js 13+

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-md mx-auto mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-md mx-auto"></div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-8">
          <div className="relative h-12 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Image Placeholder */}
              <div className="w-full h-48 bg-gray-200"></div>
              
              {/* Text Content Placeholder */}
              <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center mt-8">
          <div className="h-10 w-64 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}