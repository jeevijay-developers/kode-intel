import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BookOpen,
  ShoppingCart,
  FileText,
  PenTool,
  Brain,
  Award,
  Sparkles,
  Eye,
  ListChecks,
  Truck,
  Shield,
  ChevronRight,
  Layers,
} from "lucide-react";
import { getBookById, getTotalSubTopics } from "@/lib/bookData";

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

  const totalSubTopics = getTotalSubTopics(book);

  // Simplified book object for cart
  const cartBook = {
    id: book.id,
    class: book.class,
    title: book.title,
    subtitle: book.subtitle,
    description: book.description,
    price: book.price,
    originalPrice: book.originalPrice,
    chapters: book.chapters.length,
    subTopics: totalSubTopics,
    worksheets: book.worksheets,
    color: book.color,
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(cartBook);
    onClose();
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails(book.id);
    onClose();
  };

  const features = [
    { icon: FileText, text: "Theory Notes" },
    { icon: PenTool, text: `${book.worksheets} Worksheets` },
    { icon: Brain, text: "Mind Maps" },
    { icon: Award, text: "Assessments" },
  ];

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-4 sm:p-6">
            <DialogHeader className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Eye className="h-4 w-4" />
                Quick Preview
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-display">
                {book.title} - {book.class}
              </DialogTitle>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {/* Book Preview */}
              <div>
                <div className={`aspect-[3/4] rounded-2xl bg-gradient-to-br ${book.color} p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden mb-4`}>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
                  
                  <div className="relative z-10 text-center text-white">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <BookOpen className="h-8 w-8 sm:h-10 sm:w-10" />
                    </div>
                    <Badge className="mb-2 sm:mb-3 bg-white/20 text-white border-0">{book.class}</Badge>
                    <h3 className="text-lg sm:text-xl font-bold mb-1">{book.title}</h3>
                    <p className="text-white/80 text-xs sm:text-sm">{book.subtitle}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Chapters", value: book.chapters.length },
                    { label: "Topics", value: totalSubTopics },
                    { label: "Pages", value: book.totalPages },
                    { label: "Worksheets", value: book.worksheets },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                      <p className="text-base sm:text-lg font-bold text-primary">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Info */}
              <div className="space-y-4 sm:space-y-5">
                {/* Description */}
                <div>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {book.longDescription}
                  </p>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary/10 text-[10px] sm:text-xs">
                      <feature.icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Chapters with Subtopics */}
                <div className="border rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                    <ListChecks className="h-4 w-4 text-primary" />
                    Chapters & Topics
                  </h4>
                  <Accordion type="single" collapsible className="space-y-1">
                    {book.chapters.slice(0, 6).map((chapter) => (
                      <AccordionItem key={chapter.id} value={chapter.id} className="border-0">
                        <AccordionTrigger className="py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 hover:no-underline text-left">
                          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                            <span className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-primary/10 flex items-center justify-center text-[10px] sm:text-xs font-medium text-primary flex-shrink-0">
                              {chapter.number}
                            </span>
                            <span className="flex-1 font-medium text-foreground line-clamp-1">{chapter.title}</span>
                            <Badge variant="outline" className="text-[10px] py-0 px-1.5 hidden sm:flex">
                              {chapter.subTopics.length} topics
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-1 px-3">
                          <div className="pl-7 sm:pl-9 space-y-1.5">
                            {chapter.subTopics.map((subTopic, idx) => (
                              <div key={subTopic.id} className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                                <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-primary/50" />
                                <span className="line-clamp-1">{subTopic.title}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {book.chapters.length > 6 && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground text-center pt-2">
                      +{book.chapters.length - 6} more chapters...
                    </p>
                  )}
                </div>

                {/* Pricing */}
                <div className="p-3 sm:p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl sm:text-2xl font-bold text-primary">₹{book.price}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground line-through">₹{book.originalPrice}</span>
                    <Badge className="bg-coral text-coral-foreground text-[10px] sm:text-xs">
                      {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" /> Free Delivery
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" /> 7 Day Returns
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2 text-xs sm:text-sm" onClick={handleAddToCart}>
                      <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="text-xs sm:text-sm" onClick={handleViewDetails}>
                      View Full Details
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