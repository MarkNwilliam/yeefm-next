export default function LoadingSkeleton() {
    return (
      <div className="rounded-lg overflow-hidden shadow-md bg-white w-full flex flex-col min-h-[300px] animate-pulse">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="p-4 flex-grow">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }