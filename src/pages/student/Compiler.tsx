import { useState, useCallback, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Flame,
  Settings,
  Binary,
  Coffee,
  Globe,
  GraduationCap,
  Filter,
  Menu,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { allCodeExamples as codeExamples, type CodeExample } from "@/lib/codeExamples";

type LanguageId = "python" | "javascript" | "c" | "cpp" | "java";
type LevelId = "all" | "beginner" | "intermediate" | "advanced";

interface LanguageConfig {
  id: LanguageId;
  name: string;
  Icon: React.FC<{ className?: string }>;
  color: string;
  description: string;
}

const languages: LanguageConfig[] = [
  { id: "python", name: "Python", Icon: Code, color: "from-green-500 to-emerald-600", description: "Easy & Fun!" },
  { id: "javascript", name: "JavaScript", Icon: Globe, color: "from-yellow-500 to-orange-500", description: "Web Magic!" },
  { id: "c", name: "C", Icon: Settings, color: "from-blue-500 to-blue-600", description: "Classic Power" },
  { id: "cpp", name: "C++", Icon: Zap, color: "from-purple-500 to-purple-600", description: "Super Fast!" },
  { id: "java", name: "Java", Icon: Coffee, color: "from-orange-500 to-red-500", description: "Build Apps!" },
];

const classOptions = [
  { value: "3", label: "Class 3", ageRange: "Age 8-9" },
  { value: "4", label: "Class 4", ageRange: "Age 9-10" },
  { value: "5", label: "Class 5", ageRange: "Age 10-11" },
  { value: "6", label: "Class 6", ageRange: "Age 11-12" },
  { value: "7", label: "Class 7", ageRange: "Age 12-13" },
  { value: "8", label: "Class 8", ageRange: "Age 13-14" },
  { value: "9", label: "Class 9", ageRange: "Age 14-15" },
  { value: "10", label: "Class 10", ageRange: "Age 15-16" },
];

const levelOptions = [
  { value: "all", label: "All Levels", color: "bg-muted" },
  { value: "beginner", label: "Beginner", color: "bg-green-500/20 text-green-500" },
  { value: "intermediate", label: "Intermediate", color: "bg-sunny/20 text-sunny" },
  { value: "advanced", label: "Advanced", color: "bg-coral/20 text-coral" },
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

const getLevelColor = (level: string) => {
  switch (level) {
    case "beginner":
      return "border-green-500/50 text-green-500 bg-green-500/10";
    case "intermediate":
      return "border-sunny/50 text-sunny bg-sunny/10";
    case "advanced":
      return "border-coral/50 text-coral bg-coral/10";
    default:
      return "border-muted text-muted-foreground";
  }
};

const getLanguageColor = (lang: string) => {
  switch (lang) {
    case "python":
      return "bg-green-500/20 text-green-500";
    case "javascript":
      return "bg-yellow-500/20 text-yellow-600";
    case "c":
      return "bg-blue-500/20 text-blue-500";
    case "cpp":
      return "bg-purple-500/20 text-purple-500";
    case "java":
      return "bg-orange-500/20 text-orange-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Compiler() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(starterCode.python);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("examples");
  const [copied, setCopied] = useState(false);
  
  // New filters for class-wise examples
  const [selectedClass, setSelectedClass] = useState("5");
  const [selectedLevel, setSelectedLevel] = useState<LevelId>("all");
  const [selectedLang, setSelectedLang] = useState<LanguageId | "all">("all");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const currentLang = languages.find((l) => l.id === language);
  const filteredExamples = useMemo(() => {
    return codeExamples.filter((example) => {
      const classMatch = example.classLevel === parseInt(selectedClass);
      const levelMatch = selectedLevel === "all" || example.level === selectedLevel;
      const langMatch = selectedLang === "all" || example.language === selectedLang;
      return classMatch && levelMatch && langMatch;
    });
  }, [selectedClass, selectedLevel, selectedLang]);

  // Get stats for current class
  const classStats = useMemo(() => {
    const classExamples = codeExamples.filter(e => e.classLevel === parseInt(selectedClass));
    return {
      total: classExamples.length,
      beginner: classExamples.filter(e => e.level === "beginner").length,
      intermediate: classExamples.filter(e => e.level === "intermediate").length,
      advanced: classExamples.filter(e => e.level === "advanced").length,
    };
  }, [selectedClass]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(starterCode[newLang] || starterCode.python);
    setOutput("");
  };

  const handleLoadExample = (example: CodeExample) => {
    setLanguage(example.language);
    setCode(example.code);
    setOutput("");
    setActiveTab("code");
    toast.success(`Loaded "${example.title}" example! 🚀`);
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

          {/* Mobile Examples Drawer Button */}
          <div className="flex items-center gap-2">
            <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden gap-2"
                >
                  <Menu className="h-4 w-4" />
                  <span className="hidden sm:inline">Examples</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="p-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Class-wise Examples
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-3 border-b border-border/50">
                  {/* Class Selector */}
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="h-9 bg-background">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {classOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{opt.label}</span>
                            <span className="text-xs text-muted-foreground">({opt.ageRange})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Level Filter */}
                  <div className="flex flex-wrap gap-1.5">
                    {levelOptions.map((level) => (
                      <Button
                        key={level.value}
                        variant={selectedLevel === level.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedLevel(level.value as LevelId)}
                        className={`text-xs h-7 px-2 ${selectedLevel === level.value ? "" : level.color}`}
                      >
                        {level.label}
                      </Button>
                    ))}
                  </div>

                  {/* Language Filter */}
                  <Select value={selectedLang} onValueChange={(v) => setSelectedLang(v as LanguageId | "all")}>
                    <SelectTrigger className="h-9 bg-background">
                      <SelectValue placeholder="All Languages" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="all">All Languages</SelectItem>
                      {languages.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          <div className="flex items-center gap-2">
                            <lang.Icon className="h-3.5 w-3.5" />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Stats */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px]">
                      {filteredExamples.length} examples
                    </Badge>
                  </div>
                </div>

                {/* Mobile Examples List */}
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="p-4 space-y-2">
                    {filteredExamples.length === 0 ? (
                      <div className="text-center py-8">
                        <Filter className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No examples found</p>
                        <p className="text-xs text-muted-foreground mt-1">Try adjusting filters</p>
                      </div>
                    ) : (
                      filteredExamples.map((example) => (
                        <button
                          key={example.id}
                          onClick={() => {
                            handleLoadExample(example);
                            setMobileDrawerOpen(false);
                          }}
                          className="w-full p-3 rounded-xl bg-background/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                              <Lightbulb className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors truncate">
                                {example.title}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {example.description}
                              </p>
                              <div className="flex items-center gap-1.5 mt-2">
                                <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${getLevelColor(example.level)}`}>
                                  {example.level}
                                </Badge>
                                <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 ${getLanguageColor(example.language)}`}>
                                  {example.language}
                                </Badge>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <Button
              onClick={handleRun}
              disabled={isRunning}
              size="lg"
              className="gap-2 bg-gradient-to-r from-lime to-turquoise hover:opacity-90 shadow-lg px-6"
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
        {/* Left Sidebar - Class-wise Examples */}
        <aside className="w-80 border-r border-border/50 bg-card/50 hidden lg:flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-2 mx-4 mt-4">
              <TabsTrigger value="examples" className="text-xs gap-1">
                <BookOpen className="h-3 w-3" />
                Examples
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs gap-1">
                <Code className="h-3 w-3" />
                Editor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="examples" className="flex-1 mt-0 overflow-hidden flex flex-col">
              {/* Class & Level Filters */}
              <div className="p-4 space-y-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-foreground">Class-wise Examples</h3>
                </div>
                
                {/* Class Selector */}
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-9 bg-background">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {classOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{opt.label}</span>
                          <span className="text-xs text-muted-foreground">({opt.ageRange})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Level Filter */}
                <div className="flex flex-wrap gap-1.5">
                  {levelOptions.map((level) => (
                    <Button
                      key={level.value}
                      variant={selectedLevel === level.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLevel(level.value as LevelId)}
                      className={`text-xs h-7 px-2 ${selectedLevel === level.value ? "" : level.color}`}
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>

                {/* Language Filter */}
                <Select value={selectedLang} onValueChange={(v) => setSelectedLang(v as LanguageId | "all")}>
                  <SelectTrigger className="h-9 bg-background">
                    <SelectValue placeholder="All Languages" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="all">All Languages</SelectItem>
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        <div className="flex items-center gap-2">
                          <lang.Icon className="h-3.5 w-3.5" />
                          {lang.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Stats */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">
                    {filteredExamples.length} examples
                  </Badge>
                  <span>•</span>
                  <span className="text-green-500">{classStats.beginner} beginner</span>
                  <span>•</span>
                  <span className="text-sunny">{classStats.intermediate} intermediate</span>
                </div>
              </div>

              {/* Examples List */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {filteredExamples.length === 0 ? (
                    <div className="text-center py-8">
                      <Filter className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No examples found</p>
                      <p className="text-xs text-muted-foreground mt-1">Try adjusting filters</p>
                    </div>
                  ) : (
                    filteredExamples.map((example) => (
                      <button
                        key={example.id}
                        onClick={() => handleLoadExample(example)}
                        className="w-full p-3 rounded-xl bg-background/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                            <Lightbulb className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors truncate">
                              {example.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {example.description}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2">
                              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${getLevelColor(example.level)}`}>
                                {example.level}
                              </Badge>
                              <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 ${getLanguageColor(example.language)}`}>
                                {example.language}
                              </Badge>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                        </div>
                        {example.challenge && (
                          <div className="mt-2 p-2 rounded-lg bg-sunny/10 border border-sunny/20">
                            <p className="text-[10px] text-sunny flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              <span className="font-medium">Challenge:</span> {example.challenge}
                            </p>
                          </div>
                        )}
                      </button>
                    ))
                  )}
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
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${lang.color} flex items-center justify-center`}>
                              <lang.Icon className="h-4 w-4 text-white" />
                            </div>
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
                <Badge className={`bg-gradient-to-r ${currentLang?.color} text-white flex items-center gap-1`}>
                  {currentLang && <currentLang.Icon className="h-3 w-3" />}
                  {currentLang?.name}
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
