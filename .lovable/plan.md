
# Bug Audit and Fix Plan: Full Website

## Bugs Identified

### Bug 1: Admin Dashboard Quick Action Routes Are Wrong
**File:** `src/pages/Dashboard.tsx` (lines 55-58)
**Issue:** Quick action buttons navigate to `/schools`, `/students`, `/courses`, `/bulk-upload` instead of `/admin/schools`, `/admin/students`, `/admin/courses`, `/admin/bulk-upload`. These routes don't exist -- they'll hit the 404 page.
**Fix:** Update all four `onClick` navigations to include the `/admin` prefix.

### Bug 2: Admin Dashboard "Recent Schools/Students" Links Wrong
**File:** `src/pages/Dashboard.tsx` (lines 244, 260, 308)
**Issue:** "View All" and row click handlers navigate to `/schools` and `/students` instead of `/admin/schools` and `/admin/students`.
**Fix:** Add `/admin` prefix to all navigate calls in the Recent Schools and Recent Students sections.

### Bug 3: Admin Logo Uses Non-Bundled Asset Path
**File:** `src/components/layout/AdminLayout.tsx` (line 75)
**Issue:** `src="/src/assets/brain-logo.png"` -- this absolute path to a source file won't work in production builds. Should use an import.
**Fix:** Import the asset at the top of the file and use the import variable in the `src` attribute.

### Bug 4: Class Selection Bug -- Course Matching Uses `getClassNumber` With Fallback to "3"
**File:** `src/pages/student/GuestDashboard.tsx` (lines 91-94)
**Issue:** The `getClassNumber` function returns `"3"` as default when no class match is found in the course title. This means any course without "class X" in its title will incorrectly appear under Class 3. More critically, if a user selects Class 7 but the course title format doesn't match the regex, they could see wrong courses.
**Fix:** Change the default return to `""` (empty string) so non-matching courses are excluded from filtered views rather than falsely shown.

### Bug 5: GuestSidebar Class Change Triggers Full Page Reload
**File:** `src/components/student/GuestSidebar.tsx` (line 116)  
**File:** `src/components/student/GuestLayout.tsx` (line 81)
**Issue:** `window.location.reload()` causes a full page reload which is jarring UX and loses all React state. The GuestDashboard and GuestCourses components already read from localStorage on mount, but the sidebar/layout don't trigger React re-renders.
**Fix:** Instead of `window.location.reload()`, use React state or a custom event to trigger re-renders. Dispatch a `storage` event or use a shared context/state to propagate class changes across components without reloading.

### Bug 6: GuestDashboard `selectedClass` Default Mismatch
**File:** `src/pages/student/GuestDashboard.tsx` (line 114)
**Issue:** The registration form defaults to `selectedClass = "5"`, but the dashboard UI shows `Class {guestInfo?.selectedClass || "5"}` everywhere as fallback. If a user picks Class 7 and the `getClassNumber` regex fails on some courses, they see a mismatched experience.
**Fix:** Ensure consistent defaults and that the `getClassNumber` function handles all course title formats in the database (verified: titles like "Class 7 -- Algorithms" will match correctly). The fallback `"5"` in display text should use the actual `guestInfo.selectedClass` instead.

### Bug 7: GuestCourses Has Duplicate Registration Handlers
**File:** `src/pages/student/GuestCourses.tsx` (lines 290-302 and 315-327)
**Issue:** Two nearly identical registration handlers: `handleRegistration` and `handleRegistrationSimple`. The form button calls `handleRegistrationSimple` (line 628) but both exist. This is dead code causing confusion.
**Fix:** Remove `handleRegistration` and keep only `handleRegistrationSimple` (or consolidate into one).

### Bug 8: Admin Sidebar Missing "Coding Modules" Nav Item
**File:** `src/components/layout/AdminLayout.tsx` (lines 24-31)
**Issue:** The route `/admin/coding-modules` exists in App.tsx but there's no nav item for it in the admin sidebar. Users can't navigate to it.
**Fix:** Add a nav item for Coding Modules with the Code icon.

### Bug 9: Schools Page Has No Pagination
**File:** `src/pages/Schools.tsx`
**Issue:** Unlike the Students page which has proper pagination, the Schools page loads all schools with no pagination. If many schools exist, this could be slow.
**Fix:** Add pagination similar to the Students page pattern, or at minimum add a note that this is acceptable for the expected data volume.

### Bug 10: Student Dashboard Route `/admin` Not Under ProtectedRoute Correctly
**File:** `src/App.tsx` (lines 147-153)
**Issue:** Admin routes use individual `ProtectedRoute` wrappers on each route instead of a nested route group. While functional, it's verbose. Not a bug per se, but the real issue is that no admin role check exists -- any authenticated user can access admin pages.
**Impact:** Low priority for now, but noted.

---

## Implementation Plan

### Step 1: Fix Admin Dashboard Navigation Routes
Update `src/pages/Dashboard.tsx`:
- Change `/schools` to `/admin/schools`
- Change `/students` to `/admin/students`  
- Change `/courses` to `/admin/courses`
- Change `/bulk-upload` to `/admin/bulk-upload`
- Fix all "View All" and row click navigations similarly

### Step 2: Fix Admin Layout Logo Import
Update `src/components/layout/AdminLayout.tsx`:
- Add `import brainLogo from "@/assets/brain-logo.png";`
- Replace `src="/src/assets/brain-logo.png"` with `src={brainLogo}`
- Add Coding Modules nav item

### Step 3: Fix Class Matching Default
Update `src/pages/student/GuestDashboard.tsx`:
- Change `getClassNumber` fallback from `"3"` to `""`

### Step 4: Clean Up GuestCourses
Update `src/pages/student/GuestCourses.tsx`:
- Remove duplicate `handleRegistration` function

### Step 5: Improve Class Change Without Full Reload
Update `src/components/student/GuestSidebar.tsx` and `src/components/student/GuestLayout.tsx`:
- Replace `window.location.reload()` with a React-friendly approach using a key prop or custom event that triggers re-render without losing the entire app state

## Files Changed
- `src/pages/Dashboard.tsx` -- Fix 8+ broken navigation routes
- `src/components/layout/AdminLayout.tsx` -- Fix logo import, add missing nav item
- `src/pages/student/GuestDashboard.tsx` -- Fix class matching default
- `src/pages/student/GuestCourses.tsx` -- Remove duplicate handler
- `src/components/student/GuestSidebar.tsx` -- Replace window.location.reload
- `src/components/student/GuestLayout.tsx` -- Replace window.location.reload with state-driven refresh
