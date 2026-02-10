export interface ScoreEntry {
  wallet: string;
  score: number;
  date: string;
}

const LEADERBOARD_KEY = "rugrun_leaderboard";
const BEST_SCORE_PREFIX = "rugrun_best_";

export function getLeaderboard(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ScoreEntry[];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries: ScoreEntry[]): void {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

export function addScore(wallet: string, score: number): void {
  const entries = getLeaderboard();
  entries.push({ wallet, score, date: new Date().toISOString() });
  entries.sort((a, b) => b.score - a.score);
  saveLeaderboard(entries.slice(0, 50));
}

export function getTopScores(limit = 10): ScoreEntry[] {
  return getLeaderboard().slice(0, limit);
}

export function resetLeaderboard(): void {
  localStorage.removeItem(LEADERBOARD_KEY);
}

export function getBestScore(wallet: string): number {
  try {
    const raw = localStorage.getItem(BEST_SCORE_PREFIX + wallet);
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
}

export function setBestScore(wallet: string, score: number): void {
  const current = getBestScore(wallet);
  if (score > current) {
    localStorage.setItem(BEST_SCORE_PREFIX + wallet, score.toString());
  }
}
