// src/app/blogs/[id]/[slug]/error.tsx
'use client'; // Add this directive at the top

import { useEffect } from 'react';
export const dynamic = 'force-dynamic'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center text-red-600 mt-10">
      <h2 className="text-2xl font-bold mb-4">Error</h2>
      <p>{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
      >
        Try again
      </button>
    </div>
  );
}