import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  ShoppingCart,
  Star,
  Check,
  FileText,
  PenTool,
  Lightbulb,
  Brain,
  Target,
  Award,
  ChevronRight,
  Sparkles,
  Eye,
  BookMarked,
  ListChecks,
  Truck,
  Shield,
} from "lucide-react";
import { BookData, getBookById, booksData } from "@/lib/bookData";

interface BookQuickViewProps {
  bookId: string | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (book: any) => void;
  onViewDetails: (bookId: string) => void;
}

export function BookQuickView({ bookId, open, onClose, onAddToCart, onViewDetails }: BookQuickViewProps) {
  const book = bookId ? getBookById(bookId) : null;
  
  if (!book) return null;

  // Simplified book object for cart
  const cartBook = {
    id: book.id,
    class: book.class,
    title: book.title,
    subtitle: book.subtitle,
    description: book.description,
    price: book.price,
    originalPrice: book.originalPrice,
    chapters: book.chapters.length || 12,
    worksheets: book.worksheets,
    color: book.color,
  };

  const handleAddToCart = () => {
    onAddToCart(cartBook);
    onClose();
  };

  const handleViewDetails = () => {
    onViewDetails(book.id);
    onClose();
  };

  const features = [
    { icon: FileText, text: "Theory Notes" },
    { icon: PenTool, text: `${book.worksheets} Worksheets` },
    { icon: Brain, text: "Mind Maps" },
    { icon: Award, text: "Assessments" },
  ];

  // Get table of contents
  const tableOfContents = book.chapters.length > 0 
    ? book.chapters.map(ch => ({ number: ch.number, title: ch.title, pages: ch.pageCount }))
    : [
        { number: 1, title: "Introduction to AI", pages: 14 },
        { number: 2, title: "Pattern Recognition", pages: 16 },
        { number: 3, title: "Computational Thinking", pages: 15 },
        { number: 4, title: "Data & Information", pages: 14 },
        { number: 5, title: "Algorithms", pages: 18 },
        { number: 6, title: "Problem Solving", pages: 16 },
        { number: 7, title: "Machine Learning Basics", pages: 18 },
        { number: 8, title: "AI Applications", pages: 15 },
        { number: 9, title: "Projects & Activities", pages: 20 },
        { number: 10, title: "Review & Assessment", pages: 12 },
      ];

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Eye className="h-4 w-4" />
                Quick Preview
              </div>
              <DialogTitle className="text-2xl font-display">
                {book.title} - {book.class}
              </DialogTitle>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Book Preview */}
              <div>
                <div className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${book.color} p-6 flex flex-col items-center justify-center relative overflow-hidden mb-4`}>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
                  
                  <div className="relative z-10 text-center text-white">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <BookOpen className="h-10 w-10" />
                    </div>
                    <Badge className="mb-3 bg-white/20 text-white border-0">{book.class}</Badge>
                    <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                    <p className="text-white/80 text-sm">{book.subtitle}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Chapters", value: tableOfContents.length },
                    { label: "Pages", value: book.totalPages },
                    { label: "Worksheets", value: book.worksheets },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
                      <p className="text-lg font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-5">
                {/* Description */}
                <div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {book.longDescription}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-xs">
                      <feature.icon className="h-3.5 w-3.5 text-primary" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Table of Contents */}
                <div className="border rounded-xl p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                    <ListChecks className="h-4 w-4 text-primary" />
                    Table of Contents
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {tableOfContents.slice(0, 8).map((chapter) => (
                      <div key={chapter.number} className="flex items-center gap-3 text-sm">
                        <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {chapter.number}
                        </span>
                        <span className="flex-1 text-muted-foreground">{chapter.title}</span>
                        <span className="text-xs text-muted-foreground">{chapter.pages}p</span>
                      </div>
                    ))}
                    {tableOfContents.length > 8 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{tableOfContents.length - 8} more chapters...
                      </p>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-primary">₹{book.price}</span>
                    <span className="text-sm text-muted-foreground line-through">₹{book.originalPrice}</span>
                    <Badge className="bg-coral text-coral-foreground text-xs">
                      {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" /> Free Delivery
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" /> 7 Day Returns
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" onClick={handleAddToCart}>
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" onClick={handleViewDetails}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
