

# Redesign Sample Book PDFs: Colorful, Playful, Kids-Book Style

## Current Problem
The generated PDFs are plain text-only documents with no colors, no illustrations, no visual design. They look like raw text dumps, not educational books for children.

## What We Need (Based on Reference Image)
- Vibrant colored backgrounds and page designs
- Illustrated decorative elements (leaf borders, character mascots, speech bubbles)
- Colorful section boxes: note boxes, fun fact callouts, tip boxes
- Worksheet sections with write-in lines for kids to fill
- Playful typography with varied sizes, colors, and weights
- Icons and bullet points with visual markers
- Educational images/illustrations on every page
- Comparison tables with colored columns
- Activity boxes with checkboxes and dashed lines

## Solution: Rebuild PDF Generator with jsPDF

Replace the plain-text PDF builder in the edge function with a rich, visual PDF generator using **jsPDF** (available via esm.sh in Deno). jsPDF supports:
- Colored rectangles, rounded boxes, and shapes
- Multiple fonts, sizes, and colors
- Drawing lines, circles, and decorative elements
- Embedded images (base64-encoded PNG/JPEG)

## Implementation Plan

### Step 1: Add Decorative Image Assets
Create small base64-encoded illustrations to embed in PDFs:
- KodeIntel mascot/logo for headers
- Decorative corner elements (leaves, stars, gears)
- Section icons (lightbulb for tips, brain for key terms, pencil for activities, star for fun facts)
- Simple kid-friendly illustrations per class theme (computer for Class 3, gears for Class 5, robot for Class 8, etc.)

### Step 2: Rewrite the Edge Function PDF Builder
Complete rewrite of `supabase/functions/generate-sample-pdf/index.ts` using jsPDF:

**Page Design System:**
- Colorful page border (different accent color per class)
- Branded header bar with KodeIntel logo + class info
- Playful footer with page numbers in colored circles
- Subtle background pattern (dots or grid)

**Block Renderers (one for each content type):**

| Block Type | Visual Treatment |
|---|---|
| **Title Page** | Full-page colored background, large title, mascot illustration, class badge |
| **Text** | Clean paragraphs with colored heading, decorative underline |
| **Callout (Fun Fact)** | Yellow/orange rounded box with star icon, wavy border |
| **Callout (Tip)** | Green rounded box with lightbulb icon |
| **Callout (Info)** | Blue rounded box with info icon |
| **Key Term** | Purple/indigo box with book icon, term in bold, definition below |
| **Step-by-Step** | Numbered circles (colored) with connecting line, each step in a mini card |
| **Comparison** | Two-column colored table with headers in contrasting colors |
| **Activity** | Green dashed-border box with pencil icon, checklist items |
| **Worksheet** | Lined writing area with dashed lines, fill-in-the-blank spaces |
| **Summary** | Gradient box with checkmark icon, key takeaways as bullets |
| **Image Placeholder** | Decorative frame with themed illustration |

**Color Themes Per Class:**
- Class 3: Bright green + yellow (nature/friendly)
- Class 5: Sky blue + orange (thinking/creativity)
- Class 8: Purple + teal (technology/AI)
- Class 9: Deep blue + coral (science/learning)
- Class 10: Indigo + gold (advanced/professional)

### Step 3: Add Worksheet Content to Each Chapter
Enhance the content data to include worksheet-style questions:
- Fill in the blanks with dashed lines
- True/False questions with checkbox circles
- Match-the-column with connecting lines
- Short answer questions with ruled lines
- "Draw and label" activity boxes

These will be added as new block types (`worksheet`, `fill_blank`, `true_false`) in the chapter data within the edge function.

### Step 4: Add Themed Illustrations
Create simple geometric/vector-style illustrations as base64 images:
- Each class gets 2-3 themed illustrations
- Small decorative elements (stars, arrows, speech bubbles) scattered throughout
- Character mascot appearing in activity sections

### Step 5: Regenerate All PDFs
After deploying the updated edge function, trigger regeneration for all classes (3, 5, 8, 9, 10) to replace the plain-text PDFs in storage with the new colorful versions.

### Step 6: Update Frontend (if needed)
The `SampleBookViewer.tsx` download logic should remain the same since it already fetches from storage. No frontend changes expected.

## Technical Details

**jsPDF Usage in Deno Edge Function:**
```
import jsPDF from "https://esm.sh/jspdf@2.5.2";
```

**Key jsPDF Methods We Will Use:**
- `doc.setFillColor(r, g, b)` + `doc.roundedRect()` -- colored boxes
- `doc.setTextColor(r, g, b)` + `doc.text()` -- colored text
- `doc.setFontSize()`, `doc.setFont("helvetica", "bold")` -- typography
- `doc.addImage(base64, "PNG", x, y, w, h)` -- embedded images
- `doc.setDrawColor()` + `doc.line()` -- decorative lines and worksheet rules
- `doc.circle()`, `doc.rect()` -- shapes for bullets, checkboxes
- `doc.addPage()` -- multi-page with automatic page breaks

**Page Layout (A4: 210mm x 297mm):**
- Margins: 15mm sides, 25mm top (for header), 20mm bottom (for footer)
- Content area: 180mm wide
- Auto page-break detection: track Y position, add new page when near bottom

**Files Changed:**
- `supabase/functions/generate-sample-pdf/index.ts` -- complete rewrite with jsPDF + rich visual rendering
- No frontend changes needed

