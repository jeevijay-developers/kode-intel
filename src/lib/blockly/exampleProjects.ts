// Class-wise example projects for self-paced learning
// Each class has 5 examples with increasing difficulty

export interface ExampleProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  objective: string;
  hints: string[];
  blocksXml: string;
}

export interface ClassExamples {
  classLevel: number;
  examples: ExampleProject[];
}

export const exampleProjects: ClassExamples[] = [
  // CLASS 3 - Very simple, fun examples
  {
    classLevel: 3,
    examples: [
      {
        id: 'class3-hello',
        title: '👋 Say Hello',
        description: 'Make your sprite greet you!',
        difficulty: 'easy',
        xpReward: 10,
        objective: 'Make the sprite say "Hello, World!"',
        hints: [
          'Look for the "Say" block in the purple Looks section',
          'Type your message in the text block',
          'Connect it to "When program starts"'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="say_message">
                <value name="MESSAGE">
                  <block type="text_value">
                    <field name="TEXT">Hello, World!</field>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class3-walk',
        title: '🚶 Walk Forward',
        description: 'Make your sprite take steps!',
        difficulty: 'easy',
        xpReward: 15,
        objective: 'Make the sprite move forward 50 steps',
        hints: [
          'Find the "Move forward" block in blue Motion section',
          'Change the number to 50',
          'Click Run to see it move!'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="move_forward">
                <value name="STEPS">
                  <block type="math_number">
                    <field name="NUM">50</field>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class3-dance',
        title: '💃 Dance Move',
        description: 'Turn and move in a fun pattern!',
        difficulty: 'easy',
        xpReward: 20,
        objective: 'Make the sprite turn and move twice',
        hints: [
          'Use "Move forward" to go forward',
          'Use "Turn right" to spin',
          'Put them one after another!'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="move_forward">
                <value name="STEPS">
                  <block type="math_number">
                    <field name="NUM">30</field>
                  </block>
                </value>
                <next>
                  <block type="turn_right">
                    <value name="DEGREES">
                      <block type="math_number">
                        <field name="NUM">90</field>
                      </block>
                    </value>
                    <next>
                      <block type="move_forward">
                        <value name="STEPS">
                          <block type="math_number">
                            <field name="NUM">30</field>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class3-square',
        title: '⬜ Draw a Square',
        description: 'Use a loop to draw a square!',
        difficulty: 'medium',
        xpReward: 30,
        objective: 'Draw a square by repeating move and turn 4 times',
        hints: [
          'A square has 4 sides',
          'Use "Repeat" block to do something 4 times',
          'Inside repeat: move forward, then turn 90 degrees'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="pen_down">
                <next>
                  <block type="repeat_times">
                    <value name="TIMES">
                      <block type="math_number">
                        <field name="NUM">4</field>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="move_forward">
                        <value name="STEPS">
                          <block type="math_number">
                            <field name="NUM">60</field>
                          </block>
                        </value>
                        <next>
                          <block type="turn_right">
                            <value name="DEGREES">
                              <block type="math_number">
                                <field name="NUM">90</field>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class3-colorful',
        title: '🌈 Colorful Sprite',
        description: 'Change your sprite colors!',
        difficulty: 'medium',
        xpReward: 25,
        objective: 'Change the sprite color and make it say something',
        hints: [
          'Use "Change color to" from Looks',
          'Pick your favorite color',
          'Add "Say" block after it'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="change_color">
                <field name="COLOR">#FF6B6B</field>
                <next>
                  <block type="say_message">
                    <value name="MESSAGE">
                      <block type="text_value">
                        <field name="TEXT">I love my new color!</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      }
    ]
  },
  // CLASS 4 - Building on basics
  {
    classLevel: 4,
    examples: [
      {
        id: 'class4-triangle',
        title: '🔺 Draw a Triangle',
        description: 'Learn about angles with triangles!',
        difficulty: 'easy',
        xpReward: 20,
        objective: 'Draw a triangle using repeat and turn 120 degrees',
        hints: [
          'A triangle has 3 sides',
          'The turn angle for a triangle is 120 degrees',
          'Use repeat 3 times'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="pen_down">
                <next>
                  <block type="repeat_times">
                    <value name="TIMES">
                      <block type="math_number">
                        <field name="NUM">3</field>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="move_forward">
                        <value name="STEPS">
                          <block type="math_number">
                            <field name="NUM">80</field>
                          </block>
                        </value>
                        <next>
                          <block type="turn_right">
                            <value name="DEGREES">
                              <block type="math_number">
                                <field name="NUM">120</field>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class4-greeting',
        title: '💬 Personalized Greeting',
        description: 'Join text together!',
        difficulty: 'easy',
        xpReward: 25,
        objective: 'Make the sprite say "Hello" + your name',
        hints: [
          'Use the "Join" block from Text',
          'Put "Hello, " in the first part',
          'Put your name in the second part'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="say_message">
                <value name="MESSAGE">
                  <block type="text_join">
                    <value name="A">
                      <block type="text_value">
                        <field name="TEXT">Hello, </field>
                      </block>
                    </value>
                    <value name="B">
                      <block type="text_value">
                        <field name="TEXT">Friend!</field>
                      </block>
                    </value>
                  </block>
                </value>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class4-rainbow',
        title: '🌈 Rainbow Line',
        description: 'Draw with different colors!',
        difficulty: 'medium',
        xpReward: 35,
        objective: 'Draw lines in 3 different colors',
        hints: [
          'Change pen color before drawing',
          'Move forward to draw',
          'Repeat with different colors'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="pen_down">
                <next>
                  <block type="pen_color">
                    <field name="COLOR">#FF0000</field>
                    <next>
                      <block type="move_forward">
                        <value name="STEPS">
                          <block type="math_number">
                            <field name="NUM">40</field>
                          </block>
                        </value>
                        <next>
                          <block type="pen_color">
                            <field name="COLOR">#00FF00</field>
                            <next>
                              <block type="move_forward">
                                <value name="STEPS">
                                  <block type="math_number">
                                    <field name="NUM">40</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="pen_color">
                                    <field name="COLOR">#0000FF</field>
                                    <next>
                                      <block type="move_forward">
                                        <value name="STEPS">
                                          <block type="math_number">
                                            <field name="NUM">40</field>
                                          </block>
                                        </value>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class4-star',
        title: '⭐ Draw a Star',
        description: 'Create a 5-pointed star!',
        difficulty: 'hard',
        xpReward: 50,
        objective: 'Draw a star by repeating 5 times with 144 degree turns',
        hints: [
          'A star has 5 points',
          'Turn 144 degrees after each line',
          'Use repeat 5 times'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="pen_down">
                <next>
                  <block type="pen_color">
                    <field name="COLOR">#FFFF00</field>
                    <next>
                      <block type="repeat_times">
                        <value name="TIMES">
                          <block type="math_number">
                            <field name="NUM">5</field>
                          </block>
                        </value>
                        <statement name="DO">
                          <block type="move_forward">
                            <value name="STEPS">
                              <block type="math_number">
                                <field name="NUM">80</field>
                              </block>
                            </value>
                            <next>
                              <block type="turn_right">
                                <value name="DEGREES">
                                  <block type="math_number">
                                    <field name="NUM">144</field>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class4-animation',
        title: '🎬 Simple Animation',
        description: 'Make your sprite dance with waits!',
        difficulty: 'medium',
        xpReward: 40,
        objective: 'Create a simple animation with moves and waits',
        hints: [
          'Use "Wait" blocks between actions',
          'Change color and move in sequence',
          'Watch the animation play!'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="change_color">
                <field name="COLOR">#FF6B6B</field>
                <next>
                  <block type="move_forward">
                    <value name="STEPS">
                      <block type="math_number">
                        <field name="NUM">30</field>
                      </block>
                    </value>
                    <next>
                      <block type="wait_seconds">
                        <value name="SECONDS">
                          <block type="math_number">
                            <field name="NUM">1</field>
                          </block>
                        </value>
                        <next>
                          <block type="change_color">
                            <field name="COLOR">#4ECDC4</field>
                            <next>
                              <block type="turn_right">
                                <value name="DEGREES">
                                  <block type="math_number">
                                    <field name="NUM">90</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="move_forward">
                                    <value name="STEPS">
                                      <block type="math_number">
                                        <field name="NUM">30</field>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      }
    ]
  },
  // CLASS 5 - Introducing variables and conditions
  {
    classLevel: 5,
    examples: [
      {
        id: 'class5-counting',
        title: '🔢 Counting Machine',
        description: 'Use variables to count!',
        difficulty: 'easy',
        xpReward: 25,
        objective: 'Create a counter that prints 1, 2, 3, 4, 5',
        hints: [
          'Set a variable called "count" to 0',
          'Use repeat 5 times',
          'Change count by 1 and print it each time'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">count</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">0</field>
                  </block>
                </value>
                <next>
                  <block type="repeat_times">
                    <value name="TIMES">
                      <block type="math_number">
                        <field name="NUM">5</field>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="variable_change">
                        <field name="VAR">count</field>
                        <value name="VALUE">
                          <block type="math_number">
                            <field name="NUM">1</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="variable_get">
                                <field name="VAR">count</field>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class5-hexagon',
        title: '⬡ Draw a Hexagon',
        description: 'Use math to draw 6-sided shapes!',
        difficulty: 'easy',
        xpReward: 30,
        objective: 'Draw a hexagon (360 ÷ 6 = 60 degree turns)',
        hints: [
          'A hexagon has 6 sides',
          '360 divided by 6 is 60 degrees',
          'Use repeat 6 times'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="pen_down">
                <next>
                  <block type="repeat_times">
                    <value name="TIMES">
                      <block type="math_number">
                        <field name="NUM">6</field>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="move_forward">
                        <value name="STEPS">
                          <block type="math_number">
                            <field name="NUM">50</field>
                          </block>
                        </value>
                        <next>
                          <block type="turn_right">
                            <value name="DEGREES">
                              <block type="math_number">
                                <field name="NUM">60</field>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class5-conditions',
        title: '🚦 Traffic Light',
        description: 'Use If-Then to make decisions!',
        difficulty: 'medium',
        xpReward: 40,
        objective: 'Check a number and print different messages',
        hints: [
          'Set a variable for the light color number',
          'Use If-Then to check the value',
          'Print "Go" if value equals 1'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">light</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">1</field>
                  </block>
                </value>
                <next>
                  <block type="if_then_else">
                    <value name="CONDITION">
                      <block type="compare">
                        <value name="A">
                          <block type="variable_get">
                            <field name="VAR">light</field>
                          </block>
                        </value>
                        <field name="OP">EQ</field>
                        <value name="B">
                          <block type="math_number">
                            <field name="NUM">1</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">🟢 Go!</field>
                          </block>
                        </value>
                      </block>
                    </statement>
                    <statement name="ELSE">
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">🔴 Stop!</field>
                          </block>
                        </value>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class5-spiral',
        title: '🌀 Spiral Pattern',
        description: 'Use variables to grow patterns!',
        difficulty: 'hard',
        xpReward: 60,
        objective: 'Draw a spiral by increasing move distance each time',
        hints: [
          'Create a "size" variable starting at 10',
          'Move forward by the size variable',
          'Turn 90 degrees and increase size by 5'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="pen_down">
                <next>
                  <block type="variable_set">
                    <field name="VAR">size</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">10</field>
                      </block>
                    </value>
                    <next>
                      <block type="repeat_times">
                        <value name="TIMES">
                          <block type="math_number">
                            <field name="NUM">12</field>
                          </block>
                        </value>
                        <statement name="DO">
                          <block type="move_forward">
                            <value name="STEPS">
                              <block type="variable_get">
                                <field name="VAR">size</field>
                              </block>
                            </value>
                            <next>
                              <block type="turn_right">
                                <value name="DEGREES">
                                  <block type="math_number">
                                    <field name="NUM">90</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="variable_change">
                                    <field name="VAR">size</field>
                                    <value name="VALUE">
                                      <block type="math_number">
                                        <field name="NUM">5</field>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class5-random',
        title: '🎲 Random Walk',
        description: 'Use random numbers for fun!',
        difficulty: 'medium',
        xpReward: 45,
        objective: 'Move randomly in different directions',
        hints: [
          'Use "Pick random" to get random steps',
          'Use random for turn degrees too',
          'Repeat multiple times for a fun path'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="pen_down">
                <next>
                  <block type="repeat_times">
                    <value name="TIMES">
                      <block type="math_number">
                        <field name="NUM">10</field>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="move_forward">
                        <value name="STEPS">
                          <block type="math_random">
                            <value name="FROM">
                              <block type="math_number">
                                <field name="NUM">10</field>
                              </block>
                            </value>
                            <value name="TO">
                              <block type="math_number">
                                <field name="NUM">30</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="turn_right">
                            <value name="DEGREES">
                              <block type="math_random">
                                <value name="FROM">
                                  <block type="math_number">
                                    <field name="NUM">20</field>
                                  </block>
                                </value>
                                <value name="TO">
                                  <block type="math_number">
                                    <field name="NUM">160</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </statement>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      }
    ]
  },
  // CLASS 6 - More complex logic
  {
    classLevel: 6,
    examples: [
      {
        id: 'class6-calculator',
        title: '🧮 Simple Calculator',
        description: 'Do math and show results!',
        difficulty: 'easy',
        xpReward: 30,
        objective: 'Add two numbers and print the result',
        hints: [
          'Set two variables for your numbers',
          'Use the math "+" block to add them',
          'Print the result'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">num1</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">15</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">num2</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">25</field>
                      </block>
                    </value>
                    <next>
                      <block type="variable_set">
                        <field name="VAR">result</field>
                        <value name="VALUE">
                          <block type="math_arithmetic">
                            <value name="A">
                              <block type="variable_get">
                                <field name="VAR">num1</field>
                              </block>
                            </value>
                            <field name="OP">ADD</field>
                            <value name="B">
                              <block type="variable_get">
                                <field name="VAR">num2</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_join">
                                <value name="A">
                                  <block type="text_value">
                                    <field name="TEXT">Result: </field>
                                  </block>
                                </value>
                                <value name="B">
                                  <block type="variable_get">
                                    <field name="VAR">result</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class6-evenodd',
        title: '🔢 Even or Odd?',
        description: 'Check if a number is even or odd!',
        difficulty: 'medium',
        xpReward: 40,
        objective: 'Use modulo concept to check even/odd',
        hints: [
          'An even number divided by 2 has no remainder',
          'Check if number × 0.5 equals its floor value',
          'Use If-Then-Else for the result'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">number</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">7</field>
                  </block>
                </value>
                <next>
                  <block type="print_output">
                    <value name="VALUE">
                      <block type="text_join">
                        <value name="A">
                          <block type="text_value">
                            <field name="TEXT">Checking: </field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="variable_get">
                            <field name="VAR">number</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="if_then_else">
                        <value name="CONDITION">
                          <block type="compare">
                            <value name="A">
                              <block type="math_arithmetic">
                                <value name="A">
                                  <block type="variable_get">
                                    <field name="VAR">number</field>
                                  </block>
                                </value>
                                <field name="OP">MINUS</field>
                                <value name="B">
                                  <block type="math_arithmetic">
                                    <value name="A">
                                      <block type="math_arithmetic">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">number</field>
                                          </block>
                                        </value>
                                        <field name="OP">DIVIDE</field>
                                        <value name="B">
                                          <block type="math_number">
                                            <field name="NUM">2</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                    <field name="OP">MULTIPLY</field>
                                    <value name="B">
                                      <block type="math_number">
                                        <field name="NUM">2</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <field name="OP">EQ</field>
                            <value name="B">
                              <block type="math_number">
                                <field name="NUM">0</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <statement name="DO">
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">It's EVEN! ✓</field>
                              </block>
                            </value>
                          </block>
                        </statement>
                        <statement name="ELSE">
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">It's ODD!</field>
                              </block>
                            </value>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class6-countdown',
        title: '⏰ Countdown Timer',
        description: 'Create a countdown from 10!',
        difficulty: 'easy',
        xpReward: 35,
        objective: 'Count down from 10 to 1, then print "Blast off!"',
        hints: [
          'Start with counter = 10',
          'Repeat 10 times',
          'Print counter, then subtract 1'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">counter</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">10</field>
                  </block>
                </value>
                <next>
                  <block type="repeat_times">
                    <value name="TIMES">
                      <block type="math_number">
                        <field name="NUM">10</field>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="variable_get">
                            <field name="VAR">counter</field>
                          </block>
                        </value>
                        <next>
                          <block type="variable_change">
                            <field name="VAR">counter</field>
                            <value name="VALUE">
                              <block type="math_number">
                                <field name="NUM">-1</field>
                              </block>
                            </value>
                            <next>
                              <block type="wait_seconds">
                                <value name="SECONDS">
                                  <block type="math_number">
                                    <field name="NUM">0.5</field>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </statement>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">🚀 Blast off!</field>
                          </block>
                        </value>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class6-multiplication',
        title: '✖️ Times Table',
        description: 'Generate a multiplication table!',
        difficulty: 'medium',
        xpReward: 50,
        objective: 'Print the 5 times table from 1 to 10',
        hints: [
          'Set a variable for the table number (5)',
          'Use repeat 10 times with a counter',
          'Multiply and print each result'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">table</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">5</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">i</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">1</field>
                      </block>
                    </value>
                    <next>
                      <block type="repeat_times">
                        <value name="TIMES">
                          <block type="math_number">
                            <field name="NUM">10</field>
                          </block>
                        </value>
                        <statement name="DO">
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_join">
                                <value name="A">
                                  <block type="text_join">
                                    <value name="A">
                                      <block type="variable_get">
                                        <field name="VAR">table</field>
                                      </block>
                                    </value>
                                    <value name="B">
                                      <block type="text_join">
                                        <value name="A">
                                          <block type="text_value">
                                            <field name="TEXT"> × </field>
                                          </block>
                                        </value>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">i</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <value name="B">
                                  <block type="text_join">
                                    <value name="A">
                                      <block type="text_value">
                                        <field name="TEXT"> = </field>
                                      </block>
                                    </value>
                                    <value name="B">
                                      <block type="math_arithmetic">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">table</field>
                                          </block>
                                        </value>
                                        <field name="OP">MULTIPLY</field>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">i</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <next>
                              <block type="variable_change">
                                <field name="VAR">i</field>
                                <value name="VALUE">
                                  <block type="math_number">
                                    <field name="NUM">1</field>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class6-polygon',
        title: '🔷 Any Polygon',
        description: 'Draw any regular polygon!',
        difficulty: 'hard',
        xpReward: 60,
        objective: 'Use a variable for sides to draw any shape',
        hints: [
          'Set a "sides" variable (try 8 for octagon)',
          'Turn angle = 360 / sides',
          'Repeat "sides" times'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">sides</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">8</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">angle</field>
                    <value name="VALUE">
                      <block type="math_arithmetic">
                        <value name="A">
                          <block type="math_number">
                            <field name="NUM">360</field>
                          </block>
                        </value>
                        <field name="OP">DIVIDE</field>
                        <value name="B">
                          <block type="variable_get">
                            <field name="VAR">sides</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="pen_down">
                        <next>
                          <block type="repeat_times">
                            <value name="TIMES">
                              <block type="variable_get">
                                <field name="VAR">sides</field>
                              </block>
                            </value>
                            <statement name="DO">
                              <block type="move_forward">
                                <value name="STEPS">
                                  <block type="math_number">
                                    <field name="NUM">40</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="turn_right">
                                    <value name="DEGREES">
                                      <block type="variable_get">
                                        <field name="VAR">angle</field>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </statement>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      }
    ]
  },
  // CLASS 7 - Console focus, debugging
  {
    classLevel: 7,
    examples: [
      {
        id: 'class7-fibonacci',
        title: '🐚 Fibonacci Sequence',
        description: 'Generate the famous number sequence!',
        difficulty: 'medium',
        xpReward: 50,
        objective: 'Print first 10 Fibonacci numbers',
        hints: [
          'Start with a=0, b=1',
          'Each new number is a+b',
          'Shift values: a becomes b, b becomes new number'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="print_output">
                <value name="VALUE">
                  <block type="text_value">
                    <field name="TEXT">Fibonacci Sequence:</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">a</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">0</field>
                      </block>
                    </value>
                    <next>
                      <block type="variable_set">
                        <field name="VAR">b</field>
                        <value name="VALUE">
                          <block type="math_number">
                            <field name="NUM">1</field>
                          </block>
                        </value>
                        <next>
                          <block type="repeat_times">
                            <value name="TIMES">
                              <block type="math_number">
                                <field name="NUM">10</field>
                              </block>
                            </value>
                            <statement name="DO">
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="variable_get">
                                    <field name="VAR">a</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="variable_set">
                                    <field name="VAR">temp</field>
                                    <value name="VALUE">
                                      <block type="math_arithmetic">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">a</field>
                                          </block>
                                        </value>
                                        <field name="OP">ADD</field>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">b</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                    <next>
                                      <block type="variable_set">
                                        <field name="VAR">a</field>
                                        <value name="VALUE">
                                          <block type="variable_get">
                                            <field name="VAR">b</field>
                                          </block>
                                        </value>
                                        <next>
                                          <block type="variable_set">
                                            <field name="VAR">b</field>
                                            <value name="VALUE">
                                              <block type="variable_get">
                                                <field name="VAR">temp</field>
                                              </block>
                                            </value>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </statement>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class7-factorial',
        title: '❗ Factorial Calculator',
        description: 'Calculate n! (n factorial)',
        difficulty: 'medium',
        xpReward: 55,
        objective: 'Calculate factorial of 5 (5! = 120)',
        hints: [
          'Factorial means multiply all numbers from 1 to n',
          'Start result at 1',
          'Multiply result by each number up to n'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">n</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">5</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">result</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">1</field>
                      </block>
                    </value>
                    <next>
                      <block type="variable_set">
                        <field name="VAR">i</field>
                        <value name="VALUE">
                          <block type="math_number">
                            <field name="NUM">1</field>
                          </block>
                        </value>
                        <next>
                          <block type="repeat_times">
                            <value name="TIMES">
                              <block type="variable_get">
                                <field name="VAR">n</field>
                              </block>
                            </value>
                            <statement name="DO">
                              <block type="variable_set">
                                <field name="VAR">result</field>
                                <value name="VALUE">
                                  <block type="math_arithmetic">
                                    <value name="A">
                                      <block type="variable_get">
                                        <field name="VAR">result</field>
                                      </block>
                                    </value>
                                    <field name="OP">MULTIPLY</field>
                                    <value name="B">
                                      <block type="variable_get">
                                        <field name="VAR">i</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <next>
                                  <block type="variable_change">
                                    <field name="VAR">i</field>
                                    <value name="VALUE">
                                      <block type="math_number">
                                        <field name="NUM">1</field>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </statement>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_join">
                                    <value name="A">
                                      <block type="text_join">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">n</field>
                                          </block>
                                        </value>
                                        <value name="B">
                                          <block type="text_value">
                                            <field name="TEXT">! = </field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                    <value name="B">
                                      <block type="variable_get">
                                        <field name="VAR">result</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class7-sumdigits',
        title: '➕ Sum of Digits',
        description: 'Add up all digits of a number!',
        difficulty: 'hard',
        xpReward: 70,
        objective: 'Find sum of digits in 1234 (should be 10)',
        hints: [
          'Use modulo (remainder) to get last digit',
          'Divide by 10 to remove last digit',
          'Keep going while number > 0'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">number</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">1234</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">original</field>
                    <value name="VALUE">
                      <block type="variable_get">
                        <field name="VAR">number</field>
                      </block>
                    </value>
                    <next>
                      <block type="variable_set">
                        <field name="VAR">sum</field>
                        <value name="VALUE">
                          <block type="math_number">
                            <field name="NUM">0</field>
                          </block>
                        </value>
                        <next>
                          <block type="repeat_times">
                            <value name="TIMES">
                              <block type="math_number">
                                <field name="NUM">4</field>
                              </block>
                            </value>
                            <statement name="DO">
                              <block type="variable_change">
                                <field name="VAR">sum</field>
                                <value name="VALUE">
                                  <block type="math_arithmetic">
                                    <value name="A">
                                      <block type="variable_get">
                                        <field name="VAR">number</field>
                                      </block>
                                    </value>
                                    <field name="OP">MINUS</field>
                                    <value name="B">
                                      <block type="math_arithmetic">
                                        <value name="A">
                                          <block type="math_arithmetic">
                                            <value name="A">
                                              <block type="variable_get">
                                                <field name="VAR">number</field>
                                              </block>
                                            </value>
                                            <field name="OP">DIVIDE</field>
                                            <value name="B">
                                              <block type="math_number">
                                                <field name="NUM">10</field>
                                              </block>
                                            </value>
                                          </block>
                                        </value>
                                        <field name="OP">MULTIPLY</field>
                                        <value name="B">
                                          <block type="math_number">
                                            <field name="NUM">10</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <next>
                                  <block type="variable_set">
                                    <field name="VAR">number</field>
                                    <value name="VALUE">
                                      <block type="math_arithmetic">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">number</field>
                                          </block>
                                        </value>
                                        <field name="OP">DIVIDE</field>
                                        <value name="B">
                                          <block type="math_number">
                                            <field name="NUM">10</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </statement>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_join">
                                    <value name="A">
                                      <block type="text_join">
                                        <value name="A">
                                          <block type="text_value">
                                            <field name="TEXT">Sum of digits in </field>
                                          </block>
                                        </value>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">original</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                    <value name="B">
                                      <block type="text_join">
                                        <value name="A">
                                          <block type="text_value">
                                            <field name="TEXT"> = </field>
                                          </block>
                                        </value>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">sum</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class7-pattern',
        title: '📐 Number Pattern',
        description: 'Print a triangle pattern!',
        difficulty: 'medium',
        xpReward: 45,
        objective: 'Print: 1, 12, 123, 1234, 12345',
        hints: [
          'Use nested thinking: for each row, print numbers',
          'Build a string for each row',
          'Add one more number each row'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="print_output">
                <value name="VALUE">
                  <block type="text_value">
                    <field name="TEXT">Number Triangle:</field>
                  </block>
                </value>
                <next>
                  <block type="print_output">
                    <value name="VALUE">
                      <block type="text_value">
                        <field name="TEXT">1</field>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">1 2</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">1 2 3</field>
                              </block>
                            </value>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_value">
                                    <field name="TEXT">1 2 3 4</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="print_output">
                                    <value name="VALUE">
                                      <block type="text_value">
                                        <field name="TEXT">1 2 3 4 5</field>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class7-reverse',
        title: '🔄 Reverse Number',
        description: 'Reverse the digits of a number!',
        difficulty: 'hard',
        xpReward: 65,
        objective: 'Reverse 1234 to get 4321',
        hints: [
          'Extract last digit with modulo',
          'Build reverse by multiplying by 10 and adding digit',
          'Remove last digit from original'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">number</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">1234</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">original</field>
                    <value name="VALUE">
                      <block type="variable_get">
                        <field name="VAR">number</field>
                      </block>
                    </value>
                    <next>
                      <block type="variable_set">
                        <field name="VAR">reversed</field>
                        <value name="VALUE">
                          <block type="math_number">
                            <field name="NUM">0</field>
                          </block>
                        </value>
                        <next>
                          <block type="repeat_times">
                            <value name="TIMES">
                              <block type="math_number">
                                <field name="NUM">4</field>
                              </block>
                            </value>
                            <statement name="DO">
                              <block type="variable_set">
                                <field name="VAR">digit</field>
                                <value name="VALUE">
                                  <block type="math_arithmetic">
                                    <value name="A">
                                      <block type="variable_get">
                                        <field name="VAR">number</field>
                                      </block>
                                    </value>
                                    <field name="OP">MINUS</field>
                                    <value name="B">
                                      <block type="math_arithmetic">
                                        <value name="A">
                                          <block type="math_arithmetic">
                                            <value name="A">
                                              <block type="variable_get">
                                                <field name="VAR">number</field>
                                              </block>
                                            </value>
                                            <field name="OP">DIVIDE</field>
                                            <value name="B">
                                              <block type="math_number">
                                                <field name="NUM">10</field>
                                              </block>
                                            </value>
                                          </block>
                                        </value>
                                        <field name="OP">MULTIPLY</field>
                                        <value name="B">
                                          <block type="math_number">
                                            <field name="NUM">10</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <next>
                                  <block type="variable_set">
                                    <field name="VAR">reversed</field>
                                    <value name="VALUE">
                                      <block type="math_arithmetic">
                                        <value name="A">
                                          <block type="math_arithmetic">
                                            <value name="A">
                                              <block type="variable_get">
                                                <field name="VAR">reversed</field>
                                              </block>
                                            </value>
                                            <field name="OP">MULTIPLY</field>
                                            <value name="B">
                                              <block type="math_number">
                                                <field name="NUM">10</field>
                                              </block>
                                            </value>
                                          </block>
                                        </value>
                                        <field name="OP">ADD</field>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">digit</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                    <next>
                                      <block type="variable_set">
                                        <field name="VAR">number</field>
                                        <value name="VALUE">
                                          <block type="math_arithmetic">
                                            <value name="A">
                                              <block type="variable_get">
                                                <field name="VAR">number</field>
                                              </block>
                                            </value>
                                            <field name="OP">DIVIDE</field>
                                            <value name="B">
                                              <block type="math_number">
                                                <field name="NUM">10</field>
                                              </block>
                                            </value>
                                          </block>
                                        </value>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </statement>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_join">
                                    <value name="A">
                                      <block type="text_join">
                                        <value name="A">
                                          <block type="text_value">
                                            <field name="TEXT">Reverse of </field>
                                          </block>
                                        </value>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">original</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                    <value name="B">
                                      <block type="text_join">
                                        <value name="A">
                                          <block type="text_value">
                                            <field name="TEXT"> = </field>
                                          </block>
                                        </value>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">reversed</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      }
    ]
  },
  // CLASS 8 - Advanced algorithms
  {
    classLevel: 8,
    examples: [
      {
        id: 'class8-prime',
        title: '🔢 Prime Checker',
        description: 'Check if a number is prime!',
        difficulty: 'hard',
        xpReward: 70,
        objective: 'Check if 17 is a prime number',
        hints: [
          'A prime has no divisors other than 1 and itself',
          'Check divisibility from 2 to n-1',
          'If any divides evenly, it\'s not prime'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">n</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">17</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">isPrime</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">1</field>
                      </block>
                    </value>
                    <next>
                      <block type="variable_set">
                        <field name="VAR">i</field>
                        <value name="VALUE">
                          <block type="math_number">
                            <field name="NUM">2</field>
                          </block>
                        </value>
                        <next>
                          <block type="repeat_times">
                            <value name="TIMES">
                              <block type="math_arithmetic">
                                <value name="A">
                                  <block type="variable_get">
                                    <field name="VAR">n</field>
                                  </block>
                                </value>
                                <field name="OP">MINUS</field>
                                <value name="B">
                                  <block type="math_number">
                                    <field name="NUM">2</field>
                                  </block>
                                </value>
                              </block>
                            </value>
                            <statement name="DO">
                              <block type="if_then">
                                <value name="CONDITION">
                                  <block type="compare">
                                    <value name="A">
                                      <block type="math_arithmetic">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">n</field>
                                          </block>
                                        </value>
                                        <field name="OP">MINUS</field>
                                        <value name="B">
                                          <block type="math_arithmetic">
                                            <value name="A">
                                              <block type="math_arithmetic">
                                                <value name="A">
                                                  <block type="variable_get">
                                                    <field name="VAR">n</field>
                                                  </block>
                                                </value>
                                                <field name="OP">DIVIDE</field>
                                                <value name="B">
                                                  <block type="variable_get">
                                                    <field name="VAR">i</field>
                                                  </block>
                                                </value>
                                              </block>
                                            </value>
                                            <field name="OP">MULTIPLY</field>
                                            <value name="B">
                                              <block type="variable_get">
                                                <field name="VAR">i</field>
                                              </block>
                                            </value>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                    <field name="OP">EQ</field>
                                    <value name="B">
                                      <block type="math_number">
                                        <field name="NUM">0</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <statement name="DO">
                                  <block type="variable_set">
                                    <field name="VAR">isPrime</field>
                                    <value name="VALUE">
                                      <block type="math_number">
                                        <field name="NUM">0</field>
                                      </block>
                                    </value>
                                  </block>
                                </statement>
                                <next>
                                  <block type="variable_change">
                                    <field name="VAR">i</field>
                                    <value name="VALUE">
                                      <block type="math_number">
                                        <field name="NUM">1</field>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </statement>
                            <next>
                              <block type="if_then_else">
                                <value name="CONDITION">
                                  <block type="compare">
                                    <value name="A">
                                      <block type="variable_get">
                                        <field name="VAR">isPrime</field>
                                      </block>
                                    </value>
                                    <field name="OP">EQ</field>
                                    <value name="B">
                                      <block type="math_number">
                                        <field name="NUM">1</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <statement name="DO">
                                  <block type="print_output">
                                    <value name="VALUE">
                                      <block type="text_join">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">n</field>
                                          </block>
                                        </value>
                                        <value name="B">
                                          <block type="text_value">
                                            <field name="TEXT"> is PRIME! ✓</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </statement>
                                <statement name="ELSE">
                                  <block type="print_output">
                                    <value name="VALUE">
                                      <block type="text_join">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">n</field>
                                          </block>
                                        </value>
                                        <value name="B">
                                          <block type="text_value">
                                            <field name="TEXT"> is NOT prime</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </statement>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class8-gcd',
        title: '🔗 GCD Calculator',
        description: 'Find Greatest Common Divisor!',
        difficulty: 'hard',
        xpReward: 75,
        objective: 'Find GCD of 48 and 18 (answer: 6)',
        hints: [
          'Use Euclidean algorithm',
          'Keep subtracting smaller from larger',
          'When equal, that\'s the GCD'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">a</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">48</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">b</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">18</field>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_join">
                            <value name="A">
                              <block type="text_value">
                                <field name="TEXT">Finding GCD of 48 and 18...</field>
                              </block>
                            </value>
                            <value name="B">
                              <block type="text_value">
                                <field name="TEXT"></field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="repeat_times">
                            <value name="TIMES">
                              <block type="math_number">
                                <field name="NUM">20</field>
                              </block>
                            </value>
                            <statement name="DO">
                              <block type="if_then">
                                <value name="CONDITION">
                                  <block type="compare">
                                    <value name="A">
                                      <block type="variable_get">
                                        <field name="VAR">a</field>
                                      </block>
                                    </value>
                                    <field name="OP">GT</field>
                                    <value name="B">
                                      <block type="variable_get">
                                        <field name="VAR">b</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                                <statement name="DO">
                                  <block type="variable_set">
                                    <field name="VAR">a</field>
                                    <value name="VALUE">
                                      <block type="math_arithmetic">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">a</field>
                                          </block>
                                        </value>
                                        <field name="OP">MINUS</field>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">b</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </statement>
                                <next>
                                  <block type="if_then">
                                    <value name="CONDITION">
                                      <block type="compare">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">b</field>
                                          </block>
                                        </value>
                                        <field name="OP">GT</field>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">a</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                    <statement name="DO">
                                      <block type="variable_set">
                                        <field name="VAR">b</field>
                                        <value name="VALUE">
                                          <block type="math_arithmetic">
                                            <value name="A">
                                              <block type="variable_get">
                                                <field name="VAR">b</field>
                                              </block>
                                            </value>
                                            <field name="OP">MINUS</field>
                                            <value name="B">
                                              <block type="variable_get">
                                                <field name="VAR">a</field>
                                              </block>
                                            </value>
                                          </block>
                                        </value>
                                      </block>
                                    </statement>
                                  </block>
                                </next>
                              </block>
                            </statement>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_join">
                                    <value name="A">
                                      <block type="text_value">
                                        <field name="TEXT">GCD = </field>
                                      </block>
                                    </value>
                                    <value name="B">
                                      <block type="variable_get">
                                        <field name="VAR">a</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class8-power',
        title: '⚡ Power Calculator',
        description: 'Calculate base^exponent!',
        difficulty: 'medium',
        xpReward: 55,
        objective: 'Calculate 2^8 (should be 256)',
        hints: [
          'Start result at 1',
          'Multiply by base, exponent times',
          'Use a loop'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">base</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">2</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">exp</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">8</field>
                      </block>
                    </value>
                    <next>
                      <block type="variable_set">
                        <field name="VAR">result</field>
                        <value name="VALUE">
                          <block type="math_number">
                            <field name="NUM">1</field>
                          </block>
                        </value>
                        <next>
                          <block type="repeat_times">
                            <value name="TIMES">
                              <block type="variable_get">
                                <field name="VAR">exp</field>
                              </block>
                            </value>
                            <statement name="DO">
                              <block type="variable_set">
                                <field name="VAR">result</field>
                                <value name="VALUE">
                                  <block type="math_arithmetic">
                                    <value name="A">
                                      <block type="variable_get">
                                        <field name="VAR">result</field>
                                      </block>
                                    </value>
                                    <field name="OP">MULTIPLY</field>
                                    <value name="B">
                                      <block type="variable_get">
                                        <field name="VAR">base</field>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </statement>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_join">
                                    <value name="A">
                                      <block type="text_join">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">base</field>
                                          </block>
                                        </value>
                                        <value name="B">
                                          <block type="text_join">
                                            <value name="A">
                                              <block type="text_value">
                                                <field name="TEXT">^</field>
                                              </block>
                                            </value>
                                            <value name="B">
                                              <block type="variable_get">
                                                <field name="VAR">exp</field>
                                              </block>
                                            </value>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                    <value name="B">
                                      <block type="text_join">
                                        <value name="A">
                                          <block type="text_value">
                                            <field name="TEXT"> = </field>
                                          </block>
                                        </value>
                                        <value name="B">
                                          <block type="variable_get">
                                            <field name="VAR">result</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class8-armstrong',
        title: '💪 Armstrong Number',
        description: 'Check for special numbers!',
        difficulty: 'hard',
        xpReward: 80,
        objective: 'Check if 153 is an Armstrong number (1³+5³+3³=153)',
        hints: [
          'Extract each digit',
          'Cube each digit and add',
          'Compare sum to original'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">n</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">153</field>
                  </block>
                </value>
                <next>
                  <block type="print_output">
                    <value name="VALUE">
                      <block type="text_join">
                        <value name="A">
                          <block type="text_value">
                            <field name="TEXT">Checking </field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="variable_get">
                            <field name="VAR">n</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">1³ + 5³ + 3³ = 1 + 125 + 27 = 153</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">153 IS an Armstrong number! ✓</field>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class8-staircase',
        title: '🪜 Staircase Pattern',
        description: 'Draw a staircase with blocks!',
        difficulty: 'medium',
        xpReward: 50,
        objective: 'Draw a visual staircase using pen',
        hints: [
          'Each step goes right then down',
          'Use pen to draw lines',
          'Repeat for each step'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="go_to_position">
                <value name="X">
                  <block type="math_number">
                    <field name="NUM">-80</field>
                  </block>
                </value>
                <value name="Y">
                  <block type="math_number">
                    <field name="NUM">80</field>
                  </block>
                </value>
                <next>
                  <block type="pen_down">
                    <next>
                      <block type="repeat_times">
                        <value name="TIMES">
                          <block type="math_number">
                            <field name="NUM">5</field>
                          </block>
                        </value>
                        <statement name="DO">
                          <block type="move_forward">
                            <value name="STEPS">
                              <block type="math_number">
                                <field name="NUM">30</field>
                              </block>
                            </value>
                            <next>
                              <block type="turn_right">
                                <value name="DEGREES">
                                  <block type="math_number">
                                    <field name="NUM">90</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="move_forward">
                                    <value name="STEPS">
                                      <block type="math_number">
                                        <field name="NUM">30</field>
                                      </block>
                                    </value>
                                    <next>
                                      <block type="turn_left">
                                        <value name="DEGREES">
                                          <block type="math_number">
                                            <field name="NUM">90</field>
                                          </block>
                                        </value>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      }
    ]
  },
  // CLASS 9 - Algorithm design
  {
    classLevel: 9,
    examples: [
      {
        id: 'class9-bubblesort',
        title: '🫧 Bubble Sort Demo',
        description: 'Visualize sorting algorithm!',
        difficulty: 'hard',
        xpReward: 80,
        objective: 'Demonstrate bubble sort concept with prints',
        hints: [
          'Compare adjacent elements',
          'Swap if in wrong order',
          'Repeat until sorted'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="print_output">
                <value name="VALUE">
                  <block type="text_value">
                    <field name="TEXT">🫧 Bubble Sort Demo</field>
                  </block>
                </value>
                <next>
                  <block type="print_output">
                    <value name="VALUE">
                      <block type="text_value">
                        <field name="TEXT">Starting: [5, 2, 8, 1, 9]</field>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">Pass 1: Compare 5,2 → Swap!</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">[2, 5, 8, 1, 9]</field>
                              </block>
                            </value>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_value">
                                    <field name="TEXT">Compare 8,1 → Swap!</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="print_output">
                                    <value name="VALUE">
                                      <block type="text_value">
                                        <field name="TEXT">[2, 5, 1, 8, 9]</field>
                                      </block>
                                    </value>
                                    <next>
                                      <block type="print_output">
                                        <value name="VALUE">
                                          <block type="text_value">
                                            <field name="TEXT">...</field>
                                          </block>
                                        </value>
                                        <next>
                                          <block type="print_output">
                                            <value name="VALUE">
                                              <block type="text_value">
                                                <field name="TEXT">✓ Sorted: [1, 2, 5, 8, 9]</field>
                                              </block>
                                            </value>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class9-binarysearch',
        title: '🔍 Binary Search',
        description: 'Find efficiently in sorted data!',
        difficulty: 'hard',
        xpReward: 85,
        objective: 'Demonstrate binary search concept',
        hints: [
          'Start with middle element',
          'If target < middle, search left half',
          'If target > middle, search right half'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="print_output">
                <value name="VALUE">
                  <block type="text_value">
                    <field name="TEXT">🔍 Binary Search Demo</field>
                  </block>
                </value>
                <next>
                  <block type="print_output">
                    <value name="VALUE">
                      <block type="text_value">
                        <field name="TEXT">Array: [1,3,5,7,9,11,13,15]</field>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">Finding: 11</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">Step 1: Mid=7, 11>7 → Go right</field>
                              </block>
                            </value>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_value">
                                    <field name="TEXT">Step 2: Mid=11, Found! ✓</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="print_output">
                                    <value name="VALUE">
                                      <block type="text_value">
                                        <field name="TEXT">Only 2 steps instead of 6!</field>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class9-palindrome',
        title: '🔄 Palindrome Check',
        description: 'Check if number reads same backwards!',
        difficulty: 'medium',
        xpReward: 60,
        objective: 'Check if 12321 is a palindrome',
        hints: [
          'Reverse the number',
          'Compare with original',
          'If same, it\'s a palindrome'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">original</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">12321</field>
                  </block>
                </value>
                <next>
                  <block type="print_output">
                    <value name="VALUE">
                      <block type="text_join">
                        <value name="A">
                          <block type="text_value">
                            <field name="TEXT">Checking: </field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="variable_get">
                            <field name="VAR">original</field>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">Reversed: 12321</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">12321 = 12321 ✓</field>
                              </block>
                            </value>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_value">
                                    <field name="TEXT">It IS a palindrome!</field>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class9-lcm',
        title: '🔢 LCM Calculator',
        description: 'Find Least Common Multiple!',
        difficulty: 'medium',
        xpReward: 65,
        objective: 'Find LCM of 12 and 18 (should be 36)',
        hints: [
          'LCM = (a × b) / GCD',
          'First find GCD',
          'Then calculate LCM'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">a</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">12</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">b</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">18</field>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">Finding LCM of 12 and 18</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">Step 1: GCD(12,18) = 6</field>
                              </block>
                            </value>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_value">
                                    <field name="TEXT">Step 2: LCM = (12×18)/6</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="print_output">
                                    <value name="VALUE">
                                      <block type="text_value">
                                        <field name="TEXT">LCM = 216/6 = 36 ✓</field>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class9-perfectnum',
        title: '💎 Perfect Number',
        description: 'Check if sum of divisors equals n!',
        difficulty: 'hard',
        xpReward: 75,
        objective: 'Check if 28 is perfect (1+2+4+7+14=28)',
        hints: [
          'Find all divisors of n (except n)',
          'Add them up',
          'If sum equals n, it\'s perfect'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="variable_set">
                <field name="VAR">n</field>
                <value name="VALUE">
                  <block type="math_number">
                    <field name="NUM">28</field>
                  </block>
                </value>
                <next>
                  <block type="print_output">
                    <value name="VALUE">
                      <block type="text_join">
                        <value name="A">
                          <block type="text_value">
                            <field name="TEXT">Checking if </field>
                          </block>
                        </value>
                        <value name="B">
                          <block type="text_join">
                            <value name="A">
                              <block type="variable_get">
                                <field name="VAR">n</field>
                              </block>
                            </value>
                            <value name="B">
                              <block type="text_value">
                                <field name="TEXT"> is perfect...</field>
                              </block>
                            </value>
                          </block>
                        </value>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">Divisors of 28: 1, 2, 4, 7, 14</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">Sum: 1+2+4+7+14 = 28</field>
                              </block>
                            </value>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_value">
                                    <field name="TEXT">28 IS a perfect number! ✓</field>
                                  </block>
                                </value>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      }
    ]
  },
  // CLASS 10 - Advanced concepts
  {
    classLevel: 10,
    examples: [
      {
        id: 'class10-complexity',
        title: '📊 Time Complexity',
        description: 'Understand algorithm efficiency!',
        difficulty: 'medium',
        xpReward: 70,
        objective: 'Compare O(n) vs O(n²) with examples',
        hints: [
          'O(n) does n operations',
          'O(n²) does n×n operations',
          'For n=100: 100 vs 10,000!'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="print_output">
                <value name="VALUE">
                  <block type="text_value">
                    <field name="TEXT">📊 Time Complexity Demo</field>
                  </block>
                </value>
                <next>
                  <block type="variable_set">
                    <field name="VAR">n</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">100</field>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_join">
                            <value name="A">
                              <block type="text_value">
                                <field name="TEXT">For n = </field>
                              </block>
                            </value>
                            <value name="B">
                              <block type="variable_get">
                                <field name="VAR">n</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">O(n) → 100 operations</field>
                              </block>
                            </value>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_value">
                                    <field name="TEXT">O(n²) → 10,000 operations</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="print_output">
                                    <value name="VALUE">
                                      <block type="text_value">
                                        <field name="TEXT">O(log n) → ~7 operations!</field>
                                      </block>
                                    </value>
                                    <next>
                                      <block type="print_output">
                                        <value name="VALUE">
                                          <block type="text_value">
                                            <field name="TEXT">Algorithm choice matters! 💡</field>
                                          </block>
                                        </value>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class10-recursion',
        title: '🔁 Recursion Concept',
        description: 'Understand self-calling functions!',
        difficulty: 'hard',
        xpReward: 85,
        objective: 'Demonstrate recursion with factorial example',
        hints: [
          'Function calls itself',
          'Needs a base case to stop',
          'Each call reduces the problem'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="print_output">
                <value name="VALUE">
                  <block type="text_value">
                    <field name="TEXT">🔁 Recursion: factorial(5)</field>
                  </block>
                </value>
                <next>
                  <block type="print_output">
                    <value name="VALUE">
                      <block type="text_value">
                        <field name="TEXT">factorial(5) = 5 × factorial(4)</field>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">factorial(4) = 4 × factorial(3)</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">factorial(3) = 3 × factorial(2)</field>
                              </block>
                            </value>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_value">
                                    <field name="TEXT">factorial(2) = 2 × factorial(1)</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="print_output">
                                    <value name="VALUE">
                                      <block type="text_value">
                                        <field name="TEXT">factorial(1) = 1 (Base case!)</field>
                                      </block>
                                    </value>
                                    <next>
                                      <block type="print_output">
                                        <value name="VALUE">
                                          <block type="text_value">
                                            <field name="TEXT">Unwinding: 1→2→6→24→120</field>
                                          </block>
                                        </value>
                                        <next>
                                          <block type="print_output">
                                            <value name="VALUE">
                                              <block type="text_value">
                                                <field name="TEXT">Result: 120 ✓</field>
                                              </block>
                                            </value>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class10-stack',
        title: '📚 Stack Operations',
        description: 'Understand LIFO data structure!',
        difficulty: 'medium',
        xpReward: 65,
        objective: 'Demonstrate push and pop operations',
        hints: [
          'LIFO = Last In, First Out',
          'Push adds to top',
          'Pop removes from top'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="print_output">
                <value name="VALUE">
                  <block type="text_value">
                    <field name="TEXT">📚 Stack Demo (LIFO)</field>
                  </block>
                </value>
                <next>
                  <block type="print_output">
                    <value name="VALUE">
                      <block type="text_value">
                        <field name="TEXT">Stack: []</field>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">push(A) → [A]</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">push(B) → [A, B]</field>
                              </block>
                            </value>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_value">
                                    <field name="TEXT">push(C) → [A, B, C]</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="print_output">
                                    <value name="VALUE">
                                      <block type="text_value">
                                        <field name="TEXT">pop() → returns C, [A, B]</field>
                                      </block>
                                    </value>
                                    <next>
                                      <block type="print_output">
                                        <value name="VALUE">
                                          <block type="text_value">
                                            <field name="TEXT">pop() → returns B, [A]</field>
                                          </block>
                                        </value>
                                        <next>
                                          <block type="print_output">
                                            <value name="VALUE">
                                              <block type="text_value">
                                                <field name="TEXT">Last In = First Out! ✓</field>
                                              </block>
                                            </value>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class10-queue',
        title: '🚶 Queue Operations',
        description: 'Understand FIFO data structure!',
        difficulty: 'medium',
        xpReward: 65,
        objective: 'Demonstrate enqueue and dequeue',
        hints: [
          'FIFO = First In, First Out',
          'Enqueue adds to back',
          'Dequeue removes from front'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="print_output">
                <value name="VALUE">
                  <block type="text_value">
                    <field name="TEXT">🚶 Queue Demo (FIFO)</field>
                  </block>
                </value>
                <next>
                  <block type="print_output">
                    <value name="VALUE">
                      <block type="text_value">
                        <field name="TEXT">Queue: []</field>
                      </block>
                    </value>
                    <next>
                      <block type="print_output">
                        <value name="VALUE">
                          <block type="text_value">
                            <field name="TEXT">enqueue(A) → [A]</field>
                          </block>
                        </value>
                        <next>
                          <block type="print_output">
                            <value name="VALUE">
                              <block type="text_value">
                                <field name="TEXT">enqueue(B) → [A, B]</field>
                              </block>
                            </value>
                            <next>
                              <block type="print_output">
                                <value name="VALUE">
                                  <block type="text_value">
                                    <field name="TEXT">enqueue(C) → [A, B, C]</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="print_output">
                                    <value name="VALUE">
                                      <block type="text_value">
                                        <field name="TEXT">dequeue() → returns A, [B, C]</field>
                                      </block>
                                    </value>
                                    <next>
                                      <block type="print_output">
                                        <value name="VALUE">
                                          <block type="text_value">
                                            <field name="TEXT">dequeue() → returns B, [C]</field>
                                          </block>
                                        </value>
                                        <next>
                                          <block type="print_output">
                                            <value name="VALUE">
                                              <block type="text_value">
                                                <field name="TEXT">First In = First Out! ✓</field>
                                              </block>
                                            </value>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      },
      {
        id: 'class10-fractal',
        title: '🌀 Fractal Pattern',
        description: 'Draw self-similar patterns!',
        difficulty: 'hard',
        xpReward: 90,
        objective: 'Create a simple fractal-like pattern',
        hints: [
          'Fractals repeat at different scales',
          'Use nested loops',
          'Each iteration is smaller'
        ],
        blocksXml: `<xml xmlns="https://developers.google.com/blockly/xml">
          <block type="when_start" x="50" y="50">
            <next>
              <block type="pen_down">
                <next>
                  <block type="variable_set">
                    <field name="VAR">size</field>
                    <value name="VALUE">
                      <block type="math_number">
                        <field name="NUM">80</field>
                      </block>
                    </value>
                    <next>
                      <block type="repeat_times">
                        <value name="TIMES">
                          <block type="math_number">
                            <field name="NUM">4</field>
                          </block>
                        </value>
                        <statement name="DO">
                          <block type="repeat_times">
                            <value name="TIMES">
                              <block type="math_number">
                                <field name="NUM">4</field>
                              </block>
                            </value>
                            <statement name="DO">
                              <block type="move_forward">
                                <value name="STEPS">
                                  <block type="variable_get">
                                    <field name="VAR">size</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="turn_right">
                                    <value name="DEGREES">
                                      <block type="math_number">
                                        <field name="NUM">90</field>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </statement>
                            <next>
                              <block type="turn_right">
                                <value name="DEGREES">
                                  <block type="math_number">
                                    <field name="NUM">30</field>
                                  </block>
                                </value>
                                <next>
                                  <block type="variable_set">
                                    <field name="VAR">size</field>
                                    <value name="VALUE">
                                      <block type="math_arithmetic">
                                        <value name="A">
                                          <block type="variable_get">
                                            <field name="VAR">size</field>
                                          </block>
                                        </value>
                                        <field name="OP">MULTIPLY</field>
                                        <value name="B">
                                          <block type="math_number">
                                            <field name="NUM">0.7</field>
                                          </block>
                                        </value>
                                      </block>
                                    </value>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </statement>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </xml>`
      }
    ]
  }
];

// Helper function to get examples for a specific class
export function getExamplesForClass(classLevel: number): ExampleProject[] {
  const classExamples = exampleProjects.find(c => c.classLevel === classLevel);
  return classExamples?.examples || exampleProjects[0].examples;
}

// Helper function to get a specific example by ID
export function getExampleById(exampleId: string): ExampleProject | undefined {
  for (const classExamples of exampleProjects) {
    const example = classExamples.examples.find(e => e.id === exampleId);
    if (example) return example;
  }
  return undefined;
}
