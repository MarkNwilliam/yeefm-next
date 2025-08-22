import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
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

async function searchBlogs(query: string, page: number): Promise<BlogResponse> {
  const res = await fetch(
    `https://yeeplatformbackend.azurewebsites.net/searchblogs?query=${encodeURIComponent(query)}&page=${page}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!res.ok) throw new Error('Failed to search blogs');
  return res.json();
}

export async function generateMetadata({ params }: { 
  params: { query: string, pageNumber: string } 
}): Promise<Metadata> {
  const query = decodeURIComponent(params.query);
  const page = parseInt(params.pageNumber) || 1;
  
  return {
    title: `Search Results for "${query}" - Page ${page} | YeeFM Blog`,
    description: `Explore blog posts about "${query}" on YeeFM - Page ${page}`,
    alternates: {
      canonical: `https://www.yeefm.com/blogs/search/${params.query}/page/${page}`,
    },
  };
}

export default async function BlogSearchPage({ params }: { 
  params: { query: string, pageNumber: string }
}) {
  const query = decodeURIComponent(params.query);
  const page = parseInt(params.pageNumber) || 1;
  const { blogs, totalPages } = await searchBlogs(query, page);

  if (page > totalPages) return notFound();

  const handlePageChange = async (newPage: number) => {
    'use server';
    redirect(`/blogs/search/${params.query}/page/${newPage}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-600">
        Search Results for "{query}" - Page {page}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog, index) => (
          <BlogCard key={blog._id} blog={blog} index={index} />
        ))}
      </div>

      <CustomPagination
        totalPages={totalPages}
        currentPage={page}
        onChange={handlePageChange}
      />
    </div>
  );
}