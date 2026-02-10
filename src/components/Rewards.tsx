export default function Rewards() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-3">Rewards</h3>
        <p className="text-gray-400 leading-relaxed">
          Earn points by playing. Occasional community prize drops may happen.
          No guaranteed earnings — this is a fun community game, not a financial product.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
        <div className="glass-card p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 text-2xl">
            🎮
          </div>
          <h4 className="font-semibold mb-1">Play</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Play RugRun and rack up the highest score you can.
          </p>
        </div>

        <div className="glass-card p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 text-2xl">
            ✍️
          </div>
          <h4 className="font-semibold mb-1">Sign</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Connect your wallet and sign your score proof after game over.
          </p>
        </div>

        <div className="glass-card p-5 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 text-2xl">
            📋
          </div>
          <h4 className="font-semibold mb-1">Claim</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            Post your signed proof + wallet address in our X thread or Discord.
          </p>
        </div>
      </div>

      <div className="glass-card max-w-2xl mx-auto p-5">
        <h4 className="font-semibold text-sm mb-2">How claiming works (manual)</h4>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-400">
          <li>Play a game and get a high score.</li>
          <li>Connect your Solana wallet (Phantom, Solflare, or Backpack).</li>
          <li>Click "Sign score proof" to create a verifiable proof.</li>
          <li>Copy the signed proof JSON.</li>
          <li>Paste it in our pinned X thread or Discord #rewards channel along with your wallet address.</li>
          <li>Team reviews and distributes rewards at their discretion.</li>
        </ol>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 max-w-2xl mx-auto">
        <p className="text-xs text-amber-400/80 text-center leading-relaxed">
          <strong>Disclaimer:</strong> Rewards are not guaranteed. Distribution is at the team's discretion.
          This is a community game, not a financial product. Do not spend more than you can afford.
        </p>
      </div>
    </div>
  );
}
