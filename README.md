# RugRun

**Play. Compete. Prove your score.**

A Solana memecoin endless runner game — entirely frontend, no backend required.

---

## Features

- **Endless Runner Game** — Dodge "rug" obstacles, collect SOL shards, beat your high score
- **Solana Wallet Connect** — Phantom, Solflare, Backpack via `@solana/wallet-adapter`
- **Score Proof System** — Sign your score with your wallet, copy the proof, paste in Discord/X
- **Local Leaderboard** — Top 10 scores stored in localStorage per device
- **Token Address Display** — Copy-to-clipboard, Solscan link, Dexscreener link
- **Dark Theme** — Polished UI with Tailwind CSS, gradients, glass cards
- **Mobile Friendly** — Responsive layout, tap-to-jump game controls

## Setting the Token Address

Edit `src/lib/solana.ts` and replace the placeholder:

```ts
export const TOKEN_MINT = "PASTE_TOKEN_ADDRESS_HERE";
```

This address is displayed in the Hero section and Token section with copy + Solscan/Dexscreener links.

## Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to Railway

1. Push to GitHub
2. Create a new Railway project → "Deploy from GitHub repo"
3. Set build & start commands:
   - **Build:** `npm install && npm run build`
   - **Start:** `npm run preview -- --host 0.0.0.0 --port $PORT`
4. Railway will auto-detect the PORT env variable
5. Deploy

The `vite.config.ts` is pre-configured to bind the preview server to `0.0.0.0` and read `PORT` from the environment.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_SOLANA_RPC` | `https://api.mainnet-beta.solana.com` | Solana RPC endpoint |
| `PORT` | `4173` | Preview server port (set by Railway) |

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx        # Sticky nav with wallet button + mobile menu
│   ├── TokenCard.tsx     # Token address display with copy + Solscan link
│   ├── WalletConnect.tsx # Connected wallet display with truncated pubkey
│   ├── GameCanvas.tsx    # HTML canvas endless runner game + score proof
│   ├── Leaderboard.tsx   # Local top-10 leaderboard from localStorage
│   ├── Rewards.tsx       # Rewards explanation + claiming instructions
│   ├── FAQ.tsx           # Accordion FAQ section
│   └── Footer.tsx        # Footer with social links
├── lib/
│   ├── solana.ts         # TOKEN_MINT constant, RPC config, URLs
│   ├── storage.ts        # localStorage helpers for scores/leaderboard
│   └── format.ts         # Pubkey truncation, clipboard copy
├── App.tsx               # Main app with wallet providers + all sections
├── main.tsx              # React entry point
└── index.css             # Tailwind + custom styles
```

## Frontend-Only Limitations

> **Important:** This is a frontend-only demo.

- Scores are stored in `localStorage` and **can be spoofed**
- The signed score proof adds wallet accountability but is **not tamper-proof**
- There is no backend, no database, no server-side verification
- Rewards are **not guaranteed** and are distributed at the team's discretion
- A backend with anti-cheat and verified leaderboards may come in a future version

## Tech Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS 3** (dark theme)
- **@solana/wallet-adapter** (Phantom, Solflare, Backpack)
- **@solana/web3.js** (connection, signing)
- No backend. No database. No server functions.

## License

MIT
# RugRun
