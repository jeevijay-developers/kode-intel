import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Sparkles, GraduationCap, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { normalizeClassValue } from "@/lib/classLevel";

interface DigitalBookWithChapter {
  id: string;
  title: string;
  subtitle: string | null;
  cover_image_url: string | null;
  estimated_reading_time: number | null;
  chapters: {
    id: string;
    title: string;
    order_index: number;
    courses: {
      id: string;
      title: string;
    };
  };
}

const colorClasses = [
  {
    bg: "from-turquoise/10 to-turquoise/5",
    border: "border-turquoise/20",
    badge: "bg-turquoise/20 text-turquoise",
    icon: "from-turquoise to-lime",
  },
  {
    bg: "from-coral/10 to-coral/5",
    border: "border-coral/20",
    badge: "bg-coral/20 text-coral",
    icon: "from-coral to-sunny",
  },
  {
    bg: "from-purple/10 to-purple/5",
    border: "border-purple/20",
    badge: "bg-purple/20 text-purple",
    icon: "from-purple to-primary",
  },
  {
    bg: "from-primary/10 to-primary/5",
    border: "border-primary/20",
    badge: "bg-primary/20 text-primary",
    icon: "from-primary to-secondary",
  },
];

export function SampleEbookViewer() {
  const navigate = useNavigate();
  
  // Get guest's selected class
  const getGuestClass = (): string => {
    try {
      const stored = localStorage.getItem("guestInfo");
      if (stored) {
        const parsed = JSON.parse(stored);
        return normalizeClassValue(parsed?.selectedClass) || "5";
      }
    } catch {
      // Ignore parsing errors
    }
    return "5";
  };

  const guestClass = getGuestClass();

  // Fetch digital books for the guest's class
  const { data: digitalBooks = [], isLoading } = useQuery({
    queryKey: ["sample-digital-books", guestClass],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digital_books")
        .select(`
          id,
          title,
          subtitle,
          cover_image_url,
          estimated_reading_time,
          chapters!inner(
            id,
            title,
            order_index,
            courses!inner(
              id,
              title
            )
          )
        `)
        .eq("is_published", true)
        .order("created_at", { ascending: true })
        .limit(6);

      if (error) throw error;

      // Filter by class in JS since Supabase doesn't support ILIKE on nested tables easily
      const filtered = (data || []).filter((book: any) => {
        const courseTitle = book.chapters?.courses?.title || "";
        return courseTitle.toLowerCase().includes(`class ${guestClass}`) ||
               courseTitle.toLowerCase().includes(`class${guestClass}`);
      });

      // If no books for this class, return first 3 books from any class
      if (filtered.length === 0) {
        return (data || []).slice(0, 3) as DigitalBookWithChapter[];
      }

      return filtered.slice(0, 3) as DigitalBookWithChapter[];
    },
  });

  const handleOpenBook = (bookId: string) => {
    navigate(`/guest/book/${bookId}`);
  };

  const getClassFromCourse = (courseTitle: string): string => {
    const match = courseTitle.match(/class\s*(\d+)/i);
    return match ? match[1] : "5";
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden relative border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-3 py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading digital books...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (digitalBooks.length === 0) {
    return null; // Don't show section if no books available
  }

  return (
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
              📖 Digital Book Previews
              <Badge className="bg-sunny/20 text-sunny text-[9px] sm:text-[10px] animate-pulse">
                FREE PREVIEW
              </Badge>
            </h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Read interactive digital books from our curriculum
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {digitalBooks.map((book, index) => {
            const colors = colorClasses[index % colorClasses.length];
            const courseTitle = book.chapters?.courses?.title || "";
            const classNum = getClassFromCourse(courseTitle);
            const chapterTitle = book.chapters?.title || "";
            
            return (
              <Card
                key={book.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group bg-gradient-to-br ${colors.bg} ${colors.border}`}
                onClick={() => handleOpenBook(book.id)}
              >
                <CardContent className="p-2.5 sm:p-3 md:p-4">
                  <div className="flex sm:flex-col items-center sm:text-center gap-3">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
                      <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                    </div>
                    <div className="flex-1 sm:flex-none min-w-0">
                      <Badge className={`${colors.badge} text-[10px] sm:text-xs mb-0.5 sm:mb-1`}>
                        Class {classNum}
                      </Badge>
                      <h3 className="font-bold text-xs sm:text-sm md:text-base line-clamp-2 sm:min-h-[2.5rem]">
                        {book.title}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                        {chapterTitle || "Chapter"} • Interactive Book
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 sm:gap-1.5 text-[10px] sm:text-xs group-hover:bg-primary group-hover:text-white transition-colors px-2 sm:px-3 h-7 sm:h-8 shrink-0"
                    >
                      <Eye className="h-3 w-3" />
                      <span className="hidden sm:inline">Read</span>
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
  );
}
