import * as Blockly from 'blockly';

// Kid-friendly color palette
const COLORS = {
  motion: '#4C97FF',      // Blue
  looks: '#9966FF',       // Purple
  sound: '#CF63CF',       // Pink
  events: '#FFBF00',      // Yellow/Gold
  control: '#FFAB19',     // Orange
  logic: '#5CB1D6',       // Cyan
  math: '#59C059',        // Green
  text: '#5CB712',        // Lime
  variables: '#FF8C1A',   // Dark Orange
  lists: '#FF661A',       // Red-Orange
};

// ==================== MOTION BLOCKS ====================
Blockly.Blocks['move_forward'] = {
  init: function() {
    this.appendValueInput('STEPS')
        .setCheck('Number')
        .appendField('Move forward');
    this.appendDummyInput()
        .appendField('steps');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.motion);
    this.setTooltip('Move the sprite forward');
  }
};

Blockly.Blocks['turn_right'] = {
  init: function() {
    this.appendValueInput('DEGREES')
        .setCheck('Number')
        .appendField('Turn right');
    this.appendDummyInput()
        .appendField('degrees');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.motion);
    this.setTooltip('Turn the sprite clockwise');
  }
};

Blockly.Blocks['turn_left'] = {
  init: function() {
    this.appendValueInput('DEGREES')
        .setCheck('Number')
        .appendField('Turn left');
    this.appendDummyInput()
        .appendField('degrees');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.motion);
    this.setTooltip('Turn the sprite counter-clockwise');
  }
};

Blockly.Blocks['go_to_position'] = {
  init: function() {
    this.appendValueInput('X')
        .setCheck('Number')
        .appendField('Go to x:');
    this.appendValueInput('Y')
        .setCheck('Number')
        .appendField('y:');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.motion);
    this.setTooltip('Move sprite to a specific position');
  }
};

Blockly.Blocks['go_to_center'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Go to center');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.motion);
    this.setTooltip('Move sprite to the center of the canvas');
  }
};

// ==================== LOOKS BLOCKS ====================
Blockly.Blocks['say_message'] = {
  init: function() {
    this.appendValueInput('MESSAGE')
        .setCheck('String')
        .appendField('Say');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.looks);
    this.setTooltip('Display a speech bubble');
  }
};

Blockly.Blocks['change_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Change color to')
        .appendField(new Blockly.FieldDropdown([
          ['red', '#FF6B6B'],
          ['blue', '#4ECDC4'],
          ['green', '#59C059'],
          ['yellow', '#FFE66D'],
          ['purple', '#9966FF'],
          ['orange', '#FF8C1A'],
          ['pink', '#FF69B4'],
        ]), 'COLOR');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.looks);
    this.setTooltip('Change the sprite color');
  }
};

Blockly.Blocks['set_size'] = {
  init: function() {
    this.appendValueInput('SIZE')
        .setCheck('Number')
        .appendField('Set size to');
    this.appendDummyInput()
        .appendField('%');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.looks);
    this.setTooltip('Change the sprite size');
  }
};

Blockly.Blocks['show_sprite'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Show');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.looks);
    this.setTooltip('Make the sprite visible');
  }
};

Blockly.Blocks['hide_sprite'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Hide');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.looks);
    this.setTooltip('Make the sprite invisible');
  }
};

// ==================== EVENTS BLOCKS ====================
Blockly.Blocks['when_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('🚀 When program starts');
    this.setNextStatement(true, null);
    this.setColour(COLORS.events);
    this.setTooltip('Run this code when the program starts');
  }
};

Blockly.Blocks['when_key_pressed'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('⌨️ When')
        .appendField(new Blockly.FieldDropdown([
          ['space', 'space'],
          ['up arrow', 'ArrowUp'],
          ['down arrow', 'ArrowDown'],
          ['left arrow', 'ArrowLeft'],
          ['right arrow', 'ArrowRight'],
          ['any key', 'any'],
        ]), 'KEY')
        .appendField('key pressed');
    this.setNextStatement(true, null);
    this.setColour(COLORS.events);
    this.setTooltip('Run this code when a key is pressed');
  }
};

