'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Book {
  _id: string;
  title: string;
  authors: string[];
  coverimage_optimized_url?: string;
  coverImageMediumUrl?: string;
  coverImage?: string;
  description?: string;
  price?: number;
  categories?: string[];
  subjects?: string[];
}

// Smart recommendation categories with search terms
const RECOMMENDATION_CATEGORIES = [
  {
    title: 'Science & Technology',
    searchTerm: 'science technology',
    icon: '🔬',
    gradient: 'from-blue-400 to-cyan-600',
    description: 'Explore the latest in tech and science'
  },
  {
    title: 'Business & Finance',
    searchTerm: 'business finance economics',
    icon: '💼',
    gradient: 'from-green-400 to-emerald-600',
    description: 'Build your entrepreneurial knowledge'
  },
  {
    title: 'History & Culture',
    searchTerm: 'history culture civilization',
    icon: '🏛️',
    gradient: 'from-amber-400 to-orange-600',
    description: 'Journey through time and cultures'
  },
  {
    title: 'Literature & Fiction',
    searchTerm: 'literature fiction novel',
    icon: '📚',
    gradient: 'from-purple-400 to-pink-600',
    description: 'Immerse in captivating stories'
  },
  {
    title: 'Art & Philosophy',
    searchTerm: 'art philosophy creativity',
    icon: '🎨',
    gradient: 'from-indigo-400 to-purple-600',
    description: 'Feed your creative soul'
  },
  {
    title: 'Comics & Graphics',
    searchTerm: 'comics graphic novel manga',
    icon: '🦸',
    gradient: 'from-red-400 to-pink-600',
    description: 'Visual storytelling at its best'
  },
  {
    title: 'Self-Help & Growth',
    searchTerm: 'self help personal development',
    icon: '🌱',
    gradient: 'from-teal-400 to-green-600',
    description: 'Transform and grow yourself'
  },
  {
    title: 'Mathematics & Logic',
    searchTerm: 'mathematics logic statistics',
    icon: '🔢',
    gradient: 'from-slate-400 to-gray-600',
    description: 'Master the language of numbers'
  }
];

// Popular search terms that lead to good results
const TRENDING_SEARCHES = [
  'artificial intelligence',
  'psychology',
  'cooking',
  'travel',
  'photography',
  'programming',
  'health',
  'astronomy'
];

export default function HomePage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recommendedCategories, setRecommendedCategories] = useState(RECOMMENDATION_CATEGORIES.slice(0, 6));

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const totalPages = 5;
        const booksPerRequest = 10;
        const lastPages = Array.from({ length: totalPages }, (_, i) => totalPages - i);
        
        const promises = lastPages.map(page =>
          fetch(`https://yeeplatformbackend.azurewebsites.net/getallfreeebooks?page=${page}&limit=${booksPerRequest}`)
            .then((res) => res.json())
        );

        const results = await Promise.all(promises);
        const allBooks = results.flatMap(result => result.data || result || []);
        setBooks(allBooks.slice(0, 20)); // Take first 20 books
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
    
    // Randomize recommendations every page load
    const shuffled = [...RECOMMENDATION_CATEGORIES].sort(() => 0.5 - Math.random());
    setRecommendedCategories(shuffled.slice(0, 6));
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(books.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(books.length / 4)) % Math.ceil(books.length / 4));
  };

  // Handle recommendation click
  const handleRecommendationClick = (searchTerm: string) => {
    // Always start at page 2 as requested
    const searchUrl = `/books?page=2&search=${encodeURIComponent(searchTerm)}`;
    router.push(searchUrl);
  };

  // Handle trending search click
  const handleTrendingClick = (searchTerm: string) => {
    const searchUrl = `/books?page=3&search=${encodeURIComponent(searchTerm)}`;
    router.push(searchUrl);
  };

  // Handle continue reading click
  const handleContinueReading = (bookType: string) => {
    if (bookType === 'book') {
      router.push('/books?page=1&search=adventure');
    } else {
      router.push('/books?page=1&search=audiobook');
    }
  };

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Continue your reading journey or discover something new from our vast collection.</p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link href="/books" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">1,342,000+</p>
            </div>
          </div>
        </Link>

        <Link href="/books?search=free" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Free Books</p>
              <p className="text-2xl font-bold text-gray-900">890,000+</p>
            </div>
          </div>
        </Link>

        <Link href="/books?search=audiobook" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Audiobooks</p>
              <p className="text-2xl font-bold text-gray-900">45,000+</p>
            </div>
          </div>
        </Link>

        <Link href="/books" className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">New This Week</p>
              <p className="text-2xl font-bold text-gray-900">2,340</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Featured Books Carousel */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Free Books</h2>
          <div className="flex space-x-2">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
              disabled={books.length === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-lg border hover:bg-gray-50 transition-colors"
              disabled={books.length === 0}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(books.length / 4) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {books.slice(slideIndex * 4, slideIndex * 4 + 4).map((book, index) => (
                      <Link key={book._id || index} href={`/books/${book._id}`} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02] block">
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                          {book.coverimage_optimized_url || book.coverImageMediumUrl || book.coverImage ? (
                            <img 
                              src={book.coverimage_optimized_url || book.coverImageMediumUrl || book.coverImage}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-sm font-medium">Book Cover</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate">{book.title}</h3>
                          <p className="text-gray-600 text-sm mb-2 truncate">{book.authors?.join(', ') || 'Unknown Author'}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-green-600 font-bold text-sm">FREE</span>
                            <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                              Read
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Continue Reading */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Continue Reading</h2>
          <Link 
            href="/books?search=recent"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            View Reading History →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleContinueReading('book')}
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
          >
            <div className="w-16 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded flex items-center justify-center mr-4">
              <span className="text-white text-xs font-bold">Book</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">The Great Adventure</h3>
              <p className="text-gray-600 text-sm">Chapter 5: The Journey Begins</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: '45%' }}></div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => handleContinueReading('audiobook')}
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
          >
            <div className="w-16 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded flex items-center justify-center mr-4">
              <span className="text-white text-xs font-bold">Audio</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Mystery Audiobook</h3>
              <p className="text-gray-600 text-sm">Track 3 of 12 - 2:34 remaining</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: '75%' }}></div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Smart Recommendations */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Discover by Category</h2>
            <p className="text-gray-600 text-sm mt-1">Explore curated collections based on your interests</p>
          </div>
          <Link 
            href="/books"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            View All Books →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedCategories.map((category, index) => (
            <button
              key={category.title}
              onClick={() => handleRecommendationClick(category.searchTerm)}
              className="group text-left border rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-blue-300"
            >
              <div className={`h-24 bg-gradient-to-br ${category.gradient} rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform`}>
                <span className="text-3xl">{category.icon}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {category.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{category.description}</p>
              <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-800">
                Explore Collection 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Searches */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            <p className="text-gray-600 text-sm mt-1">Popular searches from our community</p>
          </div>
          <Link 
            href="/books?sort=popular"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            View Popular Books →
          </Link>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {TRENDING_SEARCHES.map((searchTerm, index) => (
            <button
              key={searchTerm}
              onClick={() => handleTrendingClick(searchTerm)}
              className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 border hover:border-blue-300"
            >
              🔥 {searchTerm}
            </button>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm">Can't find what you're looking for?</h3>
              <p className="text-gray-600 text-sm">Try our advanced search to discover more from our 1.3M+ book collection</p>
            </div>
            <Link 
              href="/books"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Advanced Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}