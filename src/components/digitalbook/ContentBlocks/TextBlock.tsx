import { cn } from "@/lib/utils";

interface TextContent {
  heading?: string;
  heading_level?: 1 | 2 | 3 | 4;
  paragraphs?: string[];
  list?: {
    type: "bullet" | "numbered";
    items: string[];
  };
}

interface TextBlockProps {
  content: TextContent;
  className?: string;
}

export function TextBlock({ content, className }: TextBlockProps) {
  const { heading, heading_level = 2, paragraphs, list } = content;

  const HeadingTag = `h${heading_level}` as keyof JSX.IntrinsicElements;

  const headingStyles = {
    1: "text-2xl md:text-3xl font-bold text-foreground mb-4",
    2: "text-xl md:text-2xl font-semibold text-foreground mb-3",
    3: "text-lg md:text-xl font-semibold text-foreground mb-2",
    4: "text-base md:text-lg font-medium text-foreground mb-2",
  };

  return (
    <div className={cn("py-4", className)}>
      {heading && (
        <HeadingTag className={headingStyles[heading_level]}>
          {heading}
        </HeadingTag>
      )}

      {paragraphs?.map((paragraph, index) => (
        <p
          key={index}
          className="text-muted-foreground leading-relaxed mb-4 text-base md:text-lg"
        >
          {paragraph}
        </p>
      ))}

      {list && (
        <ul
          className={cn(
            "space-y-2 ml-6 mb-4",
            list.type === "numbered" ? "list-decimal" : "list-disc"
          )}
        >
          {list.items.map((item, index) => (
            <li
              key={index}
              className="text-muted-foreground text-base md:text-lg"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
