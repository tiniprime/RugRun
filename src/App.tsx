import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { getRpcEndpoint, SOLSCAN_TOKEN_URL, DEXSCREENER_URL } from "./lib/solana";

import Navbar from "./components/Navbar";
import TokenCard from "./components/TokenCard";
import WalletConnect from "./components/WalletConnect";
import GameCanvas from "./components/GameCanvas";
import Leaderboard from "./components/Leaderboard";
import Rewards from "./components/Rewards";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function App() {
  const endpoint = useMemo(() => getRpcEndpoint(), []);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new BackpackWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="relative min-h-screen">
            {/* Background decorations */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
              <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-3xl" />
              <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
              <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-brand-500/3 blur-3xl" />
            </div>

            <Navbar />

            <main className="relative">
              {/* Hero */}
              <section id="home" className="section-container py-20 sm:py-32">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
                    <span className="text-xs font-medium text-brand-400">Live on Solana</span>
                  </div>

                  <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
                    <span className="text-gradient">RugRun</span>
                  </h1>

                  <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-md">
                    Play. Compete. Prove your score.
                  </p>

                  {/* Token Address Card - centered */}
                  <div className="mt-8 w-full max-w-lg">
                    <TokenCard />
                  </div>

                  <div className="mt-6">
                    <WalletConnect />
                  </div>

                  <a href="#play" className="mt-8 btn-primary text-sm">
                    Play Now &darr;
                  </a>
                </div>
              </section>

              {/* Game */}
              <section id="play" className="section-container py-16 sm:py-24">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold">Play RugRun</h2>
                  <p className="mt-2 text-gray-500 text-sm">
                    Dodge rugs. Collect SOL shards. Set a high score.
                  </p>
                </div>
                <GameCanvas />
              </section>

              {/* Leaderboard */}
              <section id="leaderboard" className="section-container py-16 sm:py-24">
                <Leaderboard />
              </section>

              {/* Rewards */}
              <section id="rewards" className="section-container py-16 sm:py-24">
                <Rewards />
              </section>

              {/* Token */}
              <section id="token" className="section-container py-16 sm:py-24">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold">Token</h2>
                  <p className="mt-2 text-gray-500 text-sm">Contract address & links</p>
                </div>

                <div className="max-w-xl mx-auto space-y-4">
                  <TokenCard />

                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <a
                      href={SOLSCAN_TOKEN_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm"
                    >
                      Solscan &rarr;
                    </a>
                    <a
                      href={DEXSCREENER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm"
                    >
                      Dexscreener &rarr;
                    </a>
                  </div>

                  <p className="text-center text-xs text-gray-600">
                    Always verify the address from official sources.
                  </p>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="section-container py-16 sm:py-24">
                <FAQ />
              </section>
            </main>

            <Footer />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
