import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Blocks, 
  Lightbulb, 
  Trophy,
  Play,
  Sparkles,
  ChevronRight,
  MousePointer,
  Puzzle,
  Zap,
  GraduationCap,
  Star,
  ArrowRight,
  Move,
  Eye,
  Repeat,
  Calculator,
  Brain,
  Box,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getExamplesForClass, ExampleProject } from "@/lib/blockly/exampleProjects";
import { getClassTheme } from "@/lib/blockly/classThemes";

interface CodeLabGuideProps {
  classLevel: number;
  onLoadExample: (xml: string) => void;
  className?: string;
}

// Block category explanations with icons
const blockCategories = [
  {
    name: "Motion",
    color: "#4C97FF",
    icon: Move,
    emoji: "🏃",
    blocks: [
      { name: "Move forward", desc: "Move the sprite in the direction it's facing" },
      { name: "Turn right/left", desc: "Rotate the sprite by degrees" },
      { name: "Go to position", desc: "Jump to specific x,y coordinates" },
      { name: "Go to center", desc: "Return to the middle of the canvas" }
    ]
  },
  {
    name: "Looks",
    color: "#9966FF",
    icon: Eye,
    emoji: "👀",
    blocks: [
      { name: "Say", desc: "Show a speech bubble with text" },
      { name: "Change color", desc: "Change the sprite's color" },
      { name: "Set size", desc: "Make the sprite bigger or smaller" },
      { name: "Show/Hide", desc: "Make the sprite visible or invisible" }
    ]
  },
  {
    name: "Events",
    color: "#FFBF00",
    icon: Zap,
    emoji: "🚀",
    blocks: [
      { name: "When program starts", desc: "Run code when you click Run" },
      { name: "When key pressed", desc: "React to keyboard input" }
    ]
  },
  {
    name: "Control",
    color: "#FFAB19",
    icon: Repeat,
    emoji: "🔄",
    blocks: [
      { name: "Wait", desc: "Pause for a number of seconds" },
      { name: "Repeat times", desc: "Do something multiple times" },
      { name: "Repeat forever", desc: "Keep doing something continuously" },
      { name: "If then", desc: "Do something only if a condition is true" },
      { name: "If then else", desc: "Choose between two actions" }
    ]
  },
  {
    name: "Math",
    color: "#59C059",
    icon: Calculator,
    emoji: "🔢",
    blocks: [
      { name: "Number", desc: "A number value to use in calculations" },
      { name: "Math operators", desc: "Add, subtract, multiply, divide" },
      { name: "Pick random", desc: "Get a random number in a range" }
    ]
  },
  {
    name: "Logic",
    color: "#5CB1D6",
    icon: Brain,
    emoji: "🧠",
    blocks: [
      { name: "Compare", desc: "Check if values are equal, greater, less" },
      { name: "And/Or", desc: "Combine multiple conditions" },
      { name: "Not", desc: "Flip a true/false value" }
    ]
  },
  {
    name: "Variables",
    color: "#FF8C1A",
    icon: Box,
    emoji: "📦",
    blocks: [
      { name: "Set variable", desc: "Store a value with a name" },
      { name: "Get variable", desc: "Use a stored value" },
      { name: "Change variable", desc: "Add/subtract from a variable" }
    ]
  },
  {
    name: "Text",
    color: "#5CB712",
    icon: MessageSquare,
    emoji: "💬",
    blocks: [
      { name: "Text value", desc: "A piece of text (string)" },
      { name: "Join", desc: "Combine two pieces of text" },
      { name: "Print", desc: "Show text in the console" }
    ]
  }
];

const gettingStartedSteps = [
  {
    step: 1,
    title: "Find Your Blocks",
    description: "Look at the colorful categories on the left. Each color has different types of blocks!",
    icon: Puzzle,
    tip: "Click a category to see its blocks"
  },
  {
    step: 2,
    title: "Drag & Drop",
    description: "Click and drag a block from the menu to the workspace. Try the 'When program starts' block first!",
    icon: MousePointer,
    tip: "Blocks snap together like puzzle pieces"
  },
  {
    step: 3,
    title: "Connect Blocks",
    description: "Drag more blocks and connect them below the first one. They'll click together!",
    icon: Blocks,
    tip: "The shape shows what blocks can connect"
  },
  {
    step: 4,
    title: "Run Your Code!",
    description: "Click the green Run button to see your code in action. Watch the Stage or Console!",
    icon: Play,
    tip: "Try changing numbers to see different results"
  }
];

