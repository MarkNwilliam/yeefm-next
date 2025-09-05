'use client';
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Headphones, 
  FileText, 
  PenTool, 
  Radio, 
  Bookmark, 
  Search,
  FileCheck,
  Scale,
  Shield
} from 'lucide-react';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const GooglePlayIcon = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
    alt="Get it on Google Play"
    className="h-10 w-auto transition-transform duration-200 hover:scale-105"
    style={{ filter: 'brightness(1.1)' }}
  />
);

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/home', icon: Home },
    { name: 'Books', href: '/books', icon: BookOpen },
    { name: 'Audiobooks', href: '/audiobooks', icon: Headphones },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'Blogs', href: '/blogs', icon: PenTool },
    { name: 'Radio', href: '/radio', icon: Radio },
  ];

  const legalNavigation = [
    { name: 'Terms of Service', href: '/terms', icon: FileCheck },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile sidebar using Headless UI Dialog */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center justify-between">
                    <Link href="/" className="flex items-center group" onClick={() => setSidebarOpen(false)}>
                      <div className="w-8 h-8 mr-2">
                        <Image 
                          src="/favicon.ico" 
                          alt="YeePlatform Logo"
                          width={32}
                          height={32}
                          className="rounded-lg"
                        />
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        YeePlatform
                      </span>
                    </Link>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => {
                            const Icon = item.icon;
                            const isCurrent = pathname === item.href;
                            
                            return (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`
                                    group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                                    ${isCurrent 
                                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700' 
                                      : 'text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100'
                                    }
                                  `}
                                >
                                  <Icon className="h-6 w-6 shrink-0" />
                                  {item.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                      
                      {/* Legal Pages Section */}
                      <li className="pt-6">
                        <div className="text-xs font-semibold leading-6 text-gray-400">Legal</div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {legalNavigation.map((item) => {
                            const Icon = item.icon;
                            const isCurrent = pathname === item.href;
                            
                            return (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`
                                    group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                                    ${isCurrent 
                                      ? 'bg-gray-50 text-blue-600' 
                                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                    }
                                  `}
                                >
                                  <Icon className="h-6 w-6 shrink-0" />
                                  {item.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </li>

                      {/* Mobile App Download */}
                      <li className="pt-6">
                        <div className="text-xs font-semibold leading-6 text-gray-400">Get the App</div>
                        <div className="mt-2">
                          <a 
                            href="https://play.google.com/store/apps/details?id=com.yeeplatform.yeefm&hl=en_IN"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block hover:opacity-80 transition-all duration-200"
                          >
                            <GooglePlayIcon />
                          </a>
                        </div>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200 shadow-sm">
          {/* Sidebar Header */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <Link href="/" className="flex items-center group transition-transform duration-200 hover:scale-105">
              <div className="w-8 h-8 mr-2 transition-transform duration-200 group-hover:rotate-12">
                <Image 
                  src="/favicon.ico" 
                  alt="YeePlatform Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                YeePlatform
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isCurrent = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-md group
                    ${isCurrent 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
                  {item.name}
                </Link>
              );
            })}

            {/* Legal Pages Section */}
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Legal</h3>
              <div className="mt-2 space-y-1">
                {legalNavigation.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 transform hover:scale-105 group
                        ${isCurrent 
                          ? 'bg-gray-50 text-blue-600' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile App Download */}
            <div className="pt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase mb-3 tracking-wider">Get the App</h3>
              <div className="px-3">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.yeeplatform.yeefm&hl=en_IN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:opacity-80 transition-all duration-200 transform hover:scale-105"
                >
                  <GooglePlayIcon />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 极 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 focus:scale-105 hover:shadow-md"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-极4 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            <button 
              type="submit"
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              Search
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