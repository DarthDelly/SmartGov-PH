# SmartGov PH

**Padayon sa Paglambo** — AI-powered Local Government Operating System for Philippine barangays and municipalities.

---

## Overview

SmartGov PH is a frontend dashboard for barangay-level governance. It provides three role-based portals for residents, barangay staff, and municipal admins — covering permit requests, concern reporting, resident management, and disaster response coordination.

> All data is served from static mock JSON files. No backend is required to run this project.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 |
| Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| Fonts | Geist (UI) · Plus Jakarta Sans (headings) |
| Theme | next-themes (light/dark) |
| State | Zustand (persisted auth store) |
| Charts | Recharts |
| Animations | Framer Motion |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open (localhost) and you will be redirected to the login page.

---

## Roles

The login page has a **DEV role switcher** — enter any email and password, select a role, and sign in.

| Role | Access |
|---|---|
| **Resident** | Barangay Permits, Report Concerns, Notifications |
| **Barangay Staff** | Permits Queue (Approve/Reject), Residents, Blotter |
| **Municipal Admin** | Analytics, Barangay Monitor, Disaster Response |

---

## Pages

| Route | Description | Access |
|---|---|---|
| `/login` | Login with dev role switcher | Public |
| `/dashboard` | Role-adaptive home overview | All |
| `/permits` | Permit type grid + requirements modal | All |
| `/permits/[type]` | Document upload + submission flow | All |
| `/notifications` | Notification center with status filters | All |
| `/concerns` | Report a barangay concern | Resident |
| `/residents` | Searchable resident table with pagination | Staff, Admin |
| `/analytics` | Charts and municipality-wide metrics | Admin |
| `/monitor` | Live barangay status grid | Admin |
| `/disaster` | Incident alerts, response teams, evacuation centers | Admin |

---

## Project Structure

```
├── app/
│   ├── (auth)/login/         # Login page
│   ├── (dashboard)/          # Authenticated shell + all pages
│   └── globals.css           # CSS custom property token system
├── components/
│   ├── layout/               # Sidebar, Topnav, Shell, RoleGuard
│   ├── ui/                   # shadcn/ui primitives
│   ├── dashboard/            # Stats cards, request table
│   ├── permits/              # Permit card, modal, upload zone, status badge
│   ├── notifications/        # Notification item
│   ├── residents/            # Resident table
│   └── analytics/            # Bar chart, donut chart, metric card
├── lib/
│   ├── mock/                 # Static JSON data files
│   ├── store/auth-store.ts   # Zustand auth + role store
│   └── constants/            # Permit types, nav items
└── tailwind.config.ts        # Brand color tokens + font config
```

---

## Design Tokens

Defined as CSS custom properties in `app/globals.css`.

```css
/* Brand — Philippine flag blue */
--brand-600: #1D4ED8;   /* primary action */
--brand-700: #1E40AF;   /* hover */

/* Status */
--status-received:  #F59E0B;
--status-processing:#3B82F6;
--status-done:      #10B981;
--status-rejected:  #EF4444;
```

---

## Permit Types

1. Barangay Clearance
2. Certificate of Indigency
3. Residency Certificate
4. Business Clearance
5. Barangay ID Generation

Each permit has a defined fee, processing time, and requirements checklist.

---

## Mock Data

All mock data lives in `lib/mock/`:

| File | Contents |
|---|---|
| `permits.json` | 8 sample permit requests |
| `notifications.json` | 7 notifications across all statuses |
| `residents.json` | 15 registered residents |
| `analytics.json` | Monthly trends, status distribution, barangay volume |

---

## Notes

- Credit AI assessment UI is a placeholder — not yet implemented
- Payment flows are placeholders — not yet implemented
- Blotter and Barangay Monitor detail views are scaffolded for future phases
