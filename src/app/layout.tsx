import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import SidebarLayout from "@/components/SidebarLayout";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.yeefm.com'), // ← ADD THIS LINE
  title: "Yee FM Ebooks Audiobooks and Research papers with An Ai Virtual teacher",
  description: "Yee FM is a cutting-edge multilingual ebook and audiobook streaming platform that offers AI-powered chat assistance, seamless text-to-speech synthesis, and an extensive library of ebooks. Perfect for avid readers and learners, Yee FM supports multiple languages, including French, Spanish, Swahili, and Arabic. Enjoy personalized reading experiences and effortless audiobook streaming. The website is also an online radio directory with more than 2000 radio stations!",
  keywords: "ebooks, audiobooks, research papers, virtual teacher, ai, chatbot, text-to-speech, multilingual, radio stations, online radio, streaming platform, reading, learning, languages, French, Spanish, Swahili, Arabic, personalized, experiences, radio directory, 2000 radio stations",
  authors: [{ name: "Yee FM" }],
  robots: "index, follow",
  openGraph: {
    title: "Yee FM Ebooks Audiobooks and Research papers with An Ai Virtual teacher",
    description: "Yee FM is a cutting-edge multilingual ebook and audiobook streaming platform that offers AI-powered chat assistance, seamless text-to-speech synthesis, and an extensive library of ebooks.",
    type: "website",
    url: "https://www.yeefm.com/",
    images: [
      {
        url: "/favicon_io/android-chrome-512x512.png", // ← This will now be https://www.yeefm.com/favicon_io/android-chrome-512x512.png
        width: 600,
        height: 314,
        alt: "Yee FM Logo"
      }
    ],
    siteName: "Yee FM"
  },
  twitter: {
    card: "summary_large_image",
    title: "Yee FM Ebooks Audiobooks and Research papers with An Ai Virtual teacher",
    description: "Yee FM is a cutting-edge multilingual ebook and audiobook streaming platform that offers AI-powered chat assistance, seamless text-to-speech synthesis, and an extensive library of ebooks.",
    images: ["/favicon_io/android-chrome-512x512.png"] // ← This will also be fixed
  },
  icons: {
    icon: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png"
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#000000",
    "google-adsense-account": "ca-pub-7163440324211024",
    "yandex-verification": "c03b962c1dc2328c1"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-W83N7V2M"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        
        {/* Yandex Metrika noscript */}
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/101204360" style={{position: 'absolute', left: '-9999px'}} alt="" />
          </div>
        </noscript>

        <AuthProvider>
          <SidebarLayout>
            {children}
            <Footer />
          </SidebarLayout>
        </AuthProvider>

        {/* Google Tag Manager Script */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W83N7V2M');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ood5df3wku");
          `}
        </Script>

        {/* Yandex Metrika */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(101204360, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true,
                 ecommerce:"dataLayer"
            });
          `}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7163440324211024"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Yee FM Ebooks and Audiobooks",
              "alternateName": ["yeefm", "yeefm virtual teacher", "yeefm.com", "yeefm Ai", "Ai yeefm"],
              "url": "https://www.yeefm.com/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.yeefm.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </body>
    </html>
  );
}