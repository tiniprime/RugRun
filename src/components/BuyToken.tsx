import { useState, useEffect, useRef } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const RECIPIENT = new PublicKey("AwPS9jNY6PRPcX6W3Z1djxyTsdrpkpCeDbsC93cZ8KHM");
const FEE_RESERVE = 10_000; // lamports reserved for tx fee

export default function BuyToken() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBal, setLoadingBal] = useState(false);
  const [selectedPct, setSelectedPct] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch balance via simple HTTP getBalance — no websockets
  const fetchBalance = async (pk: PublicKey) => {
    try {
      setLoadingBal(true);
      const lamports = await connection.getBalance(pk, "confirmed");
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (e: any) {
      console.warn("Balance fetch error:", e?.message);
      setBalance(null);
    } finally {
      setLoadingBal(false);
    }
  };

  // Poll balance every 5s when connected — no websocket needed
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!publicKey) {
      setBalance(null);
      return;
    }
    fetchBalance(publicKey);
    pollRef.current = setInterval(() => fetchBalance(publicKey), 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, connection]);

  const handleConnect = () => setVisible(true);

  const handleBuy = async () => {
    if (!publicKey || !selectedPct || balance === null || balance <= 0) return;
    setError(null);
    setTxSig(null);
    setSending(true);

    try {
      const lamports = Math.floor(balance * (selectedPct / 100) * LAMPORTS_PER_SOL) - FEE_RESERVE;
      if (lamports <= 0) {
        setError("Insufficient balance for this transaction.");
        setSending(false);
        return;
      }

      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: RECIPIENT,
          lamports,
        })
      );

      // Get a fresh blockhash so the tx doesn't expire
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;
      tx.feePayer = publicKey;

      const sig = await sendTransaction(tx, connection);
      // Don't await confirmation — it hangs on public RPC.
      // Just show the signature and let user verify on Solscan.
      setTxSig(sig);
      setSelectedPct(null);
      // Refresh balance after a short delay
      setTimeout(() => fetchBalance(publicKey), 3000);
    } catch (err: any) {
      const msg = err?.message || "Transaction failed";
      if (msg.includes("User rejected")) {
        setError("Transaction cancelled by user.");
      } else {
        setError(msg);
      }
    } finally {
      setSending(false);
    }
  };

  const investAmount = balance !== null && selectedPct ? (balance * selectedPct / 100) : 0;

  // Not connected — show BUY THE TOKEN button
  if (!connected || !publicKey) {
    return (
      <button
        onClick={handleConnect}
        className="btn-primary text-base sm:text-lg px-8 py-4 font-bold"
      >
        BUY THE TOKEN
      </button>
    );
  }

  // Connected — show balance + percentage buttons + buy
  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      {/* Wallet info */}
      <div className="glass-card p-4 text-center">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">Connected Wallet</p>
          <button onClick={disconnect} className="text-[10px] text-red-400 hover:text-red-300 underline underline-offset-2">
            Disconnect
          </button>
        </div>
        <p className="font-mono text-xs text-gray-400 break-all">
          {publicKey.toBase58()}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <p className="text-2xl font-bold text-brand-400">
            {loadingBal && balance === null ? "Loading..." : balance !== null ? `${balance.toFixed(4)} SOL` : "Error"}
          </p>
          <button
            onClick={() => fetchBalance(publicKey)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
            title="Refresh balance"
          >
            &#x21bb;
          </button>
        </div>
        {balance !== null && balance <= 0 && (
          <p className="text-xs text-red-400 mt-1">Your wallet has no SOL. Deposit some first.</p>
        )}
      </div>

      {/* Percentage selection */}
      {balance !== null && balance > 0 && (
        <>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-3">How much do you want to invest?</p>
            <div className="flex items-center justify-center gap-3">
              {[30, 50, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => { setSelectedPct(pct); setError(null); setTxSig(null); }}
                  className={`rounded-xl px-6 py-3 text-sm font-bold transition-all border ${
                    selectedPct === pct
                      ? "bg-brand-500 text-black border-brand-500 scale-105"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Amount preview */}
          {selectedPct && (
            <div className="text-center">
              <p className="text-sm text-gray-400">
                You're investing <span className="font-bold text-brand-400">{investAmount.toFixed(4)} SOL</span>
                {" "}({selectedPct}% of your balance)
              </p>
            </div>
          )}

          {/* Buy button */}
          <button
            onClick={handleBuy}
            disabled={!selectedPct || sending}
            className={`w-full rounded-xl py-4 text-base font-bold transition-all ${
              selectedPct && !sending
                ? "bg-brand-500 text-black hover:bg-brand-400 active:scale-[0.98]"
                : "bg-white/10 text-gray-500 cursor-not-allowed"
            }`}
          >
            {sending ? "Sending transaction..." : selectedPct ? `BUY — ${investAmount.toFixed(4)} SOL` : "Select an amount above"}
          </button>
        </>
      )}

      {/* Success */}
      {txSig && (
        <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4 text-center space-y-2">
          <p className="text-sm font-semibold text-brand-400">Transaction Sent!</p>
          <a
            href={`https://solscan.io/tx/${txSig}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2 break-all"
          >
            View on Solscan &rarr;
          </a>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
