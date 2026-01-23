import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import kodiMascot from "@/assets/kodi-mascot-3d.png";

export function MobileCTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-10 px-4">
      {/* CTA Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-primary via-secondary to-turquoise p-6 overflow-hidden shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 text-center">
          {/* Mascot */}
          <div className="w-24 h-24 mx-auto mb-4">
            <img 
              src={kodiMascot} 
              alt="KODI" 
              className="w-full h-full object-contain drop-shadow-2xl animate-float"
            />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 font-display">
            Ready to Begin?
          </h2>
          <p className="text-white/90 text-sm mb-5 leading-relaxed">
            Join 1000+ students learning AI & coding the fun way
          </p>

          {/* Benefits List */}
          <div className="space-y-2 mb-5">
            {[
              "7-day free trial, no card needed",
              "Cancel anytime, no questions asked",
              "Dedicated support for parents"
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-lime" />
                <span className="text-white/95 text-xs font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => navigate("/student/signup")}
            className="w-full h-14 bg-white text-primary hover:bg-white/95 rounded-xl text-base font-bold shadow-xl gap-2 mb-3"
          >
            <Sparkles className="h-5 w-5" />
            Start Your Free Trial
            <ChevronRight className="h-5 w-5" />
          </Button>

          <p className="text-white/70 text-xs">
            Already registered?{" "}
            <button 
              onClick={() => navigate("/student/login")}
              className="text-white font-semibold underline underline-offset-2"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      {/* Contact Options */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        <a
          href="tel:+919876543210"
          className="flex flex-col items-center p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow"
        >
          <Phone className="h-5 w-5 text-primary mb-1.5" />
          <span className="text-[10px] font-semibold text-foreground">Call Us</span>
        </a>
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow"
        >
          <MessageCircle className="h-5 w-5 text-lime mb-1.5" />
          <span className="text-[10px] font-semibold text-foreground">WhatsApp</span>
        </a>
        <a
          href="mailto:hello@kodeintel.com"
          className="flex flex-col items-center p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow"
        >
          <Mail className="h-5 w-5 text-coral mb-1.5" />
          <span className="text-[10px] font-semibold text-foreground">Email</span>
        </a>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          © 2024 KodeIntel. Made with ❤️ for young innovators in India.
        </p>
      </div>
    </section>
  );
}
