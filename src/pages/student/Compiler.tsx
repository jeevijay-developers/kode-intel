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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  BookOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const languages = [
  { id: "c", name: "C", icon: "🔧", color: "from-blue-500 to-blue-600" },
  { id: "cpp", name: "C++", icon: "⚡", color: "from-purple-500 to-purple-600" },
  { id: "python", name: "Python", icon: "🐍", color: "from-green-500 to-green-600" },
  { id: "java", name: "Java", icon: "☕", color: "from-orange-500 to-orange-600" },
  { id: "javascript", name: "JavaScript", icon: "✨", color: "from-yellow-500 to-yellow-600" },
];

interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  code: string;
}

const codeTemplates: Record<string, CodeTemplate[]> = {
  c: [
    {
      id: "hello",
      name: "Hello World",
      description: "Your first C program!",
      icon: "👋",
      code: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Welcome to coding! 🎉\\n");
    return 0;
}`
    },
    {
      id: "calculator",
      name: "Simple Calculator",
      description: "Add two numbers together",
      icon: "🧮",
      code: `#include <stdio.h>

int main() {
    int num1 = 10;
    int num2 = 5;
    
    printf("Number 1: %d\\n", num1);
    printf("Number 2: %d\\n", num2);
    printf("Sum: %d\\n", num1 + num2);
    printf("Difference: %d\\n", num1 - num2);
    printf("Product: %d\\n", num1 * num2);
    
    return 0;
}`
    },
    {
      id: "pattern",
      name: "Star Pattern",
      description: "Draw a triangle with stars",
      icon: "⭐",
      code: `#include <stdio.h>

int main() {
    int rows = 5;
    
    for(int i = 1; i <= rows; i++) {
        for(int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\\n");
    }
    
    return 0;
}`
    }
  ],
  cpp: [
    {
      id: "hello",
      name: "Hello World",
      description: "Your first C++ program!",
      icon: "👋",
      code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    cout << "Let's learn C++! 🚀" << endl;
    return 0;
}`
    },
    {
      id: "calculator",
      name: "Simple Calculator",
      description: "Basic math operations",
      icon: "🧮",
      code: `#include <iostream>
using namespace std;

int main() {
    int a = 15, b = 4;
    
    cout << "Number 1: " << a << endl;
    cout << "Number 2: " << b << endl;
    cout << "Addition: " << a + b << endl;
    cout << "Subtraction: " << a - b << endl;
    cout << "Multiplication: " << a * b << endl;
    cout << "Division: " << a / b << endl;
    
    return 0;
}`
    },
    {
      id: "countdown",
      name: "Countdown Timer",
      description: "Count from 10 to 1",
      icon: "⏰",
      code: `#include <iostream>
using namespace std;

int main() {
    cout << "🚀 Rocket Launch Countdown!" << endl;
    cout << endl;
    
    for(int i = 10; i >= 1; i--) {
        cout << i << "..." << endl;
    }
    
    cout << endl;
    cout << "🎉 BLAST OFF! 🎉" << endl;
    
    return 0;
}`
    }
  ],
  python: [
    {
      id: "hello",
      name: "Hello World",
      description: "Your first Python program!",
      icon: "👋",
      code: `print("Hello, World!")
print("Python is awesome! 🐍")
print("Let's code together!")`
    },
    {
      id: "calculator",
      name: "Fun Calculator",
      description: "Math is fun!",
      icon: "🧮",
      code: `# Fun Calculator 🧮

num1 = 25
num2 = 7

print(f"First number: {num1}")
print(f"Second number: {num2}")
print()
print(f"➕ Addition: {num1 + num2}")
print(f"➖ Subtraction: {num1 - num2}")
print(f"✖️ Multiplication: {num1 * num2}")
print(f"➗ Division: {num1 / num2:.2f}")`
    },
    {
      id: "guessing",
      name: "Number Fun",
      description: "Play with numbers",
      icon: "🎲",
      code: `# Number Fun! 🎲

secret_number = 7

print("🎯 Let's play with numbers!")
print()

for guess in range(1, 11):
    if guess == secret_number:
        print(f"✨ {guess} is the magic number!")
    elif guess < secret_number:
        print(f"{guess} is too small")
    else:
        print(f"{guess} is too big")`
    },
    {
      id: "art",
      name: "ASCII Art",
      description: "Draw with text!",
      icon: "🎨",
      code: `# ASCII Art 🎨

print("  🌟 Let's draw! 🌟")
print()

# Draw a simple house
print("     /\\\\")
print("    /  \\\\")
print("   /    \\\\")
print("  /______\\\\")
print("  |      |")
print("  |  🚪  |")
print("  |______|")
print()
print("🏠 Home Sweet Home!")`
    }
  ],
  java: [
    {
      id: "hello",
      name: "Hello World",
      description: "Your first Java program!",
      icon: "👋",
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Java is powerful! ☕");
    }
}`
    },
    {
      id: "calculator",
      name: "Calculator",
      description: "Basic math operations",
      icon: "🧮",
      code: `public class Main {
    public static void main(String[] args) {
        int a = 20;
        int b = 6;
        
        System.out.println("🧮 Java Calculator");
        System.out.println();
        System.out.println("Number 1: " + a);
        System.out.println("Number 2: " + b);
        System.out.println();
        System.out.println("Sum: " + (a + b));
        System.out.println("Difference: " + (a - b));
        System.out.println("Product: " + (a * b));
    }
}`
    },
    {
      id: "pattern",
      name: "Number Pyramid",
      description: "Build a number pyramid",
      icon: "🔺",
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("🔺 Number Pyramid");
        System.out.println();
        
        for (int i = 1; i <= 5; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print(j + " ");
            }
            System.out.println();
        }
    }
}`
    }
  ],
  javascript: [
    {
      id: "hello",
      name: "Hello World",
      description: "Your first JS program!",
      icon: "👋",
      code: `console.log("Hello, World!");
console.log("JavaScript is magical! ✨");
console.log("Let's build amazing things!");`
    },
    {
      id: "calculator",
      name: "Smart Calculator",
      description: "Math operations",
      icon: "🧮",
      code: `// Smart Calculator 🧮

const num1 = 42;
const num2 = 8;

console.log("🔢 Smart Calculator");
console.log("");
console.log(\`First number: \${num1}\`);
console.log(\`Second number: \${num2}\`);
console.log("");
console.log(\`➕ Sum: \${num1 + num2}\`);
console.log(\`➖ Difference: \${num1 - num2}\`);
console.log(\`✖️ Product: \${num1 * num2}\`);
console.log(\`➗ Division: \${(num1 / num2).toFixed(2)}\`);`
    },
    {
      id: "array",
      name: "Fun with Arrays",
      description: "Learn about arrays",
      icon: "📚",
      code: `// Fun with Arrays! 📚

const fruits = ["🍎 Apple", "🍌 Banana", "🍊 Orange", "🍇 Grapes", "🍓 Strawberry"];

console.log("🛒 My Fruit Basket:");
console.log("");

fruits.forEach((fruit, index) => {
    console.log(\`\${index + 1}. \${fruit}\`);
});

console.log("");
console.log(\`Total fruits: \${fruits.length}\`);
console.log(\`First fruit: \${fruits[0]}\`);
console.log(\`Last fruit: \${fruits[fruits.length - 1]}\`);`
    },
    {
      id: "emoji",
      name: "Emoji Story",
      description: "Create with emojis!",
      icon: "🎭",
      code: `// Emoji Story Generator 🎭

const characters = ["🦁", "🐰", "🦊", "🐻"];
const places = ["🏰", "🌲", "🏖️", "🌙"];
const actions = ["found treasure", "made friends", "had an adventure", "learned to fly"];

console.log("📖 Once upon a time...");
console.log("");

characters.forEach((char, i) => {
    console.log(\`\${char} went to \${places[i]} and \${actions[i]}!\`);
});

console.log("");
console.log("🎉 The End! 🎉");`
    }
  ]
};

