import { BLOCK_COLORS } from './customBlocks';

// Class-wise toolbox configurations
// Classes 3-4: Basic motion, looks, events, simple loops
// Classes 5-6: + Logic, Variables, Sounds
// Classes 7-8: + Functions, Lists, Math Operations
// Classes 9-10: + Advanced Logic, Algorithms

export type ClassLevel = 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface ToolboxCategory {
  kind: 'category';
  name: string;
  colour: string;
  contents: { kind: 'block'; type: string; inputs?: object }[];
}

interface ToolboxSeparator {
  kind: 'sep';
}

type ToolboxItem = ToolboxCategory | ToolboxSeparator;

export interface ToolboxConfig {
  kind: 'categoryToolbox';
  contents: ToolboxItem[];
}

const createCategory = (
  name: string,
  color: string,
  blocks: { type: string; inputs?: object }[]
): ToolboxCategory => ({
  kind: 'category',
  name,
  colour: color,
  contents: blocks.map(b => ({ kind: 'block', ...b })),
});

// Base categories for all levels
const eventsCategory: ToolboxCategory = createCategory('Events', BLOCK_COLORS.events, [
  { type: 'when_start' },
  { type: 'when_key_pressed' },
]);

const motionBasic: ToolboxCategory = createCategory('Motion', BLOCK_COLORS.motion, [
  { type: 'move_forward', inputs: { STEPS: { block: { type: 'math_number', fields: { NUM: 10 } } } } },
  { type: 'turn_right', inputs: { DEGREES: { block: { type: 'math_number', fields: { NUM: 90 } } } } },
  { type: 'turn_left', inputs: { DEGREES: { block: { type: 'math_number', fields: { NUM: 90 } } } } },
  { type: 'go_to_center' },
]);

const motionAdvanced: ToolboxCategory = createCategory('Motion', BLOCK_COLORS.motion, [
  { type: 'move_forward', inputs: { STEPS: { block: { type: 'math_number', fields: { NUM: 10 } } } } },
  { type: 'turn_right', inputs: { DEGREES: { block: { type: 'math_number', fields: { NUM: 90 } } } } },
  { type: 'turn_left', inputs: { DEGREES: { block: { type: 'math_number', fields: { NUM: 90 } } } } },
  { type: 'go_to_position' },
  { type: 'go_to_center' },
  { type: 'pen_down' },
  { type: 'pen_up' },
  { type: 'pen_color' },
  { type: 'clear_canvas' },
]);

const looksBasic: ToolboxCategory = createCategory('Looks', BLOCK_COLORS.looks, [
  { type: 'say_message', inputs: { MESSAGE: { block: { type: 'text_value', fields: { TEXT: 'Hello!' } } } } },
  { type: 'change_color' },
  { type: 'show_sprite' },
  { type: 'hide_sprite' },
]);

const looksAdvanced: ToolboxCategory = createCategory('Looks', BLOCK_COLORS.looks, [
  { type: 'say_message', inputs: { MESSAGE: { block: { type: 'text_value', fields: { TEXT: 'Hello!' } } } } },
  { type: 'change_color' },
  { type: 'set_size', inputs: { SIZE: { block: { type: 'math_number', fields: { NUM: 100 } } } } },
  { type: 'show_sprite' },
  { type: 'hide_sprite' },
]);

const controlBasic: ToolboxCategory = createCategory('Control', BLOCK_COLORS.control, [
  { type: 'wait_seconds', inputs: { SECONDS: { block: { type: 'math_number', fields: { NUM: 1 } } } } },
  { type: 'repeat_times', inputs: { TIMES: { block: { type: 'math_number', fields: { NUM: 10 } } } } },
]);

const controlIntermediate: ToolboxCategory = createCategory('Control', BLOCK_COLORS.control, [
  { type: 'wait_seconds', inputs: { SECONDS: { block: { type: 'math_number', fields: { NUM: 1 } } } } },
  { type: 'repeat_times', inputs: { TIMES: { block: { type: 'math_number', fields: { NUM: 10 } } } } },
  { type: 'repeat_forever' },
  { type: 'if_then' },
]);

