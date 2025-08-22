'use client'; // Add this directive at the top

import Link from 'next/link';
export const dynamic = 'force-dynamic'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h2>
          <p className="mt-2 text-gray-600">
            We couldn't load the audiobook details. Please try again.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/audiobooks"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center"
            >
              Back to Audiobooks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}