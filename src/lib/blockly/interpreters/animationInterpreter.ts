// Animation Interpreter for Block-Based Coding
// Executes blocks and renders visual output on canvas

export interface SpriteState {
  x: number;
  y: number;
  direction: number; // degrees, 0 = right, 90 = down
  color: string;
  size: number;
  visible: boolean;
  penDown: boolean;
  penColor: string;
  message: string | null;
}

export interface CanvasState {
  drawings: DrawCommand[];
  messages: MessageCommand[];
}

interface DrawCommand {
  type: 'line';
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
  width: number;
}

interface MessageCommand {
  text: string;
  x: number;
  y: number;
  timestamp: number;
}

export type AnimationCommand =
  | { type: 'move_forward'; steps: number }
  | { type: 'turn_right'; degrees: number }
  | { type: 'turn_left'; degrees: number }
  | { type: 'go_to'; x: number; y: number }
  | { type: 'go_to_center' }
  | { type: 'say'; message: string }
  | { type: 'change_color'; color: string }
  | { type: 'set_size'; size: number }
  | { type: 'show' }
  | { type: 'hide' }
  | { type: 'pen_down' }
  | { type: 'pen_up' }
  | { type: 'pen_color'; color: string }
  | { type: 'clear' }
  | { type: 'wait'; seconds: number };

const DEFAULT_SPRITE: SpriteState = {
  x: 200,
  y: 200,
  direction: 0,
  color: '#4ECDC4',
  size: 100,
  visible: true,
  penDown: false,
  penColor: '#FF6B6B',
  message: null,
};

export class AnimationInterpreter {
  private sprite: SpriteState;
  private canvas: CanvasState;
  private canvasWidth: number;
  private canvasHeight: number;
  private executionQueue: AnimationCommand[];
  private isRunning: boolean;
  private onUpdate: (sprite: SpriteState, canvas: CanvasState) => void;
  private animationSpeed: number;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    onUpdate: (sprite: SpriteState, canvas: CanvasState) => void,
    animationSpeed: number = 100
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.onUpdate = onUpdate;
    this.animationSpeed = animationSpeed;
    this.sprite = { ...DEFAULT_SPRITE, x: canvasWidth / 2, y: canvasHeight / 2 };
    this.canvas = { drawings: [], messages: [] };
    this.executionQueue = [];
    this.isRunning = false;
  }

  reset(): void {
    this.sprite = { ...DEFAULT_SPRITE, x: this.canvasWidth / 2, y: this.canvasHeight / 2 };
    this.canvas = { drawings: [], messages: [] };
    this.executionQueue = [];
    this.isRunning = false;
    this.onUpdate(this.sprite, this.canvas);
  }

  stop(): void {
    this.isRunning = false;
    this.executionQueue = [];
  }

  async execute(commands: AnimationCommand[]): Promise<void> {
    this.executionQueue = [...commands];
    this.isRunning = true;

    while (this.executionQueue.length > 0 && this.isRunning) {
      const command = this.executionQueue.shift()!;
      await this.executeCommand(command);
    }

    this.isRunning = false;
  }

  private async executeCommand(command: AnimationCommand): Promise<void> {
    const oldX = this.sprite.x;
    const oldY = this.sprite.y;

    switch (command.type) {
      case 'move_forward': {
        const radians = (this.sprite.direction * Math.PI) / 180;
        this.sprite.x += Math.cos(radians) * command.steps;
        this.sprite.y += Math.sin(radians) * command.steps;
        
        // Wrap around screen
        this.sprite.x = ((this.sprite.x % this.canvasWidth) + this.canvasWidth) % this.canvasWidth;
        this.sprite.y = ((this.sprite.y % this.canvasHeight) + this.canvasHeight) % this.canvasHeight;

        if (this.sprite.penDown) {
          this.canvas.drawings.push({
            type: 'line',
            fromX: oldX,
            fromY: oldY,
            toX: this.sprite.x,
            toY: this.sprite.y,
            color: this.sprite.penColor,
            width: 3,
          });
        }
        break;
      }

      case 'turn_right':
        this.sprite.direction = (this.sprite.direction + command.degrees) % 360;
        break;

      case 'turn_left':
        this.sprite.direction = (this.sprite.direction - command.degrees + 360) % 360;
        break;

      case 'go_to':
        if (this.sprite.penDown) {
          this.canvas.drawings.push({
            type: 'line',
            fromX: oldX,
            fromY: oldY,
            toX: command.x,
            toY: command.y,
            color: this.sprite.penColor,
            width: 3,
          });
        }
        this.sprite.x = command.x;
        this.sprite.y = command.y;
        break;

      case 'go_to_center':
        if (this.sprite.penDown) {
          this.canvas.drawings.push({
            type: 'line',
            fromX: oldX,
            fromY: oldY,
            toX: this.canvasWidth / 2,
            toY: this.canvasHeight / 2,
            color: this.sprite.penColor,
            width: 3,
          });
        }
        this.sprite.x = this.canvasWidth / 2;
        this.sprite.y = this.canvasHeight / 2;
        break;

      case 'say':
        this.sprite.message = command.message;
        this.canvas.messages.push({
          text: command.message,
          x: this.sprite.x,
          y: this.sprite.y - 50,
          timestamp: Date.now(),
        });
        break;

      case 'change_color':
        this.sprite.color = command.color;
        break;

      case 'set_size':
        this.sprite.size = Math.max(10, Math.min(500, command.size));
        break;

      case 'show':
        this.sprite.visible = true;
        break;

      case 'hide':
        this.sprite.visible = false;
        break;

      case 'pen_down':
        this.sprite.penDown = true;
        break;

      case 'pen_up':
        this.sprite.penDown = false;
        break;

      case 'pen_color':
        this.sprite.penColor = command.color;
        break;

      case 'clear':
        this.canvas.drawings = [];
        this.canvas.messages = [];
        break;

      case 'wait':
        await this.delay(command.seconds * 1000);
        return;
    }

    this.onUpdate(this.sprite, this.canvas);
    await this.delay(this.animationSpeed);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getState(): { sprite: SpriteState; canvas: CanvasState } {
    return { sprite: { ...this.sprite }, canvas: { ...this.canvas } };
  }
}

