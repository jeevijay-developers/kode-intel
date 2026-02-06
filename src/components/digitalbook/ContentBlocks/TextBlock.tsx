import { cn } from "@/lib/utils";

interface TextContent {
  heading?: string;
  heading_level?: 1 | 2 | 3 | 4;
  paragraphs?: string[];
  list?: {
    type: "bullet" | "numbered";
    items: string[];
  };
  emphasis?: string;
}

interface TextBlockProps {
  content: TextContent;
  className?: string;
}

export function TextBlock({ content, className }: TextBlockProps) {
  const { heading, heading_level = 2, paragraphs, list, emphasis } = content;

  const HeadingTag = `h${heading_level}` as keyof JSX.IntrinsicElements;

  const headingStyles = {
    1: "text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight",
    2: "text-xl md:text-2xl font-semibold text-foreground mb-3 leading-tight",
    3: "text-lg md:text-xl font-semibold text-foreground mb-2",
    4: "text-base md:text-lg font-medium text-foreground mb-2",
  };

  return (
    <div className={cn("py-3", className)}>
      {heading && (
        <HeadingTag className={headingStyles[heading_level]}>
          {heading}
        </HeadingTag>
      )}

      {paragraphs?.map((paragraph, index) => (
        <p
          key={index}
          className="text-muted-foreground leading-[1.8] mb-4 text-[15px] md:text-[17px]"
        >
          {paragraph}
        </p>
      ))}

      {emphasis && (
        <p className="text-foreground font-medium leading-relaxed mb-4 text-base md:text-lg pl-4 border-l-4 border-primary/30 bg-primary/5 py-2 pr-4 rounded-r-lg">
          {emphasis}
        </p>
      )}

      {list && (
        <ul
          className={cn(
            "space-y-2.5 ml-6 mb-4",
            list.type === "numbered" ? "list-decimal" : "list-disc"
          )}
        >
          {list.items.map((item, index) => (
            <li
              key={index}
              className="text-muted-foreground text-[15px] md:text-[17px] leading-relaxed pl-1"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
