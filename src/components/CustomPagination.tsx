'use client';

interface CustomPaginationProps {
  totalPages: number;
  currentPage: number; 
  onChange: (page: number) => void;
}

export default function CustomPagination({ totalPages, currentPage, onChange }: CustomPaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift('...');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 my-6">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onChange(page)}
          disabled={page === '...'}
          className={`px-3 py-2 rounded-lg border ${
            page === currentPage 
              ? 'bg-blue-600 text-white' 
              : page === '...' 
                ? 'cursor-default' 
                : 'hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}
