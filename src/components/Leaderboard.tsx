import { useState, useEffect } from "react";
import { getTopScores, resetLeaderboard, type ScoreEntry } from "../lib/storage";
import { truncatePubkey } from "../lib/format";

export default function Leaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  const refresh = () => setScores(getTopScores(10));

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    if (window.confirm("Reset local leaderboard? This cannot be undone.")) {
      resetLeaderboard();
      refresh();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold">Local Leaderboard</h3>
          <p className="text-xs text-gray-500 mt-1">Local (this device) — no backend yet.</p>
        </div>
        <button
          onClick={handleReset}
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          Reset
        </button>
      </div>

      {scores.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 py-12 text-center">
          <p className="text-gray-500 text-sm">No scores yet. Play to get on the board!</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left font-medium text-gray-400">#</th>
                <th className="px-4 py-3 text-left font-medium text-gray-400">Wallet</th>
                <th className="px-4 py-3 text-right font-medium text-gray-400">Score</th>
                <th className="px-4 py-3 text-right font-medium text-gray-400 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((entry, i) => (
                <tr
                  key={`${entry.wallet}-${entry.date}-${i}`}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`font-bold ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-gray-500"}`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-gray-300">{truncatePubkey(entry.wallet, 5)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-brand-400">{entry.score.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-500 hidden sm:table-cell">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
