'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import CustomPagination from '@/components/CustomPagination';

type Blog = {
  _id: string;
  title: string;
  content: string;
  author: string;
  keywords: string[];
  createdAt: string;
};

type BlogResponse = {
  blogs: Blog[];
  totalPages: number;
};

function BlogsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);

  const page = parseInt(searchParams.get('page') || '1');
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://yeeplatformbackend.azurewebsites.net/getblogs?page=${page}${
            searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''
          }`
        );
        const data: BlogResponse = await response.json();
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page, searchTerm]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/blogs?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const searchValue = formData.get('search') as string;
    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    params.set('page', '1');
    router.push(`/blogs?${params.toString()}`);
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-600">Articles</h1>

      {/* Search form */}
      <div className="relative mb-8">
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400 h-5 w-5" />
            </div>
            <input
              type="text"
              name="search"
              placeholder="Search blogs..."
              defaultValue={searchTerm}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Search
          </button>
        </form>
      </div>

      {/* Blogs */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} />
            ))}
          </div>

          <CustomPagination
            totalPages={totalPages}
            currentPage={page}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<div>Loading blogs...</div>}>
      <BlogsContent />
    </Suspense>
  );
}
