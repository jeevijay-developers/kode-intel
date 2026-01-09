import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "secondary" | "accent" | "coral" | "turquoise" | "sunny" | "purple" | "pink";
  hover?: boolean;
  header?: ReactNode;
  title?: string;
}

const glowColorMap = {
  primary: "hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)] border-primary/20",
  secondary: "hover:shadow-[0_0_30px_hsl(var(--secondary)/0.3)] border-secondary/20",
  accent: "hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)] border-accent/20",
  coral: "hover:shadow-[0_0_30px_hsl(var(--coral)/0.3)] border-coral/20",
  turquoise: "hover:shadow-[0_0_30px_hsl(var(--turquoise)/0.3)] border-turquoise/20",
  sunny: "hover:shadow-[0_0_30px_hsl(var(--sunny)/0.3)] border-sunny/20",
  purple: "hover:shadow-[0_0_30px_hsl(var(--purple)/0.3)] border-purple/20",
  pink: "hover:shadow-[0_0_30px_hsl(var(--pink)/0.3)] border-pink/20",
};

const bgGradientMap = {
  primary: "from-primary/10 via-primary/5 to-transparent",
  secondary: "from-secondary/10 via-secondary/5 to-transparent",
  accent: "from-accent/10 via-accent/5 to-transparent",
  coral: "from-coral/10 via-coral/5 to-transparent",
  turquoise: "from-turquoise/10 via-turquoise/5 to-transparent",
  sunny: "from-sunny/10 via-sunny/5 to-transparent",
  purple: "from-purple/10 via-purple/5 to-transparent",
  pink: "from-pink/10 via-pink/5 to-transparent",
};

export function GlowCard({
  children,
  className,
  glowColor = "primary",
  hover = true,
  header,
  title,
}: GlowCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        `bg-gradient-to-br ${bgGradientMap[glowColor]}`,
        hover && glowColorMap[glowColor],
        hover && "hover:-translate-y-1",
        className
      )}
    >
      {/* Decorative gradient orb */}
      <div 
        className={cn(
          "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20 blur-2xl",
          glowColor === "primary" && "bg-primary",
          glowColor === "secondary" && "bg-secondary",
          glowColor === "accent" && "bg-accent",
          glowColor === "coral" && "bg-coral",
          glowColor === "turquoise" && "bg-turquoise",
          glowColor === "sunny" && "bg-sunny",
          glowColor === "purple" && "bg-purple",
          glowColor === "pink" && "bg-pink",
        )}
      />
      
      {(header || title) && (
        <CardHeader className="relative">
          {title ? <CardTitle>{title}</CardTitle> : header}
        </CardHeader>
      )}
      <CardContent className="relative">{children}</CardContent>
    </Card>
  );
}
