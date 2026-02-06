import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlocklyWorkspace, { BlocklyWorkspaceRef } from '@/components/blockly/BlocklyWorkspace';
import OutputCanvas from '@/components/blockly/OutputCanvas';
import ConsoleOutput from '@/components/blockly/ConsoleOutput';
import { CodeLabGuide } from '@/components/blockly/CodeLabGuide';
import { CodeLabWelcome } from '@/components/blockly/CodeLabWelcome';
import { ExampleLoader } from '@/components/blockly/ExampleLoader';
import { useBlockly } from '@/hooks/useBlockly';
import { useStudentAuth } from '@/hooks/useStudentAuth';
import { normalizeClassValue } from '@/lib/classLevel';
import { getClassTheme, getMascotAnimation } from '@/lib/blockly/classThemes';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Blocks, 
  Monitor, 
  Terminal,
  ChevronLeft,
  Lightbulb,
  Save,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  BookOpen,
  GraduationCap,
  Sparkles,
  Rocket,
  Star
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import kodiMascot from '@/assets/kodi-mascot-3d.png';
import { cn } from '@/lib/utils';

const CLASS_LEVELS = [
  { value: '3', label: 'Class 3', emoji: '🌟' },
  { value: '4', label: 'Class 4', emoji: '🎨' },
  { value: '5', label: 'Class 5', emoji: '⚡' },
  { value: '6', label: 'Class 6', emoji: '🧩' },
  { value: '7', label: 'Class 7', emoji: '🥷' },
  { value: '8', label: 'Class 8', emoji: '🏆' },
  { value: '9', label: 'Class 9', emoji: '🚀' },
  { value: '10', label: 'Class 10', emoji: '👑' },
];

