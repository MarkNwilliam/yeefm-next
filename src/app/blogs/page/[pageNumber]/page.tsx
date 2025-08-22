import { Search } from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
export const dynamic = 'force-dynamic'
async function fetchBlogs(page: number): Promise<BlogResponse> {
  const res = await fetch(`https://yeeplatformbackend.azurewebsites.net/getblogs?page=${page}`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) throw new Error('Failed to fetch blogs');
  return res.json();
}

export async function generateMetadata({ params }: { params: { pageNumber: string } }): Promise<Metadata> {
  const page = parseInt(params.pageNumber) || 1;
  const { blogs } = await fetchBlogs(page);
  
  const featuredTitles = blogs.slice(0, 3).map(blog => blog.title).join(', ');
  
  return {
    title: `YeeFM Blog - Page ${page}`,
    description: `Browse our latest articles and blog posts on YeeFM - Page ${page}`,
    keywords: `yeefm, blog, articles, page ${page}, ${featuredTitles}`,
    alternates: {
      canonical: `https://www.yeefm.com/blogs/page/${page}`,
      ...(page > 1 && { prev: `https://www.yeefm.com/blogs/page/${page - 1}` }),
      ...(blogs.length > 0 && { next: `https://www.yeefm.com/blogs/page/${page + 1}` })
    }
  };
}

export default async function BlogsPage({ 
  params,
  searchParams
}: { 
  params: { pageNumber: string },
  searchParams: { search?: string }
}) {
  const page = parseInt(params.pageNumber) || 1;
  const { blogs, totalPages } = await fetchBlogs(page);
  const searchTerm = searchParams.search || '';

  if (page > totalPages) return notFound();

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-yellow-600">Articles</h1>
      
      <div className="relative mb-8">
        <form action="/blogs/page/1" method="GET" className="flex">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.map((blog, index) => (
          <BlogCard key={blog._id} blog={blog} index={index} />
        ))}
      </div>

      <form action={async (formData) => {
        'use server';
        const newPage = formData.get('page');
        if (searchTerm) {
          redirect(`/blogs/page/${newPage}?search=${encodeURIComponent(searchTerm)}`);
        } else {
          redirect(`/blogs/page/${newPage}`);
        }
      }}>
        <input type="hidden" name="page" value={page} />
        <CustomPagination
          totalPages={totalPages}
          currentPage={page}
          onChange={(newPage) => {
            const form = document.forms[document.forms.length - 1];
            form.page.value = newPage;
            form.requestSubmit();
          }}
        />
      </form>
    </div>
  );
}