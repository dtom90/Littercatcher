'use client';

interface PageButtonProps {
  page: number;
  isActive?: boolean;
  onClick: () => void;
}

const PageButton = ({ page, isActive = false, onClick }: PageButtonProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 border rounded ${
      isActive ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
    }`}
  >
    {page}
  </button>
);

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination = ({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  maxVisiblePages = 5
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return null;

  const pages = [];
  const halfVisible = Math.floor(maxVisiblePages / 2);
  
  let startPage = Math.max(1, currentPage - halfVisible);
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust start page if we're near the end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // First page
  if (startPage > 1) {
    pages.push(
      <PageButton
        key="1"
        page={1}
        onClick={() => onPageChange(1)}
      />
    );
    if (startPage > 2) {
      pages.push(
        <span key="start-ellipsis" className="px-2">
          ...
        </span>
      );
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <PageButton
        key={i}
        page={i}
        isActive={currentPage === i}
        onClick={() => onPageChange(i)}
      />
    );
  }

  // Last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="end-ellipsis" className="px-2">
          ...
        </span>
      );
    }
    pages.push(
      <PageButton
        key={totalPages}
        page={totalPages}
        onClick={() => onPageChange(totalPages)}
      />
    );
  }

  return (
    <div className="flex justify-center gap-2 items-center">
      {pages}
    </div>
  );
};

export default Pagination;
