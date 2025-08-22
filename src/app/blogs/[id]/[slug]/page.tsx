// src/app/blogs/[id]/[slug]/page.tsx
import { Metadata } from 'next';
import BlogDetailClient from '@/components/BlogDetailClient';

const defaultCoverImage = "https://yeeplatformstorage.blob.core.windows.net/assets/images/yeeplatform_book_cover.png";
export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }: { 
  params: { id: string, slug: string } 
}): Promise<Metadata> {
  const response = await fetch(`https://yeeplatformbackend.azurewebsites.net/getblogbyid/${params.id}`);
  const blog = await response.json();
  
  return {
    title: `${blog.title} - YeeFM`,
    description: blog.content.slice(0, 160),
    openGraph: {
      images: [blog.imageUrl || defaultCoverImage],
    },
  };
}

async function getBlogData(id: string) {
  const res = await fetch(`https://yeeplatformbackend.azurewebsites.net/getblogbyid/${id}`);
  return res.json();
}

export default async function BlogDetailPage({ params }: { params: { id: string, slug: string } }) {
  const blog = await getBlogData(params.id);
  return <BlogDetailClient blog={blog} params={params} />;
}