export function CodeLabGuide({ classLevel, onLoadExample, className }: CodeLabGuideProps) {
  const [activeTab, setActiveTab] = useState("start");
  const examples = getExamplesForClass(classLevel);
  const theme = getClassTheme(classLevel);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-lime/20 text-lime border-lime/30';
      case 'medium': return 'bg-sunny/20 text-sunny border-sunny/30';
      case 'hard': return 'bg-coral/20 text-coral border-coral/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return Star;
      case 'medium': return Zap;
      case 'hard': return Trophy;
      default: return Star;
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header with class theme */}
      <div className={cn(
        "px-4 py-3 border-b bg-gradient-to-r",
        theme.gradient
      )}>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-bold text-sm">{theme.name}</h3>
            <p className="text-[10px] text-muted-foreground">{theme.tagline}</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-1.5 gap-1 shrink-0">
          <TabsTrigger value="start" className="text-xs gap-1.5 px-3 py-2 data-[state=active]:bg-primary/20">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Get Started</span>
          </TabsTrigger>
          <TabsTrigger value="blocks" className="text-xs gap-1.5 px-3 py-2 data-[state=active]:bg-primary/20">
            <Blocks className="h-3.5 w-3.5" />
            <span>Blocks</span>
          </TabsTrigger>
          <TabsTrigger value="examples" className="text-xs gap-1.5 px-3 py-2 data-[state=active]:bg-primary/20">
            <Lightbulb className="h-3.5 w-3.5" />
            <span>Examples</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="text-xs gap-1.5 px-3 py-2 data-[state=active]:bg-primary/20">
            <Trophy className="h-3.5 w-3.5" />
            <span>Challenges</span>
          </TabsTrigger>
        </TabsList>

        {/* Scrollable content area - FIXED */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {/* Getting Started Tab */}
            <TabsContent value="start" className="m-0 p-4 data-[state=inactive]:hidden">
              <div className="space-y-4 pb-4">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-2">{theme.emoji}</div>
                  <h3 className="text-lg font-bold mb-2">{theme.welcomeTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn to code by connecting colorful blocks. No typing needed!
                  </p>
                </div>

                {/* What is Block Coding */}
                <Card className={cn("border-primary/20 bg-gradient-to-r", theme.gradient)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      What is Block Coding?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <p>Block coding is like building with LEGO! You:</p>
                    <ul className="space-y-1.5">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <MousePointer className="h-3.5 w-3.5 text-primary shrink-0" />
                        Drag colorful blocks onto the workspace
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <Puzzle className="h-3.5 w-3.5 text-primary shrink-0" />
                        Connect them to create instructions
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <Play className="h-3.5 w-3.5 text-primary shrink-0" />
                        Click Run to see your code work!
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Class-specific features */}
                <Card className="border-secondary/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="h-4 w-4 text-sunny" />
                      Class {classLevel} Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {theme.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs gap-1">
                          <Sparkles className="h-3 w-3 text-primary" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Step by step guide */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    How to Use CodeLab:
                  </h4>
                  {gettingStartedSteps.map((step) => (
                    <Card key={step.step} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 p-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                          <step.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-[10px] px-1.5">
                              Step {step.step}
                            </Badge>
                            <h5 className="font-medium text-sm">{step.title}</h5>
                          </div>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                          <div className="flex items-center gap-1 mt-1.5 text-primary">
                            <Lightbulb className="h-3 w-3" />
                            <p className="text-xs font-medium">{step.tip}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Quick tip */}
                <Card className="bg-sunny/10 border-sunny/20">
                  <CardContent className="p-3 flex items-start gap-2">
                    <Zap className="h-4 w-4 text-sunny shrink-0 mt-0.5" />
                    <p className="text-xs">
                      <strong>Pro Tip:</strong> Start with the Examples tab to see working code, then modify it to learn!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Block Reference Tab */}
            <TabsContent value="blocks" className="m-0 p-4 data-[state=inactive]:hidden">
              <div className="space-y-4 pb-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
                    <Blocks className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">Block Reference</h3>
                  <p className="text-xs text-muted-foreground">
                    What each block does and how to use it
                  </p>
                </div>

                {blockCategories.map((category) => {
                  const CategoryIcon = category.icon;
                  return (
                    <Card key={category.name} className="overflow-hidden">
                      <CardHeader 
                        className="py-2 px-3"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <CardTitle className="text-sm flex items-center gap-2">
                          <CategoryIcon className="h-4 w-4" style={{ color: category.color }} />
                          <span style={{ color: category.color }}>{category.name}</span>
                          <span className="text-base">{category.emoji}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-2">
                        <div className="space-y-1.5">
                          {category.blocks.map((block, idx) => (
                            <div key={idx} className="flex items-start gap-2 p-2 rounded bg-muted/50 hover:bg-muted transition-colors">
                              <div 
                                className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                                style={{ backgroundColor: category.color }}
                              />
                              <div>
                                <p className="text-xs font-medium">{block.name}</p>
                                <p className="text-[10px] text-muted-foreground">{block.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Examples Tab */}
            <TabsContent value="examples" className="m-0 p-4 data-[state=inactive]:hidden">
              <div className="space-y-4 pb-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sunny/10 mb-2">
                    <Lightbulb className="h-6 w-6 text-sunny" />
                  </div>
                  <h3 className="text-lg font-bold">Example Projects</h3>
                  <p className="text-xs text-muted-foreground">
                    Class {classLevel} • Load and learn by doing!
                  </p>
                </div>

                <div className="grid gap-3">
                  {examples.map((example) => (
                    <ExampleCard 
                      key={example.id}
                      example={example}
                      onLoad={() => onLoadExample(example.blocksXml)}
                      getDifficultyColor={getDifficultyColor}
                      getDifficultyIcon={getDifficultyIcon}
                    />
                  ))}
                </div>

                {examples.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Puzzle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No examples available for this class yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Challenges Tab */}
            <TabsContent value="challenges" className="m-0 p-4 data-[state=inactive]:hidden">
              <div className="space-y-4 pb-4">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-coral/10 mb-2">
                    <Trophy className="h-6 w-6 text-coral" />
                  </div>
                  <h3 className="text-lg font-bold">Coding Challenges</h3>
                  <p className="text-xs text-muted-foreground">
                    Complete these for XP rewards!
                  </p>
                </div>

                <div className="grid gap-3">
                  {examples.filter(e => e.difficulty !== 'easy').map((example) => {
                    const DiffIcon = getDifficultyIcon(example.difficulty);
                    return (
                      <Card key={example.id} className="overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-coral">
                        <div className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                              <DiffIcon className="h-4 w-4" />
                              {example.title}
                            </h4>
                            <Badge className={cn("gap-1", getDifficultyColor(example.difficulty))}>
                              <DiffIcon className="h-3 w-3" />
                              {example.difficulty}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{example.objective}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] gap-1">
                              <Sparkles className="h-3 w-3 text-sunny" />
                              {example.xpReward} XP
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-7 text-xs gap-1"
                              onClick={() => onLoadExample(example.blocksXml)}
                            >
                              <Play className="h-3 w-3" />
                              Try It
                              <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {examples.filter(e => e.difficulty !== 'easy').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No challenges available yet. Try the Examples first!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
}

interface ExampleCardProps {
  example: ExampleProject;
  onLoad: () => void;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyIcon: (difficulty: string) => React.ComponentType<{ className?: string }>;
}

function ExampleCard({ example, onLoad, getDifficultyColor, getDifficultyIcon }: ExampleCardProps) {
  const DiffIcon = getDifficultyIcon(example.difficulty);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all hover:scale-[1.01]">
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-medium text-sm flex items-center gap-1.5">
              {example.title}
            </h4>
            <p className="text-xs text-muted-foreground">{example.description}</p>
          </div>
          <Badge className={cn("shrink-0 gap-1", getDifficultyColor(example.difficulty))}>
            <DiffIcon className="h-3 w-3" />
            {example.difficulty}
          </Badge>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-2 mb-2">
          <div className="flex items-center gap-1 text-primary mb-1">
            <Star className="h-3 w-3" />
            <p className="text-xs font-medium">Goal:</p>
          </div>
          <p className="text-xs text-muted-foreground">{example.objective}</p>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] gap-1">
            <Sparkles className="h-3 w-3 text-sunny" />
            {example.xpReward} XP
          </Badge>
          <Button 
            size="sm" 
            onClick={onLoad}
            className="h-7 text-xs gap-1.5 bg-gradient-to-r from-primary to-secondary"
          >
            <Play className="h-3.5 w-3.5" />
            Load Example
          </Button>
        </div>
      </div>
    </Card>
  );
}
