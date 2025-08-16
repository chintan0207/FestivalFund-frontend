import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <IoIosArrowBack className="" />
        Prev
      </Button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-1 text-gray-500 select-none">
            ...
          </span>
        ) : (
          <Button
            key={idx}
            variant={page === currentPage ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={
              page === currentPage
                ? "bg-PRIMARY text-white rounded-full h-8 w-8 p-0"
                : "rounded-full h-8 w-8 p-0"
            }
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <IoIosArrowForward className="" />
      </Button>
    </div>
  );
};
