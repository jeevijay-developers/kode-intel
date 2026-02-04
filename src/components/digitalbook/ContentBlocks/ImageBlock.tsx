import { cn } from "@/lib/utils";

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

  const sizeStyles = {
    small: "max-w-xs",
    medium: "max-w-md",
    large: "max-w-2xl",
    full: "w-full",
  };

  return (
    <figure className={cn("py-6 flex flex-col items-center", className)}>
      <div
        className={cn(
          "relative rounded-xl overflow-hidden shadow-lg",
          sizeStyles[size]
        )}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-cover"
          loading="lazy"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
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
