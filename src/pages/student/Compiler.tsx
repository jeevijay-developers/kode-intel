import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Trash2,
  ArrowLeft,
  Loader2,
  Code,
  Terminal,
  Sparkles,
  Rocket,
  Lightbulb,
  Star,
  Zap,
  BookOpen,
  Blocks,
  Gamepad2,
  Puzzle,
  ChevronRight,
  Copy,
  Check,
  Trophy,
  Target,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const languages = [
  { id: "python", name: "Python", icon: "🐍", color: "from-green-500 to-emerald-600", description: "Easy & Fun!" },
  { id: "javascript", name: "JavaScript", icon: "✨", color: "from-yellow-500 to-orange-500", description: "Web Magic!" },
  { id: "c", name: "C", icon: "🔧", color: "from-blue-500 to-blue-600", description: "Classic Power" },
  { id: "cpp", name: "C++", icon: "⚡", color: "from-purple-500 to-purple-600", description: "Super Fast!" },
  { id: "java", name: "Java", icon: "☕", color: "from-orange-500 to-red-500", description: "Build Apps!" },
];

interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: "Easy" | "Medium" | "Hard";
  language: string;
  code: string;
  challenge?: string;
}

const projects: Project[] = [
  {
    id: "hello",
    name: "Hello World",
    description: "Your first program! Say hello to the world of coding.",
    icon: "👋",
    difficulty: "Easy",
    language: "python",
    code: `# 🌟 My First Program!
# This is a comment - the computer ignores it

print("Hello, World! 🌍")
print("I'm learning to code!")
print("This is SO cool! 🚀")`,
    challenge: "Try changing the message to your name!",
  },
  {
    id: "calculator",
    name: "Fun Calculator",
    description: "Build a calculator that does magic with numbers!",
    icon: "🧮",
    difficulty: "Easy",
    language: "python",
    code: `# 🧮 My Fun Calculator!

# Let's add two numbers
num1 = 10
num2 = 5

print("🔢 Number 1:", num1)
print("🔢 Number 2:", num2)
print()
print("➕ Addition:", num1 + num2)
print("➖ Subtraction:", num1 - num2)
print("✖️ Multiplication:", num1 * num2)
print("➗ Division:", num1 / num2)`,
    challenge: "Change the numbers and see what happens!",
  },
  {
    id: "pattern",
    name: "Star Pattern",
    description: "Create beautiful star patterns with loops!",
    icon: "⭐",
    difficulty: "Medium",
    language: "python",
    code: `# ⭐ Star Pattern Generator!

rows = 5
print("✨ Here's your star pyramid! ✨")
print()

for i in range(1, rows + 1):
    # Print spaces
    print(" " * (rows - i), end="")
    # Print stars
    print("⭐ " * i)

print()
print("🎉 Amazing pattern!")`,
    challenge: "Try making the pyramid bigger by changing 'rows'!",
  },
  {
    id: "guessing",
    name: "Number Guessing",
    description: "A fun guessing game with hints!",
    icon: "🎯",
    difficulty: "Medium",
    language: "python",
    code: `# 🎯 Number Guessing Game!

secret = 7
print("🎮 Let's play a guessing game!")
print()

for guess in range(1, 11):
    if guess == secret:
        print(f"🎉 {guess} is CORRECT! You found it!")
    elif guess < secret:
        print(f"🔍 {guess} is too small...")
    else:
        print(f"🔍 {guess} is too big...")

print()
print("🏆 Game Over!")`,
    challenge: "Change the secret number and run again!",
  },
  {
    id: "art",
    name: "ASCII Art",
    description: "Draw pictures using text characters!",
    icon: "🎨",
    difficulty: "Easy",
    language: "python",
    code: `# 🎨 ASCII Art Gallery!

print("=" * 30)
print("   🖼️  MY ART GALLERY  🖼️")
print("=" * 30)
print()

# Draw a house
print("       /\\\\")
print("      /  \\\\")
print("     /    \\\\")
print("    /______\\\\")
print("    |      |")
print("    |  🚪  |")
print("    |______|")
print()
print("🏠 Home Sweet Home!")
print()

# Draw a tree
print("      🌟")
print("      /\\\\")
print("     /  \\\\")
print("    /    \\\\")
print("   /______\\\\")
print("      ||")
print()
print("🎄 Happy Holidays!")`,
    challenge: "Create your own ASCII art picture!",
  },
  {
    id: "countdown",
    name: "Rocket Launch",
    description: "Build a countdown timer for a rocket launch!",
    icon: "🚀",
    difficulty: "Easy",
    language: "python",
    code: `# 🚀 Rocket Launch Countdown!

print("=" * 30)
print("   🛸 SPACE MISSION 🛸")
print("=" * 30)
print()
print("Initiating launch sequence...")
print()

for i in range(10, 0, -1):
    print(f"   {i}...")

print()
print("🔥🔥🔥 BLAST OFF! 🔥🔥🔥")
print()
print("🚀 Rocket is flying to space! ✨")
print("🌟 Mission successful! 🌟")`,
    challenge: "Make it count down from 20 instead!",
  },
];

