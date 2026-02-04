import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, BookOpen, Lock, Rocket, Sparkles } from "lucide-react";
import { BookCoverPage } from "@/components/digitalbook/BookCoverPage";
import { PageRenderer } from "@/components/digitalbook/PageRenderer";
import { BookNavigation } from "@/components/digitalbook/BookNavigation";
import { cn } from "@/lib/utils";
import kodiMascot from "@/assets/kodi-mascot-3d.png";

const MAX_PREVIEW_PAGES = 3; // Cover + 2 content pages

export default function GuestDigitalBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Fetch digital book with pages and content blocks
  const { data: book, isLoading } = useQuery({
    queryKey: ["guest-digital-book", bookId],
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

  // Sort pages by order_index
  const sortedPages = book?.book_pages
    ? [...book.book_pages].sort((a, b) => a.order_index - b.order_index)
    : [];

  // Include cover page as page 0
  const totalPages = sortedPages.length + 1;
  const accessiblePages = Math.min(MAX_PREVIEW_PAGES, totalPages);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 0) return;
    
    // Check if page is beyond preview limit
    if (newPage >= accessiblePages) {
      setShowUpgradeModal(true);
      return;
    }

    setCurrentPage(newPage);
  }, [accessiblePages]);

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
        <Button onClick={() => navigate("/guest/courses")}>Back to Courses</Button>
      </div>
    );
  }

  const currentPageData = currentPage === 0 ? null : sortedPages[currentPage - 1];
  const isLastPreviewPage = currentPage === accessiblePages - 1;

  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col",
        "select-none"
      )}
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/guest/courses")}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="truncate">
              <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                {book.title}
              </p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Page {currentPage + 1} of {accessiblePages}
                <span className="text-coral ml-1">(Preview)</span>
              </p>
            </div>
          </div>

          <Badge variant="outline" className="bg-sunny/10 text-sunny border-sunny/30 text-[10px] sm:text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Free Preview
          </Badge>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-3 sm:px-4 pb-24 overflow-y-auto">
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
          <div className="py-4 sm:py-6">
            {currentPageData.title && (
              <h2 className="text-lg sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
                {currentPageData.title}
              </h2>
            )}
            <PageRenderer blocks={currentPageData.page_content_blocks || []} />
          </div>
        ) : null}

        {/* Show upgrade prompt on last preview page */}
        {isLastPreviewPage && (
          <Card className="mt-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2">
                Want to read more? 📚
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sign up for free to access all {totalPages} pages of this digital book and unlock all courses!
              </p>
              <Button
                onClick={() => navigate("/student/signup")}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Sign Up Free
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-3 sm:p-4 z-40">
        <div className="container mx-auto flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 0}
            className="h-10 px-3 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: accessiblePages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={cn(
                  "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all",
                  idx === currentPage
                    ? "bg-primary scale-125"
                    : "bg-muted hover:bg-muted-foreground/30"
                )}
              />
            ))}
            {totalPages > accessiblePages && (
              <div className="flex items-center gap-1 ml-1">
                <Lock className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= accessiblePages - 1}
            className="h-10 px-3 sm:px-4"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="sm:hidden">Next</span>
            <ArrowLeft className="h-4 w-4 ml-1 sm:ml-2 rotate-180" />
          </Button>
        </div>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md border-2 border-primary/20">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl scale-150" />
              <img 
                src={kodiMascot} 
                alt="Kodi" 
                className="w-20 h-20 mx-auto relative z-10 drop-shadow-xl" 
              />
            </div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Unlock Full Access! 🎉
            </DialogTitle>
            <DialogDescription className="text-center">
              You've reached the end of your free preview. Sign up to continue reading and access all our courses!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-coral/10 to-coral/5 border border-coral/20">
                <BookOpen className="h-5 w-5 mx-auto text-coral mb-1" />
                <p className="text-[10px] font-medium">Full Books</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple/10 to-purple/5 border border-purple/20">
                <Sparkles className="h-5 w-5 mx-auto text-purple mb-1" />
                <p className="text-[10px] font-medium">All Courses</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-turquoise/10 to-turquoise/5 border border-turquoise/20">
                <Lock className="h-5 w-5 mx-auto text-turquoise mb-1" />
                <p className="text-[10px] font-medium">No Limits</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={() => navigate("/student/signup")}
              className="w-full h-12 gap-2 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] hover:bg-right transition-all duration-500 font-bold"
            >
              <Rocket className="h-5 w-5" />
              Sign Up Free
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowUpgradeModal(false)}
              className="w-full text-muted-foreground"
            >
              Continue Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
