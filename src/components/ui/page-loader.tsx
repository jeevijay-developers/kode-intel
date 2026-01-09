import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  message?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PageLoader({ 
  message = "Loading...", 
  className,
  size = "md"
}: PageLoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 space-y-4",
      className
    )}>
      <div className="relative">
        <Loader2 className={cn(
          "animate-spin text-primary",
          sizeClasses[size]
        )} />
        <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
      </div>
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

interface FullPageLoaderProps {
  message?: string;
}

export function FullPageLoader({ message = "Loading..." }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 blur-xl bg-primary/30 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-foreground animate-pulse">
            {message}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please wait...
          </p>
        </div>
      </div>
    </div>
  );
}
