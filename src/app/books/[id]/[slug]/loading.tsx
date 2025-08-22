import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function EbookLoadingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-6">
        {/* Back Button Skeleton */}
        <div className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4 text-gray-300" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Main Content Skeleton */}
        <div className="flex flex-col lg:flex-row items-start bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cover Image Skeleton */}
          <div className="w-full lg:w-1/4 p-6">
            <div className="aspect-[2/3] max-h-[50vh] w-full">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          </div>
          
          {/* Book Details Skeleton */}
          <div className="w-full lg:w-3/4 p-6 space-y-6">
            {/* Title and Date */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-48" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-5 w-5 rounded" />
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-32" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>

            {/* Book Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-6 border-t">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-12 w-36" />
            </div>
          </div>
        </div>

        {/* Reviews Section Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Skeleton key={j} className="h-4 w-4 rounded" />
                    ))}
                  </div>
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>

        {/* Related Books Section Skeleton */}
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <Skeleton className="h-6 w-40" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}