const blockBasedExamples = [
  {
    id: "motion",
    name: "Move & Dance",
    description: "Make things move on screen!",
    icon: "💃",
    blocks: ["move 10 steps", "turn 90°", "repeat 4 times", "change color"],
    code: `# 💃 Dance Moves!
# Imagine a character dancing

moves = ["Step Right →", "Step Left ←", "Spin! 🔄", "Jump! ⬆️"]

print("🎵 Let's dance! 🎵")
print()

for i in range(3):  # Dance 3 times
    print(f"Round {i + 1}:")
    for move in moves:
        print(f"  {move}")
    print()

print("🌟 Great dancing! 🌟")`,
  },
  {
    id: "looks",
    name: "Say & Think",
    description: "Make characters talk!",
    icon: "💬",
    blocks: ["say 'Hello!'", "think 'Hmm...'", "change costume", "show/hide"],
    code: `# 💬 Talking Characters!

characters = ["🐱 Cat", "🐶 Dog", "🐰 Bunny"]

print("🎭 Character Chat 🎭")
print()

for char in characters:
    print(f"{char} says: 'Hello there!'")
    print(f"{char} thinks: 'I love coding!'")
    print()

print("💬 What a fun conversation!")`,
  },
  {
    id: "events",
    name: "When Things Happen",
    description: "React to clicks and keys!",
    icon: "🎮",
    blocks: ["when clicked", "when key pressed", "when I receive", "broadcast"],
    code: `# 🎮 Event Simulator!

print("🎮 Game Controller Simulator 🎮")
print()

events = [
    ("When SPACE pressed", "Jump! ⬆️"),
    ("When LEFT pressed", "Move left ←"),
    ("When RIGHT pressed", "Move right →"),
    ("When clicked", "Attack! ⚔️"),
]

print("Controller mapping:")
for event, action in events:
    print(f"  {event} → {action}")

print()
print("🎯 Ready to play!")`,
  },
];

const starterCode: Record<string, string> = {
  c: `#include <stdio.h>

int main() {
    // 🎯 Write your C code here!
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // 🎯 Write your C++ code here!
    cout << "Hello, World!" << endl;
    return 0;
}`,
  python: `# 🎯 Write your Python code here!
# Python is super fun and easy!

print("Hello, World! 🌍")
print("Let's start coding!")`,
  java: `public class Main {
    public static void main(String[] args) {
        // 🎯 Write your Java code here!
        System.out.println("Hello, World!");
    }
}`,
  javascript: `// 🎯 Write your JavaScript code here!
// JavaScript makes websites come alive!

console.log("Hello, World! 🌍");
console.log("JavaScript is awesome!");`,
};

const getLanguageExtension = (langId: string) => {
  switch (langId) {
    case "c":
    case "cpp":
      return cpp();
    case "python":
      return python();
    case "java":
      return java();
    case "javascript":
      return javascript();
    default:
      return python();
  }
};

