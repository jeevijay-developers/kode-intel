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
import { Brain, Play, Trash2, ArrowLeft, Loader2, Code, Terminal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const languages = [
  { id: "c", name: "C", extension: "c" },
  { id: "cpp", name: "C++", extension: "cpp" },
  { id: "python", name: "Python", extension: "py" },
  { id: "java", name: "Java", extension: "java" },
  { id: "javascript", name: "JavaScript", extension: "js" },
];

const starterCode: Record<string, string> = {
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  python: `print("Hello, World!")`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  javascript: `console.log("Hello, World!");`,
};

// Language extensions mapping for CodeMirror
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

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(starterCode[newLang] || "");
    setOutput("");
  };

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput("Running...\n");

    try {
      const { data, error } = await supabase.functions.invoke("execute-code", {
        body: { language, code },
      });

      if (error) {
        setOutput(`Error: ${error.message}`);
        toast.error("Failed to execute code");
        return;
      }

      let result = "";
      if (data.output) {
        result += data.output;
      }
      if (data.error) {
        result += (result ? "\n" : "") + `Error:\n${data.error}`;
      }
      if (!data.output && !data.error) {
        result = "(No output)";
      }
      if (data.executionTime && data.executionTime !== "N/A") {
        result += `\n\n⏱ Execution time: ${data.executionTime}s`;
      }

      setOutput(result);
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  }, [language, code]);

  const handleClear = () => {
    setCode(starterCode[language] || "");
    setOutput("");
  };

  // Handle Ctrl+Enter to run
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Code Compiler</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>

            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Run</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <div
        className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-4 p-4"
        onKeyDown={handleKeyDown}
      >
        {/* Code Editor */}
        <Card className="flex flex-col min-h-[400px] lg:min-h-0">
          <CardHeader className="py-3 px-4 border-b border-border">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              Editor
              <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
                Ctrl + Enter to run
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
        <Card className="flex flex-col min-h-[300px] lg:min-h-0 mt-4 lg:mt-0">
          <CardHeader className="py-3 px-4 border-b border-border">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              Output
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-auto bg-[#1e1e1e]">
            <pre className="p-4 text-sm font-mono text-[#d4d4d4] whitespace-pre-wrap min-h-full">
              {output || "// Output will appear here after running your code"}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
