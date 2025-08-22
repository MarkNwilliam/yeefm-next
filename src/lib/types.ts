// src/lib/types.ts
export interface EbookItem {
    _id: string;
    title: string;
    description?: string;
    authors?: string[];
    author?: string;
    keywords?: string[];
    categories?: string[];
    subjects?: string[];
    type?: string;
    ebookUrl?: string;
    ebookpdfUrl?: string;
    date_added?: string;
    views?: string | number;
    downloads?: string | number;
    rating?: number;
    thumbnailUrl?: string;
    coverImage?: string;
    accessType?: string;
    PublishedOn?: string;
    statistics?: {
      views?: number;
      downloads?: number;
      rating?: number;
    };
  }
  
  export interface ApiResponse {
    data: EbookItem[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
    message?: string;
  }