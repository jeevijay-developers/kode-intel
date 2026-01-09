import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Sparkles, GraduationCap } from "lucide-react";

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

  return (
    <>
      {/* Sample Ebooks Section */}
      <Card className="overflow-hidden relative">
        {/* Decorative sparkle */}
        <Sparkles className="absolute top-3 right-3 h-5 w-5 text-sunny animate-pulse" />
        
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg font-display flex items-center gap-2">
                Visit Our E-Books
                <Badge className="bg-sunny/20 text-sunny text-[10px] animate-pulse">
                  FREE PREVIEW
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                Sample chapters from our curriculum
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sampleEbooks.map((ebook) => {
              const colors = colorClasses[ebook.color];
              return (
                <Card
                  key={ebook.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group bg-gradient-to-br ${colors.bg} ${colors.border}`}
                  onClick={() => setSelectedEbook(ebook)}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <GraduationCap className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <div>
                        <Badge className={`${colors.badge} text-xs mb-1`}>
                          {ebook.className}
                        </Badge>
                        <h3 className="font-bold text-sm sm:text-base line-clamp-2 min-h-[2.5rem]">
                          {ebook.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                          {ebook.chapter}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs group-hover:bg-primary group-hover:text-white transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        Preview
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
      <Dialog open={!!selectedEbook} onOpenChange={() => setSelectedEbook(null)}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-2 border-b bg-gradient-to-r from-primary/5 to-secondary/5">
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
          
          {/* PDF Viewer - using iframe with toolbar hidden to prevent download */}
          <div className="flex-1 h-full bg-muted/50" style={{ height: 'calc(90vh - 80px)' }}>
            {selectedEbook && (
              <iframe
                src={`${selectedEbook.pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full border-0"
                title={`${selectedEbook.title} - ${selectedEbook.chapter}`}
                style={{ 
                  pointerEvents: 'auto',
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
