import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Building2, ChevronRight, Sparkles } from "lucide-react";
import studentsAchievement from "@/assets/students-achievement.png";

export function MobileCTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-8 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-secondary" />
      <div className="absolute inset-0 pattern-dots opacity-10" />
      
      {/* Image */}
      <div className="relative z-10">
        <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
          <img 
            src={studentsAchievement} 
            alt="Students Celebrating" 
            className="w-full h-32 object-cover"
          />
        </div>

        <div className="text-center text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="h-3 w-3" />
            Join 1000+ Students
          </div>
          
          <h2 className="text-xl font-bold mb-3 font-display">
            Ready to Start Your AI Journey?
          </h2>
          <p className="text-sm text-white/80 mb-5">
            Login to access courses, watch videos, take quizzes, and earn badges!
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/student/login")}
              variant="secondary"
              className="w-full h-11 gap-2 rounded-xl font-semibold shadow-lg"
            >
              <GraduationCap className="h-5 w-5" />
              Student Login
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate("/schools")}
              variant="outline"
              className="w-full h-11 gap-2 rounded-xl font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Building2 className="h-5 w-5" />
              For Schools
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
