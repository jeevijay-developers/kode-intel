import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Eye, Sparkles, GraduationCap, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Set up PDF.js worker - use CDN with proper CORS
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface SampleEbook {
  id: string;
  title: string;
  className: string;
  chapter: string;
  pdfUrl: string;
  color: "primary" | "turquoise" | "coral" | "purple";
}

const sampleEbooks: SampleEbook[] = [
  {
    id: "class-4-ch1",
    title: "Logic & Problem Solving",
    className: "Class 4",
    chapter: "Chapter 1",
    pdfUrl: "/ebooks/class-4-chapter-1.pdf",
    color: "turquoise",
  },
  {
    id: "class-6-ch1",
    title: "Computational Thinking Core",
    className: "Class 6",
    chapter: "Chapter 1",
    pdfUrl: "/ebooks/class-6-chapter-1.pdf",
    color: "coral",
  },
  {
    id: "class-7-ch1",
    title: "Algorithms & Flowcharts",
    className: "Class 7",
    chapter: "Chapter 1",
    pdfUrl: "/ebooks/class-7-chapter-1.pdf",
    color: "purple",
  },
];

const colorClasses = {
  primary: {
    bg: "from-primary/10 to-primary/5",
    border: "border-primary/20",
    badge: "bg-primary/20 text-primary",
    icon: "from-primary to-secondary",
  },
  turquoise: {
    bg: "from-turquoise/10 to-turquoise/5",
    border: "border-turquoise/20",
    badge: "bg-turquoise/20 text-turquoise",
    icon: "from-turquoise to-lime",
  },
  coral: {
    bg: "from-coral/10 to-coral/5",
    border: "border-coral/20",
    badge: "bg-coral/20 text-coral",
    icon: "from-coral to-sunny",
  },
  purple: {
    bg: "from-purple/10 to-purple/5",
    border: "border-purple/20",
    badge: "bg-purple/20 text-purple",
    icon: "from-purple to-primary",
  },
};

export function SampleEbookViewer() {
  const [selectedEbook, setSelectedEbook] = useState<SampleEbook | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
    toast({
      title: "📖 E-Book Ready!",
      description: `${selectedEbook?.title} loaded successfully.`,
    });
  };

  const handleOpenEbook = (ebook: SampleEbook) => {
    setSelectedEbook(ebook);
    setPageNumber(1);
    setIsLoading(true);
    toast({
      title: "⏳ Opening E-Book...",
      description: "Please wait while we load your preview.",
    });
  };

  const handleClose = () => {
    setSelectedEbook(null);
    setPageNumber(1);
    setNumPages(0);
  };

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  };

  return (
    <>
      {/* Sample Ebooks Section */}
      <Card className="overflow-hidden relative border-2 border-primary/20">
        {/* Decorative sparkle */}
        <Sparkles className="absolute top-3 right-3 h-5 w-5 text-sunny animate-pulse" />
        
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shrink-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-sm sm:text-base lg:text-lg font-display flex items-center gap-2 flex-wrap">
                📖 Sample E-Book Previews
                <Badge className="bg-sunny/20 text-sunny text-[9px] sm:text-[10px] animate-pulse">
                  FREE PREVIEW
                </Badge>
              </h2>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Preview sample chapters from our curriculum (non-downloadable)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {sampleEbooks.map((ebook) => {
              const colors = colorClasses[ebook.color];
              return (
                <Card
                  key={ebook.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group bg-gradient-to-br ${colors.bg} ${colors.border}`}
                  onClick={() => handleOpenEbook(ebook)}
                >
                  <CardContent className="p-2.5 sm:p-3 md:p-4">
                    <div className="flex sm:flex-col items-center sm:text-center gap-3">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
                        <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                      </div>
                      <div className="flex-1 sm:flex-none min-w-0">
                        <Badge className={`${colors.badge} text-[10px] sm:text-xs mb-0.5 sm:mb-1`}>
                          {ebook.className}
                        </Badge>
                        <h3 className="font-bold text-xs sm:text-sm md:text-base line-clamp-2 sm:min-h-[2.5rem]">
                          {ebook.title}
                        </h3>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                          {ebook.chapter} • Sample Preview
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 sm:gap-1.5 text-[10px] sm:text-xs group-hover:bg-primary group-hover:text-white transition-colors px-2 sm:px-3 h-7 sm:h-8 shrink-0"
                      >
                        <Eye className="h-3 w-3" />
                        <span className="hidden sm:inline">Preview</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* PDF Viewer Modal */}
      <Dialog open={!!selectedEbook} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 pb-2 border-b bg-gradient-to-r from-primary/5 to-secondary/5 shrink-0">
            <DialogTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="block text-base sm:text-lg font-display">
                  {selectedEbook?.title}
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  {selectedEbook?.className} • {selectedEbook?.chapter}
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {/* PDF Viewer with react-pdf */}
          <div className="flex-1 overflow-hidden bg-muted/30">
            <ScrollArea className="h-full">
              <div className="flex justify-center p-4 min-h-full">
                {selectedEbook && (
                  <Document
                    file={selectedEbook.pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                      <div className="flex items-center justify-center h-96">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    }
                    error={
                      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                        <BookOpen className="h-12 w-12 mb-2 opacity-50" />
                        <p>Failed to load PDF</p>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="shadow-xl rounded-lg overflow-hidden"
                      width={Math.min(window.innerWidth * 0.85, 700)}
                    />
                  </Document>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Page Navigation */}
          {numPages > 0 && (
            <div className="p-3 border-t bg-background/95 backdrop-blur shrink-0">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium px-4 py-1.5 bg-muted rounded-full">
                  Page {pageNumber} of {numPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
