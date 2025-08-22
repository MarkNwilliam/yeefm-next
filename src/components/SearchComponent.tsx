// src/components/SearchComponent.tsx
'use client';

import { useState } from 'react';

interface SearchComponentProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchClick: () => void;
  placeholder?: string;
  onKeyPress?: (event: React.KeyboardEvent) => void;
}

export default function SearchComponent({ 
  searchTerm, 
  onSearchChange, 
  onSearchClick, 
  placeholder = "Search...",
  onKeyPress 
}: SearchComponentProps) {
  return (
    <div className="flex w-full max-w-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        onClick={onSearchClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition-colors"
      >
        Search
      </button>
    </div>
  );
}