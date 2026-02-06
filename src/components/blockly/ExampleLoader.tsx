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
  Trophy,
  Play,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getExamplesForClass, ExampleProject } from "@/lib/blockly/exampleProjects";
import { getClassTheme } from "@/lib/blockly/classThemes";

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

const difficultyLabels = {
  easy: "Beginner",
  medium: "Intermediate", 
  hard: "Advanced"
};

export function ExampleLoader({ classLevel, onLoadExample, className }: ExampleLoaderProps) {
  const [open, setOpen] = useState(false);
  const examples = getExamplesForClass(classLevel);
  const theme = getClassTheme(classLevel);

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
          className={cn("gap-1.5 h-8 border-primary/30 hover:border-primary/50 hover:bg-primary/5", className)}
        >
          <Lightbulb className="h-4 w-4 text-sunny" />
          <span className="hidden sm:inline">Examples</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        {/* Header with class theme */}
        <div className={cn(
          "px-3 py-2 rounded-t-md -m-1 mb-1 bg-gradient-to-r",
          theme.gradient
        )}>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-semibold">Class {classLevel} Examples</p>
              <p className="text-[10px] text-muted-foreground">{theme.name}</p>
            </div>
          </div>
        </div>

        {easyExamples.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-lime flex items-center gap-1.5 py-1.5 px-2">
              <Star className="h-3.5 w-3.5" /> 
              <span>Beginner</span>
              <Badge variant="outline" className="text-[9px] h-4 px-1 ml-auto">{easyExamples.length}</Badge>
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
            <DropdownMenuLabel className="text-xs text-sunny flex items-center gap-1.5 py-1.5 px-2">
              <Zap className="h-3.5 w-3.5" /> 
              <span>Intermediate</span>
              <Badge variant="outline" className="text-[9px] h-4 px-1 ml-auto">{mediumExamples.length}</Badge>
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
            <DropdownMenuLabel className="text-xs text-coral flex items-center gap-1.5 py-1.5 px-2">
              <Trophy className="h-3.5 w-3.5" /> 
              <span>Advanced</span>
              <Badge variant="outline" className="text-[9px] h-4 px-1 ml-auto">{hardExamples.length}</Badge>
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

        {examples.length === 0 && (
          <div className="py-4 text-center text-muted-foreground text-sm">
            No examples for this class yet
          </div>
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
      className="flex items-center justify-between py-2.5 px-3 cursor-pointer group hover:bg-primary/5"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
          example.difficulty === 'easy' && "bg-lime/10",
          example.difficulty === 'medium' && "bg-sunny/10",
          example.difficulty === 'hard' && "bg-coral/10"
        )}>
          <DiffIcon className={cn("h-3.5 w-3.5", colorClass)} />
        </div>
        <div className="min-w-0">
          <span className="text-sm font-medium truncate block">{example.title}</span>
          <span className="text-[10px] text-muted-foreground truncate block">{example.description}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-2">
        <Badge variant="outline" className="text-[9px] gap-0.5 h-5">
          <Sparkles className="h-2.5 w-2.5 text-sunny" />
          {example.xpReward}
        </Badge>
        <Play className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </DropdownMenuItem>
  );
}
