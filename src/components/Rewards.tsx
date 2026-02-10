export default function Rewards() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-3">Survive & Earn</h3>
        <p className="text-gray-400 leading-relaxed">
          In the Solana jungle, rugpulls are everywhere. At RugRun, the longer you survive,
          the more you earn. Dodge scams, grab safe tokens, and prove you can outrun any rugpull.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
        <div className="glass-card p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 text-xl font-bold">
            &#x26A0;
          </div>
          <h4 className="font-semibold mb-1">Dodge Scams</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Honeypots, fake LPs, dev dumps, exit scams — jump over them all. Each rug you avoid makes you stronger.
          </p>
        </div>

        <div className="glass-card p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 text-xl font-bold">
            $
          </div>
          <h4 className="font-semibold mb-1">Collect Safe Tokens</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Grab verified, audited tokens worth real $. The safe ones glow green — just like real ones should.
          </p>
        </div>

        <div className="glass-card p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 text-xl font-bold">
            &#x2713;
          </div>
          <h4 className="font-semibold mb-1">Prove & Claim</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Copy your score proof after a run. Share it in our community to claim rewards when wallet connect launches.
          </p>
        </div>
      </div>

      <div className="glass-card max-w-2xl mx-auto p-5">
        <h4 className="font-semibold text-sm mb-2">How it works</h4>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-400">
          <li>Run from the rugpulls — survive as long as you can.</li>
          <li>Jump over scam tokens (honeypots, pump &amp; dumps, fake liquidity).</li>
          <li>Collect green safe tokens to boost your earnings.</li>
          <li>When you get rugged, copy your score proof JSON.</li>
          <li>Share it in our X thread or Discord along with your wallet address.</li>
          <li>When wallet connect goes live, top runners earn real rewards.</li>
        </ol>
      </div>

      <div className="glass-card max-w-2xl mx-auto p-5 border border-brand-500/20">
        <h4 className="font-semibold text-sm mb-2 text-brand-400">Why RugRun keeps you safe</h4>
        <ul className="space-y-1.5 text-sm text-gray-400">
          <li>&#x2022; Learn to recognize scam patterns (honeypots, fake LP, dev dumps) through gameplay.</li>
          <li>&#x2022; Every obstacle in the game mirrors a real Solana rugpull tactic.</li>
          <li>&#x2022; The more you play, the sharper your instincts get — in-game and on-chain.</li>
          <li>&#x2022; Community-driven — survivors help each other spot the next rug.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 max-w-2xl mx-auto">
        <p className="text-xs text-amber-400/80 text-center leading-relaxed">
          <strong>Disclaimer:</strong> Rewards are not guaranteed. Distribution is at the team's discretion.
          This is a community game, not a financial product. Always DYOR. Never invest more than you can afford to lose.
        </p>
      </div>
    </div>
  );
}
