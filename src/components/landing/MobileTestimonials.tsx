import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  MessageSquare
} from "lucide-react";

// Testimonial avatars
import man1 from "@/assets/testimonial/man1.png";
import woman2 from "@/assets/testimonial/woman2.png";
import man3 from "@/assets/testimonial/man3.png";
import woman4 from "@/assets/testimonial/woman4.png";

const testimonials = [
  { 
    name: "Mrs. Sharma", 
    role: "Parent, Class 7 Student",
    location: "Delhi", 
    text: "My son is so excited about AI now! The videos are engaging and he's learning concepts I never imagined at his age. Best investment in his education.",
    avatar: woman2, 
    rating: 5 
  },
  { 
    name: "Mr. Patel", 
    role: "Parent, Class 5 Student",
    location: "Mumbai", 
    text: "My daughter looks forward to her coding sessions every day. She's developing critical thinking skills while having fun. Highly recommended!",
    avatar: man1, 
    rating: 5 
  },
  { 
    name: "Mrs. Kumar", 
    role: "Parent, Class 9 Student",
    location: "Bangalore", 
    text: "The computational thinking curriculum has improved my son's problem-solving abilities across all subjects. Amazing structured approach!",
    avatar: woman4, 
    rating: 5 
  },
  { 
    name: "Principal Verma", 
    role: "Delhi Public School",
    location: "Noida", 
    text: "KodeIntel has transformed how we teach technology. The structured curriculum and teacher support makes implementation seamless.",
    avatar: man3, 
    rating: 5 
  },
];

export function MobileTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-8 px-4 bg-muted/30">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-3">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-primary">Real Reviews</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2 font-display">
          What Parents & Schools <span className="text-gradient-primary">Say</span>
        </h2>
      </div>

      {/* Testimonial Card */}
      <div className="relative">
        <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-lg overflow-hidden">
          {/* Quote Icon */}
          <Quote className="absolute top-3 right-3 h-8 w-8 text-primary/10" />
          
          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-3">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-sunny text-sunny" />
            ))}
          </div>

          {/* Text */}
          <p className="text-sm text-foreground leading-relaxed mb-4 relative z-10">
            "{current.text}"
          </p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <img 
              src={current.avatar} 
              alt={current.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <h4 className="font-bold text-sm text-foreground">{current.name}</h4>
              <p className="text-xs text-muted-foreground">{current.role}</p>
              <Badge variant="outline" className="text-[9px] mt-1 px-1.5 py-0">{current.location}</Badge>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={prevTestimonial}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex 
                    ? "w-6 bg-primary" 
                    : "bg-border hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
