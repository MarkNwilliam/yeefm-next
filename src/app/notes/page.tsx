import { Metadata } from 'next';
import NotesListClient from '@/components/NotesListClient';
import { BACKEND_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Study Notes & PPTs - Yee FM',
  description: 'Explore our collection of educational notes, study materials, and PowerPoint presentations',
};

async function getNotes(page = 1, query = '') {
  const url = new URL(
    query ? '/searchIndexedchapters' : '/getallchapters',
    BACKEND_URL
  );
  
  url.searchParams.append('page', page.toString());
  url.searchParams.append('limit', '15');
  if (query) url.searchParams.append('query', query);

  const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error('Failed to fetch notes');
  
  return response.json();
}

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined };
}) {
  const page = Number(searchParams?.page) || 1;
  const query = searchParams?.query || '';
  
  const data = await getNotes(page, query);

  return (
    <NotesListClient 
      initialData={data} 
      currentPage={page} 
      searchQuery={query} 
    />
  );
}