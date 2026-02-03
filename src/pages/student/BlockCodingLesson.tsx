import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Code,
  Play,
  Save,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Square,
} from "lucide-react";
import BlocklyWorkspace, { BlocklyWorkspaceRef } from "@/components/blockly/BlocklyWorkspace";
import { LessonPanel } from "@/components/blockly/LessonPanel";
import OutputCanvas from "@/components/blockly/OutputCanvas";
import ConsoleOutput from "@/components/blockly/ConsoleOutput";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { useCodingProgress } from "@/hooks/useCodingProgress";
import { useBlockly } from "@/hooks/useBlockly";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Confetti } from "@/components/ui/confetti";
import brainLogo from "@/assets/brain-logo.png";

export default function BlockCodingLesson() {
  const { moduleId } = useParams();
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get("chapter");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { student, loading: authLoading } = useStudentAuth();
  const { completeModule, getModuleProgress, saveProject, refetch } = useCodingProgress();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const workspaceRef = useRef<BlocklyWorkspaceRef>(null);

  // Get class level from student
  const classLevel = student ? parseInt(student.class) || 5 : 5;
  const useAnimationOutput = classLevel <= 6;

  // Blockly state
  const blocklyState = useBlockly({ classLevel });

  // Fetch the specific module
  const { data: module, isLoading: moduleLoading } = useQuery({
    queryKey: ["coding-module", moduleId],
    queryFn: async () => {
      if (!moduleId) return null;
      const { data, error } = await supabase
        .from("coding_modules")
        .select("*")
        .eq("id", moduleId)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!moduleId,
  });

  // Fetch all modules for this chapter (for navigation)
  const { data: chapterModules = [] } = useQuery({
    queryKey: ["chapter-coding-modules", chapterId],
    queryFn: async () => {
      if (!chapterId) return [];
      const { data, error } = await supabase
        .from("coding_modules")
        .select("id, title, order_index")
        .eq("chapter_id", chapterId)
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
    enabled: !!chapterId,
  });

  // Get chapter info
  const { data: chapter } = useQuery({
    queryKey: ["chapter", chapterId],
    queryFn: async () => {
      if (!chapterId) return null;
      const { data, error } = await supabase
        .from("chapters")
        .select("*, courses(title)")
        .eq("id", chapterId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!chapterId,
  });

  // Parse hints from validation_rules
  const validationRules = module?.validation_rules as { hints?: string[] } | null;
  const hints: string[] = validationRules?.hints || [];
  const moduleProgress = moduleId ? getModuleProgress(moduleId) : undefined;

  // Handle run code
  const handleRun = useCallback(() => {
    const blocks = workspaceRef.current?.getBlocks();
    if (blocks && blocks.length > 0) {
      blocklyState.runBlocks(blocks);
    }
  }, [blocklyState]);

  // Handle stop code
  const handleStop = useCallback(() => {
    blocklyState.stopExecution();
  }, [blocklyState]);

  // Handle reset workspace
  const handleReset = useCallback(() => {
    workspaceRef.current?.clear();
    blocklyState.reset();
    if (module?.initial_blocks_xml) {
      workspaceRef.current?.loadBlocksXml(module.initial_blocks_xml);
    }
  }, [blocklyState, module?.initial_blocks_xml]);

  // Handle module completion
  const handleComplete = useCallback(async () => {
    if (!moduleId || !student?.id) return;

    const success = await completeModule(moduleId);
    if (success) {
      setShowConfetti(true);
      toast({
        title: "🎉 Module Completed!",
        description: `You earned ${module?.xp_reward || 10} XP!`,
      });
      refetch();
    }
  }, [moduleId, student?.id, completeModule, module?.xp_reward, toast, refetch]);

  // Handle save progress
  const handleSave = useCallback(async () => {
    if (!student?.id) return;
    const xml = workspaceRef.current?.getBlocksXml();
    if (!xml) return;

    const projectId = await saveProject(
      module?.title || "Lesson Progress",
      xml,
      "lesson",
      classLevel,
      moduleId
    );

    if (projectId) {
      toast({
        title: "Progress Saved!",
        description: "Your work has been saved.",
      });
    }
  }, [student?.id, saveProject, module?.title, classLevel, moduleId, toast]);

  // Load initial blocks when module changes
  useEffect(() => {
    if (module?.initial_blocks_xml && workspaceRef.current) {
      workspaceRef.current.loadBlocksXml(module.initial_blocks_xml);
    }
  }, [module?.initial_blocks_xml]);

  // Navigation between modules
  const currentModuleIndex = chapterModules.findIndex((m) => m.id === moduleId);
  const prevModule = currentModuleIndex > 0 ? chapterModules[currentModuleIndex - 1] : null;
  const nextModule =
    currentModuleIndex < chapterModules.length - 1 ? chapterModules[currentModuleIndex + 1] : null;

  const navigateToModule = (id: string) => {
    navigate(`/student/coding/${id}${chapterId ? `?chapter=${chapterId}` : ""}`);
  };

  if (authLoading || moduleLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="lg:col-span-2 h-[500px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-bold mb-2">Module Not Found</h2>
          <p className="text-muted-foreground mb-4">
            This coding module doesn't exist or is not published yet.
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Confetti
        isActive={showConfetti}
        duration={4000}
        pieceCount={80}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Header */}
      <header className="h-14 border-b bg-card/95 backdrop-blur sticky top-0 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img src={brainLogo} alt="Logo" className="h-7 w-7" />
          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground">
              {(chapter as any)?.courses?.title || "Coding Lesson"}
            </p>
            <h1 className="text-sm font-semibold leading-tight truncate max-w-[200px] lg:max-w-none">
              {module.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex gap-1">
            <Sparkles className="h-3 w-3 text-sunny" />
            {module.xp_reward} XP
          </Badge>

          <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            size="sm"
            onClick={blocklyState.isRunning ? handleStop : handleRun}
            className={blocklyState.isRunning ? "bg-coral hover:bg-coral/90" : "bg-lime hover:bg-lime/90 text-foreground"}
          >
            {blocklyState.isRunning ? (
              <>
                <Square className="h-4 w-4 mr-1.5" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1.5" />
                Run
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - Lesson Panel */}
        <div
          className={`${
            showSidebar ? "w-80 lg:w-96" : "w-0"
          } transition-all duration-300 border-r bg-card overflow-hidden shrink-0`}
        >
          <div className="w-80 lg:w-96 h-full overflow-y-auto p-4 space-y-4">
            <LessonPanel
              title={module.title}
              description={module.description || undefined}
              objective={module.objective_text || "Complete this coding challenge!"}
              hints={hints}
              difficulty={module.difficulty_level as "beginner" | "intermediate" | "advanced"}
              xpReward={module.xp_reward}
              isCompleted={!!moduleProgress?.completed_at}
              attempts={moduleProgress?.attempts || 0}
              onComplete={handleComplete}
            />

            {/* Module Navigation */}
            {chapterModules.length > 1 && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Chapter Modules</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {currentModuleIndex + 1}/{chapterModules.length}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!prevModule}
                    onClick={() => prevModule && navigateToModule(prevModule.id)}
                    className="flex-1"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!nextModule}
                    onClick={() => nextModule && navigateToModule(nextModule.id)}
                    className="flex-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-1/2 -translate-y-1/2 z-10 bg-card border rounded-r-lg p-1 shadow-md hover:bg-muted transition-colors lg:hidden"
          style={{ left: showSidebar ? "calc(20rem - 1px)" : "0" }}
        >
          {showSidebar ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Blockly Editor */}
          <div className="flex-1 min-h-[300px] lg:min-h-0 relative">
            <BlocklyWorkspace
              ref={workspaceRef}
              classLevel={classLevel}
              initialBlocks={module?.initial_blocks_xml || undefined}
            />
          </div>

          {/* Output Panel */}
          <div className="h-48 lg:h-auto lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l bg-card shrink-0 overflow-hidden flex items-center justify-center p-4">
            {useAnimationOutput ? (
              <OutputCanvas
                sprite={blocklyState.sprite}
                canvas={blocklyState.canvas}
              />
            ) : (
              <ConsoleOutput
                outputs={blocklyState.consoleOutputs}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
