
# Block-Based Coding Practice Platform

## Overview

Transform the current text-based Code Playground into a kid-friendly, Scratch-like block-based coding platform that teaches coding alongside AI and Computational Thinking curriculum. The platform will feature:

1. **Chapter-linked coding activities** that unlock as students progress
2. **Free practice playground** for exploration and creativity
3. **Visual animation output** for Classes 3-6, transitioning to **console/text output** for Classes 7-10
4. **Blocks-only interface** (no visible code generation)

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    BLOCK CODING PLATFORM                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐    ┌──────────────────────────────────┐   │
│  │   COURSE MODULES    │    │      FREE PRACTICE AREA          │   │
│  │  (Chapter-linked)   │    │    (Open Exploration)            │   │
│  ├─────────────────────┤    ├──────────────────────────────────┤   │
│  │ - Unlockable        │    │ - Class-wise organized           │   │
│  │ - Guided lessons    │    │ - Topic categories               │   │
│  │ - Objectives        │    │ - Creative sandbox               │   │
│  │ - Auto-validation   │    │ - Project saving                 │   │
│  └─────────────────────┘    └──────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   BLOCKLY WORKSPACE                           │  │
│  │  ┌────────────┐  ┌─────────────────────────────────────────┐ │  │
│  │  │  Toolbox   │  │                                         │ │  │
│  │  │  (Blocks)  │  │         Drag & Drop Canvas              │ │  │
│  │  │            │  │                                         │ │  │
│  │  │ - Motion   │  │     [Student's Block Program]           │ │  │
│  │  │ - Events   │  │                                         │ │  │
│  │  │ - Logic    │  │                                         │ │  │
│  │  │ - Loops    │  │                                         │ │  │
│  │  │ - Math     │  │                                         │ │  │
│  │  │ - Text     │  │                                         │ │  │
│  │  │ - Variables│  │                                         │ │  │
│  │  └────────────┘  └─────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                    OUTPUT PREVIEW                              ││
│  │  ┌────────────────────────────┐  ┌─────────────────────────┐  ││
│  │  │   Animation Canvas         │  │   Console Output        │  ││
│  │  │   (Classes 3-6)            │  │   (Classes 7-10)        │  ││
│  │  │   [Character/Sprite]       │  │   > Hello World!        │  ││
│  │  │        ★                   │  │   > Result: 42          │  ││
│  │  └────────────────────────────┘  └─────────────────────────┘  ││
│  └────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. Class-Wise Block Categories

| Class Level | Block Categories | Output Type |
|-------------|------------------|-------------|
| Class 3-4 | Motion, Looks, Events, Simple Loops | Animation Canvas |
| Class 5-6 | + Logic, Variables, Sounds | Animation Canvas |
| Class 7-8 | + Functions, Lists, Math Operations | Console + Basic Graphics |
| Class 9-10 | + Advanced Logic, Algorithms | Console/Text Output |

### 2. Two Entry Points

- **From Course Chapter**: "Practice Coding" tab alongside Videos, Ebooks, Quizzes
- **From Dashboard/Nav**: "Code Lab" for free exploration

### 3. Guided Lessons (Chapter-Linked)

- Step-by-step instructions panel
- Pre-loaded challenge blocks
- Objective validation ("Make the cat move 10 steps")
- XP rewards on completion
- Hints system for struggling students

### 4. Free Practice Mode

- Empty canvas for creativity
- Template projects (games, animations, art)
- Save/Load projects
- Share creations (optional)

---

## Database Schema Changes

### New Tables

**coding_modules** (links to chapters)
- id, chapter_id, title, description, difficulty_level
- initial_blocks (JSON - starter blocks)
- objective_text, validation_rules
- xp_reward, order_index

**coding_projects** (student saved work)
- id, student_id, title, blocks_xml
- project_type (lesson/free)
- class_level, created_at

**coding_progress** (completion tracking)
- id, student_id, module_id
- completed_at, attempts, score

### Block Category Definitions

**block_categories** (admin-configurable)
- id, name, color, min_class_level
- blocks_json (available blocks)

---

## Component Structure

### New Files to Create

```text
src/
├── components/
│   └── blockly/
│       ├── BlocklyWorkspace.tsx        # Main Blockly editor
│       ├── BlockToolbox.tsx            # Class-wise block palette
│       ├── OutputCanvas.tsx            # Animation preview
│       ├── ConsoleOutput.tsx           # Text output for higher classes
│       ├── LessonPanel.tsx             # Instructions & objectives
│       ├── BlocklyTheme.tsx            # Kid-friendly theme config
│       └── BlockDefinitions.ts         # Custom block definitions
│
├── pages/
│   └── student/
│       ├── BlockCodingLab.tsx          # Main practice page
│       └── BlockCodingLesson.tsx       # Chapter-linked lessons
│
├── hooks/
│   └── useBlockly.ts                   # Blockly state management
│   └── useCodingProgress.ts            # Progress tracking
│
└── lib/
    └── blockly/
        ├── customBlocks.ts             # Kid-friendly block definitions
        ├── interpreters/
        │   ├── animationInterpreter.ts # Runs animation output
        │   └── consoleInterpreter.ts   # Runs console output
        └── toolboxConfigs.ts           # Class-wise toolbox configs
```

---

## Implementation Phases

### Phase 1: Core Blockly Integration
- Install `blockly` package
- Create BlocklyWorkspace component
- Build kid-friendly custom blocks (colorful, simple names)
- Implement animation canvas for visual output
- Add console output for higher classes

### Phase 2: Class-Wise Organization
- Define block categories per class level
- Create adaptive toolbox that changes based on student's class
- Build the main "Code Lab" page replacing current Compiler

### Phase 3: Curriculum Integration
- Add "Coding" tab to chapter content view
- Create `coding_modules` database table
- Build LessonPanel with objectives and hints
- Implement progress tracking and XP rewards

### Phase 4: Free Practice & Projects
- Add project save/load functionality
- Create template gallery (game starters, art projects)
- Implement localStorage backup for guest users

### Phase 5: Admin Management
- Add coding module editor in admin panel
- Block category management
- Analytics for coding completion rates

---

## UI/UX Design

### Visual Theme
- Bright, playful colors matching existing brand
- Large touch-friendly blocks for mobile
- Animated mascot (Kodi) providing hints
- Celebratory effects on completion (confetti, sounds)

### Mobile Responsiveness
- Horizontal scroll for block palette on mobile
- Collapsible toolbox drawer
- Touch-optimized block dragging
- Split view: Blocks top, Output bottom

### Kid-Friendly Block Names
Instead of "if/else", use phrases like:
- "If this happens, do that"
- "Repeat 10 times"
- "Say hello"
- "Move forward"
- "Turn right"

---

## Technical Approach

### Blockly Integration
Using Google Blockly (official library):
```text
npm install blockly
```

Key integration points:
- React wrapper component using Blockly's inject() API
- Custom block definitions with kid-friendly labels
- JavaScript code generator (hidden from students)
- Runtime interpreter for animation/console execution

### Output Execution
- **Animation Mode**: Custom canvas renderer interpreting movement/drawing commands
- **Console Mode**: Sandboxed JavaScript execution with captured console.log

---

## Migration from Current Compiler

The existing Compiler.tsx (776 lines) will be:
1. Renamed to `TextCompiler.tsx` (preserved for future text-based coding)
2. Replaced by `BlockCodingLab.tsx` as the main Code Lab
3. Route `/guest/compiler` redirects to new block-based interface
4. All class-wise examples in `codeExamples.ts` converted to block-based lessons

---

## Expected Outcome

Students will experience:
1. **Instant success**: Drag blocks, see animations immediately
2. **Progressive learning**: Simple blocks in Class 3, complex logic by Class 10
3. **Curriculum alignment**: Coding activities tied to what they learn in videos/ebooks
4. **Creative freedom**: Free practice mode for experimentation
5. **Gamification**: XP rewards, completion badges, streaks

---

## Technical Notes

- Blockly supports all major browsers and touch devices
- Block workspaces can be serialized to XML/JSON for saving
- Custom blocks can be defined with any complexity level
- Animation canvas uses HTML5 Canvas API
- Progress syncs with existing `student_points` and `student_achievements` tables

