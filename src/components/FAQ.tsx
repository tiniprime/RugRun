import { useState } from "react";
import { getSolscanUrl } from "../lib/solana";

const FAQS = [
  {
    q: "What is GetRichQuick?",
    a: "GetRichQuick is a Solana memecoin with a playable money game. You collect cash, dodge scams, and stack bags. The longer you play, the more you earn. It's the coin for people who don't want to be pishman — no regrets, only profits.",
  },
  {
    q: "Will I regret investing?",
    a: "GetRichQuick investors don't do regret. We don't look back, we only look forward. This community is built on diamond hands and conviction. People who got in early? They're not pishman — they're celebrating. The only regret is not buying sooner.",
  },
  {
    q: "What makes this different from other memecoins?",
    a: "Most memecoins are empty promises. GetRichQuick has an actual game where you earn money, a strong community on X, and a culture of 'no regrets.' We teach you to dodge scams in the game so you're smarter with your real money too. Plus — our holders don't sell, they stack.",
  },
  {
    q: "How does the game work?",
    a: "You play as a money collector running through the Solana jungle. Grab green money bags ($0.25 to $5.00 each) to stack your earnings. Jump over scam obstacles (honeypots, fake LPs, pump & dumps). The longer you survive, the richer you get. When you lose, you can copy your score proof and share it in our community.",
  },
  {
    q: "What do the obstacles in the game represent?",
    a: "Each obstacle is a real scam tactic: HONEYPOT = tokens you can buy but can't sell. FAKE LP = liquidity that gets pulled. DEV DUMP = devs dumping their bags. EXIT SCAM = project abandoned. PUMP & DUMP = price manipulation. GetRichQuick teaches you to avoid all of these — in the game and in real life.",
  },
  {
    q: "Are rewards guaranteed?",
    a: "Rewards are distributed at the team's discretion during community events. The $ amounts in the game are for fun. Real rewards depend on community events and wallet connect launching. But one thing is guaranteed — holders here don't regret it.",
  },
  {
    q: "When is wallet connect launching?",
    a: "Coming soon. We're building it with Phantom, Solflare, and Backpack support. Once live, you'll link your wallet, sign score proofs, and claim rewards on-chain. Early players will have the biggest advantage. Follow our X community for updates.",
  },
  {
    q: "How do I verify the token address?",
    a: "Always verify the contract address from official sources. Check it on Solscan and cross-reference with our official X community. Never trust links from DMs or random posts. Smart money verifies first.",
  },
  {
    q: "Why should I buy now?",
    a: "Early investors = biggest bags. The community is growing fast, the game is live, and wallet connect is coming soon. People who get in now won't be pishman later. No regrets, only profits. The question isn't why buy now — it's why haven't you already?",
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
                    href={getSolscanUrl()}
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
