# Homestay Management ERP Demo

Frontend-only React + Vite demo for a homestay management ERP. The app uses local mock data, role-based access control, and shadcn-style UI primitives built with Tailwind CSS.

## Stack

- React 19 with TypeScript
- Vite
- Tailwind CSS 4
- lucide-react icons
- Local shadcn-style components under `src/components/ui`

## Run

```bash
corepack pnpm install
corepack pnpm dev
```

## Build

```bash
corepack pnpm build
```

## What the demo includes

- Demo login for an Owner session
- Homestay signup that creates a fresh empty dashboard state
- Owner and Staff role toggle in the top bar
- Calendar / bookings grid with booking dialog
- Inventory management table with stock updates
- Owner-only staff management table and rooms/pricing cards
