

## Plan: Add "Sample Book" Tab with Downloadable Chapter Content for Classes 3-10

### Overview
Add a new **"Sample Book"** tab inside the chapter content view that displays a beautifully designed, full first-chapter preview for each class (3-10). Each chapter renders as rich, styled HTML content with a **Download as PDF** button. All remaining "Physical Book" / "Hard Copy" / "E-Store" references will also be removed.

### What Students Will See
- A 4th tab called **"Sample Book"** (with a download icon) alongside Videos, Quizzes, and Books
- When tapped, it shows the full first chapter content rendered in a polished, print-ready layout with:
  - Chapter title and class branding
  - Subtopics with paragraphs, key terms, callouts, step-by-step blocks, and comparison tables
  - Kode Intel branding and decorative icons
  - A prominent **"Download PDF"** button that triggers the browser's print-to-PDF flow
- This tab is visible **only for the first chapter** of each course

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/sampleBookContent.ts` | Contains the full first-chapter content data for all 8 classes (3-10). Each entry includes: title, subtitle, class number, and an array of content blocks (text paragraphs, key terms, callouts, step-by-step instructions, comparison tables, activities). This is the main data source -- rich, educational content tailored to each class level. |
| `src/components/courses/SampleBookViewer.tsx` | A print-optimized component that renders the chapter content beautifully. Features: branded header with gradient, structured content blocks with icons, a floating "Download as PDF" button using `window.print()` with `@media print` CSS for clean output. Responsive for both mobile and desktop. |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/courses/CourseContentView.tsx` | (1) Add `"sample"` to the `contentTab` state type. (2) Add a 4th tab button in both mobile tab bar (lines 190-232) and desktop tabs (lines 544-579). (3) Add the SampleBookViewer rendering for `contentTab === "sample"` in both mobile content area and desktop content area. (4) Conditionally show the tab only when `selectedChapterIndex === 0`. (5) **Remove** both Physical Book cards (mobile: lines 445-470, desktop: lines 676-694). |
| `src/pages/student/GuestCourses.tsx` | Remove the "Physical Book Note" section (~lines 472-480) and the "Physical Books Available!" card (~lines 852-875) that reference `/store`. |
| `src/components/layout/Footer.tsx` | Remove the "E-Store" link from the footer navigation (line 24). |
| `src/components/landing/MobilePricing.tsx` | Remove "Physical Workbook" from the plan features list (line 36) and update the non-popular plan CTA to navigate to `/student/signup` instead of `/store` (line 129). |
| `src/pages/SchoolPartnership.tsx` | Change "Physical Workbook" to "Interactive Digital Textbook" in the features list (line 545). |
| `src/index.css` | Add `@media print` styles for clean PDF output -- hide navigation, headers, footers, and non-content elements when printing. |

### Content Strategy (sampleBookContent.ts)
Each class gets a complete first chapter with 8-12 content blocks following the educational sequence:

- **Class 3**: "Meet the Computer" -- basic parts of a computer, input/output devices, simple activities
- **Class 4**: "Patterns Around Us" -- recognizing patterns in nature, sequences, simple coding patterns
- **Class 5**: "Thinking Like a Computer" -- computational thinking pillars, decomposition, abstraction
- **Class 6**: "Introduction to Algorithms" -- what are algorithms, flowcharts, pseudocode basics
- **Class 7**: "Data All Around Us" -- types of data, data representation, binary basics
- **Class 8**: "What is AI?" -- artificial intelligence intro, everyday AI examples, Turing test
- **Class 9**: "How Machines Learn" -- supervised/unsupervised learning, training data, model basics
- **Class 10**: "AI in the Real World" -- AI applications, ethics, career paths in AI

Each includes: introductory text, callout boxes, key term definitions, step-by-step instructions, comparison tables, hands-on activities, and summary sections.

### Download Mechanism
- Uses `window.print()` which triggers the browser's native "Save as PDF" dialog
- Print-specific CSS (`@media print`) ensures:
  - Navigation, headers, footers are hidden
  - Content is formatted for A4 paper
  - Colors and backgrounds are preserved (`-webkit-print-color-adjust: exact`)
  - Page breaks are handled gracefully between content blocks
  - Kode Intel branding appears on the printed output

### Physical Book Cleanup Summary
All references to physical books, hard copies, the `/store` route, and "Buy Books" CTAs will be removed from:
- CourseContentView (mobile + desktop book tabs)
- GuestCourses (PDF preview note + bottom card)
- Footer (E-Store link)
- MobilePricing (feature list + CTA)
- SchoolPartnership (feature comparison)

