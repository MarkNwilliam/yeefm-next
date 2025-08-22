'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import ContentCard from './ContentCard';
import CustomPagination from './CustomPagination';
import { replaceWithCDN } from '@/utils/urlUtils';

const ITEMS_PER_PAGE = 15;

export default function NotesListClient({
  initialData,
  currentPage,
  searchQuery,
}: {
  initialData: any;
  currentPage: number;
  searchQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState({
    items: initialData.data || [],
    totalPages: Math.ceil((initialData.totalItems || 0) / ITEMS_PER_PAGE),
    isLoading: false,
    error: null,
    searchTerm: searchQuery || '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (state.searchTerm) {
      params.set('query', state.searchTerm);
    } else {
      params.delete('query');
    }
    params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-500"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            Study Notes & PPTs
          </h1>
          <p className="text-gray-600">
            Explore our collection of educational materials for your classes
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for notes..."
              value={state.searchTerm}
              onChange={(e) => setState({...state, searchTerm: e.target.value})}
              className="pl-10 pr-24 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-3 h-4 w-4 text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <button
              type="submit"
              className="absolute right-2 top-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md text-sm font-medium"
            >
              Search
            </button>
          </div>
        </form>

        {state.isLoading ? (
          <div className="flex justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : state.error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto h-6 w-6 text-red-500 mb-2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-red-600">{state.error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {state.totalPages > 1 && (
              <div className="mb-6">
                <CustomPagination
                  totalPages={state.totalPages}
                  currentPage={currentPage}
                  onChange={handlePageChange}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.items.length > 0 ? (
                state.items.map((item: any) => (
                  <ContentCard
                    key={item._id}
                    title={item.title}
                    coverImage={replaceWithCDN(item.thumbnailUrl || item.coverImage)}
                    itemType="notes"
                    itemId={item._id}
                    rating={item.rating}
                    slug={item.slug}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">
                    No notes found. Try adjusting your search.
                  </p>
                </div>
              )}
            </div>

            {state.totalPages > 1 && (
              <div className="mt-6">
                <CustomPagination
                  totalPages={state.totalPages}
                  currentPage={currentPage}
                  onChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}