// ==================== CONTROL BLOCKS ====================
Blockly.Blocks['wait_seconds'] = {
  init: function() {
    this.appendValueInput('SECONDS')
        .setCheck('Number')
        .appendField('Wait');
    this.appendDummyInput()
        .appendField('seconds');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.control);
    this.setTooltip('Pause for a number of seconds');
  }
};

Blockly.Blocks['repeat_times'] = {
  init: function() {
    this.appendValueInput('TIMES')
        .setCheck('Number')
        .appendField('Repeat');
    this.appendDummyInput()
        .appendField('times');
    this.appendStatementInput('DO')
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.control);
    this.setTooltip('Repeat the blocks inside a number of times');
  }
};

Blockly.Blocks['repeat_forever'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Repeat forever');
    this.appendStatementInput('DO')
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setColour(COLORS.control);
    this.setTooltip('Keep repeating the blocks inside forever');
  }
};

Blockly.Blocks['if_then'] = {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('If');
    this.appendDummyInput()
        .appendField('then');
    this.appendStatementInput('DO')
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.control);
    this.setTooltip('If the condition is true, do the blocks inside');
  }
};

Blockly.Blocks['if_then_else'] = {
  init: function() {
    this.appendValueInput('CONDITION')
        .setCheck('Boolean')
        .appendField('If');
    this.appendDummyInput()
        .appendField('then');
    this.appendStatementInput('DO')
        .setCheck(null);
    this.appendDummyInput()
        .appendField('else');
    this.appendStatementInput('ELSE')
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.control);
    this.setTooltip('If true, do first blocks; otherwise, do else blocks');
  }
};

// ==================== LOGIC BLOCKS ====================
Blockly.Blocks['compare'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['=', 'EQ'],
          ['≠', 'NEQ'],
          ['<', 'LT'],
          ['>', 'GT'],
          ['≤', 'LTE'],
          ['≥', 'GTE'],
        ]), 'OP');
    this.appendValueInput('B')
        .setCheck('Number');
    this.setOutput(true, 'Boolean');
    this.setColour(COLORS.logic);
    this.setTooltip('Compare two values');
  }
};

Blockly.Blocks['logic_and'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Boolean');
    this.appendDummyInput()
        .appendField('and');
    this.appendValueInput('B')
        .setCheck('Boolean');
    this.setOutput(true, 'Boolean');
    this.setColour(COLORS.logic);
    this.setTooltip('True if both conditions are true');
  }
};

Blockly.Blocks['logic_or'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Boolean');
    this.appendDummyInput()
        .appendField('or');
    this.appendValueInput('B')
        .setCheck('Boolean');
    this.setOutput(true, 'Boolean');
    this.setColour(COLORS.logic);
    this.setTooltip('True if either condition is true');
  }
};

Blockly.Blocks['logic_not'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .setCheck('Boolean')
        .appendField('not');
    this.setOutput(true, 'Boolean');
    this.setColour(COLORS.logic);
    this.setTooltip('Returns the opposite');
  }
};

// ==================== MATH BLOCKS ====================
Blockly.Blocks['math_number'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldNumber(0), 'NUM');
    this.setOutput(true, 'Number');
    this.setColour(COLORS.math);
    this.setTooltip('A number');
  }
};

Blockly.Blocks['math_arithmetic'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck('Number');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['+', 'ADD'],
          ['-', 'MINUS'],
          ['×', 'MULTIPLY'],
          ['÷', 'DIVIDE'],
        ]), 'OP');
    this.appendValueInput('B')
        .setCheck('Number');
    this.setOutput(true, 'Number');
    this.setColour(COLORS.math);
    this.setTooltip('Do math with two numbers');
  }
};

