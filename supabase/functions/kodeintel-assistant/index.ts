import { streamResponse, GatewayError } from "npm:@lovable.dev/ai-gateway";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FACTS = `KodeIntel is a self-paced, digital-only learning platform that teaches AI, computational thinking and coding to school students in Classes 3 to 10 (aligned with NEP 2020).
- Each class has one course of chapters. Each chapter has 3 modules: Theory (digital book + YouTube videos), Coding (Blockly block-based Code Lab and a real code compiler for older classes), and Worksheet (interactive, auto-checked questions with instant feedback).
- Chapter quizzes: MCQ and true/false, 60% pass mark, unlimited attempts, best score shown.
- Gamification: XP points, levels, daily streaks, badges and achievements.
- Free trial: anyone can try as a guest at /guest for 1 day and switch between classes freely.
- Schools: students are created in bulk by the school; institutions get their own panel to track students. Schools can contact the team via the enquiry / contact form on the website.
- Learning is self-paced with no live tutor. Videos are hosted on YouTube. There are no physical books or printed workbooks and no e-store.
- Typical path for a new visitor: pick your class -> start the guest trial -> open Chapter 1 -> read the book, watch videos -> try the Code Lab -> do the worksheet -> take the quiz.`;

async function curriculum(): Promise<string> {
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: courses } = await sb.from("courses").select("id,title,description,order_index").eq("is_published", true).order("order_index");
    const { data: chapters } = await sb.from("chapters").select("course_id,title,order_index").eq("is_published", true).order("order_index");
    if (!courses?.length) return "";
    return courses.map((c) => {
      const ch = (chapters ?? []).filter((x) => x.course_id === c.id).map((x) => x.title).join("; ");
      return `- ${c.title}${c.description ? ` — ${c.description}` : ""}${ch ? `\n  Chapters: ${ch}` : ""}`;
    }).join("\n");
  } catch { return ""; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const body = await req.json();
    const raw = Array.isArray(body?.messages) ? body.messages : [];
    const messages = raw.slice(-20)
      .filter((m: any) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string")
      .map((m: any) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    if (!messages.length || messages[messages.length - 1].role !== "user") {
      return new Response(JSON.stringify({ error: "No question" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
    }
    const cur = await curriculum();
    const instructions = `You are "Ask KodeIntel", the friendly helper on the KodeIntel website. Answer only questions about KodeIntel (classes, chapters, books, videos, Code Lab, quizzes, worksheets, XP, free trial, schools). Keep answers short, warm and simple — readers may be kids, parents or school staff. Use short markdown lists when helpful. Never invent prices, dates, features or contact details; if unsure, say so and suggest the contact/enquiry form. Politely decline unrelated topics. Reply in the user's language (English, Hindi or Hinglish).

Product facts:
${FACTS}

Live published curriculum:
${cur || "(not available right now)"}`;

    const stream = await streamResponse({
      model: "openai/gpt-6-astra",
      instructions,
      input: messages,
      reasoning: { effort: "low" },
    });
    const enc = new TextEncoder();
    const out = new ReadableStream({
      async start(ctrl) {
        try {
          for await (const ev of stream as AsyncIterable<any>) {
            if (ev?.type === "response.output_text.delta" && typeof ev.delta === "string") ctrl.enqueue(enc.encode(ev.delta));
          }
        } catch (e) {
          console.error("stream error", e);
          ctrl.enqueue(enc.encode("\n\n_Sorry, something went wrong. Please try again._"));
        }
        ctrl.close();
      },
    });
    return new Response(out, { headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" } });
  } catch (e) {
    console.error(e);
    let status = 500, msg = "Assistant is unavailable right now.";
    if (e instanceof GatewayError) {
      if (e.httpStatus === 429) { status = 429; msg = "Too many questions right now — please wait a moment."; }
      if (e.httpStatus === 402) { status = 402; msg = "The assistant is temporarily unavailable."; }
    }
    return new Response(JSON.stringify({ error: msg }), { status, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
