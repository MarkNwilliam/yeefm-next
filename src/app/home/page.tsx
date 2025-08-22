'use client';

import { useState, useEffect } from 'react';
import SidebarLayout from '../../components/SidebarLayout';
import Link from 'next/link';

interface Book {
  _id: string;
  title: string;
  authors: string[];
  coverimage_optimized_url?: string;
  coverImageMediumUrl?: string;
  coverImage?: string;
  description?: string;
  price?: number;
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

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
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(books.length / 4));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(books.length / 4)) % Math.ceil(books.length / 4));
  };

  return (

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Continue your reading journey or discover something new.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Books Read</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Reading Streak</p>
                <p className="text-2xl font-bold text-gray-900">7 days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Hours Read</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Books Carousel */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Free Books</h2>
            <div className="flex space-x-2">
              <button 
                onClick={prevSlide}
                className="p-2 rounded-lg border hover:bg-gray-50"
                disabled={books.length === 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="p-2 rounded-lg border hover:bg-gray-50"
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
                        <Link key={book._id || index} href={`/ebooks/${book._id}`} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow block">
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
                              <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Continue Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
              <div className="w-16 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded flex items-center justify-center mr-4">
                <span className="text-white text-xs font-bold">Book</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">The Great Adventure</h3>
                <p className="text-gray-600 text-sm">Chapter 5: The Journey Begins</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
              <div className="w-16 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded flex items-center justify-center mr-4">
                <span className="text-white text-xs font-bold">Audio</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Mystery Audiobook</h3>
                <p className="text-gray-600 text-sm">Track 3 of 12 - 2:34 remaining</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="h-32 bg-gradient-to-br from-indigo-400 to-purple-600 rounded mb-3 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">Recommended</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Recommended Book {item}</h3>
                <p className="text-gray-600 text-sm mb-2">by Popular Author</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">$9.99</span>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Add to Library
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

  );
}