Blockly.Blocks['math_random'] = {
  init: function() {
    this.appendValueInput('FROM')
        .setCheck('Number')
        .appendField('Pick random');
    this.appendValueInput('TO')
        .setCheck('Number')
        .appendField('to');
    this.setOutput(true, 'Number');
    this.setColour(COLORS.math);
    this.setTooltip('Pick a random number between two values');
  }
};

// ==================== TEXT BLOCKS ====================
Blockly.Blocks['text_value'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('"')
        .appendField(new Blockly.FieldTextInput('Hello!'), 'TEXT')
        .appendField('"');
    this.setOutput(true, 'String');
    this.setColour(COLORS.text);
    this.setTooltip('A piece of text');
  }
};

Blockly.Blocks['text_join'] = {
  init: function() {
    this.appendValueInput('A')
        .setCheck(['String', 'Number'])
        .appendField('Join');
    this.appendValueInput('B')
        .setCheck(['String', 'Number'])
        .appendField('and');
    this.setOutput(true, 'String');
    this.setColour(COLORS.text);
    this.setTooltip('Join two pieces of text together');
  }
};

Blockly.Blocks['print_output'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .setCheck(['String', 'Number'])
        .appendField('📝 Print');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.text);
    this.setTooltip('Print a message to the console');
  }
};

// ==================== VARIABLE BLOCKS ====================
Blockly.Blocks['variable_set'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .setCheck(null)
        .appendField('Set')
        .appendField(new Blockly.FieldTextInput('my variable'), 'VAR')
        .appendField('to');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.variables);
    this.setTooltip('Set a variable to a value');
  }
};

Blockly.Blocks['variable_get'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('my variable'), 'VAR');
    this.setOutput(true, null);
    this.setColour(COLORS.variables);
    this.setTooltip('Get the value of a variable');
  }
};

Blockly.Blocks['variable_change'] = {
  init: function() {
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendField('Change')
        .appendField(new Blockly.FieldTextInput('my variable'), 'VAR')
        .appendField('by');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.variables);
    this.setTooltip('Change a variable by a number');
  }
};

// ==================== DRAWING BLOCKS ====================
Blockly.Blocks['pen_down'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('🖊️ Pen down');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.motion);
    this.setTooltip('Start drawing when moving');
  }
};

Blockly.Blocks['pen_up'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('🖊️ Pen up');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.motion);
    this.setTooltip('Stop drawing when moving');
  }
};

Blockly.Blocks['pen_color'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Set pen color to')
        .appendField(new Blockly.FieldDropdown([
          ['red', '#FF0000'],
          ['blue', '#0000FF'],
          ['green', '#00FF00'],
          ['yellow', '#FFFF00'],
          ['purple', '#9900FF'],
          ['orange', '#FF6600'],
          ['pink', '#FF69B4'],
          ['black', '#000000'],
        ]), 'COLOR');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.motion);
    this.setTooltip('Change the pen color');
  }
};

Blockly.Blocks['clear_canvas'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('🧹 Clear drawing');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(COLORS.motion);
    this.setTooltip('Clear all drawings from the canvas');
  }
};

// Export block names for toolbox configuration
export const BLOCK_COLORS = COLORS;

export const ALL_BLOCKS = {
  motion: ['move_forward', 'turn_right', 'turn_left', 'go_to_position', 'go_to_center', 'pen_down', 'pen_up', 'pen_color', 'clear_canvas'],
  looks: ['say_message', 'change_color', 'set_size', 'show_sprite', 'hide_sprite'],
  events: ['when_start', 'when_key_pressed'],
  control: ['wait_seconds', 'repeat_times', 'repeat_forever', 'if_then', 'if_then_else'],
  logic: ['compare', 'logic_and', 'logic_or', 'logic_not'],
  math: ['math_number', 'math_arithmetic', 'math_random'],
  text: ['text_value', 'text_join', 'print_output'],
  variables: ['variable_set', 'variable_get', 'variable_change'],
};
