# Cryon Network

A premium Web3 application for Cryon Network — sovereign identity infrastructure on Solana Devnet with a cyber-glass UI, SVG-only branding, and real-time on-chain verification.

## Run & Operate

- `pnpm --filter @workspace/cryon-network run dev` — run the frontend (port varies, set via PORT env)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `DATABASE_URL` — Postgres connection string (for api-server)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Web3: @solana/web3.js (native window.solana wallet adapter)

## Where things live

- `artifacts/cryon-network/src/` — Cryon Network React frontend
  - `pages/` — home.tsx, dashboard.tsx, verify.tsx, not-found.tsx
  - `components/` — Navbar, SystemStatus, WalletButton, CryonLogo, TransactionToast
  - `hooks/` — useWallet.ts (wallet state), useSolanaStatus.ts (Devnet health)
  - `index.css` — full cyber-glass dark theme with neon cyan palette
- `artifacts/api-server/src/` — Express API server
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — Drizzle ORM schema

## Architecture decisions

- **No wallet adapter libraries** — uses the native `window.solana` API (Phantom/Solflare standard) for zero-overhead wallet detection. No heavy adapter bundles.
- **CSS-only visuals** — no external images. All branding via pure SVG code, CSS grid background, backdrop-blur glassmorphism, and keyframe animations.
- **Vite dev proxy** — Solana Devnet RPC calls are proxied through Vite (`/solana-rpc`) in development to avoid CORS restrictions on localhost. In production, direct RPC calls are used.
- **Public key only** — wallet connection requests only the public key; private keys never leave the user's wallet extension.
- **Solana Program ID** — `DbXQctgDjcERBX9PitvBUsY18gAvNLKnfHwiU4DfvDF5` — verifiable on Solscan Devnet.

## Product

- **Home** — animated SVG hex logo, shimmer title, live Devnet badge, feature grid, Program ID panel, system status, one-click wallet connect
- **Dashboard** — wallet identity details, sovereign identity status, ownership score ring, recent transaction history, network stats, micro-payment simulation with toast feedback
- **Verify** — on-chain address lookup against Solana Devnet, displays balance/owner/executable status, Solscan deep-link
- **Navbar** — logo, nav links, live Devnet status badge, Program ID copy shortcut, Solscan link, wallet connect/disconnect menu

## User preferences

- No external images — pure SVG + CSS design only
- High-security wallet flow (public key only, never private keys)
- Real-time Solana Devnet status monitoring
- Mobile-first responsive design

## Gotchas

- The Solana RPC (`api.devnet.solana.com`) blocks CORS from `localhost` — the Vite dev proxy at `/solana-rpc` routes around this. Do NOT remove the proxy config in vite.config.ts.
- Always run `pnpm --filter @workspace/api-spec run codegen` after any OpenAPI spec change before touching frontend code.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
