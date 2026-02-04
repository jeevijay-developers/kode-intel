import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlockItem {
  type: string;
  label: string;
  connected?: boolean;
  color?: string;
}

interface BlockVisualContent {
  blocks: BlockItem[];
  explanation: string;
  try_it_link?: boolean;
  module_id?: string;
}

interface BlockVisualBlockProps {
  content: BlockVisualContent;
  className?: string;
}

const blockColors: Record<string, string> = {
  when_start: "bg-amber-500",
  say_message: "bg-purple-500",
  move_forward: "bg-blue-500",
  turn_right: "bg-blue-500",
  turn_left: "bg-blue-500",
  repeat: "bg-orange-500",
  if_then: "bg-orange-500",
  pen_down: "bg-green-500",
  pen_up: "bg-green-500",
  set_color: "bg-green-500",
  default: "bg-slate-500",
};

export function BlockVisualBlock({ content, className }: BlockVisualBlockProps) {
  const navigate = useNavigate();
  const { blocks, explanation, try_it_link, module_id } = content;

  const handleTryIt = () => {
    if (module_id) {
      navigate(`/student/coding/${module_id}`);
    } else {
      navigate("/codelab");
    }
  };

  return (
    <div
      className={cn(
        "my-6 p-4 md:p-6 rounded-xl bg-slate-900 border border-slate-700",
        className
      )}
    >
      {/* Block Visual */}
      <div className="space-y-1 mb-4">
        {blocks.map((block, index) => {
          const colorClass = blockColors[block.type] || blockColors.default;
          const isConnected = index > 0 && blocks[index - 1]?.connected;

          return (
            <div key={index} className="flex items-center">
              {isConnected && (
                <div className="w-6 flex justify-center">
                  <div className="w-0.5 h-4 bg-slate-600" />
                </div>
              )}
              <div
                className={cn(
                  "px-4 py-2 rounded-lg text-white font-medium text-sm shadow-md",
                  colorClass,
                  isConnected ? "ml-0" : "ml-6"
                )}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 50%)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Play className="w-3 h-3" />
                  {block.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      <p className="text-slate-300 text-sm md:text-base mb-4 leading-relaxed">
        {explanation}
      </p>

      {/* Try It Button */}
      {try_it_link && (
        <Button
          onClick={handleTryIt}
          className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
        >
          Try it in Playground
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
