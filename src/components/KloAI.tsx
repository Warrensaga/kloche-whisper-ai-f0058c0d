import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Check, AlertCircle, Loader2, Phone as PhoneIcon } from "lucide-react";
import { submitEnquiry } from "@/lib/enquiries.functions";

type Msg = { from: "ai" | "user" | "system"; text: string };
type Step = "type" | "location" | "name" | "phone" | "sending" | "error" | "done";

const prompts: Record<Exclude<Step, "sending" | "error" | "done">, string> = {
  type: "Welcome to Kloche Interiors. We specialize in curating luxury interior design and premium office fit-outs here in Nairobi. Are you looking to transform a residential home or a commercial business space today?",
  location: "Wonderful. Where is the property located? (e.g. Karen, Westlands, Kilimani)",
  name: "Delighted. May I have your name so our principal designer can address you personally?",
  phone: "Thank you. Lastly, your WhatsApp number — we'll reach out within one business day.",
};

// Validation helpers
function validateField(step: Step, value: string): string | null {
  const v = value.trim();
  if (!v) return "Please enter a response to continue.";
  if (v.length > 200) return "Please keep your response under 200 characters.";

  if (step === "type") {
    if (v.length < 3) return "Could you share a little more detail?";
  }
  if (step === "location") {
    if (v.length < 2) return "Please share the area or neighbourhood.";
  }
  if (step === "name") {
    if (v.length < 2) return "Please share your full name.";
    if (!/^[a-zA-Z\u00C0-\u017F'’.\-\s]+$/.test(v)) return "Names should only contain letters.";
  }
  if (step === "phone") {
    const digits = v.replace(/[^\d]/g, "");
    if (digits.length < 9 || digits.length > 15) {
      return "Please enter a valid WhatsApp number (9–15 digits).";
    }
    if (!/^\+?[\d\s\-()]+$/.test(v)) {
      return "Use digits, spaces, +, -, or () only.";
    }
  }
  return null;
}

function normalizePhone(raw: string): string {
  const trimmed = raw.trim().replace(/[\s\-()]/g, "");
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("0")) return "+254" + trimmed.slice(1);
  if (trimmed.startsWith("254")) return "+" + trimmed;
  return trimmed;
}

export function KloAI() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("type");
  const [input, setInput] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [data, setData] = useState({ project: "", location: "", name: "", phone: "" });
  const [messages, setMessages] = useState<Msg[]>([{ from: "ai", text: prompts.type }]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  // Clear field error as the user edits
  useEffect(() => {
    if (fieldError) setFieldError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  const push = (m: Msg) => setMessages((p) => [...p, m]);

  async function sendToWebhook(payload: typeof data): Promise<boolean> {
    try {
      const phone = normalizePhone(payload.phone);
      await submitEnquiry({
        data: {
          name: payload.name,
          phone,
          service: "Interior Design",
          message: `Project type: ${payload.project}\nLocation: ${payload.location}\nSubmitted via Klo-AI consultant.`,
          source: "Klo-AI",
        },
      });
      return true;
    } catch (e) {
      console.error("Klo-AI submit error:", e);
      return false;
    }
  }

  async function finalize(payload: typeof data) {
    setStep("sending");
    push({ from: "system", text: "Securing your consultation request…" });
    const ok = await sendToWebhook(payload);
    if (ok) {
      setStep("done");
    } else {
      setRetryCount((c) => c + 1);
      setStep("error");
    }
  }

  function retry() {
    finalize(data);
  }

  async function submit() {
    if (step === "sending" || step === "done") return;

    const value = input.trim();
    const err = validateField(step, value);
    if (err) {
      setFieldError(err);
      return;
    }

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
      const promptText = prompts[nextStep as Exclude<Step, "sending" | "error" | "done">];
      setTimeout(() => push({ from: "ai", text: promptText }), 450);
      setStep(nextStep);
    } else {
      await finalize(next);
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
                  {step === "sending" ? "Sending…" : step === "error" ? "Connection issue" : "Design Consultant"}
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
            {messages.map((m, i) => {
              if (m.from === "system") {
                return (
                  <div key={i} className="flex justify-center">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground inline-flex items-center gap-2">
                      <Loader2 className="size-3 animate-spin" /> {m.text}
                    </p>
                  </div>
                );
              }
              return (
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
              );
            })}

            {step === "sending" && (
              <div className="flex">
                <div className="bg-muted/60 px-4 py-3 rounded-lg rounded-bl-sm inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="size-1.5 rounded-full bg-gold animate-pulse [animation-delay:200ms]" />
                  <span className="size-1.5 rounded-full bg-gold animate-pulse [animation-delay:400ms]" />
                </div>
              </div>
            )}

            {step === "error" && (
              <div className="mt-2 border border-destructive/40 bg-destructive/5 rounded-lg p-5 animate-fade-up">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-display text-lg text-foreground leading-tight">
                      We couldn't reach our atelier
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {retryCount > 1
                        ? "Still no luck. Please try once more or message us directly on WhatsApp."
                        : "It might be a momentary network issue. Please try again."}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
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

            {step === "done" && (
              <div className="mt-4 border border-gold/40 bg-gold/10 rounded-lg p-5 text-center animate-fade-up">
                <span className="inline-grid place-items-center size-10 rounded-full bg-gold text-ink mb-3">
                  <Check className="size-5" />
                </span>
                <p className="font-display text-xl text-foreground">
                  Thank you{data.name ? `, ${data.name.split(" ")[0]}` : ""}.
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Your consultation request has been received. Our principal designer will reach you on WhatsApp shortly.
                </p>
              </div>
            )}
          </div>

          {step !== "done" && step !== "error" && (
            <form
              onSubmit={(e) => { e.preventDefault(); submit(); }}
              className="border-t border-border bg-card"
            >
              {fieldError && (
                <p className="px-4 pt-2 text-[11px] text-destructive flex items-center gap-1.5">
                  <AlertCircle className="size-3" /> {fieldError}
                </p>
              )}
              <div className="flex items-center gap-2 px-3 py-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={step === "sending"}
                  inputMode={step === "phone" ? "tel" : "text"}
                  autoComplete={step === "phone" ? "tel" : step === "name" ? "name" : "off"}
                  maxLength={step === "phone" ? 20 : 200}
                  placeholder={step === "phone" ? "+254 7XX XXX XXX" : "Type your reply…"}
                  aria-invalid={!!fieldError}
                  className={`flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground ${
                    fieldError ? "text-destructive" : ""
                  }`}
                />
                <button
                  type="submit"
                  disabled={step === "sending" || !input.trim()}
                  className="grid place-items-center size-9 rounded-full bg-ink text-bone disabled:opacity-40 hover:bg-gold hover:text-ink transition-colors"
                  aria-label="Send"
                >
                  {step === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}
