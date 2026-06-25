"use client";

import { DollarSign, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { usePlatformAuthStore, type PlatformCurrency } from "@/lib/stores/platform-auth.store";
import { toast } from "sonner";

const CURRENCIES: { value: PlatformCurrency; label: string; symbol: string; description: string }[] = [
  {
    value: "AED",
    label: "UAE Dirham (AED)",
    symbol: "د.إ",
    description: "Default currency for all platform billing, MRR reporting, and tenant invoicing.",
  },
  {
    value: "USD",
    label: "US Dollar (USD)",
    symbol: "$",
    description: "Switch MRR and billing displays to USD. Useful for international investor reporting.",
  },
];

export default function PlatformSettingsPage() {
  const platformCurrency = usePlatformAuthStore((s) => s.platformCurrency);
  const setCurrency = usePlatformAuthStore((s) => s.setCurrency);

  function handleCurrencyChange(currency: PlatformCurrency) {
    if (currency === platformCurrency) return;
    setCurrency(currency);
    toast.success(`Platform currency changed to ${currency}`);
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
          <Settings className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Platform Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Global configuration for the platform</p>
        </div>
      </div>

      {/* Currency */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-indigo-600" />
            <CardTitle className="text-base">Platform Currency</CardTitle>
          </div>
          <CardDescription>
            Sets the default display currency for MRR, billing totals, and org-level financial summaries across the platform.
            Individual invoices retain their original currency.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {CURRENCIES.map((c) => {
            const isSelected = platformCurrency === c.value;
            return (
              <button
                key={c.value}
                onClick={() => handleCurrencyChange(c.value)}
                className={`w-full flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                    : "border-border hover:bg-muted/50 hover:border-indigo-200"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold ${
                  isSelected ? "bg-indigo-100 text-indigo-700" : "bg-muted text-muted-foreground"
                }`}>
                  {c.symbol}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{c.label}</p>
                    {isSelected && (
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                </div>
                <div className={`h-4 w-4 shrink-0 mt-0.5 rounded-full border-2 transition-colors ${
                  isSelected ? "border-indigo-600 bg-indigo-600" : "border-muted-foreground"
                }`} />
              </button>
            );
          })}
          <p className="text-xs text-muted-foreground pt-1">
            Current: <strong>{platformCurrency}</strong> — persisted across sessions.
          </p>
        </CardContent>
      </Card>

      {/* Placeholder for future settings */}
      <Card className="opacity-60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-muted-foreground">Date &amp; Time Format</CardTitle>
          <CardDescription>Region and format preferences — coming in a future release.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-lg border border-dashed p-3">
            <span className="text-xs text-muted-foreground">Timezone: Asia/Dubai (GST +4:00) · Date: DD/MM/YYYY · Week starts: Monday</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
