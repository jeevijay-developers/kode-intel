import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  Lightbulb, 
  Sparkles,
  Star,
  Zap,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getExamplesForClass, ExampleProject } from "@/lib/blockly/exampleProjects";

interface ExampleLoaderProps {
  classLevel: number;
  onLoadExample: (xml: string) => void;
  className?: string;
}

const difficultyIcons = {
  easy: Star,
  medium: Zap,
  hard: Trophy
};

const difficultyColors = {
  easy: "text-lime",
  medium: "text-sunny",
  hard: "text-coral"
};

export function ExampleLoader({ classLevel, onLoadExample, className }: ExampleLoaderProps) {
  const [open, setOpen] = useState(false);
  const examples = getExamplesForClass(classLevel);

  const handleSelect = (example: ExampleProject) => {
    onLoadExample(example.blocksXml);
    setOpen(false);
  };

  // Group examples by difficulty
  const easyExamples = examples.filter(e => e.difficulty === 'easy');
  const mediumExamples = examples.filter(e => e.difficulty === 'medium');
  const hardExamples = examples.filter(e => e.difficulty === 'hard');

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={cn("gap-1.5 h-8", className)}
        >
          <Lightbulb className="h-4 w-4 text-sunny" />
          <span className="hidden sm:inline">Examples</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Class {classLevel} Examples
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {easyExamples.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-lime flex items-center gap-1 py-1">
              <Star className="h-3 w-3" /> Easy
            </DropdownMenuLabel>
            {easyExamples.map((example) => (
              <ExampleMenuItem 
                key={example.id} 
                example={example} 
                onSelect={handleSelect}
              />
            ))}
          </>
        )}

        {mediumExamples.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-sunny flex items-center gap-1 py-1">
              <Zap className="h-3 w-3" /> Medium
            </DropdownMenuLabel>
            {mediumExamples.map((example) => (
              <ExampleMenuItem 
                key={example.id} 
                example={example} 
                onSelect={handleSelect}
              />
            ))}
          </>
        )}

        {hardExamples.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-coral flex items-center gap-1 py-1">
              <Trophy className="h-3 w-3" /> Hard
            </DropdownMenuLabel>
            {hardExamples.map((example) => (
              <ExampleMenuItem 
                key={example.id} 
                example={example} 
                onSelect={handleSelect}
              />
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ExampleMenuItemProps {
  example: ExampleProject;
  onSelect: (example: ExampleProject) => void;
}

function ExampleMenuItem({ example, onSelect }: ExampleMenuItemProps) {
  const DiffIcon = difficultyIcons[example.difficulty];
  const colorClass = difficultyColors[example.difficulty];

  return (
    <DropdownMenuItem 
      onClick={() => onSelect(example)}
      className="flex items-center justify-between py-2 cursor-pointer"
    >
      <div className="flex items-center gap-2 min-w-0">
        <DiffIcon className={cn("h-3.5 w-3.5 shrink-0", colorClass)} />
        <span className="text-sm truncate">{example.title}</span>
      </div>
      <Badge variant="outline" className="text-[10px] gap-0.5 shrink-0 ml-2">
        <Sparkles className="h-2.5 w-2.5 text-sunny" />
        {example.xpReward}
      </Badge>
    </DropdownMenuItem>
  );
}
