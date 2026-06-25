# AI-Native ERP — Client Demo Guide

**Prepared by:** Techeniac
**Demo type:** Interactive frontend prototype
**Data:** Realistic UAE sample data — no real transactions

---

## What This Demo Shows

This is a fully interactive prototype of the AI-Native ERP platform built specifically for UAE businesses. You can click through every screen, explore every module, and see exactly how the system will look and feel.

> All figures shown are sample data — companies, invoices, employees, and amounts are fictional but designed to reflect realistic UAE business operations (AED currency, 5% VAT, UAE addresses, +971 phone numbers).

---

## How to Access the Demo

The demo has two separate portals, each with a distinct purpose:

| Portal | URL | Who uses it |
|---|---|---|
| **Organisation ERP** | `/` or `/login` | Your finance, sales, support, HR, and operations teams |
| **Platform Admin Console** | `/platform/login` | Internal platform administrators |

---

## Part 1 — Organisation ERP

### Logging In

1. Open the demo URL in your browser
2. On the login screen, click any of the **preset role buttons** at the bottom
3. Click **Sign In** — any password works for the demo
4. You will land on the dashboard for that role

**Available demo roles:**

| Role | What they can access |
|---|---|
| Super Admin | Everything — full visibility across all departments |
| Finance Manager | Finance, invoices, payments, reports |
| Sales Manager | CRM pipeline, leads, customers |
| Support Agent | Support tickets |
| Operations | Operations tasks, procurement |

> Try switching roles to see how the system adapts — each role sees a completely different dashboard and sidebar.

---

### Dashboard

The first screen after login is the role-specific dashboard. Every role sees a different view:

**Super Admin dashboard shows:**
- Total revenue this month (AED)
- Outstanding invoices and AR aging summary
- Open support tickets
- Active leads in the sales pipeline
- Headcount and recent HR activity
- 12-month revenue trend chart

**Finance dashboard shows:**
- Cash position and outstanding receivables
- Invoice status breakdown (paid / sent / overdue)
- AR aging buckets (current / 30 / 60 / 90+ days)
- Recent payment activity

**Sales dashboard shows:**
- Pipeline value by stage
- Lead conversion rate
- Top customers by revenue
- Monthly deal close trend

**Support dashboard shows:**
- Open ticket count and SLA compliance rate
- Ticket volume trend (weekly)
- Priority breakdown

Each KPI card shows the current value plus a trend indicator (up/down/flat vs. previous period).

---

### Finance Module

**How to reach it:** Click **Finance** in the left sidebar

**Invoice List**
- View all invoices with filters: Draft / Sent / Paid / Overdue / Cancelled
- Click any invoice to open the full detail page
- Invoice detail shows: line items, 5% UAE VAT, payment terms, UAE IBAN bank details, UAEFTS/SWIFT reference

**AR Aging**
- Summary table showing total receivables by aging bucket
- Colour-coded: green (current) → amber (30–60 days) → red (60+ days overdue)

**Payments**
- Chronological log of received payments
- Payment references use UAE banking formats (UAEFTS, SWIFT)

---

### CRM — Sales Pipeline

**How to reach it:** Click **CRM** in the left sidebar

**Pipeline View**
- Leads displayed across 7 stages: New → Contacted → Qualified → Proposal → Negotiation → Won → Lost
- Each lead card shows: company name, deal value (AED), assigned sales rep, AI health score
- Click any lead to open the full detail: activity timeline, contact information, next steps

**AI Lead Health Score**
- Every lead gets a 0–100 AI score indicating likelihood to convert
- Colour-coded: green (high) / amber (medium) / red (at risk)

**Lead Companies (sample data)**
Careem, First Abu Dhabi Bank, Gulf Capital, Atlantis The Palm, Mashreq Bank, Emirates NBD, DAMAC Properties, Aldar, and others.

---

### Customers

**How to reach it:** Click **Customers** in the left sidebar

- Full list of 30 UAE customer accounts
- Each customer shows: health score, account status, outstanding balance, assigned account manager
- Click any customer to see: full invoice history, open support tickets, contacts, account manager

**Customer statuses:** Active / Inactive / Prospect / Churned

---

### Support — Ticket Management

**How to reach it:** Click **Support** in the left sidebar

