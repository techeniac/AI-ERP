"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/use-auth";
import { mockUsers } from "@/lib/mock/users";
import { toast } from "sonner";
const DEMO_PRESETS = [
  { email: "admin@demo.com", label: "Admin", role: "Super Admin" },
  { email: "finance@demo.com", label: "Finance", role: "Finance Manager" },
  { email: "sales@demo.com", label: "Sales", role: "Sales Manager" },
  { email: "support@demo.com", label: "Support", role: "Support Agent" },
  { email: "ops@demo.com", label: "Ops", role: "Operations" },
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      toast.error("No account found for that email.", { description: "Try one of the demo presets below." });
      setLoading(false);
      return;
    }
    signIn(user);
    toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
  }

  function fillPreset(presetEmail: string) {
    setEmail(presetEmail);
    setPassword("demo1234");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--brand-navy)] via-[var(--login-grad-mid)] to-[var(--login-grad-deep)] p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / brand */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm shadow-lg">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI ERP</h1>
          <p className="mt-1 text-sm text-white/60">Operational Intelligence Platform</p>
        </div>

        <Card className="shadow-2xl border-white/10 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold text-center">Sign in</CardTitle>
            <CardDescription className="text-center text-sm">
              Enter your credentials or use a demo preset
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Any password works for demo accounts
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-[var(--brand-navy)] hover:bg-[var(--brand-navy)]/90 text-white font-semibold"
                disabled={loading || !email}
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-0">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Demo presets</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5 w-full">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.email}
                  type="button"
                  onClick={() => fillPreset(preset.email)}
                  className="flex flex-col items-center gap-0.5 rounded-lg border border-input bg-background py-2 px-1 text-xs font-semibold text-foreground transition-all hover:bg-muted hover:scale-105 active:scale-95"
                >
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Click a preset, then sign in. Any password works.
              </p>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-white/40">
          Phase 1 — Mock Data Demo &bull; No backend required
        </p>
      </div>
    </div>
  );
}
