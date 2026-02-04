

# Replace Sample PDF Books with Real Digital Books + Mobile Responsiveness Fixes

## Overview

This plan addresses four key issues:
1. **Book Store Section** - Currently showing sample PDF-based Class 7 books instead of real digital books
2. **Guest Dashboard Book Section** - Same issue with sample PDF previews 
3. **Mobile Responsiveness** - Various pages need mobile optimization
4. **Code Lab (Blockly)** - Not fully visible on mobile devices

---

## Current Issues Identified

### 1. Sample E-Book Viewer (`SampleEbookViewer.tsx`)
- Uses hardcoded PDF files from `/ebooks/class-4-chapter-1.pdf`, `/ebooks/class-6-chapter-1.pdf`, `/ebooks/class-7-chapter-1.pdf`
- Not connected to the new `digital_books` database content
- Shows only Classes 4, 6, 7 regardless of user's selected class

### 2. Guest Courses Page (`GuestCourses.tsx`)
- Uses PDF-based ebook viewer (`GuestPdfPreview`)
- References sample PDF files instead of digital book system
- Opens external PDF viewer instead of native DigitalBookReader

### 3. Book Store (`EStore.tsx`)
- Uses static `bookData.ts` for content structure
- No integration with actual digital_books database
- Physical book store is separate from digital content (expected behavior)

### 4. Code Lab Mobile Issues
- Blockly workspace not responsive
- Output canvas fixed at 400x400, doesn't scale
- Controls and panels overlap on small screens

---

## Implementation Plan

### Phase 1: Replace Sample Ebook Section with Real Digital Books

**Files to Modify:**
- `src/components/student/SampleEbookViewer.tsx`

**Changes:**
1. Fetch digital books from database instead of hardcoded PDFs
2. Filter by guest's selected class level
3. Navigate to native DigitalBookReader instead of PDF viewer
4. Show actual book content previews with proper styling

**New Logic:**
```text
- Query: SELECT * FROM digital_books WHERE is_published = true
- Filter by class (based on course/chapter relationship)
- Display cards linking to /student/book/:bookId
- Guest users can preview first few pages
```

---

### Phase 2: Update Guest Courses to Use Digital Books

**Files to Modify:**
- `src/pages/student/GuestCourses.tsx`

**Changes:**
1. Replace PDF viewer with navigation to DigitalBookReader
2. Query `digital_books` instead of `chapter_ebooks`
3. Update ebook handling to open `/guest/book/:bookId` route
4. Create guest-accessible book reader route

**New Route Needed:**
- `/guest/book/:bookId` - Guest-accessible digital book reader

---

### Phase 3: Create Guest Digital Book Access

**Files to Create:**
- `src/pages/student/GuestDigitalBook.tsx`

**Features:**
- Read-only digital book viewer for guests
- Limited to first 2-3 pages as preview
- Prompt to sign up for full access
- Content protection (no copy/download)

---

### Phase 4: Mobile-Responsive Code Lab

**Files to Modify:**
- `src/pages/student/BlockCodingLab.tsx`
- `src/components/blockly/BlocklyWorkspace.tsx`
- `src/components/blockly/OutputCanvas.tsx`

**Mobile Layout Changes:**

```text
Desktop Layout (lg+):
┌──────────────────────────────────────────────────────┐
│  Header                                              │
├─────────────────────────┬────────────────────────────┤
│                         │                            │
│   Blockly Workspace     │   Output Canvas/Console    │
│   (60%)                 │   (40%)                    │
│                         │                            │
└─────────────────────────┴────────────────────────────┘

Mobile Layout (< lg):
┌──────────────────────────────┐
│  Header + Controls           │
├──────────────────────────────┤
│                              │
│   Blockly Workspace          │
│   (Full width, 60vh height)  │
│                              │
├──────────────────────────────┤
│   Output (Tabs: Stage/Console)│
│   (Full width, auto height)  │
│                              │
└──────────────────────────────┘
```

**Specific Fixes:**
1. **BlocklyWorkspace**: Set `min-height: 250px` on mobile, scale toolbox
2. **OutputCanvas**: Dynamic sizing based on container width
3. **Control buttons**: Stack vertically on mobile
4. **Tabs for output**: Horizontal scroll if needed

---

### Phase 5: General Mobile Responsiveness Improvements

**Files to Review/Modify:**
- `src/pages/student/GuestDashboard.tsx`
- `src/pages/student/ChapterHome.tsx`
- `src/components/digitalbook/DigitalBookReader.tsx`
- `src/components/worksheet/WorksheetPlayer.tsx`

**Common Mobile Patterns to Apply:**
1. Reduce padding on small screens (`p-4 sm:p-6`)
2. Stack horizontal layouts vertically on mobile
3. Reduce font sizes (`text-sm sm:text-base`)
4. Full-width buttons on mobile
5. Collapsible navigation elements
6. Touch-friendly tap targets (min 44px)

---

## File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `SampleEbookViewer.tsx` | Major rewrite | Fetch real digital books from database |
| `GuestCourses.tsx` | Update ebook handling | Navigate to digital reader instead of PDF |
| `GuestDigitalBook.tsx` | Create new | Guest-accessible limited book preview |
| `BlockCodingLab.tsx` | Mobile responsive | Stack layout, responsive controls |
| `BlocklyWorkspace.tsx` | Mobile responsive | Reduce min-height, scale toolbox |
| `OutputCanvas.tsx` | Mobile responsive | Dynamic canvas sizing |
| `App.tsx` | Add route | `/guest/book/:bookId` route |
| `GuestDashboard.tsx` | Minor tweaks | Mobile spacing improvements |
| `DigitalBookReader.tsx` | Minor tweaks | Mobile touch navigation |

---

## Database Queries to Use

**Fetch Digital Books for a Class:**
```sql
SELECT db.*, c.title as chapter_title, co.title as course_title
FROM digital_books db
JOIN chapters c ON db.chapter_id = c.id
JOIN courses co ON c.course_id = co.id
WHERE db.is_published = true
  AND co.title ILIKE '%Class X%'
ORDER BY c.order_index
```

---

## Expected Outcome

After implementation:

1. **Sample E-Books Section**
   - Shows real digital book previews from database
   - Filters by guest's selected class
   - Opens native in-app reader (not PDF)

2. **Guest Courses**
   - E-Books tab shows digital books from database
   - Clicking opens native DigitalBookReader
   - Guest gets preview of first few pages

3. **Code Lab**
   - Fully usable on mobile devices
   - Blocks visible and draggable
   - Output canvas scales to screen size
   - Controls accessible without scrolling

4. **Mobile Experience**
   - All pages fully responsive
   - Touch-friendly navigation
   - No horizontal scrolling issues
   - Consistent spacing and typography

---

## Technical Considerations

1. **Guest Access Control**
   - Digital books should work without authentication
   - Limit guest preview to first 2-3 pages
   - Encourage signup for full access

2. **Performance**
   - Lazy load book pages
   - Cache digital book data
   - Optimize Blockly workspace rendering on mobile

3. **Content Protection**
   - Maintain no-copy, no-download restrictions
   - Disable right-click on book content
   - Block keyboard shortcuts for saving

