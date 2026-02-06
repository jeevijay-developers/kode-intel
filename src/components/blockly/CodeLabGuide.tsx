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
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getExamplesForClass, ExampleProject } from "@/lib/blockly/exampleProjects";

interface CodeLabGuideProps {
  classLevel: number;
  onLoadExample: (xml: string) => void;
  className?: string;
}

// Block category explanations
const blockCategories = [
  {
    name: "Motion",
    color: "#4C97FF",
    icon: "🏃",
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
    icon: "👀",
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
    icon: "🚀",
    blocks: [
      { name: "When program starts", desc: "Run code when you click Run" },
      { name: "When key pressed", desc: "React to keyboard input" }
    ]
  },
  {
    name: "Control",
    color: "#FFAB19",
    icon: "🔄",
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
    icon: "🔢",
    blocks: [
      { name: "Number", desc: "A number value to use in calculations" },
      { name: "Math operators", desc: "Add, subtract, multiply, divide" },
      { name: "Pick random", desc: "Get a random number in a range" }
    ]
  },
  {
    name: "Logic",
    color: "#5CB1D6",
    icon: "🧠",
    blocks: [
      { name: "Compare", desc: "Check if values are equal, greater, less" },
      { name: "And/Or", desc: "Combine multiple conditions" },
      { name: "Not", desc: "Flip a true/false value" }
    ]
  },
  {
    name: "Variables",
    color: "#FF8C1A",
    icon: "📦",
    blocks: [
      { name: "Set variable", desc: "Store a value with a name" },
      { name: "Get variable", desc: "Use a stored value" },
      { name: "Change variable", desc: "Add/subtract from a variable" }
    ]
  },
  {
    name: "Text",
    color: "#5CB712",
    icon: "💬",
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-lime/20 text-lime border-lime/30';
      case 'medium': return 'bg-sunny/20 text-sunny border-sunny/30';
      case 'hard': return 'bg-coral/20 text-coral border-coral/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-1 gap-1 flex-wrap">
          <TabsTrigger value="start" className="text-xs gap-1 data-[state=active]:bg-primary/20">
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Get Started</span>
          </TabsTrigger>
          <TabsTrigger value="blocks" className="text-xs gap-1 data-[state=active]:bg-primary/20">
            <Blocks className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Block Guide</span>
          </TabsTrigger>
          <TabsTrigger value="examples" className="text-xs gap-1 data-[state=active]:bg-primary/20">
            <Lightbulb className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Examples</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="text-xs gap-1 data-[state=active]:bg-primary/20">
            <Trophy className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Challenges</span>
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          {/* Getting Started Tab */}
          <TabsContent value="start" className="m-0 p-4">
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold mb-2">👋 Welcome to CodeLab!</h3>
                <p className="text-sm text-muted-foreground">
                  Learn to code by connecting colorful blocks. No typing needed!
                </p>
              </div>

              {/* What is Block Coding */}
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    What is Block Coding?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Block coding is like building with LEGO! You:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Drag colorful blocks onto the workspace</li>
                    <li>Connect them to create instructions</li>
                    <li>Click Run to see your code work!</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Step by step guide */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">How to Use CodeLab:</h4>
                {gettingStartedSteps.map((step) => (
                  <Card key={step.step} className="overflow-hidden">
                    <div className="flex items-start gap-3 p-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">{step.step}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <step.icon className="h-4 w-4 text-primary" />
                          <h5 className="font-medium text-sm">{step.title}</h5>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                        <p className="text-xs text-primary mt-1">💡 {step.tip}</p>
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
          <TabsContent value="blocks" className="m-0 p-4">
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">📚 Block Reference</h3>
                <p className="text-xs text-muted-foreground">
                  What each block does and how to use it
                </p>
              </div>

              {blockCategories.map((category) => (
                <Card key={category.name} className="overflow-hidden">
                  <CardHeader 
                    className="py-2 px-3"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <CardTitle className="text-sm flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span style={{ color: category.color }}>{category.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="space-y-1.5">
                      {category.blocks.map((block, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 rounded bg-muted/50">
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
              ))}
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="m-0 p-4">
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">💡 Example Projects</h3>
                <p className="text-xs text-muted-foreground">
                  Load these examples to learn by doing!
                </p>
              </div>

              <div className="grid gap-3">
                {examples.map((example) => (
                  <ExampleCard 
                    key={example.id}
                    example={example}
                    onLoad={() => onLoadExample(example.blocksXml)}
                    getDifficultyColor={getDifficultyColor}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="m-0 p-4">
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">🏆 Coding Challenges</h3>
                <p className="text-xs text-muted-foreground">
                  Complete these for XP rewards!
                </p>
              </div>

              <div className="grid gap-3">
                {examples.filter(e => e.difficulty !== 'easy').map((example) => (
                  <Card key={example.id} className="overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{example.title}</h4>
                        <Badge className={getDifficultyColor(example.difficulty)}>
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
                          Try It
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

interface ExampleCardProps {
  example: ExampleProject;
  onLoad: () => void;
  getDifficultyColor: (difficulty: string) => string;
}

function ExampleCard({ example, onLoad, getDifficultyColor }: ExampleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h4 className="font-medium text-sm">{example.title}</h4>
            <p className="text-xs text-muted-foreground">{example.description}</p>
          </div>
          <Badge className={cn("shrink-0", getDifficultyColor(example.difficulty))}>
            {example.difficulty}
          </Badge>
        </div>
        
        <div className="bg-muted/50 rounded p-2 mb-2">
          <p className="text-xs font-medium text-primary">🎯 Goal:</p>
          <p className="text-xs">{example.objective}</p>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-[10px] gap-1">
            <Sparkles className="h-3 w-3 text-sunny" />
            {example.xpReward} XP
          </Badge>
          <Button 
            size="sm" 
            onClick={onLoad}
            className="h-7 text-xs gap-1 bg-gradient-to-r from-primary to-secondary"
          >
            <Play className="h-3 w-3" />
            Load Example
          </Button>
        </div>
      </div>
    </Card>
  );
}
