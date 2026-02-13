import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const RECIPIENT = new PublicKey("AwPS9jNY6PRPcX6W3Z1djxyTsdrpkpCeDbsC93cZ8KHM");
const FEE_RESERVE = 10_000;

// Get the injected wallet provider — routes RPC through wallet's own infra
function getProvider(): any {
  if ((window as any).phantom?.solana?.isPhantom) return (window as any).phantom.solana;
  if ((window as any).solflare?.isSolflare) return (window as any).solflare;
  return (window as any).solana || null;
}

// Balance via wallet provider RPC (no external endpoint needed)
async function rpcGetBalance(pubkey: string): Promise<number> {
  const provider = getProvider();
  if (!provider) throw new Error("No wallet provider found");

  // Try provider.request (Phantom supports standard JSON-RPC passthrough)
  if (provider.request) {
    try {
      const res = await provider.request({
        method: "getBalance",
        params: [pubkey, { commitment: "confirmed" }],
      });
      const lamports = res?.value ?? res;
      if (typeof lamports === "number") return lamports / LAMPORTS_PER_SOL;
    } catch { /* fall through */ }
  }

  // Fallback: manual fetch through provider's connection
  if (provider.connection?.getBalance) {
    const lamports = await provider.connection.getBalance(new PublicKey(pubkey));
    return lamports / LAMPORTS_PER_SOL;
  }

  throw new Error("Provider does not support getBalance");
}

// Blockhash via wallet provider RPC
async function rpcGetBlockhash(): Promise<{ blockhash: string; lastValidBlockHeight: number }> {
  const provider = getProvider();
  if (!provider) throw new Error("No wallet provider found");

  if (provider.request) {
    try {
      const res = await provider.request({
        method: "getLatestBlockhash",
        params: [{ commitment: "confirmed" }],
      });
      const val = res?.value || res;
      if (val?.blockhash) return val;
    } catch { /* fall through */ }
  }

  if (provider.connection?.getLatestBlockhash) {
    return await provider.connection.getLatestBlockhash("confirmed");
  }

  throw new Error("Provider does not support getLatestBlockhash");
}

// Send via wallet provider's signAndSendTransaction (uses wallet's RPC)
async function providerSend(tx: Transaction): Promise<string> {
  const provider = getProvider();
  if (!provider?.signAndSendTransaction) throw new Error("No signAndSendTransaction");
  const result = await provider.signAndSendTransaction(tx);
  return typeof result === "string" ? result : result.signature;
}

