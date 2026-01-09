import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FunFact {
  emoji: string;
  fact: string;
  category: string;
}

const defaultFacts: FunFact[] = [
  { emoji: "🤖", fact: "The first robot was created in 1954 and was called 'Unimate'!", category: "Robotics" },
  { emoji: "🧠", fact: "Your brain uses about 20% of your body's energy!", category: "Science" },
  { emoji: "💻", fact: "The first computer 'bug' was an actual bug - a moth!", category: "History" },
  { emoji: "🎮", fact: "The first video game was created in 1958 - 'Tennis for Two'!", category: "Gaming" },
  { emoji: "🌐", fact: "The internet was invented in 1969 and was called ARPANET!", category: "Internet" },
  { emoji: "📱", fact: "The first smartphone was created in 1992 by IBM!", category: "Technology" },
  { emoji: "🔮", fact: "AI can now write stories, create art, and even compose music!", category: "AI" },
  { emoji: "🚀", fact: "SpaceX's rockets can land themselves after going to space!", category: "Space" },
];

interface FunFactCarouselProps {
  facts?: FunFact[];
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export function FunFactCarousel({
  facts = defaultFacts,
  autoPlay = true,
  interval = 6000,
  className,
}: FunFactCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      goToNext();
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, currentIndex]);

  const goToNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % facts.length);
      setIsAnimating(false);
    }, 150);
  };

  const goToPrev = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + facts.length) % facts.length);
      setIsAnimating(false);
    }, 150);
  };

  const currentFact = facts[currentIndex];

  return (
    <Card className={cn(
      "relative overflow-hidden bg-gradient-to-br from-secondary/10 via-purple/5 to-pink/10 border-secondary/20",
      className
    )}>
      {/* Decorative sparkles */}
      <Sparkles className="absolute top-2 right-2 h-4 w-4 text-secondary/40 animate-pulse" />
      
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-secondary/20 flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-secondary" />
          </div>
          <span className="text-xs font-medium text-secondary">Did You Know?</span>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {currentIndex + 1}/{facts.length}
          </span>
        </div>

        <div className={cn(
          "transition-all duration-150",
          isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        )}>
          <div className="flex items-start gap-2">
            <span className="text-2xl">{currentFact.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground leading-snug">
                {currentFact.fact}
              </p>
              <span className="text-[10px] text-muted-foreground mt-1 inline-block px-1.5 py-0.5 bg-muted/50 rounded">
                {currentFact.category}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex items-center justify-center gap-1.5 mt-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={goToPrev}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <div className="flex gap-1">
            {facts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === currentIndex ? "bg-secondary w-3" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={goToNext}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
