import { useState, useEffect, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
import { getSolscanUrl, getDexscreenerUrl, X_COMMUNITY_URL, getRpcEndpoint } from "./lib/solana";

import "@solana/wallet-adapter-react-ui/styles.css";

import Navbar from "./components/Navbar";
import TokenCard from "./components/TokenCard";
import BuyToken from "./components/BuyToken";
import Rewards from "./components/Rewards";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";

function MainSite() {
  return (
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
              <span className="text-xs font-medium text-brand-400">Stack bags. No regrets.</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
              <span className="text-gradient">GetRichQuick</span>
            </h1>

            <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-lg">
              The money machine on Solana. Invest, stack bags, and never look back. People who invest here don't regret it — they celebrate. No pishman, only profits.
            </p>

            {/* No regrets banner */}
            <div className="mt-6 max-w-lg w-full rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4 text-center">
              <p className="text-sm font-semibold text-brand-400">
                Investors here are never pishman. We only go up.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Diamond hands. No regrets. Just money.
              </p>
            </div>

            {/* Token Address Card */}
            <div className="mt-6 w-full max-w-lg">
              <TokenCard />
            </div>

            {/* BUY THE TOKEN + Join X */}
            <div className="mt-8 flex items-center gap-4 flex-wrap justify-center">
              <BuyToken />
              <a
                href={X_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-base sm:text-lg px-8 py-4 font-bold inline-flex items-center gap-2"
              >
                Join our X Community &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* Buy Section (after wallet connect, shows invest UI) */}
        <section id="buy" className="section-container py-16 sm:py-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Invest & Stack Bags</h2>
            <p className="mt-2 text-gray-500 text-sm max-w-md mx-auto">
              Connect your wallet, pick how much you want to invest, and buy. Early investors = biggest bags.
            </p>
          </div>
          <BuyToken />
        </section>

        {/* Community CTA Banner */}
        <section className="section-container py-10">
          <div className="mx-auto max-w-2xl rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6 sm:p-8 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Join the GetRichQuick Community</h3>
            <p className="text-gray-400 text-sm mb-3 max-w-md mx-auto">
              Connect with fellow money makers. Share wins, stack bags together, and never be pishman again. Our X community is where the profits flow.
            </p>
            <p className="text-brand-400 text-xs font-semibold mb-5">Early investors = biggest bags. Don't regret missing this.</p>
            <a
              href={X_COMMUNITY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm inline-flex items-center gap-2"
            >
              Join on X &rarr;
            </a>
          </div>
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
                href={getSolscanUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                Solscan &rarr;
              </a>
              <a
                href={getDexscreenerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                Dexscreener &rarr;
              </a>
              <a
                href={X_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                X Community &rarr;
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
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === "#/admin");

  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === "#/admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter(), new BackpackWalletAdapter()],
    []
  );
  const endpoint = useMemo(() => getRpcEndpoint(), []);

  if (isAdmin) {
    return (
      <div className="relative min-h-screen">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-brand-500/5 blur-3xl" />
          <div className="absolute top-1/2 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <AdminPanel />
      </div>
    );
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <MainSite />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
