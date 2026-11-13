# KodeIntel Launch Upgrade Plan

## Goal
Upgrade the existing KodeIntel site for schools and students together, making it easier to understand, navigate and launch. Keep public pricing enquiry-based. Prepare a high-quality, deeper starter curriculum for the first three chapters of Classes 3–10; do not imply the rest of the curriculum is complete.

## Verified starting point
- The live database currently has published courses for Classes 3–10 and 49 published chapters total. The first three published chapters exist for every class.
- Those 24 starter chapters are uneven: they currently contain 5 coding modules total, all in Class 3 Chapter 2; no coding modules are recorded for Classes 4–10.
- Published quizzes exist across the classes, but the first three chapters in Classes 7 and 8 have no quiz questions; Class 9 has only one question across those three chapters.
- Current marketing pages show specific prices and unverified school/student counts, testimonials and feature promises. The contact form currently shows a success message without saving or delivering the enquiry.
- The app already has separate public, student/guest, institution and admin areas, digital books, worksheets, quizzes, Blockly lessons and a remote code runner. These are upgrade foundations, not proof that every class is launch-ready.

## Work plan

### 1. Launch-readiness and evidence audit
- Walk the key journeys end to end: school prospect → enquiry; school/institution → add students and assign learning; student/guest → choose class → find next lesson → read, code and take assessments; admin → review content and manage classes.
- Check route destinations, loading/error/empty states, mobile layouts, chapter/class selection, and existing course/book/video/quiz data. Record defects by user impact and fix confirmed flow blockers.
- Keep security remediation scoped to the exact scan findings previously selected by the user; verify school, student and admin flows are not broken by those changes. Do not dismiss unrelated scan findings.

### 2. Clear school and student experience
- Make the first choice unmistakable: “For Schools” and “For Students”; give each audience a clear next step and consistent navigation.
- For learners, make class, chapter, progress and the single recommended next action obvious. Organize each chapter consistently as Learn (book/video), Practise (worksheet), Code (hands-on activity) and Check (quiz), showing only available, ready content.
- For schools, simplify the path from understanding the offer to requesting a demo, choosing classes, onboarding students and seeing real progress. Improve the institution dashboard with truthful, database-backed measures and useful empty states; remove mock trends or unsupported change claims.
- Keep the existing visual identity while improving clarity, legibility, mobile use and accessible control labels.

### 3. Curriculum and assessment: first three chapters per class
- Create a reviewed class-by-class content map before authoring: concepts, age-appropriate learning outcomes, progression between classes, chapter sequence, practice and assessment coverage.
- Build a repeatable quality standard for each starter chapter: clear outcomes, a structured illustrated digital book with contents and readable headings, accurate examples, meaningful activities, a useful video where available, hands-on coding practice, worksheet questions, and a complete quiz with answer key and feedback.
- Fill the verified coding and quiz gaps in these 24 chapters. Increase coding complexity progressively by class; verify which coding mode/language is appropriate for each class and test remote execution where used (the current compiler depends on the Piston service and internet access).
- Ensure each published quiz has questions, answer choices where applicable, valid scoring/pass rules, and student feedback. Do not publish placeholder lessons, empty assessments or unsupported learning claims.
- Improve book navigation, illustrations, loading/fallback states, reading progress and mobile reading. Preserve and recheck the current sample-book/PDF experience.
- Add a content readiness checklist by class and chapter so incomplete work stays visibly unpublished rather than being presented as ready.

### 4. School marketing and lead handling
- Rewrite school-facing and student-facing messages around verified product capabilities. Remove unverified testimonials, audience counts, outcome claims and contradictory promises; retain only claims supported by current product evidence.
- Remove public price amounts and discounts; use a clear demo/enquiry path and explain that school pricing is provided by enquiry.
- Replace the simulated contact success with a real, validated enquiry flow. Save submissions safely and provide an owner/admin view so school leads are not lost. Do not promise email notifications unless sending is configured and tested; the owner email/domain requirement will be surfaced if needed.
- Make school onboarding steps, supported classes, actual content previews, device/internet requirements and the demo request easy to find.

### 5. Verification before the site is considered launch-ready
- Test desktop and mobile journeys for both audiences, including class switching, chapter navigation, books, worksheets, quizzes, coding, student onboarding, school enquiry and admin content review.
- Reconcile each class’s published content against the readiness checklist; verify no empty quiz is advertised as ready and no unavailable feature appears as a promise.
- Check real-data dashboards, error/loading/empty states, form validation and successful lead storage; check any enabled email delivery with a real send before claiming it works.
- Run the project’s available automated checks and review the preview’s build/runtime signals. Report remaining external dependencies or items needing owner input plainly.

## Technical notes
- Keep the work in the existing React/Vite app and current Lovable Cloud setup; use existing design tokens and shared UI patterns.
- Use the existing course/chapter, book/page/block, video, worksheet, quiz and coding content structures where they fit. Confirm schema and authorization before any database change; apply schema changes through the Lovable Database migration workflow with correct grants and row-level access.
- Keep marketing claims and displayed progress tied to actual data. Treat the current public pricing as unconfirmed and hide amounts as requested.
- The plan covers the existing site upgrade and launch preparation, not a guarantee that every remaining chapter or an external service is already complete.
