// Semantic color tokens for inline styles and SVG contexts where Tailwind classes cannot be used.
// For Tailwind class contexts, use the equivalent Tailwind utility directly (e.g. text-emerald-500).
export const TOKEN = {
  success:  "#10b981", // emerald-500
  warning:  "#f59e0b", // amber-500
  danger:   "#ef4444", // red-500
  critical: "#dc2626", // red-600
  neutral:  "#6b7280", // gray-500
  info:     "#3b82f6", // blue-500
  purple:   "#8b5cf6", // violet-500
  teal:     "#0e7b73", // brand teal (negotiation stage)
  orange:   "#f97316", // orange-500 (high priority)
  platform: "#4f46e5", // indigo-600 (platform admin brand)
  overdue:  "#7f1d1d", // red-900 (90+ days AR aging)
  track:    "#e5e7eb", // gray-200 (SVG gauge track / chart grid lines)
} as const;
