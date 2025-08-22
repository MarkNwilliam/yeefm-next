// src/components/NoteEpubReaderClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';
import { replaceWithCDN } from '@/utils/urlUtils';
import Link from 'next/link';

interface Note {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  thumbnailUrl?: string;
  coverImage?: string;
  coverimage?: string;
  author?: string;
  course?: string;
  pageCount?: number;
  rating?: number;
  tags?: string[];
}

interface NoteEpubReaderClientProps {
  note: Note;
}

export default function NoteEpubReaderClient({ note }: NoteEpubReaderClientProps) {
  const [epubUrl, setEpubUrl] = useState<string>('');
  const [location, setLocation] = useState<string | number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEpub = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Replace with CDN if needed and set the EPUB URL
        const processedUrl = replaceWithCDN(note.fileUrl);
        setEpubUrl(processedUrl);
      } catch (err) {
        console.error('Error loading EPUB:', err);
        setError('Failed to load EPUB document');
      } finally {
        setIsLoading(false);
      }
    };

    if (note.fileUrl) {
      loadEpub();
    }
  }, [note.fileUrl]);

  const locationChanged = (epubcifi: string) => {
    setLocation(epubcifi);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EPUB...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading EPUB</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <Link
            href={`/notes/${note._id}/${encodeURIComponent(note.title.toLowerCase().replace(/\s+/g, '-'))}`}
            className="inline-flex items-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            ← Back to Note Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/notes/${note._id}/${encodeURIComponent(note.title.toLowerCase().replace(/\s+/g, '-'))}`}
                className="flex items-center text-gray-300 hover:text-yellow-400 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </Link>
              <div className="h-6 w-px bg-gray-600"></div>
              <div>
                <h1 className="text-lg font-semibold text-white truncate max-w-md">
                  {note.title}
                </h1>
                {note.author && (
                  <p className="text-sm text-gray-400">by {note.author}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/notes"
                className="px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                Browse Notes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* EPUB Reader */}
      <div style={{ height: 'calc(100vh - 80px)' }}>
        <ReactReader
          url={epubUrl}
          location={location}
          locationChanged={locationChanged}
          readerStyles={{
            ...ReactReaderStyle,
            readerArea: {
              ...ReactReaderStyle.readerArea,
              backgroundColor: '#1f2937',
              color: '#f9fafb',
            },
            arrow: {
              ...ReactReaderStyle.arrow,
              color: '#fbbf24',
            },
            arrowHover: {
              ...ReactReaderStyle.arrowHover,
              color: '#f59e0b',
            },
          }}
          epubInitOptions={{
            openAs: 'epub',
          }}
          getRendition={(rendition: any) => {
            // Customize rendition if needed
            rendition.themes.default({
              '::selection': {
                'background': 'rgba(255, 255, 0, 0.3)'
              },
              '.epubjs-hl': {
                'fill': 'yellow',
                'fill-opacity': '0.3',
                'mix-blend-mode': 'multiply'
              }
            });
          }}
        />
      </div>
    </div>
  );
}