// src/components/NotePDFReaderClient.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Viewer, Worker, ScrollMode, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { replaceWithCDN } from '@/utils/urlUtils';
import Link from 'next/link';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface Note {
  _id: string;
  title: string;
  description: string;
  doc_location: string;
  thumbnailUrl?: string;
  coverImage?: string;
  coverimage?: string;
  author?: string;
  course?: string;
  pageCount?: number;
  rating?: number;
  tags?: string[];
}

interface NotePDFReaderClientProps {
  note: Note;
}

export default function NotePDFReaderClient({ note }: NotePDFReaderClientProps) {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Create plugin instance with mobile-optimized settings
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => isMobile ? [] : defaultTabs,
    toolbarPlugin: {
      fullScreenPlugin: {
        enableShortcuts: false,
      },
    },
  });

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setLoadProgress(10);
        
        console.log('Loading PDF:', note.doc_location);
        
        const processedUrl = replaceWithCDN(note.doc_location);
        console.log('Processed URL:', processedUrl);
        
        setLoadProgress(30);
        setPdfUrl(processedUrl);

        // Test accessibility with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const testResponse = await fetch(processedUrl, { 
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!testResponse.ok) {
          throw new Error(`PDF not accessible (HTTP ${testResponse.status})`);
        }
        
        console.log('PDF accessibility verified');
        setLoadProgress(60);
      } catch (err) {
        console.error('PDF loading error:', err);
        if (err.name === 'AbortError') {
          setError('Request timeout - PDF may be too large or server is slow');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load PDF document');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (note.doc_location) {
      loadPDF();
    }
  }, [note.doc_location]);

  const handleWorkerProgress = useCallback((progress: number) => {
    setLoadProgress(Math.max(60, Math.round(progress * 100)));
  }, []);

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full">
          {/* Enhanced loading animation */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin"
              style={{
                animationDuration: '1s',
                transform: `rotate(${loadProgress * 3.6}deg)`
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-slate-700">{loadProgress}%</span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Loading PDF</h3>
          <p className="text-slate-600 mb-4">
            {loadProgress < 20 ? 'Connecting to server...' : 
             loadProgress < 50 ? 'Verifying document...' : 
             loadProgress < 80 ? 'Preparing viewer...' : 
             'Almost ready...'}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${loadProgress}%` }}
            ></div>
          </div>
          
          {/* Cancel option */}
          <Link
            href={`/notes/${note._id}/${encodeURIComponent(note.title.toLowerCase().replace(/\s+/g, '-'))}`}
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go back
          </Link>
        </div>
      </div>
    );
  }

  // Error Screen
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">Unable to Load PDF</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
              <Link
                href={`/notes/${note._id}/${encodeURIComponent(note.title.toLowerCase().replace(/\s+/g, '-'))}`}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-center"
              >
                Go Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-slate-100`}
    >
      {/* Enhanced Header */}
      <header className={`bg-white shadow-sm border-b ${isFullscreen ? '' : 'sticky top-0'} z-40`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <Link
                href={`/notes/${note._id}/${encodeURIComponent(note.title.toLowerCase().replace(/\s+/g, '-'))}`}
                className="flex items-center text-slate-600 hover:text-amber-600 transition-colors p-2 rounded-lg hover:bg-slate-50"
              >
                <svg className="w-5 h-5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </Link>
              
              <div className="h-6 w-px bg-slate-300 hidden sm:block"></div>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-semibold text-slate-900 truncate">
                  {note.title}
                </h1>
                {note.author && !isMobile && (
                  <p className="text-xs sm:text-sm text-slate-600 truncate">by {note.author}</p>
                )}
              </div>
            </div>
            
            {/* Right side - Actions */}
            <div className="flex items-center space-x-2 ml-2">
              {note.pageCount && !isMobile && (
                <span className="text-xs sm:text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                  {note.pageCount} pages
                </span>
              )}
              
              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-slate-600 hover:text-amber-600 hover:bg-slate-50 rounded-lg transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isFullscreen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 15v4.5M15 15h4.5M15 15l5.5 5.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15H4.5M9 15v4.5M9 15l-5.5 5.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  )}
                </svg>
              </button>
              
              {!isMobile && (
                <Link
                  href="/notes"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium"
                >
                  Browse Notes
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* PDF Viewer Container */}
      <main className="max-w-7xl mx-auto p-2 sm:p-4">
        <div 
          className={`bg-white rounded-lg shadow-lg overflow-hidden ${
            isFullscreen ? 'h-screen' : 'h-[calc(100vh-120px)]'
          }`}
          style={{ 
            minHeight: isMobile ? 'calc(100vh - 100px)' : 'calc(100vh - 120px)',
          }}
        >
          <Worker 
            workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"
            onProgress={handleWorkerProgress}
          >
            <div className="h-full pdf-viewer-container">
              <Viewer
                fileUrl={pdfUrl}
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={isMobile ? SpecialZoomLevel.PageWidth : SpecialZoomLevel.PageFit}
                scrollMode={ScrollMode.Vertical}
                theme={{
                  theme: 'light',
                }}
                onDocumentLoad={(e) => {
                  console.log('PDF loaded successfully:', e);
                  setLoadProgress(100);
                }}
                onDocumentError={(e) => {
                  console.error('PDF rendering error:', e);
                  setError('Failed to render PDF content. The file may be corrupted or in an unsupported format.');
                }}
                onPageChange={(e) => {
                  // Optional: Track page changes for analytics
                  console.log('Page changed to:', e.currentPage);
                }}
              />
            </div>
          </Worker>
        </div>
      </main>

      {/* Mobile-specific bottom navigation */}
      {isMobile && !isFullscreen && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 safe-area-pb">
          <div className="flex justify-between items-center">
            <Link
              href="/notes"
              className="flex items-center space-x-1 px-3 py-2 text-slate-600 hover:text-amber-600 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-sm">Browse</span>
            </Link>
            
            {note.pageCount && (
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                {note.pageCount} pages
              </span>
            )}
            
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center space-x-1 px-3 py-2 text-slate-600 hover:text-amber-600 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              <span className="text-sm">Top</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

/* Custom CSS for mobile PDF viewer optimization */
<style jsx global>{`
  .pdf-viewer-container .rpv-core__viewer {
    background: #f8fafc !important;
  }
  
  .pdf-viewer-container .rpv-toolbar__left,
  .pdf-viewer-container .rpv-toolbar__center,
  .pdf-viewer-container .rpv-toolbar__right {
    gap: 4px !important;
  }
  
  @media (max-width: 768px) {
    .pdf-viewer-container .rpv-toolbar__left > *:not(:first-child):not(:nth-child(2)):not(:nth-child(3)) {
      display: none !important;
    }
    
    .pdf-viewer-container .rpv-toolbar__center > *:not(:first-child):not(:nth-child(2)) {
      display: none !important;
    }
    
    .pdf-viewer-container .rpv-toolbar__right > *:not(:last-child):not(:nth-last-child(2)) {
      display: none !important;
    }
    
    .pdf-viewer-container .rpv-core__page-layer {
      margin: 0 auto !important;
    }
  }
  
  .safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom);
  }
`}</style>