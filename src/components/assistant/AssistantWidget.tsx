import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Bird, X, Send, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };
const KEY = "kodeintel-assistant-v1";
const URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kodeintel-assistant`;
const SUGGESTIONS = [
  "Which class should my child start with?",
  "How does the free trial work?",
  "What is in the Code Lab?",
  "How can my school sign up?",
];

const load = (): Msg[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};

export default function AssistantWidget() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(load);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (!busy) localStorage.setItem(KEY, JSON.stringify(msgs)); }, [msgs, busy]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);
  useEffect(() => { if (open && !busy) taRef.current?.focus(); }, [open, busy]);

  if (pathname.startsWith("/admin")) return null;

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    const history: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Assistant is unavailable right now.");
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...history, { role: "assistant", content: acc }]);
      }
    } catch (e) {
      setMsgs([...history, { role: "assistant", content: `_${(e as Error).message}_` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[60] flex h-[min(600px,75vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-border/60 bg-background/85 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 border-b border-border/60 bg-primary/10 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Bird className="h-5 w-5" /></div>
            <div className="flex-1">
              <p className="font-semibold leading-tight">Ask KodeIntel</p>
              <p className="text-xs text-muted-foreground">Questions about classes, trial & schools</p>
            </div>
            {msgs.length > 0 && (
              <Button size="icon" variant="ghost" aria-label="Start over" disabled={busy} onClick={() => setMsgs([])}><RotateCcw className="h-4 w-4" /></Button>
            )}
            <Button size="icon" variant="ghost" aria-label="Close assistant" onClick={() => setOpen(false)}><X className="h-4 w-4" /></Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Hi! Ask me anything about learning on KodeIntel.</p>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="block w-full rounded-2xl border border-border/60 bg-card/60 px-3 py-2 text-left text-sm transition hover:border-primary hover:bg-primary/5">{s}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-sm text-primary-foreground">{m.content}</div>
              ) : (
                <div key={i} className="max-w-[95%] text-sm">
                  {m.content ? (
                    <div className="space-y-2 leading-relaxed [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Thinking…</span>
                  )}
                </div>
              )
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-end gap-2 border-t border-border/60 p-3">
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              rows={1}
              maxLength={2000}
              placeholder="Type your question…"
              aria-label="Your question"
              className="max-h-32 min-h-[40px] flex-1 resize-none rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" size="icon" aria-label="Send" disabled={busy || !input.trim()} className="h-10 w-10 shrink-0 rounded-2xl">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      )}
      <button
        aria-label={open ? "Close assistant" : "Ask KodeIntel"}
        onClick={() => setOpen((o) => !o)}
        className={cn("fixed bottom-5 right-4 z-[60] flex items-center gap-2 rounded-full bg-primary px-4 py-3 font-semibold text-primary-foreground shadow-xl transition hover:scale-105")}
      >
        {open ? <X className="h-5 w-5" /> : <Bird className="h-5 w-5" />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask KodeIntel"}</span>
      </button>
    </>
  );
}
