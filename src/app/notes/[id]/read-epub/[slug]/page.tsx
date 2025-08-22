// src/app/notes/[id]/read-epub/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NoteEpubReaderClient from '@/components/NoteEpubReaderClient';

const API_CONFIG = {
  baseUrl: 'https://yeeplatformbackend.azurewebsites.net',
  endpoints: {
    getChapter: '/getChapter'
  }
};

interface PageProps {
  params: {
    id: string;
    slug: string;
  };
}

async function fetchNote(id: string) {
  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getChapter}/${id}`,
      {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'max-age=3600',
        },
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error fetching note:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const note = await fetchNote(params.id);
  
  if (!note) {
    return {
      title: 'Note Not Found'
    };
  }

  return {
    title: `Read: ${note.title} - Yee FM`,
    description: note.description || `Read ${note.title} online`,
  };
}

export default async function NoteEpubReaderPage({ params }: PageProps) {
  const note = await fetchNote(params.id);

  if (!note) {
    notFound();
  }

  return <NoteEpubReaderClient note={note} />;
}