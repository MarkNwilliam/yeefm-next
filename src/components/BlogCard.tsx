import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type BlogCardProps = {
  blog: {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    keywords: string[];
  };
  index: number;
};

export default function BlogCard({ blog, index }: BlogCardProps) {
  // Create URL-friendly slug from title
  const slug = blog.title.toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, ''); // Remove all non-word chars

  return (
    <Link 
      href={`/blogs/${blog._id}/${slug}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
            {blog.title}
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-700 mb-4 line-clamp-3">
            {blog.content.substring(0, 200)}...
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.keywords.slice(0, 3).map((keyword, i) => (
              <span 
                key={i} 
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-yellow-100 hover:text-yellow-800 transition-colors"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <span className="inline-flex items-center text-yellow-600 group-hover:text-yellow-700 font-medium transition-colors">
            Read more <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}