**Ticket Queue**
- Filter by: priority (critical / high / medium / low), status (open / in progress / resolved), assigned agent
- Each ticket shows SLA timer — colour turns red when approaching breach

**Ticket Detail**
- Full conversation thread between customer and agent
- Internal notes tab (not visible to customer)
- One-click status change, priority escalation, reassignment

---

### HR Module

**How to reach it:** Click **HR** in the left sidebar

- 21 employees with UAE phone numbers (+971), AED salaries, and Emirates-based addresses
- Employee detail page: job title, department, salary, manager, leave balances
- Leave balances follow UAE Labour Law: 30 days annual leave, 15 days paid sick leave

---

### Operations

**How to reach it:** Click **Operations** in the left sidebar

**Task Board**
- Tasks organised by status: Open / In Progress / Completed / Blocked
- Each task shows assignee, due date, priority

**Purchase Requests**
- Internal purchase requests with AED amounts, vendor, approval status

---

### Procurement

**How to reach it:** Click **Procurement** in the left sidebar

- 12 UAE-based vendors: PwC Middle East, Amazon AWS, Al Tamimi & Co, Aramex, Schneider Electric Gulf, Microsoft Gulf, Grand Stores LLC, and others
- Vendor profile: Tax Registration Number (TRN), payment terms, performance rating, open orders

---

### Approvals

**How to reach it:** Click **Approvals** in the left sidebar

- Approval workflows for invoices, expenses, and purchase requests
- Status: Pending / Approved / Rejected / Escalated
- Each item shows requestor, amount, current approver, and history

---

### Reports & Analytics

**How to reach it:** Click **Reports** in the left sidebar

Four report tabs:

| Tab | Contents |
|---|---|
| **Overview** | Revenue trend, invoice status donut, top customers, AR aging |
| **Finance** | AR aging detail, revenue by month, invoice summary |
| **CRM** | Pipeline by stage, lead conversion funnel, revenue by customer |
| **Support** | Ticket volume (weekly), category breakdown, resolution time |
| **Report Catalog** | List of all downloadable reports (AR Aging, Sales Pipeline, Invoice Summary, etc.) |

---

### Settings

**How to reach it:** Click **Settings** in the left sidebar

Shows the organisation's UAE-specific configuration:
- Company TRN (Tax Registration Number)
- Trade License Number and CR Number (Commercial Registration)
- UAE IBAN for bank transfers
- Emirate, area, and P.O. Box
- VAT rate (5%), fiscal year, timezone (Asia/Dubai, GST +4:00)
- Payment gateway (Network International)

---

### AI Assistant

**How to access it:** Click the chat icon in the top-right corner of any page

The AI assistant is context-aware for UAE ERP operations:
- Ask questions about invoices, leads, tickets, or employees
- Request summaries ("Summarise our AR aging this month")
- Draft communications ("Draft a follow-up email for overdue invoice INV-0042")
- Get next-step suggestions for leads and support tickets

---

## Part 2 — Platform Admin Console

This is the internal back-office for whoever operates the ERP platform — managing client organisations, subscriptions, billing, and system configuration.

### Logging In

1. Go to `/platform/login`
2. Email: `platform@admin.com`
3. Password: `admin1234`

The platform console has a distinctive **indigo sidebar** so it is visually separate from the organisation ERP.

---

### Platform Dashboard

First screen after login. Shows platform-wide health:
- Total client organisations, active orgs, MRR, ARR, churn rate
- MRR trend over 12 months
- Organisation growth chart
- System health status

---

### Organizations

A list of all 10 client organisations currently on the platform:

| Organisation | Plan | Status |
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

**Actions available per organisation:**
- View full detail (modules, user count, storage, MRR, audit history)
- Upgrade plan
- Suspend / Reactivate
- Impersonate (view their ERP as that org)

---

### Users

- 25 users across all client organisations
- KPI summary: Total / Active / Inactive / Invited
- **Invite new user** — opens a dialog to enter name, email, organisation, role
- Actions per user: Deactivate, Reactivate, Reset Password, Resend Invite

---

### Billing

Platform-wide revenue view:
- Total MRR, ARR, number of paying organisations, average MRR per org
- Revenue breakdown by plan tier (Starter / Growth / Enterprise)
- Top 5 organisations by MRR
- Full subscriptions table

---

### Subscription Plans

