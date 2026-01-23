import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CirclePlay, 
  Code, 
  FileQuestion, 
  BookMarked, 
  TrendingUp, 
  Blocks,
  CheckCircle2,
  Star,
  ChevronRight
} from "lucide-react";

const plans = [
  {
    name: "Full Pack",
    price: "₹3,499",
    period: "/year",
    popular: true,
    gradient: "from-primary to-secondary",
    features: [
      { icon: CirclePlay, text: "Video Lectures" },
      { icon: Code, text: "Practice Compiler" },
      { icon: FileQuestion, text: "Interactive Quizzes" },
      { icon: Blocks, text: "Practice Projects" },
      { icon: TrendingUp, text: "Analytics" },
      { icon: BookMarked, text: "Physical Book" },
    ],
  },
  {
    name: "Book Only",
    price: "₹999",
    period: "",
    popular: false,
    gradient: "from-muted to-muted",
    features: [
      { icon: BookMarked, text: "Physical Workbook" },
      { icon: FileQuestion, text: "Practice Exercises" },
      { icon: CheckCircle2, text: "Chapter Summaries" },
    ],
  },
];

export function MobilePricing() {
  const navigate = useNavigate();

  return (
    <section className="py-8 px-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2 font-display">
          Simple <span className="text-gradient-primary">Pricing</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose the plan that works for you
        </p>
      </div>

      <div className="space-y-4">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative rounded-2xl border-2 overflow-hidden ${
              plan.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border"
            }`}
          >
            {/* Popular Banner */}
            {plan.popular && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
            )}

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                {plan.popular && (
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-white gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Best Value
                  </Badge>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <feature.icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-xs">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={() => navigate("/store")}
                className={`w-full gap-2 rounded-xl ${
                  plan.popular 
                    ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                    : "bg-muted hover:bg-muted/80"
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                Get {plan.name}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
