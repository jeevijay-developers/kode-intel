import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CirclePlay, 
  Code, 
  FileQuestion, 
  BookMarked, 
  TrendingUp, 
  Blocks,
  CheckCircle2,
  Star,
  ChevronRight,
  Sparkles,
  Gift,
  Trophy,
  BookOpen,
  Award
} from "lucide-react";
import { GlassCard } from "./GlassCard";

const plans = [
  {
    name: "Complete Learning Pack",
    price: "₹3,499",
    originalPrice: "₹4,999",
    period: "/year",
    popular: true,
    gradient: "from-primary to-secondary",
    features: [
      { icon: CirclePlay, text: "50+ HD Video Lectures" },
      { icon: BookOpen, text: "Interactive Digital Textbook" },
      { icon: Code, text: "Unlimited Code Lab Access" },
      { icon: FileQuestion, text: "Adaptive Worksheets" },
      { icon: Blocks, text: "10+ Hands-on Projects" },
      { icon: TrendingUp, text: "Progress Analytics" },
      { icon: BookMarked, text: "Interactive Digital Textbook" },
      { icon: Trophy, text: "Badges & Certificates" },
    ],
  },
  {
    name: "Workbook Only",
    price: "₹999",
    originalPrice: null,
    period: "",
    popular: false,
    gradient: "from-muted to-muted",
    features: [
      { icon: BookMarked, text: "Theory + Worksheets Book" },
      { icon: FileQuestion, text: "Practice Exercises" },
      { icon: CheckCircle2, text: "Chapter Summaries" },
      { icon: Award, text: "Activity Pages" },
    ],
  },
];

export function MobilePricing() {
  const navigate = useNavigate();

  return (
    <section className="py-8 px-4 bg-muted/20">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 glass-card rounded-full mb-3">
          <Gift className="h-4 w-4 text-sunny" />
          <span className="text-xs font-bold text-sunny">Launch Pricing</span>
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2 font-display">
          Simple, <span className="text-gradient-primary">Transparent</span> Pricing
        </h2>
        <p className="text-sm text-muted-foreground">
          7-day free trial, no credit card needed
        </p>
      </div>

      <div className="space-y-4">
        {plans.map((plan, index) => (
          <GlassCard
            key={index}
            glowColor={plan.popular ? 'primary' : 'secondary'}
            hover3D={false}
            size="md"
            className={`relative overflow-hidden ${
              plan.popular ? "border-2 border-primary/50 shadow-xl shadow-primary/10" : ""
            }`}
          >
            {/* Popular Banner */}
            {plan.popular && (
              <>
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-turquoise" />
                <div className="absolute -top-0.5 -right-0.5">
                  <div className="bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    BEST VALUE
                  </div>
                </div>
              </>
            )}

            <div className="pt-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <span className="line-through">{plan.originalPrice}</span>
                      <span className="text-lime font-bold ml-1.5">Save 30%</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className={`grid ${plan.popular ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-5`}>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <feature.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA with Shimmer */}
              <Button
                onClick={() => navigate(plan.popular ? "/student/signup" : "/student/signup")}
                className={`w-full h-12 gap-2 rounded-xl font-bold relative overflow-hidden ${
                  plan.popular 
                    ? "bg-gradient-to-r from-primary to-secondary hover:opacity-95 shadow-lg shadow-primary/20" 
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.popular && (
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer-slide bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />
                  </div>
                )}
                {plan.popular ? (
                  <>
                    <Sparkles className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Start Free Trial</span>
                  </>
                ) : (
                  <>Buy Workbook</>
                )}
                <ChevronRight className="h-4 w-4 relative z-10" />
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* School Partnership CTA with Glass */}
      <GlassCard
        glowColor="turquoise"
        hover3D={false}
        size="md"
        className="mt-6 bg-gradient-to-r from-turquoise/10 to-lime/10 border border-turquoise/30"
      >
        <p className="text-sm font-bold text-foreground mb-1">Schools & Institutions</p>
        <p className="text-xs text-muted-foreground mb-3">
          Bulk pricing at ₹2,999/student with dedicated support & training
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/school-partnership")}
          className="w-full border-turquoise/50 text-turquoise hover:bg-turquoise/10 glass-card"
        >
          Partner With Us
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </GlassCard>
    </section>
  );
}
