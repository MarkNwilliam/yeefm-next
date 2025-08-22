'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const GooglePlayIcon = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
    alt="Get it on Google Play"
    className="h-10 w-auto"
    style={{ filter: 'brightness(1.1)' }}
  />
);

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          {/* Sidebar Header */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 mr-2">
                <Image 
                  src="/favicon.ico" 
                  alt="YeePlatform Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <span className="text-lg font-bold text-gray-900">YeePlatform</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            <Link href="/home" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link href="/blogs" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Blogs
            </Link>
            <Link href="/books" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Books
            </Link>
            <Link href="/audiobooks" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 12.536l-3.536-3.536m0 0l-3.536 3.536M12 9V3m9 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Audiobooks
            </Link>
            <Link href="/notes" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Notes
            </Link>

            {/* Legal Pages Section */}
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase">Legal</h3>
              <div className="mt-2 space-y-1">
                <Link href="/terms" className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Terms of Service
                </Link>
                <Link href="/privacy" className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Mobile App Download */}
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase mb-3">Get the App</h3>
              <div className="px-3">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.yeeplatform.yeefm&hl=en_IN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-80 transition-opacity"
                >
                  <GooglePlayIcon />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
                <Link href="/" className="flex items-center">
                  <div className="w-8 h-8 mr-2">
                    <Image 
                      src="/favicon.ico" 
                      alt="YeePlatform Logo"
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                  </div>
                  <span className="text-lg font-bold text-gray-900">YeePlatform</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                <Link href="/home" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
                <Link href="/blogs" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  Blogs
                </Link>
                <Link href="/books" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Books
                </Link>
                <Link href="/audiobooks" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 12.536l-3.536-3.536m0 0l-3.536 3.536M12 9V3m9 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Audiobooks
                </Link>
                <Link href="/notes" className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Notes
                </Link>

                {/* Legal Pages Section */}
                <div className="pt-6">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase">Legal</h3>
                  <div className="mt-2 space-y-1">
                    <Link href="/terms" className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Terms of Service
                    </Link>
                    <Link href="/privacy" className="flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Privacy Policy
                    </Link>
                  </div>
                </div>

                {/* Mobile App Download */}
                <div className="pt-6">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase mb-3">Get the App</h3>
                  <div className="px-3">
                    <a 
                      href="https://play.google.com/store/apps/details?id=com.yeeplatform.yeefm&hl=en_IN"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block hover:opacity-80 transition-opacity"
                    >
                      <GooglePlayIcon />
                    </a>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Profile
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="min-h-full">
            <div className="p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}