Define what each plan includes — pricing, limits, and which ERP modules are unlocked.

**Three plans:**

| Plan | Monthly Price | Users | Storage | ERP Modules |
|---|---|---|---|---|
| Starter | Free | Up to 10 | 5 GB | 5 of 12 |
| Growth | AED 1,499/mo | Up to 50 | 50 GB | 9 of 12 |
| Enterprise | AED 4,999/mo | Unlimited | Unlimited | All 12 |

**What you can edit per plan (click the pencil icon):**
- Tagline and marketing description
- Monthly and annual price (AED)
- Maximum users and storage
- Free trial duration (days)
- Toggle any of the 12 ERP modules on or off

**Active toggle:** Deactivate a plan to stop new organisations from signing up to it.

---

### Feature Flags

8 feature flags that can be switched on or off globally or for specific organisations:
- AI Suggested Replies (Support module)
- AI Lead Health Scoring (CRM module)
- Multi-Currency Support
- SSO / SAML Authentication
- Advanced Reporting
- Bulk Data Export

Each flag shows: global status, rollout percentage, and any per-organisation overrides.

---

### Announcements

Send system-wide or plan-targeted messages to all organisations:
- **Types:** Informational / Warning / Planned Maintenance / New Feature
- **Targeting:** All organisations, or specific plan tiers (e.g. Enterprise only)
- **Status:** Draft → Scheduled → Sent

---

### Audit Logs

Full cross-organisation activity trail:
- Every significant action is logged: logins, invoice approvals, user creation, plan upgrades, org suspensions
- Filter by organisation, user, action type, and date range

---

### System Health

Live status of all platform services:
- API server, database, background queues, file storage, email delivery
- Response time metrics
- Error rate charts over time

---

### Platform Settings

- **Platform currency toggle** — switch between AED and USD for all billing displays within the Platform Admin console
- The chosen currency is shown as a badge in the platform header and persists between sessions

---

## Demo Workflow — Suggested Walkthrough

This is a suggested sequence to demo the system to a client in 20–30 minutes:

**Step 1 — Platform overview (5 min)**
1. Log in as Platform Admin (`platform@admin.com` / `admin1234`)
2. Show the Platform Dashboard — MRR, org count, health
3. Open Organizations — show Emaar on Enterprise, Careem on Trial
4. Open Plans — show the three tiers, click Edit on Growth to show the configuration dialog

**Step 2 — Finance team view (8 min)**
1. Open a new tab, go to `/login`
2. Click the **Finance Manager** preset, sign in
3. Walk through the Finance dashboard — AR aging, invoice status
4. Open Finance module — filter to Overdue invoices, click one to show the full invoice with UAE VAT and IBAN
5. Open Reports → Finance tab — show AR aging chart

**Step 3 — Sales team view (5 min)**
1. Switch to **Sales Manager** role (log out, re-login)
2. Show the CRM pipeline — stages, deal values, AI health scores
3. Click a lead to show the detail page and activity timeline

**Step 4 — Support team view (5 min)**
1. Switch to **Support Agent** role
2. Show the ticket queue — SLA timers, priorities
3. Open a ticket — show the conversation thread and internal notes

**Step 5 — AI Assistant (2 min)**
1. While in any ERP view, open the AI chat panel (top-right icon)
2. Ask: "Summarise our overdue invoices this month"
3. Ask: "Draft a follow-up email for our highest-value overdue account"

---

## Key Differentiators to Highlight

| Feature | Why it matters |
|---|---|
| **Role-based dashboards** | Each person sees exactly what's relevant to their job — no clutter |
| **UAE-native** | AED, 5% VAT, TRN, UAE IBAN, UAE Labour Law, +971 phones — no manual configuration |
| **AI health scores on leads** | Sales team knows which deals to prioritise without manual qualification |
| **AI assistant** | Natural language access to business data from any screen |
| **Platform Admin console** | Full multi-tenant management — organisations, billing, plans, feature flags — from one place |
| **Configurable subscription plans** | Platform operator can adjust pricing and module access without a developer |
| **SLA timers on support tickets** | Prevents tickets from falling through the cracks |
| **Audit logs** | Complete traceability across all organisations and users |

---

*Demo prepared by Techeniac — Phase 1 Frontend Prototype, June 2026*
*Phase 2 (live backend, real data, API integrations) available on request*
