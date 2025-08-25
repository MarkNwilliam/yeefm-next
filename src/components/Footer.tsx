'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Social Media Icons
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current">
    <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"></path>
  </svg>
);

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.64 8.64l-1.92 9.12c-.14.64-.52.8-1.04.52l-2.88-2.12-1.4 1.36c-.16.16-.32.32-.64.32l.24-3.44 6.28-5.68c.28-.24-.08-.36-.44-.12l-7.76 4.88-3.32-1.04c-.72-.24-.72-.72.16-1.04l12-4.64c.56-.24 1.04.12.88.96z"/>
  </svg>
);

const SocialIcon = ({ href, title, children }: { href: string; title: string; children: React.ReactNode }) => (
  <a
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    title={title}
    className="flex items-center justify-center p-2 rounded-full bg-gray-100 text-gray-700 hover:text-white hover:bg-blue-600 transition-colors duration-300"
    aria-label={title}
  >
    {children}
  </a>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li className="mb-2">
    <Link
      href={href}
      className="no-underline text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm md:text-base"
    >
      {children}
    </Link>
  </li>
);

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h3 className="text-base font-semibold uppercase text-gray-800 tracking-wide">{title}</h3>
    <ul className="space-y-1">{children}</ul>
  </div>
);

// Define which pages actually exist in your app
const EXISTING_PAGES = {
  // Add pages that currently exist in your Next.js app
  '/blogs': true,
  '/free-books': true,
  '/privacy': true,
  '/terms': true,
  '/contact': true,
  '/about': true,
  '/sitemap': true,
  // Remove or comment out pages that don't exist yet
  // '/pricing': false,
  // '/support': false,
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything during SSR to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200 mt-auto">
      {/* Main Footer */}
      <div className="container px-4 py-10 mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          
          {/* Logo and Description Section */}
          <div className="md:w-1/4 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center space-x-3 no-underline text-gray-800 mb-4">
              <Image
                src="/favicon.png"
                alt="Yee FM Logo"
                width={48}
                height={48}
                priority
                className="rounded-full"
              />
              <span className="self-center text-2xl font-bold">Yee FM</span>
            </Link>
            <p className="text-gray-600 text-sm text-center md:text-left mb-4">
              Premium content for your personal and professional growth.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-3">
              <SocialIcon href="https://twitter.com" title="Twitter">
                <TwitterIcon />
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" title="LinkedIn">
                <LinkedInIcon />
              </SocialIcon>
              <SocialIcon href="https://t.me/yeefmebooksandaudiobooks" title="Telegram">
                <TelegramIcon />
              </SocialIcon>
            </div>
          </div>

          {/* Footer Links Grid - Only show sections that have existing pages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:w-3/4">
            
            {/* Product Section - Only show if there are existing product pages */}
            {(EXISTING_PAGES['/blogs'] || EXISTING_PAGES['/free-books']) && (
              <FooterSection title="Product">
                {EXISTING_PAGES['/blogs'] && <FooterLink href="/blogs">Blogs</FooterLink>}
                {EXISTING_PAGES['/free-books'] && <FooterLink href="/free-books">Free Books</FooterLink>}
                {/* Comment out non-existing pages */}
                {/* EXISTING_PAGES['/pricing'] && <FooterLink href="/pricing">Pricing</FooterLink> */}
                {/* EXISTING_PAGES['/support'] && <FooterLink href="/support">Help Center</FooterLink> */}
              </FooterSection>
            )}

            {/* Company Section */}
            {(EXISTING_PAGES['/privacy'] || EXISTING_PAGES['/terms'] || EXISTING_PAGES['/contact'] || EXISTING_PAGES['/about']) && (
              <FooterSection title="Company">
                {EXISTING_PAGES['/privacy'] && <FooterLink href="/privacy">Privacy Policy</FooterLink>}
                {EXISTING_PAGES['/terms'] && <FooterLink href="/terms">Terms of Service</FooterLink>}
                {EXISTING_PAGES['/contact'] && <FooterLink href="/contact">Contact Us</FooterLink>}
                {EXISTING_PAGES['/about'] && <FooterLink href="/about">About Us</FooterLink>}
              </FooterSection>
            )}

            {/* Resources Section */}
            <FooterSection title="Resources">
              <FooterLink href="/sitemap.xml">Main Sitemap</FooterLink>
              <FooterLink href="/ebooks_detail_sitemap_index.xml">Ebook Details</FooterLink>
              <FooterLink href="/ebooks_sitemap_index.xml">Ebook Listings</FooterLink>
              <FooterLink href="/audiobooks_sitemap_1.xml">Audiobooks</FooterLink>
            </FooterSection>
          </div>
        </div>
      </div>

      {/* Copyright and Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <p className="text-sm text-gray-600">
              © {currentYear} Yee Technologies. All rights reserved.
            </p>
            
            {/* Additional Legal Links - Only show if they exist */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {EXISTING_PAGES['/sitemap'] && <Link href="/sitemap" className="hover:text-blue-600 transition-colors">Sitemap</Link>}
              {/* Add other legal links here if they exist */}
              {/* <Link href="/cookies" className="hover:text-blue-600 transition-colors">Cookie Policy</Link> */}
              {/* <Link href="/disclaimer" className="hover:text-blue-600 transition-colors">Disclaimer</Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}