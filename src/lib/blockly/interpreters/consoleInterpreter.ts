// Console Interpreter for Block-Based Coding
// Executes blocks and produces text output for higher classes (7-10)

export interface ConsoleOutput {
  type: 'log' | 'error' | 'result';
  message: string;
  timestamp: number;
}

export interface ExecutionResult {
  outputs: ConsoleOutput[];
  variables: Record<string, any>;
  success: boolean;
  error?: string;
}

export class ConsoleInterpreter {
  private outputs: ConsoleOutput[];
  private variables: Record<string, any>;
  private isRunning: boolean;
  private onOutput: (output: ConsoleOutput) => void;

  constructor(onOutput: (output: ConsoleOutput) => void) {
    this.outputs = [];
    this.variables = {};
    this.isRunning = false;
    this.onOutput = onOutput;
  }

  reset(): void {
    this.outputs = [];
    this.variables = {};
    this.isRunning = false;
  }

  stop(): void {
    this.isRunning = false;
  }

  private log(message: string): void {
    const output: ConsoleOutput = {
      type: 'log',
      message,
      timestamp: Date.now(),
    };
    this.outputs.push(output);
    this.onOutput(output);
  }

  private error(message: string): void {
    const output: ConsoleOutput = {
      type: 'error',
      message,
      timestamp: Date.now(),
    };
    this.outputs.push(output);
    this.onOutput(output);
  }

