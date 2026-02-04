

# Add Sample Coding Lessons for "Testing and Improving" Chapter

## Overview

Create a set of guided block-based coding lessons that teach the "Test and Improve" concept from your computational thinking curriculum. These lessons will help students practice the iterative process of building, testing, finding mistakes, and improving their code.

---

## Lesson Modules to Create

### Lesson 1: "Say Hello!" (Beginner)
**Objective**: Make the sprite say a greeting message
**Blocks Used**: `when_start`, `say_message`, `text_value`
**Concept**: Running a simple program and checking output

**Starter Blocks**:
```xml
<xml>
  <block type="when_start">
    <next>
      <!-- Empty: student adds say block -->
    </next>
  </block>
</xml>
```

**Hints**:
1. Drag a "Say" block from the Looks category
2. Type your greeting in the text bubble
3. Click "Run" to test your program

---

### Lesson 2: "Move and Check" (Beginner)
**Objective**: Move the sprite forward and observe what happens
**Blocks Used**: `when_start`, `move_forward`, `math_number`
**Concept**: Testing to see if your program does what you expect

**Hints**:
1. Drag a "Move forward" block
2. Try different numbers of steps
3. Did the star move where you expected?

---

### Lesson 3: "Draw a Line" (Beginner)
**Objective**: Use pen blocks to draw a line and verify the result
**Blocks Used**: `pen_down`, `move_forward`, `pen_up`
**Concept**: Testing visual output - does the drawing look right?

**Hints**:
1. Start with "Pen down" to begin drawing
2. Move forward to create a line
3. Test: Is the line the length you wanted?

---

### Lesson 4: "Fix the Bug!" (Beginner)
**Objective**: Find and correct the mistake in a pre-built program
**Blocks Used**: Pre-loaded broken program
**Concept**: Debugging - finding and fixing errors

**Starter Blocks**: A program that moves the wrong direction - student must fix it

**Hints**:
1. Run the program to see what's wrong
2. The sprite should move forward, not backward!
3. Change the degrees to fix the turn

---

### Lesson 5: "Repeat and Improve" (Intermediate)
**Objective**: Draw a square using loops, then improve to draw a bigger one
**Blocks Used**: `repeat_times`, `move_forward`, `turn_right`
**Concept**: Iterative improvement - making things better step by step

**Hints**:
1. A square has 4 sides - use "Repeat 4 times"
2. After each side, turn right 90 degrees
3. To make it bigger, increase the step count

---

## Database Entries

For each lesson, we'll create entries in `coding_modules` with:
- `chapter_id`: Linked to the "Testing and Improving" chapter
- `title`: Lesson name
- `description`: What students will learn
- `difficulty_level`: beginner/intermediate/advanced
- `objective_text`: Clear mission statement
- `initial_blocks_xml`: Starter code (if any)
- `validation_rules`: JSON with hints array
- `xp_reward`: Points earned (10-30 XP based on difficulty)
- `order_index`: Sequence within chapter

---

## Implementation Steps

1. **Create Sample Coding Modules**
   - Add 5-6 lessons for the "Testing and Improving" concept
   - Each lesson progressively builds on the previous
   - Include starter blocks for guided exercises

2. **Link to Existing Chapters**
   - Query existing chapters to find appropriate ones
   - Or create a dedicated "Testing & Improving" chapter if needed

3. **Add Admin Interface** (Optional)
   - Create a `CodingModuleEditor` component
   - Allow admins to create/edit lessons
   - Preview initial blocks and test lessons

4. **Test the Flow**
   - Navigate to a course chapter
   - Click the "Coding" tab
   - Launch a lesson and complete it
   - Verify progress is tracked

---

## Sample Lesson Data (SQL Insert)