export default function Compiler() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(starterCode.python);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [copied, setCopied] = useState(false);

  const currentLang = languages.find((l) => l.id === language);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(starterCode[newLang] || starterCode.python);
    setOutput("");
  };

  const handleLoadProject = (project: Project) => {
    setLanguage(project.language);
    setCode(project.code);
    setOutput("");
    setActiveTab("code");
    toast.success(`Loaded "${project.name}" project! 🚀`);
  };

  const handleLoadBlockExample = (example: (typeof blockBasedExamples)[0]) => {
    setLanguage("python");
    setCode(example.code);
    setOutput("");
    setActiveTab("code");
    toast.success(`Loaded "${example.name}" example! 🧩`);
  };

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput("🚀 Running your code...\n");

    try {
      const { data, error } = await supabase.functions.invoke("execute-code", {
        body: { language, code },
      });

      if (error) {
        setOutput(`❌ Error: ${error.message}`);
        toast.error("Failed to execute code");
        return;
      }

      let result = "";
      if (data.output) {
        result += data.output;
      }
      if (data.error) {
        result += (result ? "\n" : "") + `❌ Error:\n${data.error}`;
      }
      if (!data.output && !data.error) {
        result = "✅ Code ran successfully! (No output)";
      }
      if (data.executionTime && data.executionTime !== "N/A") {
        result += `\n\n⏱️ Execution time: ${data.executionTime}s`;
      }

      setOutput(result);
      toast.success("Code executed! 🎉");
    } catch (err) {
      setOutput(`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  }, [language, code]);

  const handleClear = () => {
    setCode(starterCode[language] || starterCode.python);
    setOutput("");
    toast.success("Code cleared! ✨");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Code copied! 📋");
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleRun();
      }
    },
    [handleRun]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex flex-col">
      {/* Playful Header */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Gamepad2 className="h-5 w-5 text-white" />
                </div>
                <Sparkles className="h-4 w-4 text-sunny absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent">
                  Code Playground
                </h1>
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  Learn • Create • Have Fun!
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              size="lg"
              className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25 px-6"
            >
              {isRunning ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Play className="h-5 w-5" />
              )}
              <span className="font-bold">Run</span>
              <Zap className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Keyboard Shortcut */}
      <div className="bg-gradient-to-r from-sunny/10 via-coral/10 to-sunny/10 border-b border-sunny/20 py-2">
        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Star className="h-3 w-3 text-sunny fill-sunny" />
          <span>
            Pro tip: Press{" "}
            <kbd className="px-1.5 py-0.5 bg-card rounded border text-[10px] font-mono">
              Ctrl
            </kbd>{" "}
            +{" "}
            <kbd className="px-1.5 py-0.5 bg-card rounded border text-[10px] font-mono">
              Enter
            </kbd>{" "}
            to run your code!
          </span>
          <Star className="h-3 w-3 text-sunny fill-sunny" />
        </p>
      </div>

      <div className="flex-1 flex" onKeyDown={handleKeyDown}>
        {/* Left Sidebar - Projects & Blocks */}
        <aside className="w-80 border-r border-border/50 bg-card/50 hidden lg:flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 mx-4 mt-4">
              <TabsTrigger value="projects" className="text-xs gap-1">
                <Rocket className="h-3 w-3" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="blocks" className="text-xs gap-1">
                <Blocks className="h-3 w-3" />
                Blocks
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs gap-1">
                <Code className="h-3 w-3" />
                Editor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="flex-1 mt-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Puzzle className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-foreground">Fun Projects</h3>
                  </div>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleLoadProject(project)}
                      className="w-full p-3 rounded-xl bg-background/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          {project.icon}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {project.name}
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              project.difficulty === "Easy"
                                ? "border-green-500/50 text-green-500"
                                : project.difficulty === "Medium"
                                ? "border-sunny/50 text-sunny"
                                : "border-coral/50 text-coral"
                            }`}
                          >
                            {project.difficulty}
                          </Badge>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="blocks" className="flex-1 mt-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Blocks className="h-5 w-5 text-secondary" />
                    <h3 className="font-bold text-foreground">Block Ideas</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Click to load block-based coding concepts! 🧩
                  </p>
                  {blockBasedExamples.map((example) => (
                    <button
                      key={example.id}
                      onClick={() => handleLoadBlockExample(example)}
                      className="w-full p-3 rounded-xl bg-background/50 border border-border hover:border-secondary/50 hover:bg-secondary/5 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          {example.icon}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-foreground group-hover:text-secondary transition-colors">
                            {example.name}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {example.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {example.blocks.slice(0, 3).map((block, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-[10px] bg-secondary/20"
                          >
                            {block}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="flex-1 mt-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-coral" />
                    <h3 className="font-bold text-foreground">Quick Actions</h3>
                  </div>

                  {/* Language Selector */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Choose Language:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {languages.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => handleLanguageChange(lang.id)}
                          className={`p-3 rounded-xl border transition-all duration-200 text-left ${
                            language === lang.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{lang.icon}</span>
                            <div>
                              <p className="font-medium text-foreground">{lang.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {lang.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="w-full justify-start gap-2"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied!" : "Copy Code"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClear}
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear Code
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
          {/* Code Editor */}
          <Card className="flex-1 flex flex-col min-h-[400px] overflow-hidden border-2 border-primary/20 shadow-xl shadow-primary/5">
            <CardHeader className="py-3 px-4 border-b border-border bg-gradient-to-r from-primary/10 via-purple-500/10 to-secondary/10">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent font-bold">
                    Your Code
                  </span>
                </div>
                <Badge className={`bg-gradient-to-r ${currentLang?.color} text-white`}>
                  {currentLang?.icon} {currentLang?.name}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
              <CodeMirror
                value={code}
                height="100%"
                style={{ height: "100%", minHeight: "350px" }}
                theme={vscodeDark}
                extensions={[getLanguageExtension(language)]}
                onChange={(value) => setCode(value)}
                className="h-full"
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightActiveLine: true,
                  foldGutter: true,
                  autocompletion: true,
                  bracketMatching: true,
                  closeBrackets: true,
                  indentOnInput: true,
                }}
              />
            </CardContent>
          </Card>

          {/* Output Console */}
          <Card className="flex-1 flex flex-col min-h-[300px] overflow-hidden border-2 border-green-500/20 shadow-xl shadow-green-500/5">
            <CardHeader className="py-3 px-4 border-b border-border bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-lime/10">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-green-500" />
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent font-bold">
                    Output Console
                  </span>
                </div>
                {isRunning && (
                  <Badge className="bg-sunny/20 text-sunny border-sunny/30 animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Running...
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-auto bg-[#1e1e1e]">
              <pre className="p-4 text-sm font-mono text-[#d4d4d4] whitespace-pre-wrap min-h-full">
                {output || (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                      <Rocket className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-muted-foreground mb-2">
                      Click <span className="text-green-500 font-bold">Run</span> to see the magic! ✨
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Or press Ctrl + Enter
                    </p>
                  </div>
                )}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fun Footer */}
      <footer className="bg-card/80 border-t border-border/50 py-3">
        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Trophy className="h-4 w-4 text-sunny" />
          <span>Keep coding and become a coding superstar!</span>
          <Star className="h-4 w-4 text-sunny fill-sunny" />
        </p>
      </footer>
    </div>
  );
}
