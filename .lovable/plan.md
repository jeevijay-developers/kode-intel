

# Enhanced PDF Book: AI Images, TOC, Color Me Page, and Better Design

## Overview
Transform the sample book PDFs into truly stunning children's educational books by adding AI-generated illustrations, a Table of Contents page, a "Color Me!" activity page, larger inline illustrations, and improved typography with bolder headings and better alignment.

## What Changes

### 1. AI-Generated Images via Lovable AI
Use the Lovable AI image generation API (google/gemini-2.5-flash-image) to create topic-relevant illustrations for each class. The edge function will call the AI to generate images at build time, then embed them as base64 into the PDF.

**Images per class (2-3 per chapter):**
- Class 3: A friendly cartoon computer with eyes, kids using a keyboard
- Class 5: A child thinking with gears above their head, puzzle pieces connecting
- Class 8: A cute robot waving, AI brain with circuits
- Class 9: Data flowing into a machine, a puppy learning tricks (reinforcement learning metaphor)
- Class 10: Futuristic city with AI, diverse students collaborating

Images will be placed:
- One large hero image after the title page (full-width, ~80mm tall)
- One medium image mid-chapter between content blocks (~60mm wide)
- One small image near the worksheet section

### 2. Table of Contents (TOC) Page
Add a beautifully designed TOC page right after the title page:
- Colored section entries with page numbers
- Each section type gets a small icon (text icon, star for fun facts, book for key terms, checkmark for worksheet)
- Dotted leader lines connecting section names to page numbers
- Themed border matching the class color palette

### 3. "Color Me!" Activity Page
Add before the "End of Sample" page:
- Large outlined illustrations (drawn with jsPDF strokes only, no fill) themed per class
- Class 3: Computer with parts labeled, keyboard outline
- Class 5: Brain with four pillars labeled, puzzle pieces
- Class 8: Robot figure, circuit board pattern
- Class 9: Data flow diagram outline, neural network
- Class 10: Globe with AI connections, ethical balance scale
- Title banner: "Color Me! -- Make It Your Own"
- Instructions for kids to color and decorate

### 4. Bigger, Bolder Headings and Better Alignment
- Increase main section headings from 15pt to 20pt bold
- Add decorative left-border accent bars next to headings (4mm colored bar)
- Increase the underline width under headings
- Add 2mm more left padding for consistent text alignment
- Increase callout box text from 10pt to 11pt
- Make worksheet title bar taller with bigger text (15pt)
- Ensure all text blocks start at the same left margin (17mm)

### 5. Larger Inline Illustrations
- Increase inline illustration size from 10px to 22px (more than double)
- Position them centered between content blocks instead of overlapping margins
- Add a light circular background behind each illustration
- Add 8mm spacing around illustrations so they stand out

## Technical Approach

### AI Image Generation Flow
The edge function will:
1. For each class, define 2-3 image prompts (kid-friendly, cartoon style)
2. Call the Lovable AI API (`https://ai.gateway.lovable.dev/v1/chat/completions`) with `google/gemini-2.5-flash-image`
3. Receive base64 image data
4. Embed directly into the PDF using `doc.addImage(base64, 'PNG', x, y, w, h)`

Since generation takes time, images will be generated once and cached in storage as separate files. On subsequent PDF builds, the function checks if cached images exist before regenerating.

### Image Caching Strategy
```
sample-books/
  images/
    class-3-hero.png
    class-3-mid.png
    class-5-hero.png
    ...
  class-3-chapter-1.pdf
  class-5-chapter-1.pdf
  ...
```

### Page Order (Updated)
1. Title Page (cover)
2. Table of Contents (new)
3. Content Pages (improved headings, larger illustrations, AI images between blocks)
4. My Notes Page (existing)
5. Color Me! Page (new)
6. End of Sample Page (existing)

## Files Changed
- `supabase/functions/generate-sample-pdf/index.ts` -- Major update:
  - Add `generateAiImage()` helper that calls Lovable AI API
  - Add `renderTocPage()` for Table of Contents
  - Add `renderColorMePage()` for coloring activity
  - Update all heading sizes and alignment in existing renderers
  - Increase inline illustration sizes
  - Add image embedding logic with `doc.addImage()`
  - Add image caching/retrieval from storage