// Parse Blockly workspace XML/JSON to animation commands
export function parseBlocksToCommands(blocks: any[], variables: Record<string, any> = {}): AnimationCommand[] {
  const commands: AnimationCommand[] = [];

  const evaluateValue = (value: any): any => {
    if (!value) return 0;
    if (typeof value === 'number' || typeof value === 'string') return value;
    
    if (value.block) {
      const block = value.block;
      switch (block.type) {
        case 'math_number':
          return block.fields?.NUM ?? 0;
        case 'text_value':
          return block.fields?.TEXT ?? '';
        case 'math_arithmetic': {
          const a = evaluateValue(block.inputs?.A);
          const b = evaluateValue(block.inputs?.B);
          switch (block.fields?.OP) {
            case 'ADD': return a + b;
            case 'MINUS': return a - b;
            case 'MULTIPLY': return a * b;
            case 'DIVIDE': return b !== 0 ? a / b : 0;
            default: return 0;
          }
        }
        case 'math_random': {
          const from = evaluateValue(block.inputs?.FROM) || 0;
          const to = evaluateValue(block.inputs?.TO) || 100;
          return Math.floor(Math.random() * (to - from + 1)) + from;
        }
        case 'variable_get':
          return variables[block.fields?.VAR] ?? 0;
        default:
          return 0;
      }
    }
    
    return 0;
  };

  const processBlock = (block: any): void => {
    if (!block) return;

    switch (block.type) {
      case 'move_forward':
        commands.push({ type: 'move_forward', steps: evaluateValue(block.inputs?.STEPS) || 10 });
        break;

      case 'turn_right':
        commands.push({ type: 'turn_right', degrees: evaluateValue(block.inputs?.DEGREES) || 90 });
        break;

      case 'turn_left':
        commands.push({ type: 'turn_left', degrees: evaluateValue(block.inputs?.DEGREES) || 90 });
        break;

      case 'go_to_position':
        commands.push({
          type: 'go_to',
          x: evaluateValue(block.inputs?.X) || 0,
          y: evaluateValue(block.inputs?.Y) || 0,
        });
        break;

      case 'go_to_center':
        commands.push({ type: 'go_to_center' });
        break;

      case 'say_message':
        commands.push({ type: 'say', message: String(evaluateValue(block.inputs?.MESSAGE) || 'Hello!') });
        break;

      case 'change_color':
        commands.push({ type: 'change_color', color: block.fields?.COLOR || '#4ECDC4' });
        break;

      case 'set_size':
        commands.push({ type: 'set_size', size: evaluateValue(block.inputs?.SIZE) || 100 });
        break;

      case 'show_sprite':
        commands.push({ type: 'show' });
        break;

      case 'hide_sprite':
        commands.push({ type: 'hide' });
        break;

      case 'pen_down':
        commands.push({ type: 'pen_down' });
        break;

      case 'pen_up':
        commands.push({ type: 'pen_up' });
        break;

      case 'pen_color':
        commands.push({ type: 'pen_color', color: block.fields?.COLOR || '#FF0000' });
        break;

      case 'clear_canvas':
        commands.push({ type: 'clear' });
        break;

      case 'wait_seconds':
        commands.push({ type: 'wait', seconds: evaluateValue(block.inputs?.SECONDS) || 1 });
        break;

      case 'repeat_times': {
        const times = evaluateValue(block.inputs?.TIMES) || 1;
        const innerBlocks = block.inputs?.DO?.block;
        for (let i = 0; i < times; i++) {
          if (innerBlocks) {
            processBlock(innerBlocks);
          }
        }
        break;
      }

      case 'variable_set': {
        const varName = block.fields?.VAR;
        const value = evaluateValue(block.inputs?.VALUE);
        if (varName) {
          variables[varName] = value;
        }
        break;
      }

      case 'variable_change': {
        const varName = block.fields?.VAR;
        const changeBy = evaluateValue(block.inputs?.VALUE) || 0;
        if (varName) {
          variables[varName] = (variables[varName] || 0) + changeBy;
        }
        break;
      }
    }

    // Process next block in sequence
    if (block.next?.block) {
      processBlock(block.next.block);
    }
  };

  // Process top-level blocks
  blocks.forEach(block => {
    if (block.type === 'when_start' && block.next?.block) {
      processBlock(block.next.block);
    } else {
      processBlock(block);
    }
  });

  return commands;
}
