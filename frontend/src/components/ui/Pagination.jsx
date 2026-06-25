import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page, last_page, total, per_page } = meta;
  const from = (current_page - 1) * per_page + 1;
  const to = Math.min(current_page * per_page, total);

  // Generate page numbers to show
  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, current_page - Math.floor(maxVisible / 2));
    let end = Math.min(last_page, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between mt-8" style={{ flexWrap: 'wrap', gap: '12px' }}>
      <span className="text-caption">
        Showing {from}–{to} of {total}
      </span>
      <div className="pagination">
        <button
          className="pagination-btn"
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {getPages().map(page => (
          <button
            key={page}
            className={`pagination-btn ${page === current_page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="pagination-btn"
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
