import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Check, AlertCircle, Loader2, Phone as PhoneIcon } from "lucide-react";
import { chatWithKloAI } from "@/lib/chat.functions";

type Msg = { from: "ai" | "user"; text: string };

const GREETING =
  "Welcome to Kloche Interiors. I'm Klo-AI, your design consultant. Are you reimagining a home or a commercial space today?";

export function KloAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ from: "ai", text: GREETING }]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, sending]);

  async function send() {
    const value = input.trim();
    if (!value || sending) return;
    setError(null);
    const nextMessages: Msg[] = [...messages, { from: "user", text: value }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const history = nextMessages.map((m) => ({
        role: m.from === "ai" ? ("assistant" as const) : ("user" as const),
        content: m.text,
      }));
      const result = await chatWithKloAI({ data: { messages: history } });
      setMessages((p) => [...p, { from: "ai", text: result.text }]);
      if (result.submitted) setSubmitted(true);
    } catch (e) {
      console.error(e);
      setError("We couldn't reach the atelier. Please try again or message us on WhatsApp.");
    } finally {
      setSending(false);
    }
  }

  function retry() {
    setError(null);
    // Re-send last user message
    const lastUser = [...messages].reverse().find((m) => m.from === "user");
    if (lastUser) {
      setInput(lastUser.text);
      setMessages((p) => {
        const idx = [...p].reverse().findIndex((m) => m.from === "user");
        if (idx === -1) return p;
        const realIdx = p.length - 1 - idx;
        return p.slice(0, realIdx);
      });
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Klo-AI consultant"
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 rounded-full bg-ink text-bone pl-5 pr-3 py-3 shadow-2xl hover:scale-[1.02] transition-all animate-pulse-ring"
        >
          <span className="text-sm tracking-wide">Chat with Klo-AI</span>
          <span className="grid place-items-center size-9 rounded-full bg-gold text-ink">
            <MessageCircle className="size-4" />
          </span>
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Klo-AI design consultant chat"
          className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 w-auto sm:w-[380px] max-w-[420px] rounded-xl overflow-hidden bg-card border border-border shadow-2xl animate-fade-up"
        >
          <header className="flex items-center justify-between bg-ink text-bone px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center size-9 rounded-full bg-gold text-ink">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="font-display text-lg leading-none">Klo-AI</p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-gold-soft mt-1">
                  {sending ? "Thinking…" : submitted ? "Request received" : "Design Consultant"}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="opacity-70 hover:opacity-100">
              <X className="size-5" />
            </button>
          </header>

          <div
            ref={scrollRef}
            aria-live="polite"
            className="h-[380px] overflow-y-auto px-4 py-5 space-y-3 bg-background"
          >
            {messages.map((m, i) => (
              <div key={i} className={m.from === "ai" ? "flex" : "flex justify-end"}>
                <div
                  className={
                    m.from === "ai"
                      ? "max-w-[85%] text-sm leading-relaxed text-foreground bg-muted/60 px-4 py-3 rounded-lg rounded-bl-sm whitespace-pre-wrap"
                      : "max-w-[85%] text-sm leading-relaxed bg-ink text-bone px-4 py-3 rounded-lg rounded-br-sm whitespace-pre-wrap"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex">
                <div className="bg-muted/60 px-4 py-3 rounded-lg rounded-bl-sm inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="size-1.5 rounded-full bg-gold animate-pulse [animation-delay:200ms]" />
                  <span className="size-1.5 rounded-full bg-gold animate-pulse [animation-delay:400ms]" />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-2 border border-destructive/40 bg-destructive/5 rounded-lg p-4 animate-fade-up">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{error}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={retry}
                        className="inline-flex items-center gap-2 bg-ink text-bone text-[11px] tracking-[0.2em] uppercase px-4 py-2.5 rounded-sm hover:bg-gold hover:text-ink transition-colors"
                      >
                        Try again
                      </button>
                      <a
                        href="https://wa.me/254717634003"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-border text-[11px] tracking-[0.2em] uppercase px-4 py-2.5 rounded-sm hover:border-gold hover:text-gold transition-colors"
                      >
                        <PhoneIcon className="size-3" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {submitted && (
              <div className="mt-2 border border-gold/40 bg-gold/10 rounded-lg p-4 text-center animate-fade-up">
                <span className="inline-grid place-items-center size-9 rounded-full bg-gold text-ink mb-2">
                  <Check className="size-4" />
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your consultation request has been saved. Our principal designer will reach you on WhatsApp shortly.
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-border bg-card"
          >
            <div className="flex items-center gap-2 px-3 py-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={sending}
                maxLength={2000}
                placeholder="Type your message…"
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="grid place-items-center size-9 rounded-full bg-ink text-bone disabled:opacity-40 hover:bg-gold hover:text-ink transition-colors"
                aria-label="Send"
              >
                {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