  async execute(blocks: any[]): Promise<ExecutionResult> {
    this.reset();
    this.isRunning = true;

    try {
      // Process all top-level event blocks
      for (const block of blocks) {
        if (!this.isRunning) break;

        if (block.type === 'when_start' && block.next?.block) {
          await this.processBlock(block.next.block);
        } else if (!['when_start', 'when_key_pressed'].includes(block.type)) {
          await this.processBlock(block);
        }
      }

      return {
        outputs: this.outputs,
        variables: { ...this.variables },
        success: true,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.error(errorMessage);
      return {
        outputs: this.outputs,
        variables: { ...this.variables },
        success: false,
        error: errorMessage,
      };
    }
  }

  private async processBlock(block: any): Promise<void> {
    if (!block || !this.isRunning) return;

    switch (block.type) {
      case 'print_output': {
        const value = this.evaluateValue(block.inputs?.VALUE);
        this.log(String(value));
        break;
      }

      case 'say_message': {
        const message = this.evaluateValue(block.inputs?.MESSAGE);
        this.log(`💬 ${message}`);
        break;
      }

      case 'variable_set': {
        const varName = block.fields?.VAR;
        const value = this.evaluateValue(block.inputs?.VALUE);
        if (varName) {
          this.variables[varName] = value;
        }
        break;
      }

      case 'variable_change': {
        const varName = block.fields?.VAR;
        const changeBy = this.evaluateValue(block.inputs?.VALUE) || 0;
        if (varName) {
          this.variables[varName] = (this.variables[varName] || 0) + changeBy;
        }
        break;
      }

      case 'wait_seconds': {
        const seconds = this.evaluateValue(block.inputs?.SECONDS) || 1;
        await this.delay(seconds * 1000);
        break;
      }

      case 'repeat_times': {
        const times = this.evaluateValue(block.inputs?.TIMES) || 1;
        const innerBlock = block.inputs?.DO?.block;
        
        for (let i = 0; i < Math.min(times, 1000); i++) {
          if (!this.isRunning) break;
          if (innerBlock) {
            await this.processBlock(innerBlock);
          }
        }
        break;
      }

      case 'repeat_forever': {
        const innerBlock = block.inputs?.DO?.block;
        let iterations = 0;
        const maxIterations = 100; // Safety limit
        
        while (this.isRunning && iterations < maxIterations) {
          if (innerBlock) {
            await this.processBlock(innerBlock);
          }
          iterations++;
          await this.delay(10); // Prevent blocking
        }
        
        if (iterations >= maxIterations) {
          this.log('⚠️ Loop stopped after 100 iterations');
        }
        break;
      }

      case 'if_then': {
        const condition = this.evaluateCondition(block.inputs?.CONDITION);
        if (condition) {
          const doBlock = block.inputs?.DO?.block;
          if (doBlock) {
            await this.processBlock(doBlock);
          }
        }
        break;
      }

      case 'if_then_else': {
        const condition = this.evaluateCondition(block.inputs?.CONDITION);
        if (condition) {
          const doBlock = block.inputs?.DO?.block;
          if (doBlock) {
            await this.processBlock(doBlock);
          }
        } else {
          const elseBlock = block.inputs?.ELSE?.block;
          if (elseBlock) {
            await this.processBlock(elseBlock);
          }
        }
        break;
      }

      // Motion blocks just log in console mode
      case 'move_forward':
        this.log(`🏃 Moved forward ${this.evaluateValue(block.inputs?.STEPS) || 10} steps`);
        break;

      case 'turn_right':
        this.log(`↻ Turned right ${this.evaluateValue(block.inputs?.DEGREES) || 90}°`);
        break;

      case 'turn_left':
        this.log(`↺ Turned left ${this.evaluateValue(block.inputs?.DEGREES) || 90}°`);
        break;
    }

    // Process next block
    if (block.next?.block) {
      await this.processBlock(block.next.block);
    }
  }

  private evaluateValue(value: any): any {
    if (!value) return '';
    if (typeof value === 'number' || typeof value === 'string') return value;

    if (value.block) {
      const block = value.block;
      
      switch (block.type) {
        case 'math_number':
          return block.fields?.NUM ?? 0;

        case 'text_value':
          return block.fields?.TEXT ?? '';

        case 'math_arithmetic': {
          const a = Number(this.evaluateValue(block.inputs?.A)) || 0;
          const b = Number(this.evaluateValue(block.inputs?.B)) || 0;
          switch (block.fields?.OP) {
            case 'ADD': return a + b;
            case 'MINUS': return a - b;
            case 'MULTIPLY': return a * b;
            case 'DIVIDE': return b !== 0 ? a / b : 0;
            default: return 0;
          }
        }

        case 'math_random': {
          const from = Number(this.evaluateValue(block.inputs?.FROM)) || 0;
          const to = Number(this.evaluateValue(block.inputs?.TO)) || 100;
          return Math.floor(Math.random() * (to - from + 1)) + from;
        }

        case 'text_join': {
          const a = String(this.evaluateValue(block.inputs?.A) || '');
          const b = String(this.evaluateValue(block.inputs?.B) || '');
          return a + b;
        }

        case 'variable_get':
          return this.variables[block.fields?.VAR] ?? 0;

        default:
          return 0;
      }
    }

    return '';
  }

  private evaluateCondition(condition: any): boolean {
    if (!condition?.block) return false;

    const block = condition.block;

    switch (block.type) {
      case 'compare': {
        const a = Number(this.evaluateValue(block.inputs?.A)) || 0;
        const b = Number(this.evaluateValue(block.inputs?.B)) || 0;
        switch (block.fields?.OP) {
          case 'EQ': return a === b;
          case 'NEQ': return a !== b;
          case 'LT': return a < b;
          case 'GT': return a > b;
          case 'LTE': return a <= b;
          case 'GTE': return a >= b;
          default: return false;
        }
      }

      case 'logic_and': {
        const a = this.evaluateCondition(block.inputs?.A);
        const b = this.evaluateCondition(block.inputs?.B);
        return a && b;
      }

      case 'logic_or': {
        const a = this.evaluateCondition(block.inputs?.A);
        const b = this.evaluateCondition(block.inputs?.B);
        return a || b;
      }

      case 'logic_not': {
        const value = this.evaluateCondition(block.inputs?.VALUE);
        return !value;
      }

      default:
        return Boolean(this.evaluateValue(condition));
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getOutputs(): ConsoleOutput[] {
    return [...this.outputs];
  }

  getVariables(): Record<string, any> {
    return { ...this.variables };
  }
}
