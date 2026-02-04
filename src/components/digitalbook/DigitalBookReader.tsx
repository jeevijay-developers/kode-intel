import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, User } from "lucide-react";
import { BookCoverPage } from "./BookCoverPage";
import { PageRenderer } from "./PageRenderer";
import { BookNavigation } from "./BookNavigation";
import { cn } from "@/lib/utils";

interface DigitalBookReaderProps {
  bookId?: string;
}

export function DigitalBookReader({ bookId: propBookId }: DigitalBookReaderProps) {
  const { bookId: paramBookId } = useParams();
  const bookId = propBookId || paramBookId;
  const navigate = useNavigate();
  const { student } = useStudentAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch digital book with pages and content blocks
  const { data: book, isLoading } = useQuery({
    queryKey: ["digital-book", bookId],
    queryFn: async () => {
      if (!bookId) return null;

      const { data, error } = await supabase
        .from("digital_books")
        .select(`
          *,
          chapters(id, title, order_index, course_id),
          book_pages(
            id,
            page_number,
            title,
            order_index,
            page_content_blocks(
              id,
              block_type,
              content,
              order_index
            )
          )
        `)
        .eq("id", bookId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!bookId,
  });

  // Fetch reading progress
  const { data: progress } = useQuery({
    queryKey: ["book-progress", bookId, student?.id],
    queryFn: async () => {
      if (!bookId || !student?.id) return null;

      const { data, error } = await supabase
        .from("book_reading_progress")
        .select("*")
        .eq("digital_book_id", bookId)
        .eq("student_id", student.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!bookId && !!student?.id,
  });

  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async ({ page, completedPages }: { page: number; completedPages: number[] }) => {
      if (!bookId || !student?.id) return;

      const { error } = await supabase
        .from("book_reading_progress")
        .upsert({
          student_id: student.id,
          digital_book_id: bookId,
          current_page: page,
          completed_pages: completedPages,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "student_id,digital_book_id",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-progress", bookId] });
    },
  });

  // Restore page position from progress
  useEffect(() => {
    if (progress?.current_page && currentPage === 0) {
      setCurrentPage(progress.current_page);
    }
  }, [progress]);

  // Sort pages by order_index
  const sortedPages = book?.book_pages
    ? [...book.book_pages].sort((a, b) => a.order_index - b.order_index)
    : [];

  // Include cover page as page 0
  const totalPages = sortedPages.length + 1;

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;

    setCurrentPage(newPage);

    // Track completed pages
    if (student?.id) {
      const completedPages = progress?.completed_pages || [];
      if (!completedPages.includes(newPage)) {
        saveProgressMutation.mutate({
          page: newPage,
          completedPages: [...completedPages, newPage],
        });
      } else {
        saveProgressMutation.mutate({
          page: newPage,
          completedPages,
        });
      }
    }
  }, [totalPages, student?.id, progress, saveProgressMutation]);

  // Disable right-click and copy
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "p" || e.key === "s")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <BookOpen className="w-12 h-12 text-primary animate-bounce" />
          <p className="text-muted-foreground">Loading book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Book not found</h2>
        <p className="text-muted-foreground mb-4 text-center">
          This digital book doesn't exist or isn't available yet.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const courseId = book.chapters?.course_id;
  const currentPageData = currentPage === 0 ? null : sortedPages[currentPage - 1];

  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col",
        "select-none" // Prevent text selection
      )}
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => courseId ? navigate(`/student/chapter/${book.chapters?.id}`) : navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="truncate">
              <p className="font-semibold text-foreground text-sm truncate">
                {book.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/student/profile")}
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 pb-24 overflow-y-auto">
        {currentPage === 0 ? (
          <BookCoverPage
            title={book.title}
            subtitle={book.subtitle || undefined}
            coverImageUrl={book.cover_image_url || undefined}
            learningObjectives={(book.learning_objectives as string[]) || []}
            estimatedReadingTime={book.estimated_reading_time || 10}
            chapterNumber={book.chapters?.order_index}
          />
        ) : currentPageData ? (
          <div className="py-6">
            {currentPageData.title && (
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {currentPageData.title}
              </h2>
            )}
            <PageRenderer blocks={currentPageData.page_content_blocks || []} />
          </div>
        ) : null}
      </main>

      {/* Navigation */}
      <BookNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onPrevious={() => handlePageChange(currentPage - 1)}
        onNext={() => handlePageChange(currentPage + 1)}
        onPageSelect={handlePageChange}
      />
    </div>
  );
}
