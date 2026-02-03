import { useEffect, useRef } from 'react';
import { ConsoleOutput as ConsoleOutputType } from '@/lib/blockly/interpreters/consoleInterpreter';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ConsoleOutputProps {
  outputs: ConsoleOutputType[];
  className?: string;
}

const ConsoleOutput = ({ outputs, className }: ConsoleOutputProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new output added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputs]);

  return (
    <div className={cn(
      "bg-[#1e1e1e] rounded-xl border-2 border-primary/20 overflow-hidden",
      className
    )}>
      {/* Console header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#2d2d2d] border-b border-border/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">Console Output</span>
      </div>

      {/* Console content */}
      <ScrollArea className="h-[250px]" ref={scrollRef}>
        <div className="p-4 font-mono text-sm space-y-1">
          {outputs.length === 0 ? (
            <div className="text-muted-foreground/50 italic">
              Run your program to see output here...
            </div>
          ) : (
            outputs.map((output, index) => (
              <div
                key={`${output.timestamp}-${index}`}
                className={cn(
                  "flex gap-2 animate-fade-in",
                  output.type === 'error' && "text-destructive",
                  output.type === 'log' && "text-primary",
                  output.type === 'result' && "text-accent-foreground"
                )}
              >
                <span className="text-muted-foreground select-none">
                  {output.type === 'error' ? '✗' : output.type === 'result' ? '→' : '>'}
                </span>
                <span className="break-all">{output.message}</span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConsoleOutput;
