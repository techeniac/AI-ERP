import { formatDistanceToNow, format, parseISO, isValid } from "date-fns";

export function formatCurrency(
  amount: number,
  currency: "AED" | "INR" | "USD" | "GBP" | "EUR" = "AED"
): string {
  const localeMap: Record<string, string> = {
    AED: "en-AE",
    INR: "en-IN",
    USD: "en-US",
    GBP: "en-GB",
    EUR: "de-DE",
  };
  return new Intl.NumberFormat(localeMap[currency] ?? "en-AE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyCompact(
  amount: number,
  currency: "AED" | "INR" | "USD" | "GBP" | "EUR" = "AED"
): string {
  const symbol = { AED: "AED ", INR: "₹", USD: "$", GBP: "£", EUR: "€" }[currency] ?? "AED ";
  if (Math.abs(amount) >= 1_000_000) return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1_000) return `${symbol}${(amount / 1_000).toFixed(1)}K`;
  return `${symbol}${amount.toFixed(0)}`;
}

export function formatDate(dateStr: string | undefined | null, fmt = "dd MMM yyyy"): string {
  if (!dateStr) return "—";
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, fmt) : "—";
  } catch {
    return "—";
  }
}

export function formatDateTime(dateStr: string | undefined | null): string {
  return formatDate(dateStr, "dd MMM yyyy, HH:mm");
}

export function formatRelative(dateStr: string | undefined | null): string {
  if (!dateStr) return "—";
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : "—";
  } catch {
    return "—";
  }
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-AE").format(n);
}

export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
