'use client';

import { useState, useEffect, useCallback } from 'react';

interface ContentItem {
  _id: string;
  title: string;
  authors?: string[];
  coverImage?: string;
  coverimage_optimized_url?: string;
  coverImageMediumUrl?: string;
  thumbnailUrl?: string;
  rating?: number;
  price?: number;
  description?: string;
}

interface UseContentFetcherProps {
  contentType: 'ebooks' | 'audiobooks' | 'all';
  searchTerm?: string;
  currentPage: number;
  limit?: number;
}

interface UseContentFetcherReturn {
  items: ContentItem[];
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const API_ENDPOINTS = {
  ebooks: {
    search: 'https://yeeplatformbackend.azurewebsites.net/searchIndexedbooks',
    browse: 'https://yeeplatformbackend.azurewebsites.net/getallfreeebooks'
  },
  audiobooks: {
    search: 'https://yeeplatformbackend.azurewebsites.net/searchIndexedaudiobooks',
    browse: 'https://yeeplatformbackend.azurewebsites.net/getallaudiobooks'
  },
  all: {
    search: 'https://yeeplatformbackend.azurewebsites.net/search',
    browse: 'https://yeeplatformbackend.azurewebsites.net/getallcontent'
  }
};

export function useContentFetcher({ 
  contentType, 
  searchTerm, 
  currentPage, 
  limit = 15 
}: UseContentFetcherProps): UseContentFetcherReturn {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoints = API_ENDPOINTS[contentType];
      let url: string;

      if (searchTerm && searchTerm.trim()) {
        // Search endpoint
        if (contentType === 'all') {
          url = `${endpoints.search}?term=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${limit}`;
        } else {
          url = `${endpoints.search}?query=${encodeURIComponent(searchTerm)}&page=${currentPage}&limit=${limit}`;
        }
      } else {
        // Browse endpoint
        url = `${endpoints.browse}?page=${currentPage}&limit=${limit}`;
      }

      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        cache: 'default'
      });

      if (!response.ok) {
        throw new Error(`Data fetching failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.data) {
        const itemsArray = Array.isArray(data.data) ? data.data : [data.data];
        setItems(itemsArray);
        setTotalPages(Math.ceil((data.totalItems || itemsArray.length) / limit));
      } else {
        setItems([]);
        setTotalPages(0);
      }
    } catch (err) {
      setError(err as Error);
      console.error(`Error fetching ${contentType}:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [contentType, searchTerm, currentPage, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    totalPages,
    isLoading,
    error,
    refetch
  };
}