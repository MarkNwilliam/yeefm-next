'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

// Memoized components for performance
const SocialIcon = ({ href, title, children }: { href: string; title: string; children: React.ReactNode }) => (
  <a
    href={href}
    rel="noopener noreferrer"
    target="_blank"
    title={title}
    className="flex items-center p-1 text-gray-700 hover:text-blue-600 transition-colors"
  >
    {children}
  </a>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link
      href={href}
      className="no-underline text-gray-700 hover:text-gray-900 transition-colors"
    >
      {children}
    </Link>
  </li>
);

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-3">
    <h3 className="text-lg uppercase text-gray-800 font-medium">{title}</h3>
    <ul className="space-y-1">{children}</ul>
  </div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Add favicon dynamically (optional if not already in `public`)
  useEffect(() => {
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '/favicon.ico'; // Make sure you place favicon.ico in your `public` folder
    if (!document.querySelector("link[rel*='icon']")) {
      document.head.appendChild(link);
    }
  }, []);

  return (
    <footer className="px-4 divide-y divide-gray-200 bg-white text-gray-800">
      {/* Main Footer */}
      <div className="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0">
        {/* Logo Section */}
        <div className="lg:w-1/3 flex justify-center lg:justify-start">
          <Link href="/" className="flex items-center space-x-3 no-underline text-gray-800">
            <Image
              src="https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net/assets/images/Y.webp"
              alt="Yee FM Logo"
              width={48}
              height={48}
              priority
              className="rounded-full"
            />
            <span className="self-center text-2xl font-semibold">Yee FM</span>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-sm lg:w-2/3 sm:grid-cols-4">
          {/* Product */}
          <FooterSection title="Product">
            <FooterLink href="/pricing">Pricing</FooterLink>
            <FooterLink href="/support">Help Center</FooterLink>
            <FooterLink href="/blogs">Blogs</FooterLink>
            <FooterLink href="/free-books">Free Books</FooterLink>
          </FooterSection>

          {/* Company */}
          <FooterSection title="Company">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
          </FooterSection>

          {/* Sitemap */}
          <FooterSection title="Sitemap">
            <FooterLink href="/sitemap.xml">Main Sitemap</FooterLink>
            <FooterLink href="/ebooks_detail_sitemap_index.xml">Ebook Details (Index)</FooterLink>
            <FooterLink href="/ebooks_sitemap_index.xml">Ebook Listings</FooterLink>
            <FooterLink href="/audiobooks_sitemap_1.xml">Audiobooks</FooterLink>
          </FooterSection>

          {/* Social Media */}
          <div className="space-y-3">
            <h3 className="text-lg uppercase text-gray-800 font-medium">Follow Us</h3>
            <div className="flex space-x-4">
              <SocialIcon href="https://twitter.com" title="Twitter">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current">
                  <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"></path>
                </svg>
              </SocialIcon>
              <SocialIcon href="https://linkedin.com" title="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="https://t.me/yeefmebooksandaudiobooks" title="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.64 8.64l-1.92 9.12c-.14.64-.52.8-1.04.52l-2.88-2.12-1.4 1.36c-.16.16-.32.32-.64.32l.24-3.44 6.28-5.68c.28-.24-.08-.36-.44-.12l-7.76 4.88-3.32-1.04c-.72-.24-.72-.72.16-1.04l12-4.64c.56-.24 1.04.12.88.96z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-6 text-sm text-center text-gray-600">
        © {currentYear} Yee Technologies. All rights reserved.
      </div>
    </footer>
  );
}