import { useRef, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  BookOpen,
  Lightbulb,
  AlertCircle,
  Sparkles,
  ListOrdered,
  ArrowLeftRight,
  PenTool,
  FileText,
  BookMarked,
  Info,
  ImageIcon,
  List,
  ChevronRight,
  X,
} from "lucide-react";
import { getSampleChapterForClass, type ContentBlock } from "@/lib/sampleBookContent";
import brainLogo from "@/assets/brain-logo.png";

interface SampleBookViewerProps {
  classNum: number;
}

const variantStyles: Record<string, { bg: string; border: string; icon: React.ReactNode; label: string }> = {
  fun_fact: { bg: "bg-sunny/10", border: "border-sunny/30", icon: <Sparkles className="h-5 w-5 text-sunny" />, label: "Fun Fact" },
  tip: { bg: "bg-lime/10", border: "border-lime/30", icon: <Lightbulb className="h-5 w-5 text-lime" />, label: "Pro Tip" },
  warning: { bg: "bg-coral/10", border: "border-coral/30", icon: <AlertCircle className="h-5 w-5 text-coral" />, label: "Important" },
  info: { bg: "bg-primary/10", border: "border-primary/30", icon: <Info className="h-5 w-5 text-primary" />, label: "Did You Know?" },
};

const blockTypeIcons: Record<string, React.ReactNode> = {
  text: <BookOpen className="h-3.5 w-3.5" />,
  callout: <Lightbulb className="h-3.5 w-3.5" />,
  key_term: <BookMarked className="h-3.5 w-3.5" />,
  step_by_step: <ListOrdered className="h-3.5 w-3.5" />,
  comparison: <ArrowLeftRight className="h-3.5 w-3.5" />,
  activity: <PenTool className="h-3.5 w-3.5" />,
  summary: <FileText className="h-3.5 w-3.5" />,
  image: <ImageIcon className="h-3.5 w-3.5" />,
};