export default function BlockCodingLab() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { student } = useStudentAuth();
  const workspaceRef = useRef<BlocklyWorkspaceRef>(null);
  
  // Get student's class level or default to 5
  const studentClass = normalizeClassValue(student?.class);
  const initialClass = studentClass || '5';
  
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [activeOutputTab, setActiveOutputTab] = useState<'animation' | 'console'>('animation');
  const [showTipsDrawer, setShowTipsDrawer] = useState(false);
  const [showGuideDrawer, setShowGuideDrawer] = useState(false);
  const [mobileOutputExpanded, setMobileOutputExpanded] = useState(false);
  
  const classLevel = parseInt(selectedClass, 10) || 5;
  const theme = getClassTheme(classLevel);
  const mascotAnimation = getMascotAnimation(theme.mascotMood);
  
  // Calculate canvas size based on screen
  const canvasSize = isMobile ? Math.min(window.innerWidth - 48, 300) : 400;
  
  const {
    sprite,
    canvas,
    consoleOutputs,
    isRunning,
    outputType,
    runBlocks,
    stopExecution,
    reset,
  } = useBlockly({ classLevel, canvasWidth: canvasSize, canvasHeight: canvasSize });

  // Set default output tab based on class
  useEffect(() => {
    if (outputType === 'console') {
      setActiveOutputTab('console');
    } else {
      setActiveOutputTab('animation');
    }
  }, [outputType]);

  const handleRun = () => {
    const blocks = workspaceRef.current?.getBlocks() || [];
    runBlocks(blocks);
    if (isMobile) {
      setMobileOutputExpanded(true);
    }
  };

  const handleStop = () => {
    stopExecution();
  };

  const handleReset = () => {
    reset();
    workspaceRef.current?.clear();
  };

  const handleSaveProject = () => {
    const xml = workspaceRef.current?.getBlocksXml();
    if (xml) {
      localStorage.setItem('blockly_project', xml);
    }
  };

  // Load saved project on mount
  useEffect(() => {
    const savedXml = localStorage.getItem('blockly_project');
    if (savedXml && workspaceRef.current) {
      workspaceRef.current.loadBlocksXml(savedXml);
    }
  }, []);

  // Load example into workspace
  const handleLoadExample = (xml: string) => {
    if (workspaceRef.current) {
      workspaceRef.current.loadBlocksXml(xml);
      setShowGuideDrawer(false);
      setShowTipsDrawer(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-gradient-to-br from-background via-background",
      theme.bgPattern
    )}>
      {/* Welcome modal for first-time users */}
      <CodeLabWelcome classLevel={classLevel} onComplete={() => {}} />

      {/* Header with class-specific theme */}
      <header className={cn(
        "h-14 sm:h-16 border-b border-border/50 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-2 sm:px-4",
        "bg-gradient-to-r from-card/95 via-card/90 to-card/95"
      )}>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br",
              theme.gradient
            )}>
              <Blocks className="h-5 w-5 text-primary" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold font-display text-base">
                  Code<span className="text-primary">Lab</span>
                </span>
                <span className="text-lg">{theme.emoji}</span>
              </div>
              <p className="text-[10px] text-muted-foreground -mt-0.5">{theme.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Example loader dropdown */}
          <ExampleLoader 
            classLevel={classLevel} 
            onLoadExample={handleLoadExample}
          />

          {/* Class selector */}
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className={cn(
              "w-[100px] sm:w-[130px] h-9 text-xs sm:text-sm gap-1",
              "border-primary/30 hover:border-primary/50"
            )}>
              <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLASS_LEVELS.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  <span className="flex items-center gap-2">
                    <span>{level.emoji}</span>
                    <span>{level.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Guide drawer button */}
          <Sheet open={showGuideDrawer} onOpenChange={setShowGuideDrawer}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
              >
                <BookOpen className="h-4 w-4 text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[340px] sm:w-[400px] p-0">
              <CodeLabGuide 
                classLevel={classLevel}
                onLoadExample={handleLoadExample}
              />
            </SheetContent>
          </Sheet>

          {/* Tips drawer button */}
          <Sheet open={showTipsDrawer} onOpenChange={setShowTipsDrawer}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-9 w-9 border-sunny/30 hover:border-sunny/50 hover:bg-sunny/5"
              >
                <HelpCircle className="h-4 w-4 text-sunny" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <div className="space-y-4">
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r",
                  theme.gradient
                )}>
                  <Lightbulb className="h-6 w-6 text-sunny" />
                  <div>
                    <h3 className="font-bold">Quick Tips</h3>
                    <p className="text-xs text-muted-foreground">Class {selectedClass} • {theme.name}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {theme.features.map((feature, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-muted/50 border border-border/50 flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{feature}</p>
                        <p className="text-xs text-muted-foreground">Available in this class</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => {
                      setShowTipsDrawer(false);
                      setShowGuideDrawer(true);
                    }}
                  >
                    <BookOpen className="h-4 w-4" />
                    Open Full Guide
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden",
        isMobile ? "" : "lg:flex-row"
      )}>
        {/* Blockly workspace */}
        <div className={cn(
          "flex flex-col",
          isMobile 
            ? mobileOutputExpanded ? "h-[35vh] min-h-[200px]" : "flex-1 min-h-[300px]"
            : "flex-1 min-h-[300px] lg:min-h-0"
        )}>
          <Card className={cn(
            "flex-1 flex flex-col overflow-hidden border-2",
            `border-${theme.accentColor}/20`
          )}>
            <CardHeader className="py-2 px-3 flex flex-row items-center justify-between border-b bg-gradient-to-r from-muted/30 to-transparent">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br",
                  theme.gradient
                )}>
                  <Blocks className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm">Workspace</CardTitle>
                  <p className="text-[10px] text-muted-foreground">{theme.tagline}</p>
                </div>
              </div>
              
              {/* Control buttons */}
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveProject}
                  className="h-8 px-2.5 gap-1.5 text-xs"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="h-8 px-2.5 gap-1.5 text-xs"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
                
                {isRunning ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleStop}
                    className="h-8 px-3 gap-1.5 text-xs"
                  >
                    <Square className="h-4 w-4" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleRun}
                    className="h-8 px-3 gap-1.5 text-xs bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    <Play className="h-4 w-4" />
                    Run
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 min-h-[180px] sm:min-h-[250px]">
              <BlocklyWorkspace
                ref={workspaceRef}
                classLevel={classLevel}
              />
            </CardContent>
          </Card>
        </div>

        {/* Output section */}
        <div className={cn(
          "flex flex-col gap-2 sm:gap-4",
          isMobile 
            ? mobileOutputExpanded ? "flex-1" : "h-auto"
            : "w-full lg:w-[420px]"
        )}>
          {/* Mobile toggle button */}
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileOutputExpanded(!mobileOutputExpanded)}
              className="flex items-center justify-center gap-2 h-10 border-primary/30"
            >
              {mobileOutputExpanded ? (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span>Collapse Output</span>
                </>
              ) : (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span>Show Output</span>
                  <Monitor className="h-4 w-4 text-primary" />
                </>
              )}
            </Button>
          )}

          {/* Output tabs */}
          {(!isMobile || mobileOutputExpanded) && (
            <Card className="flex-1 flex flex-col overflow-hidden">
              <Tabs value={activeOutputTab} onValueChange={(v) => setActiveOutputTab(v as 'animation' | 'console')}>
                <CardHeader className="py-2 px-3 border-b bg-gradient-to-r from-muted/30 to-transparent">
                  <TabsList className="w-full justify-start h-9">
                    {(outputType === 'animation' || outputType === 'both') && (
                      <TabsTrigger value="animation" className="flex items-center gap-1.5 text-xs h-8">
                        <Monitor className="h-4 w-4" />
                        <span>Stage</span>
                      </TabsTrigger>
                    )}
                    {(outputType === 'console' || outputType === 'both') && (
                      <TabsTrigger value="console" className="flex items-center gap-1.5 text-xs h-8">
                        <Terminal className="h-4 w-4" />
                        <span>Console</span>
                      </TabsTrigger>
                    )}
                  </TabsList>
                </CardHeader>
                
                <CardContent className="flex-1 p-3 overflow-auto">
                  <TabsContent value="animation" className="mt-0 h-full flex justify-center items-start">
                    <OutputCanvas
                      sprite={sprite}
                      canvas={canvas}
                      width={canvasSize}
                      height={canvasSize}
                    />
                  </TabsContent>
                  
                  <TabsContent value="console" className="mt-0 h-full">
                    <ConsoleOutput outputs={consoleOutputs} className="h-full min-h-[150px]" />
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          )}

          {/* Mascot card with class theme - Desktop only */}
          {!isMobile && (
            <Card className={cn(
              "border-2 bg-gradient-to-r overflow-hidden",
              theme.gradient,
              `border-${theme.accentColor}/30`
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={kodiMascot} 
                      alt="Kodi" 
                      className={cn(
                        "w-16 h-16 object-contain drop-shadow-lg",
                        mascotAnimation
                      )}
                      style={{ animationDuration: '2s' }}
                    />
                    <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-sunny animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <GraduationCap className="h-3 w-3" />
                        Class {selectedClass}
                      </Badge>
                      <span className="text-lg">{theme.emoji}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {isRunning ? "Running your code! 🚀" : theme.mascotMessage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isRunning ? "Watch the output..." : "Drag blocks to start creating!"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
