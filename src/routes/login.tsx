import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import { login, getCurrentUserRole } from "@/lib/apiClient";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getCurrentUserRole() === "Super Admin") {
      navigate({ to: "/dashboard" });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email.trim(), password);
      navigate({ to: "/dashboard" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(72,125,255,0.18),transparent_32%),linear-gradient(180deg,oklch(0.985_0.003_250),oklch(0.96_0.01_250))] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-border bg-surface shadow-pop lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-primary via-primary/90 to-slate-900 p-10 text-primary-foreground lg:flex">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_35%)]" />
            <div className="relative">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-white/85">
                <ShieldCheck className="h-5 w-5" /> Progloss Admin
              </div>
              <h1 className="mt-6 max-w-md text-4xl font-black leading-tight tracking-tight">
                Sign in to manage subscriptions, plans, staff, and operations.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/78">
                Access the Super Admin workspace, review live data, and update the platform from one secure dashboard.
              </p>
            </div>

            <div className="relative space-y-3 text-sm text-white/80">
              <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur">
                <div className="font-bold text-white">Single admin login</div>
                <div className="mt-1">Use your Super Admin account to unlock all protected modules.</div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur">
                <div className="font-bold text-white">Server-backed edits</div>
                <div className="mt-1">Updates persist on the backend and sync across the platform.</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
            <div className="w-full max-w-md">
              <div className="mb-8 flex items-center gap-2 text-primary lg:hidden">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-[0.2em]">Progloss Admin</span>
              </div>
              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight text-foreground">Admin login</h2>
                <p className="mt-2 text-sm text-muted-foreground">Sign in with your Super Admin credentials to continue.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="grid gap-1.5">
                  <span className="text-[12px] font-bold text-muted-foreground">Email</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@progloss.local"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      autoComplete="email"
                      required
                    />
                  </div>
                </label>

                <label className="grid gap-1.5">
                  <span className="text-[12px] font-bold text-muted-foreground">Password</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-3">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </label>

                {error ? (
                  <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-card transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Protected admin area · server-authenticated access
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}