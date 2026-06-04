import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Check } from "lucide-react";

// TODO: Replace with the live Make.com webhook URL
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/your-webhook-id";

type Msg = { from: "ai" | "user"; text: string };
type Step = "type" | "location" | "name" | "phone" | "sending" | "done";

const prompts: Record<Exclude<Step, "sending" | "done">, string> = {
  type: "Welcome to Kloche Interiors. We specialize in curating luxury interior design and premium office fit-outs here in Nairobi. Are you looking to transform a residential home or a commercial business space today?",
  location: "Wonderful. Where is the property located? (e.g. Karen, Westlands, Kilimani)",
  name: "Delighted. May I have your name so our principal designer can address you personally?",
  phone: "Thank you. Lastly, your WhatsApp number — we'll reach out within one business day.",
};

export function KloAI() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("type");
  const [input, setInput] = useState("");
  const [data, setData] = useState({ project: "", location: "", name: "", phone: "" });
  const [messages, setMessages] = useState<Msg[]>([{ from: "ai", text: prompts.type }]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  const push = (m: Msg) => setMessages((p) => [...p, m]);

  async function submit() {
    const value = input.trim();
    if (!value || step === "sending" || step === "done") return;
    push({ from: "user", text: value });
    setInput("");

    const next = { ...data };
    if (step === "type") next.project = value;
    if (step === "location") next.location = value;
    if (step === "name") next.name = value;
    if (step === "phone") next.phone = value;
    setData(next);

    const order: Step[] = ["type", "location", "name", "phone"];
    const idx = order.indexOf(step);
    const nextStep = order[idx + 1];

    if (nextStep) {
      setTimeout(() => push({ from: "ai", text: prompts[nextStep] }), 450);
      setStep(nextStep);
    } else {
      setStep("sending");
      setTimeout(() => push({ from: "ai", text: "Securing your consultation request…" }), 300);
      try {
        await fetch(MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          mode: "no-cors",
          body: JSON.stringify({
            name: next.name,
            phone: next.phone,
            project: next.project,
            location: next.location,
            source: "Kloche Interiors — Klo-AI",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.error("Webhook error", e);
      }
      setStep("done");
    }
  }

  return (
    <>
      {/* Floating bubble */}
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

      {/* Chat panel */}
      {open && (
        <div className="fixed inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 z-50 w-auto sm:w-[380px] max-w-[420px] rounded-xl overflow-hidden bg-card border border-border shadow-2xl animate-fade-up">
          <header className="flex items-center justify-between bg-ink text-bone px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center size-9 rounded-full bg-gold text-ink">
                <Sparkles className="size-4" />
              </span>
              <div>
                <p className="font-display text-lg leading-none">Klo-AI</p>
                <p className="text-[11px] tracking-[0.2em] uppercase text-gold-soft mt-1">Design Consultant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="opacity-70 hover:opacity-100">
              <X className="size-5" />
            </button>
          </header>

          <div ref={scrollRef} className="h-[380px] overflow-y-auto px-4 py-5 space-y-3 bg-background">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "ai" ? "flex" : "flex justify-end"}>
                <div
                  className={
                    m.from === "ai"
                      ? "max-w-[85%] text-sm leading-relaxed text-foreground bg-muted/60 px-4 py-3 rounded-lg rounded-bl-sm"
                      : "max-w-[85%] text-sm leading-relaxed bg-ink text-bone px-4 py-3 rounded-lg rounded-br-sm"
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {step === "done" && (
              <div className="mt-4 border border-gold/40 bg-gold/10 rounded-lg p-5 text-center animate-fade-up">
                <span className="inline-grid place-items-center size-10 rounded-full bg-gold text-ink mb-3">
                  <Check className="size-5" />
                </span>
                <p className="font-display text-xl text-foreground">Thank you, {data.name.split(" ")[0]}.</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Your consultation request has been received. Our principal designer will reach you on WhatsApp shortly.
                </p>
              </div>
            )}
          </div>

          {step !== "done" && (
            <form
              onSubmit={(e) => { e.preventDefault(); submit(); }}
              className="flex items-center gap-2 border-t border-border bg-card px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={step === "sending"}
                placeholder={step === "phone" ? "+254 7XX XXX XXX" : "Type your reply…"}
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={step === "sending" || !input.trim()}
                className="grid place-items-center size-9 rounded-full bg-ink text-bone disabled:opacity-40 hover:bg-gold hover:text-ink transition-colors"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
