// src/components/blog/BlogDetailClient.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag, Facebook, Twitter, Linkedin, Play, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ObjectId } from 'bson';
import { normalizeForUrl } from '@/utils/normalizeForUrl';

const defaultCoverImage = "https://yeeplatformstorage.blob.core.windows.net/assets/images/yeeplatform_book_cover.png";

export default function BlogDetailClient({ 
  blog: initialBlog,
  params
}: { 
  blog: any;
  params: { id: string, slug: string };
}) {
  const router = useRouter();
  const [blog, setBlog] = useState(initialBlog);
  const [loading, setLoading] = useState(!initialBlog);
  const [error, setError] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blogDate, setBlogDate] = useState(initialBlog?.createdAt || '');
  const speechSynthesis = useRef<typeof window.speechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);
  const [jsonLd, setJsonLd] = useState<any>(null);

  useEffect(() => {
    speechSynthesis.current = window.speechSynthesis;
    
    const fetchBlog = async () => {
      if (initialBlog) return;
      
      try {
        const response = await fetch(`https://yeeplatformbackend.azurewebsites.net/getblogbyid/${params.id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const objectId = new ObjectId(data._id);
        const idTimestamp = objectId.getTimestamp();
        const createdAt = data.createdAt || idTimestamp.toISOString();

        setBlog({ ...data, createdAt });
        setBlogDate(idTimestamp);
        generateJsonLd(data, createdAt);

        const expectedSlug = data.title.toLowerCase().replace(/ /g, '-');
        if (params.slug !== expectedSlug) {
          router.replace(`/blogs/${params.id}/${normalizeForUrl(expectedSlug)}`);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    const generateJsonLd = (data: any, date: string) => {
      setJsonLd({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": data.title,
        "image": [data.imageUrl || defaultCoverImage],
        "datePublished": date,
        "dateModified": date,
        "author": {
          "@type": "Person",
          "name": data.author
        }
      });
    };

    if (initialBlog) {
      generateJsonLd(initialBlog, initialBlog.createdAt);
    } else {
      fetchBlog();
    }

    return () => {
      if (utterance.current && speechSynthesis.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, [params.id, params.slug, router, initialBlog]);

  const playVoice = () => {
    if (!blog?.content) return;
    
    if (!utterance.current) {
      utterance.current = new SpeechSynthesisUtterance(blog.content);
      utterance.current.onend = () => setIsPlaying(false);
    }

    if (!isPlaying && speechSynthesis.current) {
      speechSynthesis.current.speak(utterance.current);
      setIsPlaying(true);
    }
  };

  const stopVoice = () => {
    if (isPlaying && speechSynthesis.current) {
      speechSynthesis.current.cancel();
      setIsPlaying(false);
    }
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${blog?.title}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${blog?.title}&summary=${blog?.content.slice(0, 200)}`,
      '_blank'
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold mb-4">No blog found</h2>
        <p>The requested blog could not be found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <button
        onClick={() => router.back()}
        className="flex items-center text-yellow-600 hover:text-yellow-700 mb-6 transition-colors duration-200"
      >
        <ArrowLeft className="mr-2" />
        Back to Blogs
      </button>

      <article className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">{blog.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-6">
          <User className="mr-2" />
          <span className="mr-4">{blog.author}</span>
          <Calendar className="mr-2" />
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            onClick={shareFacebook}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Facebook size={20} className="mr-2" />
            Share
          </button>
          <button 
            onClick={shareTwitter}
            className="flex items-center bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors duration-200"
          >
            <Twitter size={20} className="mr-2" />
            Tweet
          </button>
          <button 
            onClick={shareLinkedIn}
            className="flex items-center bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200"
          >
            <Linkedin size={20} className="mr-2" />
            Share
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={playVoice}
            disabled={isPlaying}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              isPlaying ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <Play size={20} className="mr-2" />
            Play
          </button>
          <button
            onClick={stopVoice}
            disabled={!isPlaying}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
              !isPlaying ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            <Square size={20} className="mr-2" />
            Stop
          </button>
        </div>

        <div className="prose max-w-none mb-1">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => <a {...props} className="text-blue-600 hover:text-blue-800 underline" />,
              h2: ({ node, ...props }) => <h2 {...props} className="text-2xl font-bold mt-6 mb-4" />,
              h3: ({ node, ...props }) => <h3 {...props} className="text-xl font-semibold mt-5 mb-3" />,
              ul: ({ node, ...props }) => <ul {...props} className="list-disc list-inside mb-4" />,
              ol: ({ node, ...props }) => <ol {...props} className="list-decimal list-inside mb-4" />,
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className="border-l-4 border-gray-300 pl-4 italic my-4" />
              ),
              code: ({ node, inline, ...props }) =>
                inline ? (
                  <code {...props} className="bg-gray-100 rounded px-1 py-0.5" />
                ) : (
                  <code {...props} className="block bg-gray-100 rounded p-2 my-2 overflow-x-auto" />
                ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {blog.keywords.map((keyword: string, index: number) => (
            <span
              key={index}
              className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full px-3 py-1 text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div className="text-gray-600 flex items-center">
          <Tag className="mr-2" />
          <span>Category: {blog.category}</span>
        </div>
      </article>
    </div>
  );
}