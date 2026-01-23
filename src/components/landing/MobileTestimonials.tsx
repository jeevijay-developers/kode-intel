import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

import man1 from "@/assets/testimonial/man1.png";
import woman2 from "@/assets/testimonial/woman2.png";
import man3 from "@/assets/testimonial/man3.png";
import woman4 from "@/assets/testimonial/woman4.png";

const testimonials = [
  { 
    name: "Mrs. Sharma", 
    role: "Parent, Class 7", 
    text: "My son is so excited about AI now! The videos are engaging.", 
    avatar: woman2 
  },
  { 
    name: "Mr. Patel", 
    role: "Parent, Class 5", 
    text: "My daughter looks forward to quizzes every day!", 
    avatar: man1 
  },
  { 
    name: "Mrs. Kumar", 
    role: "Parent, Class 9", 
    text: "Improved problem-solving skills across all subjects.", 
    avatar: woman4 
  },
  { 
    name: "Principal Verma", 
    role: "DPS School", 
    text: "KodeIntel has transformed how we teach technology.", 
    avatar: man3 
  },
];

export function MobileTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8 px-4">
      <div className="text-center mb-5">
        <h2 className="text-xl font-bold text-foreground mb-2 font-display">
          Loved by <span className="text-gradient-primary">Parents</span>
        </h2>
      </div>

      {/* Testimonial Cards Carousel */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial, i) => (
            <div key={i} className="w-full flex-shrink-0 px-1">
              <div className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm">
                <Quote className="h-6 w-6 text-primary/20 mb-3" />
                <p className="text-sm text-foreground mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Star key={j} className="h-3 w-3 fill-sunny text-sunny" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? "bg-primary w-5" : "bg-border"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
