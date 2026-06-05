import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Owner Sign In — Kloche Interiors" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-3" /> Back to site
        </Link>
        <div className="border border-border bg-card rounded-md p-8 shadow-sm">
          <p className="eyebrow">Owner Portal</p>
          <h1 className="font-display text-3xl mt-2 leading-tight">
            {mode === "signin" ? "Sign in to your atelier" : "Create owner account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {mode === "signup"
              ? "The first account created becomes the admin. Keep this URL private."
              : "Access the Kloche Interiors CRM and appointment scheduler."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-sm px-3 py-2.5 text-sm outline-none focus:border-gold transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive border border-destructive/30 bg-destructive/5 rounded-sm px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-bone text-xs tracking-[0.25em] uppercase px-4 py-3 rounded-sm hover:bg-gold hover:text-ink transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="size-3 animate-spin" />}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-6 transition-colors"
          >
            {mode === "signin"
              ? "First time? Create the owner account →"
              : "Already have an account? Sign in →"}
          </button>
        </div>
      </div>
    </main>
  );
}
