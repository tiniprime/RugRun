import { useState } from "react";
import { DEXSCREENER_CHART_URL, getTokenMint, setTokenMint } from "../lib/solana";

export default function AdminPanel() {
  const [mint, setMint] = useState(getTokenMint());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setTokenMint(mint);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setTokenMint("");
    setMint(getTokenMint());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-card p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <a href="#home" className="inline-flex items-center gap-2 font-extrabold text-xl mb-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-black text-sm font-black">
              $
            </span>
            <span className="text-gradient">GetRichQuick</span>
          </a>
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-xs text-gray-500 mt-1">Change token address instantly. Stored in your browser — no backend needed.</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Token Contract Address
          </label>
          <input
            type="text"
            value={mint}
            onChange={(e) => setMint(e.target.value)}
            placeholder="Enter Solana token mint address..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 transition-colors"
          />
          <p className="text-[11px] text-gray-600">
            Current: <span className="text-gray-400 font-mono">{getTokenMint()}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="btn-primary flex-1 text-sm py-3"
          >
            {saved ? "Saved!" : "Save Address"}
          </button>
          <button
            onClick={handleReset}
            className="btn-secondary text-sm py-3 px-4"
          >
            Reset to Default
          </button>
        </div>

        {saved && (
          <div className="rounded-lg border border-brand-500/20 bg-brand-500/5 p-3 text-center">
            <p className="text-xs text-brand-400 font-medium">
              Token address updated! Reload the page to see changes everywhere.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-white/5">
          <h4 className="text-sm font-semibold mb-2">Quick Links (with current token)</h4>
          <div className="flex gap-3 flex-wrap">
            <a
              href={`https://solscan.io/token/${mint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2"
            >
              Solscan
            </a>
            <a
              href={`https://dexscreener.com/solana/${mint}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2"
            >
              Dexscreener
            </a>
            <a
              href={DEXSCREENER_CHART_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2"
            >
              BUY in DEX
            </a>
          </div>
        </div>

        <div className="text-center">
          <a href="#home" className="text-xs text-gray-500 hover:text-white transition-colors underline underline-offset-2">
            &larr; Back to site
          </a>
        </div>
      </div>
    </div>
  );
}
