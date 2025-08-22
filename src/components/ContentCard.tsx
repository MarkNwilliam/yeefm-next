'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContentCardProps {
  title: string;
  coverImage?: string;
  itemType: 'ebook' | 'audiobook' | 'chapter' | 'audiochapter' | 'notes';
  itemId: string;
  rating?: number;
  slug?: string;
  price?: number;
  currency?: string;
  authors?: string[];
}

interface ButtonConfig {
  link: string;
  text: string;
}

type ButtonConfigs = Record<ContentCardProps['itemType'], ButtonConfig>;

const defaultCoverImage = "https://yeeplatformstorage.blob.core.windows.net/assets/images/yeeplatform_book_cover.png";

const BUTTON_CONFIG: ButtonConfigs = {
  audiobook: { link: '/audiobooks/', text: 'Listen' },
  audiochapter: { link: '/audiochapters/', text: 'Listen' },
  chapter: { link: '/chapters/', text: 'Chapter' },
  notes: { link: '/notes/', text: 'Read' },
  ebook: { link: '/books/', text: 'Book' },
};

function normalizeForUrl(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function ContentCard({ 
  title, 
  coverImage, 
  itemType, 
  itemId, 
  rating = 0, 
  slug,
  price,
  currency,
  authors 
}: ContentCardProps) {
  const [imageSrc, setImageSrc] = useState(defaultCoverImage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (coverImage) {
      const img = new Image();
      img.src = coverImage;
      img.onload = () => {
        setImageSrc(coverImage);
        setIsLoading(false);
      };
      img.onerror = () => {
        setImageSrc(defaultCoverImage);
        setIsLoading(false);
      };
    } else {
      setIsLoading(false);
    }
  }, [coverImage]);

  const config = BUTTON_CONFIG[itemType];
  const linkUrl = `${config.link}${itemId}/${normalizeForUrl(slug || title)}`;

  return (
    <div className="rounded-lg overflow-hidden shadow-md bg-white w-full flex flex-col min-h-[300px] hover:shadow-lg transition-shadow">
      <Link href={linkUrl} className="block w-full">
        <div className="relative w-full h-48">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <img
            className="w-full h-full object-cover"
            src={imageSrc}
            alt={`Cover of ${title}`}
            onError={(e) => {
              e.currentTarget.src = defaultCoverImage;
            }}
          />
          {price && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white text-sm font-bold px-2 py-1 rounded-full">
              {currency} {price}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm mb-2 line-clamp-2">{title}</h3>
          {authors && (
            <p className="text-gray-600 text-xs mb-2">{authors.join(', ')}</p>
          )}
          {rating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600 text-xs ml-1">({rating})</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex justify-center">
          <Link
            href={linkUrl}
            className="bg-transparent text-blue-600 font-bold py-2 px-4 rounded border border-blue-600 hover:bg-blue-600 hover:text-white transition-all"
          >
            {config.text}
          </Link>
        </div>
      </div>
    </div>
  );
}