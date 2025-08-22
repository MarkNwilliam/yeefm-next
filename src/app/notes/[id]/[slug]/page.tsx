import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NoteDetailClient from '@/components/NoteDetailClient';
import { BACKEND_URL } from '@/lib/constants';

interface NoteData {
  _id: string;
  title: string;
  description: string;
  content: string;
  thumbnailUrl: string;
  fileUrl: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string; slug: string };
}): Promise<Metadata> {
  const response = await fetch(`${BACKEND_URL}/getchapter/${params.id}`);
  if (!response.ok) return {
    title: 'Note Not Found - Yee FM',
    description: 'The requested note could not be found.',
  };

  const data: NoteData = await response.json();
  
  return {
    title: `${data.title} - Yee FM Notes`,
    description: data.description || `Study note: ${data.title}`,
    openGraph: {
      title: data.title,
      description: data.description || `Study note: ${data.title}`,
      images: [data.thumbnailUrl],
      type: 'article',
    },
  };
}

async function getNote(id: string): Promise<NoteData | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/getchapter/${id}`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
}

export default async function NoteDetailPage({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const note = await getNote(params.id);
  if (!note) notFound();

  return <NoteDetailClient note={note} />;
}