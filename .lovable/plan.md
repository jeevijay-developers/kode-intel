# KodeIntel AI Assistant

## What visitors get
- A floating chat button (bottom-right) on every public, student and school page (hidden on admin pages).
- Opens a chat panel: "Ask KodeIntel" with a custom owl-style identity, suggested questions ("Which class should my child start with?", "How does the free trial work?", "What is in the Code Lab?", "How can my school sign up?").
- Answers stream in live, formatted nicely (lists, bold, links).
- One ongoing chat, remembered in this browser; a "Start over" button clears it.
- Answers only about KodeIntel: classes 3-10, chapters, digital books, videos, coding lab, quizzes/worksheets, XP/badges, guest trial, school onboarding, plans. Politely declines unrelated topics and never invents prices or features; points schools to the enquiry form.

## Technical details
- New backend function `kodeintel-assistant` using `@lovable.dev/ai-gateway` `streamResponse` with default model `openai/gpt-6-astra`; system prompt built from a curated product fact sheet (from PROJECT_KNOWLEDGE_BASE / PRD) plus live published course + chapter titles fetched server-side.
- Public (no login), with input limits (message length, last 20 turns) and graceful handling of rate-limit / credit errors.
- Frontend: AI Elements primitives (Conversation, Message, MessageResponse, PromptInput, PromptInputSubmit) in a `AssistantWidget` mounted in `App.tsx`; localStorage key `kodeintel-assistant-v1`; textarea auto-focus; typing indicator.
- Styling via existing design tokens, glassmorphism, Lucide icons (no Sparkles, no emojis).
- Verify via Playwright: open widget, ask a question, see streamed answer, reload and confirm history persists.
