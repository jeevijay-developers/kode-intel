

# Fix: App Build Recovery and Course Loading

## Current Issue
The entire app is showing a blank white page. This is NOT a code bug -- the Vite dev server's dependency cache is stale. Core files (react.js, App.tsx, index.css) are returning 404 from the build server. This is why courses (and everything else) appear to not load.

## Root Cause
After the batch of 6 file edits in the previous bug-fix round, the Vite dev server's pre-bundled dependency cache became desynchronized. The HTML still references old cache-busted URLs (`?t=1772453336480`) that no longer exist on the server.

## Fix Plan

### Step 1: Force a rebuild by making a trivial safe change
Add a harmless comment to `src/main.tsx` to force Vite to invalidate its module graph and rebuild everything from scratch.

### Step 2: Verify the app loads
After the rebuild triggers, verify that:
- The landing page (`/`) renders correctly
- The guest dashboard (`/guest`) loads
- The guest courses page (`/guest/courses`) loads and shows courses from the database
- Supabase API calls succeed (courses, chapters, etc.)

## Files Changed
- `src/main.tsx` -- Add a trivial comment to trigger a rebuild (e.g., `// rebuild trigger`)

## Expected Outcome
Once the rebuild completes, all 8 courses (Class 3-10) will load from the database as expected. The previous bug fixes (admin routes, class selection, etc.) will also be active.

