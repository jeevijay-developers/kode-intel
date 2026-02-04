import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onPageSelect: (page: number) => void;
}

export function BookNavigation({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onPageSelect,
}: BookNavigationProps) {
  // Show limited page dots for mobile
  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // Always show first page
    pages.push(0);

    if (currentPage > 2) {
      pages.push("ellipsis");
    }

    // Show pages around current
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("ellipsis");
    }

    // Always show last page
    if (!pages.includes(totalPages - 1)) {
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrevious}
            disabled={currentPage === 0}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Page Indicators */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {visiblePages.map((page, index) =>
              page === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="text-muted-foreground px-1"
                >
                  •••
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageSelect(page)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all",
                    page === currentPage
                      ? "bg-primary scale-125"
                      : "bg-muted hover:bg-primary/50"
                  )}
                  aria-label={`Go to page ${page + 1}`}
                />
              )
            )}
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Page Counter */}
        <p className="text-center text-xs text-muted-foreground mt-1">
          Page {currentPage + 1} of {totalPages}
        </p>
      </div>
    </div>
  );
}
