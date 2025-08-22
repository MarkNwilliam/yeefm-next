export default function Loading() {
    return (
      <div className="container mx-auto p-4 max-w-7xl animate-pulse">
        {/* Back Button Skeleton */}
        <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
  
        {/* Main Content Area */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Cover Image Skeleton */}
            <div className="lg:w-1/3 p-6">
              <div className="aspect-[3/4] w-full max-w-sm mx-auto bg-gray-200 rounded-lg"></div>
            </div>
  
            {/* Content Skeleton */}
            <div className="lg:w-2/3 p-6 space-y-6">
              {/* Title and Author */}
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                
                {/* Ratings */}
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-5 w-5 bg-gray-200 rounded-full"></div>
                  ))}
                  <div className="h-5 bg-gray-200 rounded w-12"></div>
                </div>
                
                {/* Listen Button */}
                <div className="h-10 bg-gray-200 rounded w-40"></div>
              </div>
  
              {/* Description */}
              <div className="space-y-3">
                <div className="h-7 bg-gray-200 rounded w-32"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
  
              {/* Details */}
              <div className="space-y-3">
                <div className="h-7 bg-gray-200 rounded w-24"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Reviews Section Skeleton */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-4 w-4 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Related Audiobooks Skeleton */}
        <div className="mt-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="group block bg-white rounded-lg shadow-md">
                <div className="aspect-[3/4] w-full bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-full"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-4 w-4 bg-gray-200 rounded-full"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }