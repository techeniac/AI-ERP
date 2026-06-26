"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, Users, Layers, CheckCircle2, ChevronRight,
  ChevronLeft, Briefcase, Plus, X, Check, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/stores/auth.store";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────────────────────────────────

interface InviteRow {
  id: string;
  email: string;
  role: string;
}

interface ModuleState {
  key: string;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
}

// ── Constants ────────────────────────────────────────────────────────────────

const EMIRATES = [
  "Dubai", "Abu Dhabi", "Sharjah", "Ajman",
  "Ras Al Khaimah", "Fujairah", "Umm Al Quwain",
];

const INDUSTRIES = [
  "Real Estate", "Financial Services", "Retail & E-Commerce",
  "Logistics & Supply Chain", "Technology", "Healthcare",
  "Hospitality & Tourism", "Construction", "Manufacturing", "Other",
];

const ROLES = [
  "Super Admin", "Finance Manager", "Sales Manager",
  "Support Agent", "Operations", "HR Manager", "Employee",
];

const INITIAL_MODULES: ModuleState[] = [
  { key: "dashboard", label: "Dashboard", description: "KPIs, charts, role-based insights", icon: "📊", enabled: true },
  { key: "crm", label: "CRM", description: "Lead pipeline, deal tracking, AI scoring", icon: "🎯", enabled: true },
  { key: "customers", label: "Customers", description: "Account management, health scores", icon: "👥", enabled: true },
  { key: "finance", label: "Finance", description: "Invoices, AR aging, payments (AED)", icon: "💳", enabled: true },
  { key: "support", label: "Support", description: "Ticket queue, SLA tracking, threads", icon: "🎧", enabled: true },
  { key: "hr", label: "HR", description: "Employees, leave (UAE Labour Law)", icon: "🏢", enabled: true },
  { key: "operations", label: "Operations", description: "Task board, purchase requests", icon: "⚙️", enabled: true },
  { key: "procurement", label: "Procurement", description: "Vendor management, UAE suppliers", icon: "📦", enabled: true },
  { key: "approvals", label: "Approvals", description: "Multi-level approval workflows", icon: "✅", enabled: true },
  { key: "reports", label: "Reports", description: "Analytics, charts, export", icon: "📈", enabled: true },
  { key: "documents", label: "Documents", description: "File library, sharing", icon: "📄", enabled: true },
  { key: "settings", label: "Settings", description: "Org config, TRN, IBAN, VAT", icon: "⚙️", enabled: true },
];

const STEPS = [
  { id: 1, label: "Welcome",         icon: Briefcase },
  { id: 2, label: "Company",         icon: Building2 },
  { id: 3, label: "Team",            icon: Users },
  { id: 4, label: "Modules",         icon: Layers },
  { id: 5, label: "All Set",         icon: CheckCircle2 },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const [step, setStep] = useState(1);

  // Step 1
  const [orgName, setOrgName] = useState("Emaar Properties PJSC");
  const [industry, setIndustry] = useState("Real Estate");

  // Step 2
  const [trn, setTrn] = useState("100345678900001");
  const [tradeLicense, setTradeLicense] = useState("DED-123456");
  const [emirate, setEmirate] = useState("Dubai");
  const [poBox, setPoBox] = useState("123456");
  const [phone, setPhone] = useState("+971 4 123 4567");

  // Step 3
  const [invites, setInvites] = useState<InviteRow[]>([
    { id: "1", email: "", role: "Finance Manager" },
  ]);

  // Step 4
  const [modules, setModules] = useState<ModuleState[]>(INITIAL_MODULES);

  function addInviteRow() {
    setInvites((prev) => [...prev, { id: String(Date.now()), email: "", role: "Employee" }]);
  }

  function removeInviteRow(id: string) {
    setInvites((prev) => prev.filter((r) => r.id !== id));
  }

  function updateInvite(id: string, field: "email" | "role", value: string) {
    setInvites((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  }

  function toggleModule(key: string) {
    setModules((prev) => prev.map((m) => m.key === key ? { ...m, enabled: !m.enabled } : m));
  }

  function handleComplete() {
    setOnboarded();
    toast.success("Workspace ready! Welcome to AI ERP.");
    router.push("/dashboard");
  }

  const enabledCount = modules.filter((m) => m.enabled).length;
  const firstName = currentUser?.name?.split(" ")[0] ?? "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F2D5E] via-[#1a3a6e] to-[#0d2550] flex flex-col items-center justify-center p-4">
      {/* Brand mark */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
          <Briefcase className="h-5 w-5 text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">AI ERP</span>
      </div>

      {/* Step progress */}
      <div className="mb-8 flex items-center gap-0">
        {STEPS.map((s, i) => {
          const isDone = step > s.id;
          const isActive = step === s.id;
          return (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                  isDone  ? "bg-[#0E7B73] border-[#0E7B73] text-white" :
                  isActive ? "bg-white border-white text-[#0F2D5E]" :
                             "bg-white/10 border-white/20 text-white/40"
                )}>
                  {isDone ? <Check className="h-4 w-4" /> : s.id}
                </div>
                <span className={cn(
                  "text-[10px] font-medium tracking-wide hidden sm:block",
                  isActive ? "text-white" : "text-white/40"
                )}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "mx-2 h-0.5 w-12 sm:w-16 transition-all duration-300 mb-4",
                  step > s.id ? "bg-[#0E7B73]" : "bg-white/15"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Step 1 — Welcome */}
        {step === 1 && (
          <StepShell
            title={`Welcome, ${firstName}`}
            subtitle="Let's get your workspace set up. This takes about 2 minutes."
            step={step} total={5}
            onNext={() => setStep(2)}
            nextLabel="Let's go"
          >
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="orgName">Organisation Name</Label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Your company name"
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              {/* Welcome visual */}
              <div className="rounded-xl bg-gradient-to-r from-[#0F2D5E]/5 to-[#0E7B73]/5 border border-[#0E7B73]/15 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-[#0E7B73] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#0F2D5E]">Built for UAE businesses</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      AED currency, 5% VAT, TRN support, UAE Labour Law, Network International payments — all pre-configured.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </StepShell>
        )}

        {/* Step 2 — Company Profile */}
        {step === 2 && (
          <StepShell
            title="Company Profile"
            subtitle="UAE regulatory details used on tax invoices and compliance documents."
            step={step} total={5}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="trn">Tax Registration Number (TRN)</Label>
                  <Input id="trn" value={trn} onChange={(e) => setTrn(e.target.value)} placeholder="100XXXXXXXXX0001" className="h-11" />
                  <p className="text-[11px] text-muted-foreground">15-digit UAE FTA number</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tradeLicense">Trade License Number</Label>
                  <Input id="tradeLicense" value={tradeLicense} onChange={(e) => setTradeLicense(e.target.value)} placeholder="DED-XXXXXX" className="h-11" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="emirate">Emirate</Label>
                  <select
                    id="emirate"
                    value={emirate}
                    onChange={(e) => setEmirate(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {EMIRATES.map((em) => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="poBox">P.O. Box</Label>
                  <Input id="poBox" value={poBox} onChange={(e) => setPoBox(e.target.value)} placeholder="123456" className="h-11" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Business Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 4 XXX XXXX" className="h-11" />
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
                <span className="text-xs text-amber-800">
                  VAT rate is set to <strong>5%</strong> by default (UAE standard). Change anytime in Settings.
                </span>
              </div>
            </div>
          </StepShell>
        )}

        {/* Step 3 — Invite Team */}
        {step === 3 && (
          <StepShell
            title="Invite Your Team"
            subtitle="Add colleagues now — they'll receive an email invite. You can also skip and do this later."
            step={step} total={5}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
            nextLabel="Continue"
            skipLabel="Skip for now"
            onSkip={() => setStep(4)}
          >
            <div className="space-y-3">
              {invites.map((row) => (
                <div key={row.id} className="flex items-center gap-2">
                  <Input
                    type="email"
                    placeholder="colleague@company.com"
                    value={row.email}
                    onChange={(e) => updateInvite(row.id, "email", e.target.value)}
                    className="h-10 flex-1"
                  />
                  <select
                    value={row.role}
                    onChange={(e) => updateInvite(row.id, "role", e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-40 shrink-0"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeInviteRow(row.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addInviteRow}
                className="gap-1.5 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add another
              </Button>
            </div>
          </StepShell>
        )}

        {/* Step 4 — Modules */}
        {step === 4 && (
          <StepShell
            title="Activate Modules"
            subtitle="Choose which modules your team will use. All are on by default — turn off anything you don't need."
            step={step} total={5}
            onBack={() => setStep(3)}
            onNext={() => setStep(5)}
            nextLabel="Finish setup"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">{enabledCount} of {modules.length} modules enabled</span>
                <div className="flex gap-2">
                  <button onClick={() => setModules((p) => p.map((m) => ({ ...m, enabled: true })))} className="text-xs text-[#0E7B73] hover:underline font-medium">All on</button>
                  <span className="text-muted-foreground text-xs">·</span>
                  <button onClick={() => setModules((p) => p.map((m) => ({ ...m, key: m.key === "dashboard" ? m.key : m.key, enabled: m.key === "dashboard" ? true : false })))} className="text-xs text-muted-foreground hover:underline">Minimal</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {modules.map((mod) => (
                  <button
                    key={mod.key}
                    onClick={() => mod.key !== "dashboard" && toggleModule(mod.key)}
                    disabled={mod.key === "dashboard"}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                      mod.enabled
                        ? "border-[#0E7B73]/30 bg-[#0E7B73]/5 hover:bg-[#0E7B73]/10"
                        : "border-border bg-background hover:bg-muted/50 opacity-60",
                      mod.key === "dashboard" && "cursor-default"
                    )}
                  >
                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-base",
                      mod.enabled ? "bg-[#0E7B73]/10" : "bg-muted"
                    )}>
                      <span>{mod.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{mod.label}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{mod.description}</p>
                    </div>
                    <div className={cn(
                      "shrink-0 h-4 w-4 rounded-full border-2 flex items-center justify-center",
                      mod.enabled ? "bg-[#0E7B73] border-[#0E7B73]" : "border-muted-foreground/30"
                    )}>
                      {mod.enabled && <Check className="h-2.5 w-2.5 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </StepShell>
        )}

        {/* Step 5 — All Set */}
        {step === 5 && (
          <div className="p-8 sm:p-10 flex flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0E7B73] to-[#0F2D5E] shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F2D5E] mb-2">You&apos;re all set!</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm">
              {orgName} is ready to go. Your workspace is configured with UAE defaults and {enabledCount} modules activated.
            </p>

            {/* Summary */}
            <div className="w-full max-w-sm space-y-2 mb-8 text-left">
              <SummaryRow label="Organisation" value={orgName} />
              <SummaryRow label="Industry" value={industry} />
              <SummaryRow label="Emirate" value={emirate} />
              <SummaryRow label="Modules active" value={`${enabledCount} of ${modules.length}`} />
              <SummaryRow label="Currency" value="AED (د.إ)" />
              <SummaryRow label="VAT" value="5% (UAE standard)" />
              {invites.some((i) => i.email) && (
                <SummaryRow
                  label="Invites queued"
                  value={`${invites.filter((i) => i.email).length} team member${invites.filter((i) => i.email).length > 1 ? "s" : ""}`}
                />
              )}
            </div>

            <Button
              onClick={handleComplete}
              size="lg"
              className="w-full max-w-sm h-12 bg-[#0F2D5E] hover:bg-[#0F2D5E]/90 text-white font-semibold gap-2"
            >
              Go to Dashboard
              <ChevronRight className="h-4 w-4" />
            </Button>
            <button
              onClick={() => setStep(4)}
              className="mt-3 text-xs text-muted-foreground hover:text-foreground underline"
            >
              Go back and make changes
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-white/30">
        AI ERP by Techeniac &bull; Phase 1 Demo
      </p>
    </div>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

function StepShell({
  title, subtitle, step, total,
  onBack, onNext, onSkip,
  nextLabel = "Continue",
  skipLabel,
  children,
}: {
  title: string;
  subtitle: string;
  step: number;
  total: number;
  onBack?: () => void;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  skipLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-8 sm:p-10">
      {/* Step meta */}
      <div className="mb-1 flex items-center gap-2">
        <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5">
          Step {step} of {total}
        </Badge>
      </div>
      <h2 className="text-xl font-bold text-[#0F2D5E] mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>

      {/* Content */}
      <div className="mb-8">{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        {onBack ? (
          <Button variant="outline" onClick={onBack} className="gap-1.5">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          {skipLabel && onSkip && (
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground text-xs">
              {skipLabel}
            </Button>
          )}
          <Button
            onClick={onNext}
            className="gap-1.5 bg-[#0F2D5E] hover:bg-[#0F2D5E]/90 text-white"
          >
            {nextLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-semibold text-foreground">{value}</span>
    </div>
  );
}
