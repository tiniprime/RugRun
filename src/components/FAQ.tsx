import { useState } from "react";
import { SOLSCAN_TOKEN_URL } from "../lib/solana";

const FAQS = [
  {
    q: "What is a rugpull in Solana?",
    a: "A rugpull is a crypto scam where developers create a token, hype it up to attract buyers, then suddenly drain all the liquidity and disappear with everyone's money. On Solana, rugpulls are common in the memecoin space because it's cheap and fast to launch tokens. Common tactics include honeypots (you can buy but not sell), fake liquidity pools, dev wallet dumps, and exit scams. RugRun teaches you to recognize these patterns through gameplay.",
  },
  {
    q: "How does RugRun protect me from rugpulls?",
    a: "RugRun is a game that trains your instincts. Every obstacle represents a real scam tactic used on Solana: honeypots, fake LPs, pump & dumps, dev dumps, and exit scams. The more you play, the faster you'll recognize these red flags in real life. We also build community awareness — survivors help each other spot the next rug.",
  },
  {
    q: "What do the obstacles in the game represent?",
    a: "Each obstacle is a real rugpull tactic: HONEYPOT = tokens you can buy but can't sell. FAKE LP = artificial liquidity that gets pulled. DEV DUMP = developers selling their huge token allocation. EXIT SCAM = project abandonment after collecting funds. PUMP & DUMP = artificially inflating price then crashing it. The green pickups represent safe, audited, verified tokens — the ones you should look for in real life.",
  },
  {
    q: "Is this financial advice?",
    a: "No. RugRun is a community game built for awareness and fun. Nothing on this site constitutes financial advice. Always do your own research (DYOR) before buying any token. We're here to educate, not advise.",
  },
  {
    q: "Are rewards guaranteed?",
    a: "No. Rewards are distributed at the team's discretion during community events. There are no guaranteed earnings, payouts, or returns. The $ amounts in the game are for fun — real rewards depend on community events and wallet connect launching.",
  },
  {
    q: "When is wallet connect launching?",
    a: "Wallet connect is coming soon. We're building it out with Phantom, Solflare, and Backpack support. Once live, you'll be able to link your wallet, sign score proofs, and claim rewards on-chain. Follow our X and Telegram for updates.",
  },
  {
    q: "How do I spot a rugpull in real life?",
    a: "Key red flags: anonymous team with no track record, locked liquidity that expires soon or isn't locked at all, no audit, sudden massive buy pressure from a few wallets, unrealistic promises of returns, contract code that blocks selling (honeypot), and dev wallets holding a huge % of supply. Always check Solscan, RugCheck, and community reviews before aping in.",
  },
  {
    q: "How do I verify the token address?",
    a: "Always verify the contract address from official sources. Check it on Solscan and cross-reference with our official X account and Telegram channel. Never trust links from DMs or random posts.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-center mb-8">FAQ</h3>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="glass-card overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
              aria-expanded={openIndex === i}
            >
              <span className="font-medium text-sm pr-4">{faq.q}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4">
                <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                {faq.q.includes("verify") && (
                  <a
                    href={SOLSCAN_TOKEN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-brand-400 hover:text-brand-300 underline underline-offset-2"
                  >
                    View on Solscan &rarr;
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
