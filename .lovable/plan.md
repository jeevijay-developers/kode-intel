

# Pre-Generated PDF Downloads for Sample Books

## Problem
Currently, clicking "Download PDF" for classes 3, 5, 8, 9, and 10 triggers slow client-side PDF generation using `html2pdf.js`. The user sees a "Generating..." spinner every time. The goal is to have PDFs pre-built and stored so downloads are instant.

## Solution Overview
Create a backend function that generates branded PDFs from the sample book content using `jsPDF`, stores them in file storage, and updates the download button to simply fetch the stored file -- no more client-side generation.

```text
+---------------------------+         +---------------------+
|  Edge Function            |         |  File Storage       |
|  "generate-sample-pdf"    | ------> |  sample-books/      |
|  Uses jsPDF to build PDF  |         |  class-3-ch1.pdf    |
|  from content data        |         |  class-5-ch1.pdf    |
+---------------------------+         |  class-8-ch1.pdf    |
                                      |  class-9-ch1.pdf    |
                                      |  class-10-ch1.pdf   |
                                      +---------------------+
                                             |
                                      +------v--------------+
                                      |  SampleBookViewer    |
                                      |  Download = direct   |
                                      |  link from storage   |
                                      +---------------------+
```

## Implementation Steps

### 1. Create Storage Bucket
- Create a `sample-books` storage bucket (public read access)
- This will hold all pre-generated PDF files

### 2. Create Edge Function: `generate-sample-pdf`
- Accepts a `classNum` parameter
- Imports the sample book content data (title, subtitle, blocks)
- Uses **jsPDF** (available in Deno) to build a properly formatted PDF with:
  - Branded title page (logo, class number, chapter title, subtitle)
  - Page headers ("KodeIntel -- Class X") and footers (copyright)
  - Proper page breaks between content blocks
  - Text blocks, key terms, step-by-step lists, comparison tables, activities, summaries
- Uploads the generated PDF to the `sample-books` bucket
- Returns the public URL

### 3. Create Admin/Init Trigger
- Add a simple utility (callable from the app or manually) that generates PDFs for all classes (3, 5, 8, 9, 10) that don't already have static files
- This runs once to populate storage, and can be re-run if content changes

### 4. Update `SampleBookViewer.tsx`
- Remove `html2pdf.js` dependency and all client-side generation logic
- Expand `pdfFileMap` to include storage URLs for classes 3, 5, 8, 9, 10
- On component mount, fetch the public URL from storage for the current class
- Download button becomes a simple direct download link -- no spinner, no "Generating..."
- Fallback: if storage file not found, trigger the edge function to generate it (one-time), then download

### 5. Cleanup
- Remove `html2pdf.js` from dependencies
- Remove `src/types/html2pdf.d.ts` type declaration file
- Remove `isGenerating` state and related UI logic

## Technical Details

**Edge Function PDF Generation (jsPDF):**
- Title page with centered logo, class/chapter info, copyright
- Content pages with 12pt body text, 16pt headings
- Color-coded sections (key terms in blue boxes, activities in green boxes)
- Auto page breaks with margins (top: 25mm, bottom: 20mm, sides: 15mm)
- Headers repeat on each page, footer includes page number

**Storage Structure:**
```
sample-books/
  class-3-chapter-1.pdf
  class-5-chapter-1.pdf
  class-8-chapter-1.pdf
  class-9-chapter-1.pdf
  class-10-chapter-1.pdf
```

**Download Flow (after implementation):**
1. User clicks "Download PDF"
2. App checks storage for existing file
3. If exists: instant download via public URL
4. If missing: calls edge function to generate, then downloads (one-time only)

