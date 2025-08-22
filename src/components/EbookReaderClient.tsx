'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Viewer, Worker, ScrollMode } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { 
  ArrowLeft, 
  Loader2,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

// Import PDF viewer styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface EbookContent {
  _id: string;
  title: string;
  description: string;
  author: string;
  categories: string[];
  coverImage_optimized_url?: string;
  coverImage?: string;
  coverimage?: string;
  cover_url?: string;
  optimized_url?: string;
  ebookUrl?: string;
}

interface EbookReaderClientProps {
  initialEbookContent: EbookContent;
  id: string;
  slug: string;
  ebookDate: string;
}

// Mobile Controls Sheet
const MobileControlsSheet = ({ 
  isOpen, 
  onClose, 
  controls 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  controls: any;
}) => {
  if (!isOpen) return null;

  const { ZoomIn, ZoomOut, EnterFullScreen, SwitchTheme, ShowSearchPopover } = controls;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-50 md:hidden transform transition-transform duration-300">
        <div className="p-4">
          {/* Handle */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          
          {/* Close button */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">PDF Controls</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Search className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Search</span>
            </button>
            
            <button className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ZoomIn className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Zoom In</span>
            </button>
            
            <button className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <ZoomOut className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Zoom Out</span>
            </button>
            
            <button className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Maximize className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Fullscreen</span>
            </button>
            
            <button className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors col-span-2">
              <Sun className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Toggle Theme</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Loading spinner component
const LoadingSpinner = ({ progress = 0 }: { progress?: number }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      <div className="text-center max-w-sm w-full">
        <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
          Loading PDF...
        </h2>
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <p className="text-sm text-gray-500">
          {progress > 0 ? `${Math.round(progress)}% loaded` : 'Preparing document...'}
        </p>
      </div>
    </div>
  );
};

// Error component
const ErrorDisplay = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 p-4">
      <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <div className="text-red-500 text-4xl sm:text-6xl mb-4">📄</div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          Unable to Load PDF
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">{message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors w-full sm:w-auto"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

const EbookReaderClient = ({
  initialEbookContent,
  id,
  slug,
  ebookDate
}: EbookReaderClientProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize PDF URL
  useEffect(() => {
    const initializePdfUrl = () => {
      try {
        const url = initialEbookContent?.optimized_url || 
                   initialEbookContent?.ebookUrl || 
                   initialEbookContent?.coverImage_optimized_url;
                   
        if (!url) {
          setError('No PDF URL found in the ebook data');
          setIsLoading(false);
          return;
        }

        setPdfUrl(url);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing PDF URL:', err);
        setError('Failed to initialize PDF URL');
        setIsLoading(false);
      }
    };

    initializePdfUrl();
  }, [initialEbookContent]);

  // Get responsive scale based on screen size
  const getDefaultScale = () => {
    if (typeof window === 'undefined') return 1;
    
    const width = window.innerWidth;
    if (width <= 480) return 0.6;  // Small phones
    if (width <= 768) return 0.8;  // Tablets
    if (width <= 1024) return 1.0; // Small laptops
    return 1.2; // Desktop
  };

  // Default layout plugin with mobile-optimized toolbar
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // Hide sidebar on mobile for more space
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(props) => {
          const {
            CurrentPageInput,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            ShowSearchPopover,
            Zoom,
            ZoomIn,
            ZoomOut,
            EnterFullScreen,
            SwitchTheme,
          } = props;

          return (
            <>
              {/* Desktop Toolbar */}
              <div className="hidden md:flex items-center justify-between w-full bg-white border-b px-4 py-2 shadow-sm">
                <button
                  onClick={() => router.back()}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>

                <div className="flex-1 mx-4 text-center">
                  <h1 className="font-semibold text-gray-800 truncate">
                    {initialEbookContent?.title || 'PDF Reader'}
                  </h1>
                </div>

                <div className="flex items-center space-x-2">
                  <ShowSearchPopover />
                  <div className="flex items-center space-x-1 bg-gray-50 rounded-md px-2 py-1">
                    <GoToPreviousPage />
                    <CurrentPageInput />
                    <span className="text-sm text-gray-600">/</span>
                    <NumberOfPages />
                    <GoToNextPage />
                  </div>
                  <div className="flex items-center space-x-1 bg-gray-50 rounded-md px-2 py-1">
                    <ZoomOut />
                    <Zoom />
                    <ZoomIn />
                  </div>
                  <EnterFullScreen />
                  <SwitchTheme />
                </div>
              </div>

              {/* Mobile Toolbar */}
              <div className="md:hidden flex items-center justify-between w-full bg-white border-b px-3 py-2 shadow-sm">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="flex-1 mx-2 text-center">
                  <h1 className="font-medium text-gray-800 truncate text-sm">
                    {initialEbookContent?.title || 'PDF Reader'}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>

                <button
                  onClick={() => setIsMobileControlsOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Controls Sheet */}
              <MobileControlsSheet
                isOpen={isMobileControlsOpen}
                onClose={() => setIsMobileControlsOpen(false)}
                controls={{ ZoomIn, ZoomOut, EnterFullScreen, SwitchTheme, ShowSearchPopover }}
              />
            </>
          );
        }}
      </Toolbar>
    ),
  });

  // Handle loading states
  if (isLoading) {
    return <LoadingSpinner progress={loadingProgress} />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  if (!pdfUrl) {
    return <ErrorDisplay message="No PDF file available to display" />;
  }

  return (
    <div className="h-screen w-full bg-gray-100 relative">
      {/* Mobile Page Navigation Overlay */}
      {isMobile && totalPages > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <span className="text-sm font-medium px-2">
            {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfUrl}
          plugins={[defaultLayoutPluginInstance]}
          scrollMode={isMobile ? ScrollMode.Page : ScrollMode.Vertical}
          defaultScale={getDefaultScale()}
          onDocumentLoad={(e) => {
            console.log('PDF loaded successfully:', e.doc.numPages, 'pages');
            setTotalPages(e.doc.numPages);
            setLoadingProgress(100);
          }}
          onPageChange={(e) => {
            console.log('Page changed to:', e.currentPage);
            setCurrentPage(e.currentPage);
          }}
          renderLoader={(percentages) => (
            <LoadingSpinner progress={percentages} />
          )}
          renderError={(error) => (
            <ErrorDisplay message={`Failed to load PDF: ${error.message || 'Unknown error'}`} />
          )}
        />
      </Worker>
    </div>
  );
};

export default EbookReaderClient;