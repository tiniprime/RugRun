import { useState } from "react";
import { SOLSCAN_TOKEN_URL } from "../lib/solana";

const FAQS = [
  {
    q: "Is this financial advice?",
    a: "No. RugRun is a community game built for fun. Nothing on this site constitutes financial advice. Always do your own research (DYOR).",
  },
  {
    q: "Are rewards guaranteed?",
    a: "No. Rewards are distributed at the team's discretion during community events. There are no guaranteed earnings, payouts, or returns of any kind.",
  },
  {
    q: "Why is there no backend?",
    a: "RugRun is an early-stage demo. The game runs entirely in your browser. Scores are stored locally on your device. A backend with anti-cheat and verified leaderboards may come in a future version.",
  },
  {
    q: "How do I verify the token address?",
    a: `Always verify the contract address from official sources. You can check it on Solscan and cross-reference with our official X account and Telegram channel.`,
  },
  {
    q: "What wallets are supported?",
    a: "We support Phantom, Solflare, and Backpack through the Solana wallet adapter. Any wallet compatible with the Solana wallet standard should work.",
  },
  {
    q: "Can scores be faked?",
    a: "Yes. Since the game is frontend-only, scores can technically be manipulated. The signed proof system adds a layer of accountability, but it's not tamper-proof. This is a known limitation of the demo.",
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
