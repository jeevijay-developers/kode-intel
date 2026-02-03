import { useState, useCallback, useRef } from 'react';
import { AnimationInterpreter, SpriteState, CanvasState, parseBlocksToCommands } from '@/lib/blockly/interpreters/animationInterpreter';
import { ConsoleInterpreter, ConsoleOutput } from '@/lib/blockly/interpreters/consoleInterpreter';
import { getOutputType } from '@/lib/blockly/toolboxConfigs';

interface UseBlocklyOptions {
  classLevel: number;
  canvasWidth?: number;
  canvasHeight?: number;
}

export function useBlockly({ classLevel, canvasWidth = 400, canvasHeight = 400 }: UseBlocklyOptions) {
  const outputType = getOutputType(classLevel);
  
  // Animation state
  const [sprite, setSprite] = useState<SpriteState>({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    direction: 0,
    color: '#4ECDC4',
    size: 100,
    visible: true,
    penDown: false,
    penColor: '#FF6B6B',
    message: null,
  });
  const [canvas, setCanvas] = useState<CanvasState>({ drawings: [], messages: [] });
  
  // Console state
  const [consoleOutputs, setConsoleOutputs] = useState<ConsoleOutput[]>([]);
  
  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const animationInterpreterRef = useRef<AnimationInterpreter | null>(null);
  const consoleInterpreterRef = useRef<ConsoleInterpreter | null>(null);

  // Initialize interpreters
  const initializeInterpreters = useCallback(() => {
    animationInterpreterRef.current = new AnimationInterpreter(
      canvasWidth,
      canvasHeight,
      (newSprite, newCanvas) => {
        setSprite({ ...newSprite });
        setCanvas({ ...newCanvas });
      }
    );

    consoleInterpreterRef.current = new ConsoleInterpreter((output) => {
      setConsoleOutputs(prev => [...prev, output]);
    });
  }, [canvasWidth, canvasHeight]);

  // Run blocks
  const runBlocks = useCallback(async (blocks: any[]) => {
    if (isRunning) return;
    
    setIsRunning(true);
    initializeInterpreters();

    try {
      if (outputType === 'animation' || outputType === 'both') {
        // Run animation interpreter
        const commands = parseBlocksToCommands(blocks);
        animationInterpreterRef.current?.reset();
        await animationInterpreterRef.current?.execute(commands);
      }

      if (outputType === 'console' || outputType === 'both') {
        // Run console interpreter
        consoleInterpreterRef.current?.reset();
        setConsoleOutputs([]);
        await consoleInterpreterRef.current?.execute(blocks);
      }
    } catch (err) {
      console.error('Execution error:', err);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, outputType, initializeInterpreters]);

  // Stop execution
  const stopExecution = useCallback(() => {
    animationInterpreterRef.current?.stop();
    consoleInterpreterRef.current?.stop();
    setIsRunning(false);
  }, []);

  // Reset everything
  const reset = useCallback(() => {
    stopExecution();
    animationInterpreterRef.current?.reset();
    consoleInterpreterRef.current?.reset();
    setSprite({
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      direction: 0,
      color: '#4ECDC4',
      size: 100,
      visible: true,
      penDown: false,
      penColor: '#FF6B6B',
      message: null,
    });
    setCanvas({ drawings: [], messages: [] });
    setConsoleOutputs([]);
  }, [stopExecution, canvasWidth, canvasHeight]);

  // Clear console only
  const clearConsole = useCallback(() => {
    setConsoleOutputs([]);
  }, []);

  return {
    // State
    sprite,
    canvas,
    consoleOutputs,
    isRunning,
    outputType,
    
    // Actions
    runBlocks,
    stopExecution,
    reset,
    clearConsole,
  };
}
