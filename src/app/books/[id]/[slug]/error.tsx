'use client';

import { useEffect } from 'react';
import { BookOpen, RefreshCw, Home } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function EbookErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Ebook detail page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <BookOpen className="h-12 w-12 text-red-500" />
            </div>
          </div>
          
          {/* Error Content */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Something went wrong!
          </h1>
          <p className="text-gray-600 mb-2">
            We encountered an error while loading this book.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <button 
              onClick={reset}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/books'}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
            >
              <Home className="h-4 w-4" />
              Browse Books
            </button>
          </div>

          {/* Debug info in development */}
          {process.env.NODE_ENV === 'development' && error.digest && (
            <div className="mt-6 p-3 bg-gray-100 rounded-lg text-left">
              <p className="text-xs text-gray-500 font-mono">
                Error ID: {error.digest}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}