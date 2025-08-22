'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Sun, 
  Moon, 
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Type,
  Loader2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

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
  ebookepubImagesUrl?: string;
  ebook_url?: string;
}

interface EpubReaderClientProps {
  initialEbookContent: EbookContent;
  id: string;
  slug: string;
  ebookDate: string;
}

// Add proper types for search results
interface SearchResult {
  cfi: string;
  excerpt: string;
}

// Mobile Controls Sheet
const MobileControlsSheet = ({ 
  isOpen, 
  onClose, 
  theme,
  setTheme,
  font,
  setFont,
  searchQuery,
  setSearchQuery,
  handleSearch,
  fonts
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  theme: string;
  setTheme: (theme: string) => void;
  font: string;
  setFont: (font: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  fonts: string[];
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-50 transform transition-transform duration-300 max-h-[80vh] overflow-y-auto">
        <div className="p-4">
          {/* Handle */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
          
          {/* Close button */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Reading Controls</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Theme Controls */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Theme</h4>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTheme('light')}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors flex-1 ${
                  theme === 'light' ? 'bg-blue-100 border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Sun className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium">Light</span>
              </button>
              
              <button 
                onClick={() => setTheme('dark')}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors flex-1 ${
                  theme === 'dark' ? 'bg-blue-100 border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Moon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium">Dark</span>
              </button>
            </div>
          </div>

          {/* Font Selection */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Font Family</h4>
            <select 
              value={font} 
              onChange={(e) => setFont(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg bg-white"
            >
              {fonts.map((fontOption) => (
                <option key={fontOption} value={fontOption}>
                  {fontOption.split(',')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Search in Book</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search term..."
                className="flex-1 p-3 border border-gray-200 rounded-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button 
                onClick={handleSearch}
                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Loading component
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-4">
      <div className="text-center max-w-sm w-full">
        <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
          Loading EPUB...
        </h2>
        <p className="text-sm text-gray-500">
          Preparing your reading experience...
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
        <div className="text-red-500 text-4xl sm:text-6xl mb-4">📚</div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          Unable to Load EPUB
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

const EpubReaderClient = ({
  initialEbookContent,
  id,
  slug,
  ebookDate
}: EpubReaderClientProps) => {
  const [theme, setTheme] = useState('light');
  const [font, setFont] = useState('Georgia, serif');
  const [location, setLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [pageInfo, setPageInfo] = useState('');

  const renditionRef = useRef<any>(null);
  const tocRef = useRef<any>(null);
  const router = useRouter();

  const fonts = [
    'Georgia, serif',
    'Arial, sans-serif',
    'Times New Roman, serif',
    'Helvetica, sans-serif',
    'Verdana, sans-serif',
    'Courier New, monospace',
    'Palatino, serif',
    'Garamond, serif',
    'Trebuchet MS, sans-serif',
    'Tahoma, sans-serif'
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update theme when changed
  useEffect(() => {
    if (renditionRef.current) {
      updateTheme(renditionRef.current, theme, font);
    }
  }, [theme, font]);

  // Theme update function
  function updateTheme(rendition: any, themeType: string, fontFamily: string) {
    const themes = rendition.themes;
    switch (themeType) {
      case 'dark':
        themes.override('color', '#fff');
        themes.override('background-color', '#000');
        themes.override('font-family', fontFamily);
        break;
      case 'light':
        themes.override('color', '#000');
        themes.override('background-color', '#fff');
        themes.override('font-family', fontFamily);
        break;
    }
  }

  // Search function with proper typing
  const doSearch = (query: string): Promise<SearchResult[]> => {
    if (!renditionRef.current) return Promise.resolve([]);
    
    return Promise.all(
      renditionRef.current.book.spine.spineItems.map((item: any) => 
        item.load(renditionRef.current.book.load.bind(renditionRef.current.book))
          .then(item.find.bind(item, query))
          .finally(item.unload.bind(item))
      )
    ).then((results: SearchResult[][]) => {
      // Clear existing highlights
      if (renditionRef.current?.annotations) {
        renditionRef.current.annotations.remove();
      }
      
      // Flatten results and ensure proper typing
      const flatResults = results.reduce((acc: SearchResult[], result: SearchResult[]) => {
        return acc.concat(result);
      }, []);
      
      // Highlight search results
      flatResults.forEach((result: SearchResult) => {
        if (renditionRef.current?.annotations && result.cfi) {
          renditionRef.current.annotations.highlight(result.cfi, {}, () => {});
        }
      });
      
      return flatResults;
    }).catch((error) => {
      console.error('Search error:', error);
      return [];
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await doSearch(searchQuery);
      setSearchResults(results);
      setCurrentResultIndex(0);
      if (results.length > 0 && results[0].cfi && renditionRef.current) {
        renditionRef.current.display(results[0].cfi);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNext = () => {
    if (searchResults.length === 0 || !renditionRef.current) return;
    const nextIndex = (currentResultIndex + 1) % searchResults.length;
    const nextResult = searchResults[nextIndex];
    if (nextResult?.cfi) {
      renditionRef.current.display(nextResult.cfi);
      setCurrentResultIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (searchResults.length === 0 || !renditionRef.current) return;
    const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
    const prevResult = searchResults[prevIndex];
    if (prevResult?.cfi) {
      renditionRef.current.display(prevResult.cfi);
      setCurrentResultIndex(prevIndex);
    }
  };

  const locationChanged = (epubcfi: string) => {
    setLocation(epubcfi);
    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start;
      const chapter = tocRef.current.find((item: any) => item.href === href);
      setPageInfo(
        `Page ${displayed.page} of ${displayed.total} in chapter ${
          chapter ? chapter.label : 'n/a'
        }`
      );
    }
  };

  // Get EPUB URL
  const getEpubUrl = () => {
    return initialEbookContent?.ebookepubImagesUrl || 
           initialEbookContent?.ebook_url || 
           initialEbookContent?.ebookUrl;
  };

  const epubUrl = getEpubUrl();

  if (!epubUrl) {
    return <ErrorDisplay message="No EPUB file available to display" />;
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="h-screen w-full bg-gray-100 relative">
      {/* Desktop Header */}
      <div className="hidden md:block bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <div className="flex-1 mx-4 text-center">
            <h1 className="font-semibold text-gray-800 truncate">
              {initialEbookContent?.title || 'EPUB Reader'}
            </h1>
            <p className="text-sm text-gray-500">{pageInfo}</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="px-3 py-2 border border-gray-200 rounded-md text-sm w-48"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                disabled={isSearching}
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            <select 
              value={font} 
              onChange={(e) => setFont(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm"
            >
              {fonts.map((fontOption) => (
                <option key={fontOption} value={fontOption}>
                  {fontOption.split(',')[0]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Results Bar */}
        {searchResults.length > 0 && (
          <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 border-b">
            <span className="text-sm text-gray-600">
              {searchResults.length} results found
            </span>
            <button
              onClick={handlePrevious}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
              disabled={searchResults.length === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {currentResultIndex + 1} of {searchResults.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
              disabled={searchResults.length === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between w-full bg-white border-b px-3 py-2 shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="flex-1 mx-2 text-center">
          <h1 className="font-medium text-gray-800 truncate text-sm">
            {initialEbookContent?.title || 'EPUB Reader'}
          </h1>
          <p className="text-xs text-gray-500">{pageInfo}</p>
        </div>

        <button
          onClick={() => setIsMobileControlsOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Search Results */}
      {isMobile && searchResults.length > 0 && (
        <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 border-b">
          <button
            onClick={handlePrevious}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium">
            {currentResultIndex + 1} / {searchResults.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Mobile Controls Sheet */}
      <MobileControlsSheet
        isOpen={isMobileControlsOpen}
        onClose={() => setIsMobileControlsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        font={font}
        setFont={setFont}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        fonts={fonts}
      />

      {/* EPUB Reader */}
      <div className="h-full" style={{ paddingTop: isMobile ? '0' : '0' }}>
        <ReactReader
          title={initialEbookContent?.title}
          url={epubUrl}
          showToc={!isMobile}
          location={location}
          locationChanged={locationChanged}
          epubInitOptions={{
            openAs: 'epub',
          }}
          readerStyles={theme === 'dark' ? darkReaderTheme : lightReaderTheme}
          getRendition={(rendition) => {
            renditionRef.current = rendition;
            updateTheme(rendition, theme, font);
            setIsLoading(false);
            
            // Add selection styling
            rendition.themes.default({
              '::selection': {
                background: 'orange'
              }
            });
          }}
          tocChanged={(toc) => (tocRef.current = toc)}
        />
      </div>
    </div>
  );
};

// Theme styles
const lightReaderTheme = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
  },
  arrow: {
    ...ReactReaderStyle.arrow,
    color: '#f59e0b',
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: '#f59e0b',
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: 'black',
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    color: '#f59e0b',
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    color: '#f59e0b',
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: 'black',
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: '#f59e0b',
  },
};

const darkReaderTheme = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: 'white',
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: 'yellow',
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: '#000',
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: '#ccc',
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: '#111',
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: '#222',
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: '#fff',
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: 'white',
  },
};

export default EpubReaderClient;