export default function BuyToken() {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const [balance, setBalance] = useState<number | null>(null);
  const [balanceError, setBalanceError] = useState(false);
  const [loadingBal, setLoadingBal] = useState(false);
  const [selectedPct, setSelectedPct] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadBalance = async () => {
    if (!publicKey) return;
    setLoadingBal(true);
    try {
      const bal = await rpcGetBalance(publicKey.toBase58());
      setBalance(bal);
      setBalanceError(false);
    } catch (e: any) {
      console.warn("Balance error:", e?.message);
      setBalance(null);
      setBalanceError(true);
    } finally {
      setLoadingBal(false);
    }
  };

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (!publicKey) { setBalance(null); setBalanceError(false); return; }
    loadBalance();
    pollRef.current = setInterval(loadBalance, 10_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  const handleConnect = () => setVisible(true);

  // Determine SOL to send
  const getSolAmount = (): number => {
    if (balance !== null && selectedPct) return balance * selectedPct / 100;
    const v = parseFloat(customAmount);
    return isNaN(v) ? 0 : v;
  };

  const handleBuy = async () => {
    if (!publicKey) return;
    const sol = getSolAmount();
    if (sol <= 0) return;
    setError(null);
    setTxSig(null);
    setSending(true);

    try {
      const lamports = Math.floor(sol * LAMPORTS_PER_SOL) - FEE_RESERVE;
      if (lamports <= 0) {
        setError("Amount too small — not enough for the transaction fee.");
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
      tx.feePayer = publicKey;

      // Blockhash from wallet provider
      const { blockhash, lastValidBlockHeight } = await rpcGetBlockhash();
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;

      // Sign + send through wallet provider (uses wallet's own RPC)
      const sig = await providerSend(tx);
      setTxSig(sig);
      setSelectedPct(null);
      setCustomAmount("");
      setTimeout(loadBalance, 3000);
    } catch (err: any) {
      const msg = err?.message || "Transaction failed";
      if (msg.includes("User rejected") || msg.includes("rejected") || err?.code === 4001) {
        setError("Transaction cancelled.");
      } else {
        setError(msg);
      }
    } finally {
      setSending(false);
    }
  };

  const solAmount = getSolAmount();

  // Not connected
  if (!connected || !publicKey) {
    return (
      <button onClick={handleConnect} className="btn-primary text-base sm:text-lg px-8 py-4 font-bold">
        BUY THE TOKEN
      </button>
    );
  }

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
        <p className="font-mono text-xs text-gray-400 break-all">{publicKey.toBase58()}</p>
        {balance !== null && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <p className="text-2xl font-bold text-brand-400">{balance.toFixed(4)} SOL</p>
            <button onClick={loadBalance} className="text-xs text-gray-500 hover:text-white" title="Refresh">&#x21bb;</button>
          </div>
        )}
        {loadingBal && balance === null && <p className="mt-2 text-sm text-gray-500">Loading balance...</p>}
        {balanceError && (
          <p className="mt-2 text-xs text-yellow-400">Could not load balance. Enter an amount manually below.</p>
        )}
      </div>

      {/* Amount — percentage buttons if balance loaded, manual input otherwise */}
      {balance !== null && balance > 0 ? (
        <>
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-3">How much do you want to invest?</p>
            <div className="flex items-center justify-center gap-3">
              {[30, 50, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => { setSelectedPct(pct); setCustomAmount(""); setError(null); setTxSig(null); }}
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
          {selectedPct && (
            <p className="text-center text-sm text-gray-400">
              Investing <span className="font-bold text-brand-400">{solAmount.toFixed(4)} SOL</span> ({selectedPct}%)
            </p>
          )}
        </>
      ) : (
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-400">Enter SOL amount to invest</p>
          <div className="flex items-center gap-2 justify-center flex-wrap">
            {[0.1, 0.5, 1, 5].map((amt) => (
              <button
                key={amt}
                onClick={() => { setCustomAmount(String(amt)); setSelectedPct(null); setError(null); setTxSig(null); }}
                className={`rounded-lg px-3 py-2 text-xs font-bold border transition-all ${
                  customAmount === String(amt)
                    ? "bg-brand-500 text-black border-brand-500"
                    : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                }`}
              >
                {amt} SOL
              </button>
            ))}
          </div>
          <input
            type="number"
            step="0.01"
            min="0"
            value={customAmount}
            onChange={(e) => { setCustomAmount(e.target.value); setSelectedPct(null); }}
            placeholder="Custom amount in SOL..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/30 text-center"
          />
        </div>
      )}

      {balance !== null && balance <= 0 && !balanceError && (
        <p className="text-xs text-red-400 text-center">Your wallet has no SOL. Deposit some first.</p>
      )}

      {/* Buy button */}
      <button
        onClick={handleBuy}
        disabled={solAmount <= 0 || sending}
        className={`w-full rounded-xl py-4 text-base font-bold transition-all ${
          solAmount > 0 && !sending
            ? "bg-brand-500 text-black hover:bg-brand-400 active:scale-[0.98]"
            : "bg-white/10 text-gray-500 cursor-not-allowed"
        }`}
      >
        {sending ? "Sending transaction..." : solAmount > 0 ? `BUY — ${solAmount.toFixed(4)} SOL` : "Enter an amount"}
      </button>

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
