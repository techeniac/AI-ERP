# AI-Native ERP — Project Walkthrough

> Phase 1: Frontend Prototype (Next.js + Mock Data)
> Live: deployed on Vercel | Repo: github.com/techeniac/AI-ERP

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Running Locally](#3-running-locally)
4. [Architecture](#4-architecture)
5. [Demo Login Credentials](#5-demo-login-credentials)
6. [Org-Level ERP — Module Walkthrough](#6-org-level-erp--module-walkthrough)
7. [Platform Admin Console — Walkthrough](#7-platform-admin-console--walkthrough)
8. [UAE / Dubai Localisation](#8-uae--dubai-localisation)
9. [Role-Based Access Control](#9-role-based-access-control)
10. [AI Assistant](#10-ai-assistant)
11. [Phase 2 Roadmap](#11-phase-2-roadmap)

---

## 1. Project Overview

An AI-native ERP and operational platform built for UAE-based businesses. The system has two distinct layers:

- **Org-level ERP** — used by client organisations (finance, sales, HR, support, operations)
- **Platform Admin Console** — used internally to manage tenants, billing, plans, and system health

Phase 1 is a fully functional frontend prototype with realistic UAE mock data. No backend exists yet — all data is served through TanStack Query hooks over in-memory mock datasets.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI Components | shadcn/ui + Tailwind CSS v4 |
| State Management | Zustand 5 with persist middleware |
| Data Fetching | TanStack Query v5 (all mock data via `useQuery`) |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| AI Chat | Vercel AI SDK + OpenAI |
| Language | TypeScript (strict mode, zero `any`) |
| Package Manager | pnpm workspaces |
| Monorepo | `ai-erp/` root → `apps/web/` |
| Pre-commit | Husky — blocks commits with TypeScript errors |
| Deployment | Vercel |

---

## 3. Running Locally

```bash
# Clone the repo
git clone https://github.com/techeniac/AI-ERP.git
cd AI-ERP

# Install dependencies (from monorepo root)
pnpm install

# Start the dev server
pnpm dev
# → http://localhost:3001
```

**Optional — AI Assistant:**
```bash
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local and add your OpenAI key:
# OPENAI_API_KEY=sk-...
```

The app runs fully without the OpenAI key — only the AI chat panel will show an error.

---

## 4. Architecture

```
ai-erp/
├── apps/
│   └── web/                        # Next.js application
│       ├── app/
│       │   ├── (app)/              # Org-level ERP routes (authenticated)
│       │   │   ├── dashboard/
│       │   │   ├── finance/        # Invoices, payments, AR aging
│       │   │   ├── crm/            # Leads pipeline
│       │   │   ├── customers/      # Customer accounts
│       │   │   ├── support/        # Tickets
│       │   │   ├── hr/             # Employees
│       │   │   ├── operations/     # Tasks, purchase requests
│       │   │   ├── procurement/    # Vendor management
│       │   │   ├── approvals/      # Approval workflows
│       │   │   ├── reports/        # Analytics
│       │   │   ├── documents/      # Document library
│       │   │   └── settings/       # Org configuration
│       │   ├── platform/
│       │   │   ├── login/          # Platform admin login
│       │   │   └── (admin)/        # Platform admin routes
│       │   │       ├── dashboard/
│       │   │       ├── organizations/
│       │   │       ├── users/
│       │   │       ├── billing/
│       │   │       ├── plans/      # Subscription plan config
│       │   │       ├── feature-flags/
│       │   │       ├── announcements/
│       │   │       ├── audit-logs/
│       │   │       ├── system/
│       │   │       └── settings/   # Platform currency (AED/USD)
│       │   └── login/              # Org user login
│       ├── components/
│       │   ├── layout/             # Sidebar, header, AI command bar
│       │   ├── platform/           # Platform sidebar
│       │   ├── shared/             # StatCard, DataTable, StatusBadge, etc.
│       │   └── ui/                 # shadcn/ui primitives
│       ├── lib/
│       │   ├── mock/               # 16 mock data files (UAE data)
│       │   ├── stores/             # Zustand stores (auth, platform-auth, ui)
│       │   ├── types/              # TypeScript interfaces
│       │   └── utils/              # formatCurrency, formatDate, permissions
│       └── vercel.json
├── vercel.json                     # Monorepo build config for Vercel
├── .npmrc                          # pnpm strict-peer-dependencies=false
└── .husky/pre-commit               # TypeScript check on every commit
```

**Key convention:** Every data fetch goes through a `useQuery` hook — never a direct import from `lib/mock/`. This means swapping mock data for real API calls in Phase 2 requires only changing the `queryFn`.

---

## 5. Demo Login Credentials

### Org-Level ERP
URL: `/login` (or `/`)

Any password works for all demo accounts.

| Role | Email | What they see |
|---|---|---|
| Super Admin | `admin@demo.com` | Full access to all modules |
| Finance Manager | `finance@demo.com` | Finance, invoices, payments, reports |
| Sales Manager | `sales@demo.com` | CRM, leads, customers |
| Support Agent | `support@demo.com` | Support tickets only |
| Operations | `ops@demo.com` | Operations, procurement, tasks |

Click any preset on the login page, then click **Sign In**.

### Platform Admin Console
URL: `/platform/login`

| Email | Password |
|---|---|
| `platform@admin.com` | `admin1234` |

---

## 6. Org-Level ERP — Module Walkthrough

### Dashboard (`/dashboard`)
Role-specific dashboards — each role sees different KPI cards and charts:
- **Super Admin** — full business overview: revenue, AR aging, open tickets, pipeline, headcount
- **Finance** — cash flow, invoice status, AR aging breakdown
- **Sales** — pipeline by stage, lead conversion, top customers
- **Support** — ticket volume, SLA compliance, open vs resolved
- **Operations** — task completion, procurement spend, vendor performance

KPIs are colour-coded with trend indicators (up/down/flat vs prior period).

### Finance (`/finance`)
- Invoice list with status filters (draft / sent / paid / overdue / cancelled)
- Invoice detail page: line items, 5% UAE VAT, UAE IBAN bank details
- AR aging summary (current / 1–30 / 31–60 / 60+ days)
- Payments log with UAEFTS/SWIFT references
- All amounts in AED

### CRM (`/crm`)
- Lead pipeline with Kanban-style stage view
- 7-stage funnel: New → Contacted → Qualified → Proposal → Negotiation → Won → Lost
- AI lead health score (0–100) per lead
- Lead detail: activity timeline, contact info, deal value
- Leads from UAE companies (Careem, FAB, Gulf Capital, Atlantis, Mashreq, etc.)

### Customers (`/customers`)
- 30 UAE customer accounts with health scores
- Customer detail: invoice history, open tickets, contacts, account manager
- Status: active / inactive / prospect / churned
- Mix of AED and USD accounts (international clients)

### Support (`/support`)
- Ticket queue with priority / status / SLA filters
- Ticket detail: message thread, internal notes, assignee, SLA timer
- Customers: Emirates NBD, DAMAC, Aldar, Etihad, etc.
- VAT references in ticket content (not GST)

### HR (`/hr`)
- 21 employees with UAE phone numbers (+971) and AED salaries
- Leave balances per UAE Labour Law (30 days annual, 15 days sick)
- Employee detail: job info, salary, leave history, manager

### Operations (`/operations`)
- Task board: open, in-progress, completed, blocked
- Purchase requests with AED amounts and UAE vendor names

### Procurement (`/procurement`)
- 12 UAE vendors: PwC ME, Amazon AWS, Grand Stores LLC, Al Tamimi & Co, Aramex, Schneider Electric Gulf, Microsoft Gulf, etc.
- Vendor detail: TRN, payment terms, performance rating

### Approvals (`/approvals`)
- Multi-level approval workflows for invoices, expenses, purchase requests
- Status: pending / approved / rejected / escalated

### Settings (`/settings`)
UAE-localised company configuration:
- **TRN** (Tax Registration Number) — format: 100XXXXXXXXX0001
- **Trade License Number**
- **CR Number** (Commercial Registration)
- **IBAN** — format: AE + 21 digits
- **Emirate** selector (Dubai, Abu Dhabi, Sharjah, etc.)
- **P.O. Box** (replaces PIN code)
- **Timezone**: Asia/Dubai (GST +4:00)
- **Currency**: AED default
- **VAT Rate**: 5% (UAE standard)
- **Fiscal Year**: January–December (UAE standard)
- **Payment Gateway**: Network International (UAE)

---

## 7. Platform Admin Console — Walkthrough

URL: `/platform/login`
Theme: Indigo sidebar — visually distinct from the org-level ERP.

### Dashboard (`/platform/dashboard`)
Platform-wide health overview:
- Total orgs, active orgs, MRR, ARR, churn rate
- MRR trend chart (12 months)
- Org growth over time
- System health indicators

### Organizations (`/platform/organizations`)
Manage all 10 tenant organisations:

| Org | Plan | Status |
|---|---|---|
| Emaar Properties PJSC | Enterprise | Active |
| Emirates Group | Enterprise | Active |
| Majid Al Futtaim Holding | Growth | Active |
| DP World Limited | Growth | Active |
| First Abu Dhabi Bank (FAB) | Growth | Active |
| Aldar Properties PJSC | Growth | Active |
| Noon.com FZ LLC | Enterprise | Suspended |
| Careem Networks FZ LLC | Starter | Trial |
| Dubizzle Group (Bayut) | Starter | Trial |
| Kitopi DMCC | Starter | Churned |

Actions per org: **Upgrade plan**, **Suspend**, **Reactivate**, **View detail**
Org detail: module list, user count, storage usage, MRR, audit history.

### Users (`/platform/users`)
- 25 platform users across all orgs (Arabic, South Asian expat, Western expat names)
- KPI cards: Total / Active / Inactive / Invited
- Actions: **Invite User** (dialog), **Deactivate / Reactivate**, **Reset Password**, **Resend Invite**

### Billing (`/platform/billing`)
- Total MRR, ARR, paying org count, avg MRR per org
- Revenue by plan breakdown (Starter / Growth / Enterprise)
- Top organisations by MRR
- All active subscriptions table

### Plans (`/platform/plans`)
Configure subscription plan definitions:

| Plan | Price | Users | Storage | Modules |
|---|---|---|---|---|
| Starter | Free | 10 | 5 GB | 5/12 |
| Growth | AED 1,499/mo | 50 | 50 GB | 9/12 |
| Enterprise | AED 4,999/mo | Unlimited | Unlimited | 12/12 |

**Edit dialog** per plan: tagline, monthly/annual price (AED), max users, max storage, trial days, toggle any of the 12 modules on/off.
**Active toggle** per plan: deactivate a plan to stop new signups.

### Feature Flags (`/platform/feature-flags`)
8 feature flags across categories (AI, Finance, CRM, Platform):
- Toggle globally on/off
- Per-org overrides
- Rollout percentage control
- Examples: AI Suggested Replies, AI Lead Scoring, Multi-Currency, SSO/SAML

### Announcements (`/platform/announcements`)
- Create announcements targeting all orgs or specific plan tiers
- Types: info / warning / maintenance / feature
- Status: draft / scheduled / sent
- Rich text body with plan targeting

### Audit Logs (`/platform/audit-logs`)
Cross-org audit trail:
- Actions: LOGIN, INVOICE_APPROVED, USER_CREATED, ORG_SUSPENDED, PLAN_UPGRADED, etc.
- Filtered by org, user, action type, date range
- UAE IP addresses, AED amounts, TRN/VAT references

### System Health (`/platform/system`)
- Service status indicators (API, database, queues, etc.)
- Response time metrics
- Error rate charts

### Settings (`/platform/settings`)
- **Platform Currency**: AED or USD toggle — persisted in browser storage, reflected in the header badge and all billing displays across the Platform Admin console

---

## 8. UAE / Dubai Localisation

Every aspect of the system is localised for the UAE market:

| Area | Detail |
|---|---|
| Currency | AED (د.إ) default, compact format: AED 1.2M / AED 450K |
| Tax | 5% UAE VAT (replaces 18% India GST) |
| Tax ID | TRN — Tax Registration Number (100XXXXXXXXX0001) |
| Bank | UAE IBAN (AE + 21 digits), SWIFT/UAEFTS payment rails |
| Company reg | Trade License Number, CR Number (Commercial Registration) |
| Phone | +971 4 (Dubai landline), +971 50/55 (mobile) |
| Address | Emirate, Area/Community, P.O. Box — no PIN codes |
| Timezone | Asia/Dubai, GST +4:00 |
| Fiscal year | January–December (UAE standard) |
| Labour law | 30 days annual leave, 15 days paid sick (UAE Labour Law) |
| Payment GW | Network International (replaces Razorpay) |
| Invoice | "Tax Invoice" label per FTA requirement |
| Companies | Emaar, Emirates NBD, DAMAC, Aldar, DP World, Noon, Careem, FAB, MAF, Etihad, Aramex, Al Tamimi, etc. |

---

## 9. Role-Based Access Control

Access is enforced via `usePermissions()` hook and sidebar filtering. Roles:

| Role | Sidebar modules visible |
|---|---|
| `super_admin` | All 12 modules |
| `finance` | Dashboard, Finance, Customers, Reports, Documents, Approvals, Settings |
| `sales_manager` | Dashboard, CRM, Customers, Reports, Documents |
| `support_agent` | Dashboard, Support, Customers, Documents |
| `operations` | Dashboard, Operations, Procurement, Approvals, Documents |
| `hr` | Dashboard, HR, Documents, Settings |
| `employee` | Dashboard, Documents only |

Attempting to access a restricted URL redirects to the dashboard.

---

## 10. AI Assistant

Accessible via the command bar icon in the top-right of the org ERP (all roles).

- Powered by OpenAI via Vercel AI SDK (streaming)
- Context-aware: knows about UAE ERP operations, AED currency, VAT
- Capabilities: answer questions about invoices/leads/tickets, summarise AR aging, draft emails, suggest next actions
- Requires `OPENAI_API_KEY` in `.env.local` (see [Running Locally](#3-running-locally))

---

## 11. Phase 2 Roadmap

Phase 2 will wire a real backend behind the existing frontend. The frontend is already structured for this — every `useQuery` call has a `queryFn` that currently returns mock data and will be swapped for real API calls.

| Area | Plan |
|---|---|
| Backend | Node.js / Fastify API |
| Database | PostgreSQL (direct install, no Docker) |
| Cache | Redis |
| Auth | JWT + refresh tokens, RBAC middleware |
| File storage | S3-compatible (Cloudflare R2) |
| Email | Resend |
| Payments | Network International API |
| UAE FTA | e-Invoicing integration |
| Multi-tenant | Row-level security per org |

> Phase 2 will not begin until explicitly confirmed.

---

*Built with Claude Code — Phase 1 complete, June 2026*