const starterCode: Record<string, string> = {
  c: `#include <stdio.h>

int main() {
    // Write your C code here!
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your C++ code here!
    cout << "Hello, World!" << endl;
    return 0;
}`,
  python: `# Write your Python code here!
print("Hello, World!")`,
  java: `public class Main {
    public static void main(String[] args) {
        // Write your Java code here!
        System.out.println("Hello, World!");
    }
}`,
  javascript: `// Write your JavaScript code here!
console.log("Hello, World!");`,
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
      return javascript();
  }
};

export default function Compiler() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(starterCode.python);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const currentLang = languages.find(l => l.id === language);
  const templates = codeTemplates[language] || [];

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(starterCode[newLang] || "");
    setOutput("");
    setShowTemplates(false);
  };

  const handleLoadTemplate = (template: CodeTemplate) => {
    setCode(template.code);
    setShowTemplates(false);
    toast.success(`Loaded "${template.name}" template!`);
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
    } catch (err) {
      setOutput(`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  }, [language, code]);

  const handleClear = () => {
    setCode(starterCode[language] || "");
    setOutput("");
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Fun Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
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
            <div className="flex items-center gap-2">
              <div className="relative">
                <Rocket className="h-7 w-7 text-primary animate-bounce" />
                <Sparkles className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Code Playground
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[130px] sm:w-[150px] bg-background/50 border-primary/20">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    <span className="flex items-center gap-2">
                      <span>{lang.icon}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Templates Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTemplates(!showTemplates)}
              className="gap-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Examples</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="gap-2 border-destructive/20 hover:bg-destructive/10 hover:border-destructive/40"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>

            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Run</span>
              <Zap className="h-3 w-3 hidden sm:inline" />
            </Button>
          </div>
        </div>
      </header>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="bg-card/90 backdrop-blur-sm border-b border-border p-4 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-foreground">
                {currentLang?.icon} {currentLang?.name} Examples - Click to load!
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleLoadTemplate(template)}
                  className="group p-3 rounded-xl bg-background/50 border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl group-hover:scale-110 transition-transform">{template.icon}</span>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">{template.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcut Hint */}
      <div className="bg-primary/5 border-b border-primary/10 py-2 text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Star className="h-3 w-3 text-yellow-500" />
          <span>Pro tip: Press <kbd className="px-1.5 py-0.5 bg-background rounded border text-xs font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-background rounded border text-xs font-mono">Enter</kbd> to run your code!</span>
          <Star className="h-3 w-3 text-yellow-500" />
        </p>
      </div>

      {/* Main Content - Split Screen */}
      <div
        className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4"
        onKeyDown={handleKeyDown}
      >
        {/* Code Editor */}
        <Card className="flex flex-col min-h-[400px] lg:min-h-0 overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader className="py-3 px-4 border-b border-border bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent font-semibold">
                Your Code
              </span>
              <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {currentLang?.icon} {currentLang?.name}
              </span>
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
        <Card className="flex flex-col min-h-[300px] lg:min-h-0 mt-0 overflow-hidden border-2 border-green-500/20 shadow-lg shadow-green-500/5">
          <CardHeader className="py-3 px-4 border-b border-border bg-gradient-to-r from-green-500/10 to-emerald-500/10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Terminal className="h-4 w-4 text-green-500" />
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent font-semibold">
                Output
              </span>
              {isRunning && (
                <span className="ml-auto flex items-center gap-1 text-xs text-yellow-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Running...
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-auto bg-[#1e1e1e]">
            <pre className="p-4 text-sm font-mono text-[#d4d4d4] whitespace-pre-wrap min-h-full">
              {output || (
                <span className="text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Click "Run" to see the magic happen! ✨
                </span>
              )}
            </pre>
          </CardContent>
        </Card>
      </div>

      {/* Fun Footer */}
      <footer className="bg-card/50 border-t border-border py-3 text-center">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Rocket className="h-4 w-4 text-primary" />
          <span>Keep coding and have fun! You're doing amazing!</span>
          <Star className="h-4 w-4 text-yellow-500" />
        </p>
      </footer>
    </div>
  );
}