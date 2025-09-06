'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Headphones, 
  Microscope, 
  FileText, 
  PenTool, 
  Radio, 
  Bookmark, 
  Search,
  Languages,
  Volume2,
  MessageCircle,
  Briefcase,
  Sparkles,
  Users,
  Play,
  ArrowRight,
  Star
} from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleExploreClick = () => {
    console.log('Navigate to /ebooks/page/1');
  };

  const handleCategoryClick = (category) => {
    const routes = {
      'Free Ebooks': '/ebooks/page/1',
      'Audiobooks': '/audiobooks/page/1',
      'Scientific Papers': '/papers/page/1',
      'Notes & PPTs': '/chapters/page/1',
      'Blogs': '/blogs/page/1',
      'Radio': '/radios/page/1',
      'My Reads': '/my-reads',
      'Search': '/search'
    };
    console.log(`Navigate to ${routes[category] || '/'}`);
  };

  const features = [
    {
      icon: BookOpen,
      title: "Free Open-Access Content",
      description: "Access thousands of ebooks, audiobooks, scientific papers, and educational resources without any subscription fees."
    },
    {
      icon: Languages,
      title: "AI-Powered Translation",
      description: "Break language barriers with our advanced AI translation feature, making content accessible in multiple languages."
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Convert any text content into natural-sounding audio with our advanced text-to-speech technology in multiple languages."
    },
    {
      icon: MessageCircle,
      title: "AI-Driven Chat",
      description: "Interact with our intelligent assistant to help you find, understand, and engage with educational content."
    },
    {
      icon: Briefcase,
      title: "Diverse Content Library",
      description: "Browse our extensive collection of ebooks, audiobooks, scientific papers, notes, presentations, and blogs."
    },
    {
      icon: Sparkles,
      title: "Personalized Experience",
      description: "Track your reading habits, bookmark favorites, and receive content recommendations based on your interests."
    }
  ];

  const categories = [
    { name: "Free Ebooks", icon: BookOpen, color: "bg-blue-500" },
    { name: "Audiobooks", icon: Headphones, color: "bg-green-500" },
    { name: "Scientific Papers", icon: Microscope, color: "bg-purple-500" },
    { name: "Notes & PPTs", icon: FileText, color: "bg-orange-500" },
    { name: "Blogs", icon: PenTool, color: "bg-pink-500" },
    { name: "Radio", icon: Radio, color: "bg-red-500" },
    { name: "My Reads", icon: Bookmark, color: "bg-indigo-500" },
    { name: "Search", icon: Search, color: "bg-gray-600" }
  ];

  const footerLinks = {
    platform: [
      { name: "Free Ebooks", route: "/ebooks/page/1" },
      { name: "Audiobooks", route: "/audiobooks/page/1" },
      { name: "Scientific Papers", route: "/papers/page/1" },
      { name: "Notes & PPTs", route: "/chapters/page/1" }
    ],
    support: [
      { name: "Help Center", route: "/support" },
      { name: "Contact Us", route: "/contact" },
      { name: "FAQ", route: "/faq" },
      { name: "Privacy Policy", route: "/privacy" }
    ],
    connect: [
      { name: "Twitter", url: "https://twitter.com/yeefm" },
      { name: "Facebook", url: "https://facebook.com/yeefm" },
      { name: "Instagram", url: "https://instagram.com/yeefm" },
      { name: "LinkedIn", url: "https://linkedin.com/company/yeefm" }
    ]
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 font-sans min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-black overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        
        <div className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              
              {/* Left Content */}
              <div className={`lg:w-1/2 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="mb-6 flex items-center">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <BookOpen className="h-7 w-7 text-yellow-600" />
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">Yee FM</h1>
                </div>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6 text-gray-800">
                  Open Access Learning and Fun for Everyone
                </h2>
                
                <p className="text-lg md:text-xl mb-8 max-w-xl text-gray-700 leading-relaxed">
                  Discover a world of free ebooks, audiobooks, scientific papers, and educational content with AI-powered features to enhance your learning experience.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <button 
                    onClick={handleExploreClick}
                    className="group px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center"
                  >
                    Explore Content
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <a 
                    href="https://play.google.com/store/apps/details?id=com.yeeplatform.yeefm&hl=en_IN" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group px-8 py-4 border-2 border-black bg-transparent hover:bg-black hover:text-white transition-all duration-300 font-semibold rounded-2xl flex items-center"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Get Android App
                  </a>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="font-medium">4.5+ Rating</span>
                  <span className="mx-2">•</span>
                  <Users className="h-4 w-4 mr-1" />
                  <span>10K+ Downloads</span>
                </div>
              </div>

              {/* Right Content - App Screenshot */}
              <div className={`lg:w-1/2 transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="relative max-w-sm mx-auto lg:max-w-md lg:ml-auto">
                  <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-black to-gray-800 rounded-3xl transform rotate-3"></div>
                  <div className="relative z-10 bg-white p-2 rounded-3xl shadow-2xl">
                    <img 
                      src="/screen2.jpg" 
                      alt="Yee FM App Screenshot" 
                      className="w-full h-auto rounded-2xl"
                      onError={(e) => {
                        // Fallback if image doesn't exist
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback placeholder */}
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl aspect-[9/16] items-center justify-center hidden">
                      <div className="text-white text-center">
                        <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-80" />
                        <p className="text-sm opacity-80">App Screenshot</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
          <svg className="relative block w-full h-16 transform rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-50"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Yee FM?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the future of learning with our cutting-edge features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                  <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Categories Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Our Categories</h2>
            <p className="text-xl text-gray-600">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div 
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                  className="group bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:-translate-y-2"
                >
                  <div className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            Download the Yee FM app today and get instant access to thousands of educational resources.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://play.google.com/store/apps/details?id=com.yeeplatform.yeefm&hl=en_IN" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group px-8 py-4 bg-white text-gray-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center"
            >
              <Play className="mr-2 h-5 w-5" />
              Download Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <button 
              onClick={handleExploreClick}
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold rounded-2xl"
            >
              Explore Web Version
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;