import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { truncatePubkey, copyToClipboard } from "../lib/format";

export default function WalletConnect() {
  const { publicKey } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!publicKey) return null;

  const pubkeyStr = publicKey.toBase58();

  const handleCopy = async () => {
    await copyToClipboard(pubkeyStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
      <span className="font-mono text-sm text-gray-300">{truncatePubkey(pubkeyStr)}</span>
      <button
        onClick={handleCopy}
        className="text-xs text-gray-400 hover:text-white transition-colors"
        aria-label="Copy wallet address"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
