import { SOLSCAN_TOKEN_URL, DEXSCREENER_URL, X_COMMUNITY_URL } from "./lib/solana";

import Navbar from "./components/Navbar";
import TokenCard from "./components/TokenCard";
import GameCanvas from "./components/GameCanvas";
import Leaderboard from "./components/Leaderboard";
import Rewards from "./components/Rewards";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function App() {
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
                    <span className="text-xs font-medium text-brand-400">Outrun the rugpulls</span>
                  </div>

                  <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
                    <span className="text-gradient">RugRun</span>
                  </h1>

                  <p className="mt-4 text-lg sm:text-xl text-gray-400 max-w-lg">
                    The Solana jungle is full of rugpulls. At RugRun, you learn to dodge them — and get rewarded for surviving.
                  </p>

                  {/* Token Address Card - centered */}
                  <div className="mt-8 w-full max-w-lg">
                    <TokenCard />
                  </div>

                  <div className="mt-6">
                    <button
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed border border-white/10"
                      disabled
                    >
                      Connect Wallet
                      <span className="rounded-md bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-400">COMING SOON</span>
                    </button>
                  </div>

                  <div className="mt-6 flex items-center gap-3 flex-wrap justify-center">
                    <a href="#play" className="btn-primary text-sm">
                      Start Running &darr;
                    </a>
                    <a
                      href={X_COMMUNITY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm inline-flex items-center gap-2"
                    >
                      Join our X Community &rarr;
                    </a>
                  </div>
                </div>
              </section>

              {/* Community CTA Banner */}
              <section className="section-container py-10">
                <div className="mx-auto max-w-2xl rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6 sm:p-8 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Join the RugRun Community</h3>
                  <p className="text-gray-400 text-sm mb-5 max-w-md mx-auto">
                    Connect with fellow survivors, share rugpull warnings, and stay safe together. Our X community is where runners help each other.
                  </p>
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

              {/* Game */}
              <section id="play" className="section-container py-16 sm:py-24">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold">Escape the Rugpulls</h2>
                  <p className="mt-2 text-gray-500 text-sm max-w-md mx-auto">
                    Jump over honeypots, fake LPs, and dev dumps. Grab verified safe tokens. How long can you survive?
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
