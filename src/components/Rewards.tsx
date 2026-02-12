export default function Rewards() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-3">Stack Bags & Get Paid</h3>
        <p className="text-gray-400 leading-relaxed">
          At GetRichQuick, every second you play is money in your pocket. Dodge the trash, grab the cash,
          and prove you deserve the biggest bag. People who invest here don't regret it — they celebrate it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
        <div className="glass-card p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 text-2xl font-bold">
            $
          </div>
          <h4 className="font-semibold mb-1">Grab the Cash</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Money bags are everywhere. Collect them all — $0.25, $1, $5 — every dollar counts. Stack your way to the top.
          </p>
        </div>

        <div className="glass-card p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 text-xl font-bold">
            &#x26A0;
          </div>
          <h4 className="font-semibold mb-1">Dodge the Scams</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Honeypots, fake LPs, pump &amp; dumps — jump over them. Smart money avoids the traps. Be smart money.
          </p>
        </div>

        <div className="glass-card p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 text-2xl font-bold">
            &#x2713;
          </div>
          <h4 className="font-semibold mb-1">Claim Your Profits</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Copy your score proof and share it. When wallet connect launches, the biggest earners get real rewards. No pishman here.
          </p>
        </div>
      </div>

      <div className="glass-card max-w-2xl mx-auto p-5">
        <h4 className="font-semibold text-sm mb-2">How to get rich</h4>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-400">
          <li>Play the game — every second alive = more money stacked.</li>
          <li>Jump over scam tokens. Smart investors avoid the traps.</li>
          <li>Collect green money bags to boost your earnings fast.</li>
          <li>When the round ends, copy your score proof.</li>
          <li>Share it in our X community with your wallet address.</li>
          <li>Top earners get real rewards when wallet connect goes live.</li>
        </ol>
      </div>

      <div className="glass-card max-w-2xl mx-auto p-5 border border-brand-500/20">
        <h4 className="font-semibold text-sm mb-2 text-brand-400">Why you won't regret investing in GetRichQuick</h4>
        <ul className="space-y-1.5 text-sm text-gray-400">
          <li>&#x2022; Strong community of holders who never look back — only forward.</li>
          <li>&#x2022; The game rewards diamond hands. The longer you hold, the more you earn.</li>
          <li>&#x2022; No pishman energy here — every investor is a winner in the making.</li>
          <li>&#x2022; Early supporters get the biggest bags. Don't be the one who missed out.</li>
          <li>&#x2022; Community-driven — we eat together, we win together.</li>
        </ul>
      </div>

      <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-4 max-w-2xl mx-auto">
        <p className="text-sm text-brand-400 text-center font-semibold">
          People who invest in GetRichQuick don't regret it. They brag about it.
        </p>
        <p className="text-xs text-gray-500 text-center mt-1">
          No pishman. No looking back. Only bags getting bigger.
        </p>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 max-w-2xl mx-auto">
        <p className="text-xs text-amber-400/80 text-center leading-relaxed">
          <strong>Disclaimer:</strong> Rewards are not guaranteed. Distribution is at the team's discretion.
          This is a community game, not a financial product. Always DYOR.
        </p>
      </div>
    </div>
  );
}
