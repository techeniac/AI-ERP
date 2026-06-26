# Design System — AI ERP

## Product Context
- **What this is:** AI-native multi-tenant ERP platform for UAE-based businesses
- **Who it's for:** Finance, Sales, Support, HR, and Operations teams at UAE corporates — from SMEs to enterprise (Emaar, Emirates Group, FAB-scale)
- **Space/industry:** Enterprise SaaS / B2B operational platform
- **Project type:** Data-dense web application with two distinct portals (Org ERP + Platform Admin)

## Aesthetic Direction
- **Direction:** Industrial Precision
- **Decoration level:** Intentional — subtle elevation and surface treatment; decoration serves data hierarchy, not decoration for its own sake
- **Mood:** Composed, trustworthy, and sharp. The UI should feel like a Bloomberg terminal crossed with a Stripe dashboard — serious without being austere. Every pixel has a job.
- **Safe choices:** Standard SaaS nav patterns, shadcn/ui components, familiar table/card layouts — UAE corporates expect conventional enterprise UX
- **Deliberate risks:**
  1. Plus Jakarta Sans over Inter — smoother numeric rendering matters for financial data; more refined without trying too hard
  2. 3-level elevation system (flat / raised / floating) to give depth to data without gradients or decorative elements
  3. Stat card left-border colour coding (teal=revenue, amber=AR/risk, red=alerts) — at-a-glance signal without adding icons everywhere

## Typography
- **UI / Body:** Plus Jakarta Sans — clean, humanist grotesque with excellent tabular-numeric support; used in weights 400/500/600/700/800
- **Mono / Code / Data:** Geist Mono — data tables, invoice numbers, TRNs, IBANs
- **Loading:** Next.js `next/font/google` (Plus_Jakarta_Sans), self-hosted via CDN, `display: swap`
- **Feature settings:** `font-feature-settings: "cv02", "cv03", "cv04", "cv11"` on body; `font-variant-numeric: tabular-nums` on all financial figures via `.tabular-nums`
- **Scale:**
  - `text-xs` (12px) — labels, metadata, badges
  - `text-sm` (14px) — body, form fields, table rows
  - `text-base` (16px) — section headings, card titles
  - `text-lg` (18px) — page titles
  - `text-xl` (20px) — onboarding/wizard headings
  - `text-2xl` (24px) — KPI values, dashboard numbers
  - `text-3xl`+ (30px+) — hero/landing only

## Color
- **Approach:** Restrained — one brand teal as the only expressive accent; amber for warnings; red for danger
- **Navy (primary brand):** `#0F2D5E` — sidebar, primary buttons, headings
- **Teal (action / positive):** `#0E7B73` — active states, success, CTA, revenue metrics
- **Amber (warning / AR risk):** `#D97706` — overdue, at-risk, AR aging
- **Danger red:** `#DC2626` — SLA breach, destructive actions, critical errors
- **Neutrals:** White `#FFFFFF` content bg → `oklch(0.97)` muted → `oklch(0.922)` border → `oklch(0.556)` muted text → `oklch(0.145)` foreground
- **Platform Admin accent:** Indigo-900 sidebar — visually distinct from Org ERP navy sidebar
- **Dark mode:** Surfaces shift to `oklch(0.145)`/`oklch(0.205)`; teal becomes primary; saturation reduced ~15%

## Elevation / Shadow System
Three levels — use the lowest level that provides sufficient separation:
```
--shadow-xs:  0 1px 2px 0 rgb(0 0 0 / 0.04)                  /* subtle lift, hover states */
--shadow-sm:  0 1px 3px + 1px 2px -1px rgb(0 0 0 / 0.07)     /* cards (default) */
--shadow-md:  0 4px 6px -1px + 2px 4px -2px rgb(0 0 0 / 0.07) /* raised panels, dropdowns */
--shadow-lg:  0 10px 15px -3px + 4px 6px -4px                 /* modals, popovers */
--shadow-xl:  0 20px 25px -5px + 8px 10px -6px                /* command bars, floating UI */
```
Tailwind utilities: `.shadow-card`, `.shadow-raised`, `.shadow-floating`

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable — enterprise data density without feeling cramped
- **Scale:** 2(8px) → 3(12px) → 4(16px) → 5(20px) → 6(24px) → 8(32px) → 10(40px) → 12(48px)
- **Card padding:** `p-6` (24px) default; `p-4` for compact/mobile; `p-8 sm:p-10` for wizard/onboarding
- **Section gaps:** `space-y-6` between major sections; `space-y-4` within sections

## Layout
- **Approach:** Grid-disciplined — strict column alignment inside the content area; editorial freedom only in marketing/onboarding screens
- **App shell:** Fixed sidebar (w-64) + full-height content area with header (h-16)
- **Content grid:** `grid-cols-4` for KPI cards; `grid-cols-1 lg:grid-cols-3` for detail panels
- **Max content width:** none — full width minus sidebar for data-dense views
- **Border radius:** `--radius: 0.5rem` (8px base); sm=4.8px, md=6.4px, lg=8px, xl=11.2px, 2xl=14.4px
- **Sidebar:** Navy `#0F2D5E` for Org ERP; Indigo-900 for Platform Admin — always distinct, never interchangeable

## Motion
- **Approach:** Minimal-functional — only transitions that aid comprehension or confirm interaction
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`
- **Duration:** micro 50–100ms (state changes), short 150ms (hover), medium 200–300ms (panel open/close), long 400ms (page-level)
- **No scroll-driven animation, no decorative entrance animations** — enterprise users don't want a show

## Component Conventions
- **KPI stat cards:** white bg, `shadow-card`, `border border-border`, colored left-border accent (teal/amber/red) via `border-l-4`
- **Data tables:** zebra-free, hover `bg-muted/40`, sticky header, sortable columns
- **Badges:** `rounded-full px-2 py-0.5 text-xs font-semibold` — semantic color per status
- **Buttons:** primary=navy, secondary=outline, ghost=text-only; no gradient buttons
- **Forms:** `h-10` inputs, `h-11` for wizard/prominent forms, `text-sm` labels

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-26 | Plus Jakarta Sans replaces Inter | Superior tabular numeric rendering for AED financial figures; more refined enterprise feel |
| 2026-06-26 | 3-level elevation token system added | Cards needed visual separation without borders doubling up — shadow-sm as default card level |
| 2026-06-26 | Onboarding wizard at /onboarding | Full-screen, no sidebar — first-run UX requires undivided attention, not the app chrome |
| 2026-06-26 | isOnboarded gated in auth store + (app)/layout | Ensures no user lands in the app without completing setup; persisted across sessions |
