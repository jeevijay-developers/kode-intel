import { cn } from "@/lib/utils";
import { ImageOff, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface ImageContent {
  src: string;
  alt: string;
  caption?: string;
  size?: "small" | "medium" | "large" | "full";
}

interface ImageBlockProps {
  content: ImageContent;
  className?: string;
}

export function ImageBlock({ content, className }: ImageBlockProps) {
  const { src, alt, caption, size = "medium" } = content;
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeStyles = {
    small: "max-w-xs",
    medium: "max-w-md",
    large: "max-w-2xl",
    full: "w-full",
  };

  // Handle missing images with a nice placeholder
  if (imageError) {
    return (
      <figure className={cn("py-6 flex flex-col items-center", className)}>
        <div
          className={cn(
            "relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-2 border-dashed border-muted-foreground/20",
            sizeStyles[size],
            "aspect-video flex items-center justify-center"
          )}
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">{alt}</p>
          </div>
        </div>
        {caption && (
          <figcaption className="mt-3 text-sm text-muted-foreground text-center italic max-w-md">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={cn("py-6 flex flex-col items-center", className)}>
      <div
        className={cn(
          "relative rounded-xl overflow-hidden shadow-lg",
          sizeStyles[size]
        )}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-auto object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          loading="lazy"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-muted-foreground text-center italic max-w-md">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}