```sql
INSERT INTO coding_modules (
  chapter_id,
  title,
  description,
  difficulty_level,
  objective_text,
  initial_blocks_xml,
  validation_rules,
  xp_reward,
  order_index,
  is_published
) VALUES
(
  'CHAPTER_UUID_HERE',
  'Say Hello!',
  'Learn to make the sprite speak by using the Say block.',
  'beginner',
  'Make the star say "Hello, World!" when the program starts.',
  '<xml><block type="when_start" x="50" y="50"></block></xml>',
  '{"hints": ["Drag a Say block from the purple Looks category", "Connect it below the When program starts block", "Type Hello, World! in the text field"]}',
  10,
  1,
  true
),
(
  'CHAPTER_UUID_HERE',
  'Move and Check',
  'Practice testing your programs by moving the sprite and observing the result.',
  'beginner',
  'Move the star forward exactly 100 steps.',
  '<xml><block type="when_start" x="50" y="50"></block></xml>',
  '{"hints": ["Drag a Move forward block from the blue Motion category", "Change the number to 100", "Run the program and watch where the star moves!"]}',
  10,
  2,
  true
),
(
  'CHAPTER_UUID_HERE',
  'Draw a Line',
  'Use the pen tool to draw and verify your output matches expectations.',
  'beginner',
  'Draw a straight red line that is 150 steps long.',
  '<xml><block type="when_start" x="50" y="50"></block></xml>',
  '{"hints": ["First use Set pen color to red", "Then use Pen down to start drawing", "Move forward 150 steps to draw the line"]}',
  15,
  3,
  true
),
(
  'CHAPTER_UUID_HERE',
  'Fix the Bug!',
  'Practice debugging by finding and correcting mistakes in existing code.',
  'beginner',
  'The star should move forward, but it is turning instead! Fix the program.',
  '<xml><block type="when_start" x="50" y="50"><next><block type="turn_right"><value name="DEGREES"><block type="math_number"><field name="NUM">90</field></block></value></block></next></block></xml>',
  '{"hints": ["Run the program first to see what happens", "The star turns but should move forward", "Replace the Turn block with a Move forward block"]}',
  20,
  4,
  true
),
(
  'CHAPTER_UUID_HERE',
  'Draw a Square',
  'Learn iteration by drawing shapes with loops, then improve your solution.',
  'intermediate',
  'Draw a square using a repeat loop, then make it twice as big!',
  '<xml><block type="when_start" x="50" y="50"><next><block type="pen_down"></block></next></block></xml>',
  '{"hints": ["A square has 4 equal sides - use Repeat 4 times", "Inside the loop: Move forward, then Turn right 90 degrees", "To make it bigger, increase the steps number"]}',
  25,
  5,
  true
);
```

---

## Files to Create/Modify

| File | Changes |
|------|---------|
| `src/pages/admin/CodingModuleManager.tsx` | New admin page to create/edit coding lessons |
| `src/components/admin/CodingModuleEditor.tsx` | Form component for lesson creation |
| `App.tsx` | Add admin route for coding module management |
| Database migration | Insert sample lessons linked to existing chapters |

---

## User Experience Flow

```text
Student Journey:
┌─────────────────────────────────────────────────────────────┐
│  Course → Chapter → "Coding" Tab                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📚 Testing & Improving - Coding Activities         │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  ✓ Say Hello!          ★ 10 XP    [Completed]      │   │
│  │  ○ Move and Check      ★ 10 XP    [Start →]        │   │
│  │  ○ Draw a Line         ★ 15 XP    [Locked]         │   │
│  │  ○ Fix the Bug!        ★ 20 XP    [Locked]         │   │
│  │  ○ Draw a Square       ★ 25 XP    [Locked]         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Lesson View:
┌─────────────────────────────────────────────────────────────┐
│  ← Back    Say Hello!                    [Save] [Run ▶]    │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│  MISSION    │        ┌─────────────────────────────┐        │
│  ─────────  │        │                             │        │
│  Make the   │        │   BLOCKLY WORKSPACE         │        │
│  star say   │        │                             │        │
│  "Hello!"   │        │   [🚀 When program starts]  │        │
│             │        │            ↓                │        │
│  ⭐ 10 XP   │        │   [💬 Say "Hello!"]         │        │
│             │        │                             │        │
│  [💡 Hint]  │        └─────────────────────────────┘        │
│             │                                               │
│             ├───────────────────────────────────────────────┤
│             │  OUTPUT CANVAS                                │
│             │  ┌─────────────────────────────────────────┐  │
│             │  │        💬 "Hello!"                      │  │
│             │  │            ⭐                           │  │
│             │  └─────────────────────────────────────────┘  │
└─────────────┴───────────────────────────────────────────────┘
```

---

## Expected Outcome

After implementation:
1. Students can access coding activities from chapter content view
2. Each lesson has clear objectives, hints, and XP rewards
3. Progress is tracked (attempts, completion, XP earned)
4. Lessons build progressively on the "Test and Improve" concept
5. Admins can create new lessons without code changes