function renderBlock(block: ContentBlock, index: number) {
  const sectionId = `section-${index}`;

  switch (block.type) {
    case "image":
      return (
        <div key={index} id={sectionId} className="mb-6 sample-book-block flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-primary/10 max-w-lg w-full bg-muted/30">
            <img
              src={block.imageSrc}
              alt={block.imageAlt || "Illustration"}
              className="w-full h-auto object-cover"
              loading="lazy"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="hidden items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="text-center">
                <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">{block.imageAlt}</p>
              </div>
            </div>
          </div>
          {block.title && (
            <p className="mt-2 text-xs text-muted-foreground italic text-center">{block.title}</p>
          )}
        </div>
      );

    case "text":
      return (
        <div key={index} id={sectionId} className="mb-6 sample-book-block">
          {block.title && (
            <h3 className="text-lg font-bold font-display text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary shrink-0" />
              {block.title}
            </h3>
          )}
          <p className="text-sm leading-relaxed text-muted-foreground">{block.content}</p>
        </div>
      );

    case "callout": {
      const style = variantStyles[block.variant || "info"];
      return (
        <div key={index} id={sectionId} className={`mb-6 p-4 rounded-2xl border-2 ${style.bg} ${style.border} sample-book-block`}>
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">{block.icon ? <span className="text-2xl">{block.icon}</span> : style.icon}</div>
            <div>
              <Badge className={`${style.bg} text-foreground border-0 text-[10px] mb-1.5`}>{style.label}</Badge>
              <p className="text-sm leading-relaxed text-foreground">{block.content}</p>
            </div>
          </div>
        </div>
      );
    }

    case "key_term":
      return (
        <div key={index} id={sectionId} className="mb-5 p-4 rounded-2xl bg-secondary/10 border-2 border-secondary/20 sample-book-block">
          <div className="flex items-start gap-3">
            <BookMarked className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-secondary">{block.title}</p>
              <p className="text-sm text-foreground mt-1 leading-relaxed">{block.content}</p>
            </div>
          </div>
        </div>
      );

    case "step_by_step":
      return (
        <div key={index} id={sectionId} className="mb-6 sample-book-block">
          {block.title && (
            <h3 className="text-lg font-bold font-display text-foreground mb-3 flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-turquoise shrink-0" />
              {block.title}
            </h3>
          )}
          <div className="space-y-2.5">
            {block.items?.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-turquoise/5 border border-turquoise/15">
                <div className="w-7 h-7 rounded-lg bg-turquoise/20 flex items-center justify-center shrink-0 text-xs font-bold text-turquoise">
                  {i + 1}
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">{item}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "comparison":
      return (
        <div key={index} id={sectionId} className="mb-6 sample-book-block">
          {block.title && (
            <h3 className="text-lg font-bold font-display text-foreground mb-3 flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-coral shrink-0" />
              {block.title}
            </h3>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-xs font-bold text-primary mb-2">{block.columns?.leftTitle || "Left"}</p>
              <ul className="space-y-1.5">
                {block.columns?.left.map((item, i) => (
                  <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                    <span className="text-primary mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 rounded-xl bg-coral/5 border border-coral/20">
              <p className="text-xs font-bold text-coral mb-2">{block.columns?.rightTitle || "Right"}</p>
              <ul className="space-y-1.5">
                {block.columns?.right.map((item, i) => (
                  <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                    <span className="text-coral mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );

    case "activity":
      return (
        <div key={index} id={sectionId} className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-lime/10 to-turquoise/10 border-2 border-lime/20 sample-book-block">
          <div className="flex items-start gap-3">
            <PenTool className="h-5 w-5 text-lime shrink-0 mt-0.5" />
            <div>
              <Badge className="bg-lime/20 text-lime border-0 text-[10px] mb-1.5">Hands-On Activity</Badge>
              {block.title && <p className="font-bold text-sm text-foreground mb-1">{block.title}</p>}
              <p className="text-sm text-muted-foreground mb-2">{block.content}</p>
              {block.items && (
                <ul className="space-y-1.5 mt-2">
                  {block.items.map((item, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-2">
                      <span className="w-5 h-5 rounded bg-lime/20 flex items-center justify-center text-[10px] font-bold text-lime shrink-0">{i + 1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );

    case "summary":
      return (
        <div key={index} id={sectionId} className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 sample-book-block">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <Badge className="bg-primary/20 text-primary border-0 text-[10px] mb-1.5">Summary</Badge>
              {block.title && <p className="font-bold text-sm text-foreground mb-1">{block.title}</p>}
              <p className="text-sm text-muted-foreground leading-relaxed">{block.content}</p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function SampleBookViewer({ classNum }: SampleBookViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const chapter = getSampleChapterForClass(classNum);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  // Build TOC entries from blocks that have titles
  const tocEntries = useMemo(() => {
    if (!chapter) return [];
    return chapter.blocks
      .map((block, index) => ({
        index,
        title: block.title || (block.type === "callout" ? variantStyles[block.variant || "info"]?.label : null),
        type: block.type,
      }))
      .filter((entry) => entry.title && entry.type !== "image");
  }, [chapter]);

  if (!chapter) {
    return (
      <Card className="p-8 text-center border-dashed">
        <BookOpen className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Sample book not available for this class yet</p>
      </Card>
    );
  }

  const handleDownload = () => {
    window.print();
  };

  const scrollToSection = (index: number) => {
    const el = document.getElementById(`section-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(index);
      setTocOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Download Button Header */}
      <div className="shrink-0 p-3 border-b bg-background/95 backdrop-blur flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center gap-1.5 text-sm font-semibold hover:text-primary transition-colors"
          >
            <List className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline">Contents</span>
          </button>
        </div>
        <Button onClick={handleDownload} size="sm" className="gap-2 bg-gradient-to-r from-primary to-secondary">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div className="flex flex-1 min-h-0 relative">
        {/* TOC Sidebar — desktop sticky, mobile overlay */}
        {/* Desktop TOC */}
        <div className="hidden lg:block w-56 xl:w-64 shrink-0 border-r bg-muted/30 print:hidden">
          <ScrollArea className="h-full">
            <div className="p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">
                Table of Contents
              </p>
              <nav className="space-y-0.5">
                {tocEntries.map((entry) => (
                  <button
                    key={entry.index}
                    onClick={() => scrollToSection(entry.index)}
                    className={`w-full text-left flex items-start gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors hover:bg-primary/10 hover:text-primary ${
                      activeSection === entry.index
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="shrink-0 mt-0.5 opacity-60">{blockTypeIcons[entry.type]}</span>
                    <span className="leading-snug line-clamp-2">{entry.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </ScrollArea>
        </div>

        {/* Mobile TOC Overlay */}
        {tocOpen && (
          <div className="lg:hidden absolute inset-0 z-30 bg-background/95 backdrop-blur-sm print:hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-foreground flex items-center gap-2">
                  <List className="h-4 w-4 text-primary" />
                  Table of Contents
                </p>
                <button onClick={() => setTocOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <nav className="space-y-1">
                {tocEntries.map((entry) => (
                  <button
                    key={entry.index}
                    onClick={() => scrollToSection(entry.index)}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-primary/10 hover:text-primary text-muted-foreground active:scale-[0.98]"
                  >
                    <span className="shrink-0 opacity-60">{blockTypeIcons[entry.type]}</span>
                    <span className="flex-1 line-clamp-1">{entry.title}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div ref={contentRef} id="sample-book-content" className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Branded Header */}
            <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-primary/15 via-secondary/10 to-turquoise/10 border-2 border-primary/20 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-turquoise" />
              <div className="flex justify-center mb-3">
                <img src={brainLogo} alt="KodeIntel" className="h-12" />
              </div>
              <Badge className="bg-primary/20 text-primary border-0 mb-2">Class {chapter.classNum}</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground mb-1">{chapter.title}</h1>
              <p className="text-sm text-muted-foreground">{chapter.subtitle}</p>
              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                <span>KodeIntel Learning Platform</span>
                <span>•</span>
                <span>Chapter 1 • Sample Preview</span>
              </div>
            </div>

            {/* Content Blocks */}
            {chapter.blocks.map((block, index) => renderBlock(block, index))}

            {/* Footer Branding */}
            <div className="mt-10 pt-6 border-t border-border/50 text-center">
              <div className="flex justify-center mb-2">
                <img src={brainLogo} alt="KodeIntel" className="h-8 opacity-60" />
              </div>
              <p className="text-xs text-muted-foreground">
                © KodeIntel — AI & Computational Thinking for Young Learners
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                This is a sample preview of Chapter 1, Class {chapter.classNum}. For the complete curriculum, sign up on our platform.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
