import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlocklyWorkspace, { BlocklyWorkspaceRef } from '@/components/blockly/BlocklyWorkspace';
import OutputCanvas from '@/components/blockly/OutputCanvas';
import ConsoleOutput from '@/components/blockly/ConsoleOutput';
import { useBlockly } from '@/hooks/useBlockly';
import { useStudentAuth } from '@/hooks/useStudentAuth';
import { normalizeClassValue } from '@/lib/classLevel';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Blocks, 
  Monitor, 
  Terminal,
  Sparkles,
  ChevronLeft,
  Menu,
  Lightbulb,
  BookOpen,
  Save
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import kodiMascot from '@/assets/kodi-mascot-3d.png';

const CLASS_LEVELS = [
  { value: '3', label: 'Class 3' },
  { value: '4', label: 'Class 4' },
  { value: '5', label: 'Class 5' },
  { value: '6', label: 'Class 6' },
  { value: '7', label: 'Class 7' },
  { value: '8', label: 'Class 8' },
  { value: '9', label: 'Class 9' },
  { value: '10', label: 'Class 10' },
];

const TIPS_BY_CLASS: Record<string, string[]> = {
  '3': [
    '🌟 Drag blocks from the left to the workspace!',
    '🏃 Use "Move forward" to make the star move!',
    '🔄 "Repeat" blocks let you do things many times!',
  ],
  '4': [
    '🎨 Try changing the color of your sprite!',
    '✏️ Use "Pen down" to draw as you move!',
    '💬 Make your sprite say hello!',
  ],
  '5': [
    '🧮 Use variables to remember numbers!',
    '🔀 "If then" lets you make decisions!',
    '🎯 Combine loops with movement for patterns!',
  ],
  '6': [
    '🔢 Try math operations inside loops!',
    '🎲 Random numbers make things unpredictable!',
    '📝 Join text to create messages!',
  ],
  '7': [
    '⚡ Use the console to see your output!',
    '🔁 Nested loops create complex patterns!',
    '🧪 Test different conditions with logic!',
  ],
  '8': [
    '📊 Variables can store calculations!',
    '🔗 Combine multiple conditions with AND/OR!',
    '🎨 Mix animation and console output!',
  ],
  '9': [
    '💡 Plan your algorithm before building!',
    '🐛 Use print blocks to debug!',
    '🏗️ Break complex problems into parts!',
  ],
  '10': [
    '🚀 Optimize your loops for efficiency!',
    '📈 Track values with variables!',
    '🎯 Think about edge cases!',
  ],
};

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
  
  const classLevel = parseInt(selectedClass, 10) || 5;
  
  const {
    sprite,
    canvas,
    consoleOutputs,
    isRunning,
    outputType,
    runBlocks,
    stopExecution,
    reset,
  } = useBlockly({ classLevel, canvasWidth: 400, canvasHeight: 400 });

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
      // Could save to database for logged-in users
    }
  };

  // Load saved project on mount
  useEffect(() => {
    const savedXml = localStorage.getItem('blockly_project');
    if (savedXml && workspaceRef.current) {
      workspaceRef.current.loadBlocksXml(savedXml);
    }
  }, []);

  const tips = TIPS_BY_CLASS[selectedClass] || TIPS_BY_CLASS['5'];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="h-14 border-b border-border/50 bg-card/95 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Blocks className="h-5 w-5 text-primary" />
            <span className="font-bold font-display hidden sm:inline">
              Code<span className="text-primary">Lab</span>
            </span>
          </div>

          <Badge variant="secondary" className="hidden sm:flex">
            Block Coding
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Class selector */}
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[110px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLASS_LEVELS.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mobile tips button */}
          {isMobile && (
            <Sheet open={showTipsDrawer} onOpenChange={setShowTipsDrawer}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Tips for Class {selectedClass}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  {tips.map((tip, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-muted/50 text-sm"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row p-2 lg:p-4 gap-4 overflow-hidden">
        {/* Left side - Blockly workspace */}
        <div className="flex-1 flex flex-col min-h-[300px] lg:min-h-0">
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="py-2 px-3 flex flex-row items-center justify-between border-b">
              <div className="flex items-center gap-2">
                <Blocks className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm">Workspace</CardTitle>
              </div>
              
              {/* Control buttons */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveProject}
                  className="h-8"
                >
                  <Save className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleReset}
                  className="h-8"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Reset</span>
                </Button>
                
                {isRunning ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleStop}
                    className="h-8"
                  >
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleRun}
                    className="h-8 bg-gradient-to-r from-primary to-primary/80"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 min-h-[250px]">
              <BlocklyWorkspace
                ref={workspaceRef}
                classLevel={classLevel}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right side - Output */}
        <div className="w-full lg:w-[420px] flex flex-col gap-4">
          {/* Output tabs */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <Tabs value={activeOutputTab} onValueChange={(v) => setActiveOutputTab(v as 'animation' | 'console')}>
              <CardHeader className="py-2 px-3 border-b">
                <TabsList className="w-full justify-start">
                  {(outputType === 'animation' || outputType === 'both') && (
                    <TabsTrigger value="animation" className="flex items-center gap-1">
                      <Monitor className="h-4 w-4" />
                      <span className="hidden sm:inline">Stage</span>
                    </TabsTrigger>
                  )}
                  {(outputType === 'console' || outputType === 'both') && (
                    <TabsTrigger value="console" className="flex items-center gap-1">
                      <Terminal className="h-4 w-4" />
                      <span className="hidden sm:inline">Console</span>
                    </TabsTrigger>
                  )}
                </TabsList>
              </CardHeader>
              
              <CardContent className="flex-1 p-3">
                <TabsContent value="animation" className="mt-0 h-full">
                  <div className="flex justify-center">
                    <OutputCanvas
                      sprite={sprite}
                      canvas={canvas}
                      width={isMobile ? 300 : 400}
                      height={isMobile ? 300 : 400}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="console" className="mt-0 h-full">
                  <ConsoleOutput outputs={consoleOutputs} className="h-full" />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Tips card - Desktop only */}
          {!isMobile && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Tips for Class {selectedClass}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3">
                <div className="space-y-2">
                  {tips.slice(0, 2).map((tip, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      {tip}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mascot */}
          {!isMobile && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <img 
                src={kodiMascot} 
                alt="Kodi" 
                className="w-12 h-12 object-contain animate-bounce"
                style={{ animationDuration: '2s' }}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {isRunning ? "Running your code! 🚀" : "Drag blocks to create magic! ✨"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Click Run when you're ready!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
