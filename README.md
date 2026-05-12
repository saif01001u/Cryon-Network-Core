# Cryon Network

> Sovereign identity infrastructure for the decentralized web — verified on-chain, owned by you.

A production-ready Web3 dApp built on Solana Devnet with a cyber-glass UI, real-time on-chain verification, and zero external image dependencies.

---

## Live Demo

Deployed on Replit — accessible at the published `.replit.app` domain.

---

## Program ID

```
DbXQctgDjcERBX9PitvBUsY18gAvNLKnfHwiU4DfvDF5
```

Verifiable on [Solscan Devnet](https://solscan.io/account/DbXQctgDjcERBX9PitvBUsY18gAvNLKnfHwiU4DfvDF5?cluster=devnet).

---

## Features

- **Sovereign Identity Dashboard** — wallet identity details, ownership score ring, recent transaction history, micro-payment simulation with toast feedback
- **On-Chain Verification** — look up any Solana address on Devnet; shows balance, owner program, executable status, and Solscan deep-link
- **Real-Time Devnet Status** — live slot number, TPS, and latency polling every 30 seconds
- **Wallet Integration** — Phantom and Solflare support via native `window.solana` API (no heavy adapter libraries)
- **Cyber-Glass UI** — pure SVG + CSS only, no external images; neon cyan palette, glassmorphism cards, animated hex logo, CSS grid background
- **Security First** — public key only; private keys never leave the user's wallet extension

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Routing | Wouter |
| Icons | Lucide React |
| Blockchain | Solana Devnet (raw JSON-RPC) |
| Wallet | Native `window.solana` (Phantom / Solflare) |
| Package Manager | pnpm workspaces |
| Language | TypeScript 5.9 |

---

## Project Structure

```
cryon-network/
├── artifacts/
│   └── cryon-network/
│       └── src/
│           ├── pages/
│           │   ├── home.tsx          # Hero, features, Program ID panel, system status
│           │   ├── dashboard.tsx     # Identity, score ring, tx history, payments
│           │   ├── verify.tsx        # On-chain address lookup
│           │   └── not-found.tsx
│           ├── components/
│           │   ├── CryonLogo.tsx     # Pure SVG hex network logo
│           │   ├── Navbar.tsx        # Nav, Devnet badge, wallet button
│           │   ├── SystemStatus.tsx  # Live RPC status panel
│           │   ├── WalletButton.tsx  # Connect / disconnect wallet
│           │   └── TransactionToast.tsx
│           ├── hooks/
│           │   ├── useWallet.ts      # Native window.solana wallet state
│           │   └── useSolanaStatus.ts # Raw JSON-RPC Devnet polling
│           └── index.css             # Full cyber-glass dark theme
├── artifacts/api-server/             # Express 5 API server
├── lib/
│   ├── api-spec/openapi.yaml         # OpenAPI contract (source of truth)
│   └── db/src/schema/               # Drizzle ORM schema
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 24+
- pnpm 9+
- Phantom or Solflare browser extension (for wallet features)

### Install

```bash
pnpm install
```

### Run Frontend

```bash
pnpm --filter @workspace/cryon-network run dev
```

### Run API Server

```bash
pnpm --filter @workspace/api-server run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (for api-server) |
| `SESSION_SECRET` | Session signing secret |

---

## Architecture Decisions

- **No wallet adapter libraries** — uses native `window.solana` API for zero-overhead wallet detection
- **CSS-only visuals** — all branding via pure SVG code, CSS grid background, backdrop-blur glassmorphism, and keyframe animations
- **Raw JSON-RPC** — direct `fetch` calls to Solana Devnet RPC; no `@solana/web3.js` runtime in the browser
- **Public key only** — wallet connection requests only the public key; private keys never leave the user's wallet extension
- **Vite dev proxy** — Solana Devnet RPC calls are proxied through Vite (`/solana-rpc`) in development to avoid CORS restrictions on localhost

---

## Security

- No private keys are ever requested or stored
- All RPC calls are read-only account lookups
- No external tracking scripts or third-party analytics
- Content Security Policy compatible (no `eval`, no inline scripts)

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

Built with Replit · Deployed on Solana Devnet
