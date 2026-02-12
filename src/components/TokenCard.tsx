import { useState } from "react";
import { getTokenMint, getSolscanUrl } from "../lib/solana";
import { truncatePubkey, copyToClipboard } from "../lib/format";

interface TokenCardProps {
  className?: string;
  compact?: boolean;
}

export default function TokenCard({ className = "", compact = false }: TokenCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(getTokenMint());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`glass-card glow-green p-4 sm:p-6 ${className}`}>
      <div className="text-center">
        {!compact && (
          <p className="text-xs font-medium uppercase tracking-wider text-brand-400 mb-2">
            Token Contract Address
          </p>
        )}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <code className="font-mono text-sm sm:text-base text-gray-300 break-all select-all">
            {compact ? truncatePubkey(getTokenMint(), 6) : getTokenMint()}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium transition-all hover:bg-white/20 active:scale-95"
            aria-label="Copy token address"
          >
            {copied ? (
              <span className="text-brand-400">Copied!</span>
            ) : (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </span>
            )}
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <a
            href={getSolscanUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors underline underline-offset-2"
          >
            View on Solscan &rarr;
          </a>
        </div>
        {!compact && (
          <p className="mt-3 text-[11px] text-gray-500">
            Always verify the address from official sources.
          </p>
        )}
      </div>
    </div>
  );
}