const controlAdvanced: ToolboxCategory = createCategory('Control', BLOCK_COLORS.control, [
  { type: 'wait_seconds', inputs: { SECONDS: { block: { type: 'math_number', fields: { NUM: 1 } } } } },
  { type: 'repeat_times', inputs: { TIMES: { block: { type: 'math_number', fields: { NUM: 10 } } } } },
  { type: 'repeat_forever' },
  { type: 'if_then' },
  { type: 'if_then_else' },
]);

const logicCategory: ToolboxCategory = createCategory('Logic', BLOCK_COLORS.logic, [
  { type: 'compare' },
  { type: 'logic_and' },
  { type: 'logic_or' },
  { type: 'logic_not' },
]);

const mathBasic: ToolboxCategory = createCategory('Math', BLOCK_COLORS.math, [
  { type: 'math_number' },
  { type: 'math_arithmetic' },
]);

const mathAdvanced: ToolboxCategory = createCategory('Math', BLOCK_COLORS.math, [
  { type: 'math_number' },
  { type: 'math_arithmetic' },
  { type: 'math_random' },
]);

const textBasic: ToolboxCategory = createCategory('Text', BLOCK_COLORS.text, [
  { type: 'text_value' },
  { type: 'print_output' },
]);

const textAdvanced: ToolboxCategory = createCategory('Text', BLOCK_COLORS.text, [
  { type: 'text_value' },
  { type: 'text_join' },
  { type: 'print_output' },
]);

const variablesCategory: ToolboxCategory = createCategory('Variables', BLOCK_COLORS.variables, [
  { type: 'variable_set' },
  { type: 'variable_get' },
  { type: 'variable_change' },
]);

// Toolbox configurations by class level
export const getToolboxForClass = (classLevel: number): ToolboxConfig => {
  const level = Math.max(3, Math.min(10, classLevel)) as ClassLevel;

  // Classes 3-4: Basic blocks
  if (level <= 4) {
    return {
      kind: 'categoryToolbox',
      contents: [
        eventsCategory,
        { kind: 'sep' },
        motionBasic,
        looksBasic,
        { kind: 'sep' },
        controlBasic,
        mathBasic,
      ],
    };
  }

  // Classes 5-6: + Logic, Variables
  if (level <= 6) {
    return {
      kind: 'categoryToolbox',
      contents: [
        eventsCategory,
        { kind: 'sep' },
        motionAdvanced,
        looksAdvanced,
        { kind: 'sep' },
        controlIntermediate,
        logicCategory,
        mathBasic,
        textBasic,
        variablesCategory,
      ],
    };
  }

  // Classes 7-8: + Functions, Lists, More Math
  if (level <= 8) {
    return {
      kind: 'categoryToolbox',
      contents: [
        eventsCategory,
        { kind: 'sep' },
        motionAdvanced,
        looksAdvanced,
        { kind: 'sep' },
        controlAdvanced,
        logicCategory,
        mathAdvanced,
        textAdvanced,
        variablesCategory,
      ],
    };
  }

  // Classes 9-10: Full blocks
  return {
    kind: 'categoryToolbox',
    contents: [
      eventsCategory,
      { kind: 'sep' },
      motionAdvanced,
      looksAdvanced,
      { kind: 'sep' },
      controlAdvanced,
      logicCategory,
      mathAdvanced,
      textAdvanced,
      variablesCategory,
    ],
  };
};

// Get output type based on class level
export const getOutputType = (classLevel: number): 'animation' | 'console' | 'both' => {
  if (classLevel <= 6) return 'animation';
  if (classLevel <= 8) return 'both';
  return 'console';
};

// Category icons for mobile drawer
export const CATEGORY_ICONS: Record<string, string> = {
  'Events': '🚀',
  'Motion': '🏃',
  'Looks': '👀',
  'Control': '🔄',
  'Logic': '🧠',
  'Math': '🔢',
  'Text': '📝',
  'Variables': '📦',
};
