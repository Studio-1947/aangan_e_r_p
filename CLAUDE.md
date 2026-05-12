# Homestay ERP Frontend Demo

A modern frontend-only Homestay Management ERP built using React + TypeScript + Vite with TailwindCSS and shadcn/ui inspired components.

The goal is to create a polished demo-ready SaaS dashboard experience for small-to-mid homestay/property owners.

---

# Tech Stack

- React 18
- Vite
- TypeScript
- TailwindCSS
- shadcn/ui
- React Router
- Zustand (or Context API)
- React Query (mock usage)
- Lucide Icons
- Framer Motion
- Recharts
- date-fns

Frontend only.
No backend.
All data mocked locally.

---

# Product Vision

The UI should feel:

- Premium but minimal
- Fast and lightweight
- Airbnb + Notion + Modern Saa dashboard inspired
- Optimized for demos and presentations
- Responsive for desktop/tablet/mobile

The experience should focus heavily on:

- Clean dashboard UX
- Booking visibility
- OTA integrations visibility
- Revenue tracking
- Staff operations
- Inventory awareness
- Empty states
- Smooth interactions

---

# Main App Flow

## 1. Landing Page

Modern SaaS landing page with:

- Hero section
- Dashboard preview mockup
- Features grid
- OTA integrations showcase
- CTA buttons:
  - Demo Login
  - Create Homestay

---

## 2. Authentication Flow

### Demo Login

Quick enter into a seeded demo property.

### Signup Flow

Multi-step onboarding:

1. Homestay Details
2. Property Type
3. Room Count
4. OTA Selection
5. Pricing Setup
6. Finish Setup

After signup:
→ Redirect to EMPTY dashboard state.

---

# Roles & Access

Topbar role switcher:

- Owner
- Staff

## Owner Access

Can access:

- Staff management
- Revenue analytics
- OTA settings
- Pricing controls
- Property settings

## Staff Access

Can access:

- Bookings
- Calendar
- Guest check-ins
- Inventory
- Housekeeping

Restricted pages should show:
"Owner access only"

---

# Main Layout

## Sidebar

Sections:

- Dashboard
- Bookings
- Calendar
- Rooms
- Guests
- Inventory
- Housekeeping
- OTA Management
- Staff
- Analytics
- Settings

Bottom:

- Property selector
- User profile

---

# Dashboard UI

Main overview cards:

- Occupancy Rate
- Revenue Today
- Upcoming Check-ins
- Available Rooms
- OTA Booking Split
- Pending Tasks

Charts:

- Revenue trend
- Booking source pie chart
- Weekly occupancy graph

Widgets:

- Today's arrivals
- Cleaning status
- Recent bookings
- Guest messages

---

# Booking Management

## Calendar View

Modern grid-style booking calendar.

Features:

- Room rows
- Date columns
- Booking color coding
- Drag-like visual blocks
- Hover tooltips
- Quick add booking

Statuses:

- Confirmed
- Pending
- Checked In
- Checked Out
- Cancelled

Booking modal:

- Guest info
- Dates
- Payment status
- OTA source
- Notes
- Room assignment

---

# OTA Management

Dedicated OTA dashboard.

Supported mock integrations:

- Airbnb
- Booking.com
- Agoda
- MakeMyTrip
- Goibibo

Features:

- OTA status cards
- Sync indicators
- Booking source analytics
- OTA revenue split
- Last sync timestamps
- Toggle OTA active/inactive
- Channel manager style UI

Show:
"Connected"
"Syncing"
"Disconnected"

---

# Rooms Module

Room cards/grid layout.

Each card:

- Room image
- Room type
- Occupancy
- Pricing
- Amenities
- Status badge

Statuses:

- Available
- Occupied
- Cleaning
- Maintenance

Quick actions:

- Edit pricing
- Block dates
- View bookings

---

# Inventory Module

Simple modern inventory table.

Columns:

- Item
- Category
- Current Stock
- Threshold
- Status
- Last Updated

Features:

- Inline stock editing
- Low stock warnings
- Filter/search
- Empty state UI

---

# Staff Management

Owner-only section.

Features:

- Staff cards
- Roles
- Shift status
- Permissions
- Invite staff modal

Roles:

- Reception
- Housekeeping
- Manager
- Kitchen

Staff can be:

- Active
- Offline
- On Leave

---

# Housekeeping Module

Task board UI.

Statuses:

- Pending
- Cleaning
- Ready
- Maintenance

Features:

- Assign staff
- Room cleaning progress
- Daily task checklist

---

# Guest Management

Features:

- Guest profiles
- Stay history
- Preferences
- Payment status
- Notes timeline

Quick actions:

- Check-in
- Check-out
- Extend stay

---

# Analytics

Visual modern reporting UI.

Charts:

- Occupancy trends
- Revenue
- OTA performance
- Seasonal demand
- Cancellation rate

Cards:

- Avg nightly revenue
- RevPAR
- Total bookings

---

# Settings

Sections:

- Property settings
- Pricing rules
- Taxes
- OTA sync
- Notifications
- Branding

---

# UI/UX Guidelines

## Design Style

- Rounded-xl cards
- Soft shadows
- Neutral modern palette
- Spacious padding
- Minimal borders
- Smooth hover transitions

## Motion

Use Framer Motion subtly:

- Page fade
- Card hover
- Modal transitions
- Sidebar animations

---

# Empty States

Every module should have elegant empty states.

Examples:

- "No bookings yet"
- "Connect an OTA to sync reservations"
- "Invite your first staff member"

Include:

- icon
- helper text
- CTA button

---

# Responsive Behaviour

## Desktop

Full sidebar + analytics layout.

## Tablet

Collapsible sidebar.

## Mobile

Bottom navigation + drawer menu.

Calendar should become:

- horizontal scroll
- stacked compact cards

---

# Mock Data

Use realistic demo data:

- Himalayan homestay theme
- 5–10 rooms
- OTA bookings
- Staff names
- Revenue samples

Property example:
"CloudNest Retreat"

---

# Suggested Folder Structure

src/
├── app/
├── components/
├── features/
├── layouts/
├── pages/
├── routes/
├── store/
├── hooks/
├── data/
├── types/
├── lib/
└── styles/

---

# Important Demo Screens

Must look highly polished:

1. Dashboard
2. Booking Calendar
3. OTA Management
4. Rooms Grid
5. Inventory Table
6. Staff Management
7. Empty Dashboard After Signup

---

# Demo Experience Goal

The app should feel like:

"A modern hospitality SaaS platform ready for investors, clients, or product demos."

Even though frontend-only, interactions should feel realistic and production-grade.
