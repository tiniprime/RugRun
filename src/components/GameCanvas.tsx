import { useRef, useEffect, useState, useCallback } from "react";
import { addScore, setBestScore, getBestScore } from "../lib/storage";
import { copyToClipboard } from "../lib/format";

type GameState = "idle" | "playing" | "over";

// Scam types that appear as obstacles
const SCAM_TYPES = [
  { label: "HONEYPOT", color: "#dc2626", bg: "#7f1d1d" },
  { label: "FAKE LP", color: "#ea580c", bg: "#7c2d12" },
  { label: "DEV DUMP", color: "#d97706", bg: "#78350f" },
  { label: "RUG PULL", color: "#ef4444", bg: "#991b1b" },
  { label: "EXIT SCAM", color: "#f97316", bg: "#9a3412" },
  { label: "PUMP&DUMP", color: "#dc2626", bg: "#7f1d1d" },
];

interface Obstacle {
  x: number;
  width: number;
  height: number;
  scamType: typeof SCAM_TYPES[number];
}

interface SafeToken {
  x: number;
  y: number;
  collected: boolean;
  value: number;
  label: string;
}

const CANVAS_W = 800;
const CANVAS_H = 360;
const GROUND_Y = CANVAS_H - 48;
const PLAYER_W = 30;
const PLAYER_H = 44;
const GRAVITY = 0.7;
const JUMP_FORCE = -13.5;
const BASE_SPEED = 4;

// Poverty "danger wave" that chases from the left
const DANGER_WAVE_W = 60;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(0);
  const [bestScore, setBest] = useState(0);
  const [survived, setSurvived] = useState(0);
  const [proofJson, setProofJson] = useState("");
  const [proofCopied, setProofCopied] = useState(false);

  const gameRef = useRef({
    state: "idle" as GameState,
    playerY: GROUND_Y - PLAYER_H,
    playerVY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    tokens: [] as SafeToken[],
    score: 0,
    money: 0,
    rugsAvoided: 0,
    speed: BASE_SPEED,
    frameCount: 0,
    groundOffset: 0,
    dangerWaveX: -DANGER_WAVE_W,
    chartPoints: [] as number[],
  });

  const walletKey = "guest";

  useEffect(() => {
    setBest(getBestScore(walletKey));
  }, [walletKey]);

  const resetGame = useCallback(() => {
    const g = gameRef.current;
    g.playerY = GROUND_Y - PLAYER_H;
    g.playerVY = 0;
    g.isJumping = false;
    g.obstacles = [];
    g.tokens = [];
    g.score = 0;
    g.money = 0;
    g.rugsAvoided = 0;
    g.speed = BASE_SPEED;
    g.frameCount = 0;
    g.groundOffset = 0;
    g.dangerWaveX = -DANGER_WAVE_W;
    // Generate initial chart points
    g.chartPoints = [];
    for (let i = 0; i < 40; i++) g.chartPoints.push(Math.random() * 30 + 10);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    gameRef.current.state = "playing";
    setGameState("playing");
    setScore(0);
    setMoney(0);
    setSurvived(0);
    setProofJson("");
  }, [resetGame]);

  const endGame = useCallback(() => {
    const g = gameRef.current;
    g.state = "over";
    setGameState("over");
    setScore(g.score);
    setSurvived(g.rugsAvoided);

    addScore(walletKey, g.score);
    setBestScore(walletKey, g.score);
    setBest(getBestScore(walletKey));

    setProofJson(JSON.stringify({
      wallet: walletKey,
      score: g.score,
      money: g.money,
      rugsAvoided: g.rugsAvoided,
      timestamp: Date.now(),
      nonce: crypto.randomUUID(),
    }));
  }, [walletKey]);

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.state === "idle") { startGame(); return; }
    if (g.state === "playing" && !g.isJumping) {
      g.playerVY = JUMP_FORCE;
      g.isJumping = true;
    }
  }, [startGame]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") { e.preventDefault(); jump(); }
      if (e.code === "Enter" && gameRef.current.state === "over") startGame();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump, startGame]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const g = gameRef.current;

      // === BACKGROUND ===
      // Dark gradient sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      skyGrad.addColorStop(0, "#070710");
      skyGrad.addColorStop(1, "#0f0f1a");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, CANVAS_W, GROUND_Y);

      // Scrolling red "danger glow" in background
      if (g.state === "playing") {
        const pulseAlpha = 0.03 + Math.sin(g.frameCount * 0.02) * 0.02;
        ctx.fillStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
        ctx.fillRect(0, 0, CANVAS_W, GROUND_Y);
      }

      // Background chart lines (simulating a crashing token chart)
      ctx.strokeStyle = "rgba(239, 68, 68, 0.12)";
      ctx.lineWidth = 1;
      if (g.chartPoints.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < g.chartPoints.length; i++) {
          const cx = ((i * 25 - g.groundOffset * 0.5) % (CANVAS_W + 100)) + 50;
          const cy = GROUND_Y - 80 - g.chartPoints[i];
          if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
        }
        ctx.stroke();
        // Second chart line (green, the "safe" one)
        ctx.strokeStyle = "rgba(34, 197, 94, 0.08)";
        ctx.beginPath();
        for (let i = 0; i < g.chartPoints.length; i++) {
          const cx = ((i * 25 - g.groundOffset * 0.3) % (CANVAS_W + 100)) + 50;
          const cy = GROUND_Y - 120 - g.chartPoints[i] * 0.6;
          if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
        }
        ctx.stroke();
      }

      // Ground — blockchain-styled
      const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_H);
      groundGrad.addColorStop(0, "#1a1a28");
      groundGrad.addColorStop(1, "#12121c");
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

      // Ground top line
      ctx.strokeStyle = "#2e2e3d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      ctx.lineTo(CANVAS_W, GROUND_Y);
      ctx.stroke();

      // Ground block pattern (blockchain blocks)
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_W + 60; i += 60) {
        const bx = ((i - g.groundOffset * 1.5) % (CANVAS_W + 60) + CANVAS_W + 60) % (CANVAS_W + 60) - 30;
        ctx.strokeRect(bx, GROUND_Y + 4, 50, CANVAS_H - GROUND_Y - 8);
      }

      // === GAME LOGIC ===
      if (g.state === "playing") {
        g.frameCount++;
        g.speed = BASE_SPEED + Math.floor(g.frameCount / 400) * 0.5;
        g.groundOffset += g.speed;

        // Danger wave creeps closer over time
        g.dangerWaveX = Math.min(-5, -DANGER_WAVE_W + g.frameCount * 0.008);

        // Score + passive earnings (surviving = earning)
        if (g.frameCount % 5 === 0) {
          g.score++;
          g.money += 0.01;
        }

        // Shift chart points occasionally for animation
        if (g.frameCount % 30 === 0) {
          g.chartPoints.shift();
          g.chartPoints.push(Math.random() * 30 + 5);
        }

        // Spawn scam obstacles
        if (g.frameCount % Math.max(35, 75 - Math.floor(g.frameCount / 250) * 5) === 0) {
          const scam = SCAM_TYPES[Math.floor(Math.random() * SCAM_TYPES.length)];
          const h = 25 + Math.random() * 35;
          g.obstacles.push({
            x: CANVAS_W + 20,
            width: 28 + Math.random() * 18,
            height: h,
            scamType: scam,
          });
        }

        // Spawn safe token pickups
        if (g.frameCount % 80 === 0 && Math.random() > 0.35) {
          const values = [0.25, 0.50, 1.00, 2.00, 5.00];
          const labels = ["CASH", "MONEY", "BAG", "STACK", "PROFIT"];
          g.tokens.push({
            x: CANVAS_W + 20,
            y: GROUND_Y - 65 - Math.random() * 85,
            collected: false,
            value: values[Math.floor(Math.random() * values.length)],
            label: labels[Math.floor(Math.random() * labels.length)],
          });
        }

        // Player physics
        g.playerVY += GRAVITY;
        g.playerY += g.playerVY;
        if (g.playerY >= GROUND_Y - PLAYER_H) {
          g.playerY = GROUND_Y - PLAYER_H;
          g.playerVY = 0;
          g.isJumping = false;
        }

        // Update obstacles
        g.obstacles = g.obstacles.filter((o) => o.x + o.width > -10);
        let rugAvoided = false;
        for (const o of g.obstacles) {
          o.x -= g.speed;
          // Track when player survives past an obstacle
          if (Math.abs(o.x + o.width - 55) < g.speed && !rugAvoided) {
            g.rugsAvoided++;
            rugAvoided = true;
          }
          const px = 60, py = g.playerY;
          if (px + PLAYER_W > o.x + 5 && px < o.x + o.width - 5 && py + PLAYER_H > GROUND_Y - o.height + 5) {
            endGame();
            break;
          }
        }

        // Update safe tokens
        for (const t of g.tokens) {
          t.x -= g.speed;
          if (!t.collected) {
            const px = 60, py = g.playerY;
            if (px + PLAYER_W > t.x - 8 && px < t.x + 20 && py + PLAYER_H > t.y - 8 && py < t.y + 20) {
              t.collected = true;
              g.score += 15;
              g.money += t.value;
            }
          }
        }
        g.tokens = g.tokens.filter((t) => t.x > -20);

        setScore(g.score);
        setMoney(g.money);
        setSurvived(g.rugsAvoided);
      }

      // === DANGER WAVE (left side chasing wall) ===
      if (g.state === "playing") {
        const waveGrad = ctx.createLinearGradient(g.dangerWaveX, 0, g.dangerWaveX + DANGER_WAVE_W + 30, 0);
        waveGrad.addColorStop(0, "rgba(220, 38, 38, 0.6)");
        waveGrad.addColorStop(0.5, "rgba(220, 38, 38, 0.2)");
        waveGrad.addColorStop(1, "rgba(220, 38, 38, 0)");
        ctx.fillStyle = waveGrad;
        ctx.fillRect(g.dangerWaveX, 0, DANGER_WAVE_W + 30, GROUND_Y);
        // "RUGPULL" text on wave
        ctx.save();
        ctx.translate(g.dangerWaveX + 14, GROUND_Y / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("POVERTY", 0, 0);
        ctx.restore();
      }

      // === DRAW SCAM OBSTACLES ===
      for (const o of g.obstacles) {
        const ox = o.x, oy = GROUND_Y - o.height, ow = o.width, oh = o.height;
        // Shadow
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(ox + 3, oy + 3, ow, oh);
        // Body
        ctx.fillStyle = o.scamType.bg;
        ctx.fillRect(ox, oy, ow, oh);
        // Top stripe (warning)
        ctx.fillStyle = o.scamType.color;
        ctx.fillRect(ox, oy, ow, 6);
        // Skull / warning icon
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("\u26A0", ox + ow / 2, oy + oh / 2 + 2);
        // Scam label
        if (oh > 30 && ow > 24) {
          ctx.fillStyle = o.scamType.color;
          ctx.font = "bold 6px monospace";
          ctx.fillText(o.scamType.label, ox + ow / 2, oy + oh - 6);
        }
      }

      // === DRAW MONEY BAG PICKUPS ===
      for (const t of g.tokens) {
        if (t.collected) continue;
        // Glow
        ctx.shadowColor = "#22c55e";
        ctx.shadowBlur = 10;
        // Money bag shape
        ctx.fillStyle = "#166534";
        ctx.beginPath();
        ctx.arc(t.x + 8, t.y + 8, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.arc(t.x + 8, t.y + 8, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        // Dollar sign
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("$", t.x + 8, t.y + 13);
        // Value label
        ctx.fillStyle = "#bbf7d0";
        ctx.font = "bold 7px sans-serif";
        ctx.fillText(`$${t.value.toFixed(2)}`, t.x + 8, t.y - 4);
        // Pickup label
        ctx.fillStyle = "#4ade80";
        ctx.font = "bold 5px monospace";
        ctx.fillText(t.label, t.x + 8, t.y + 24);
      }

      // === DRAW PLAYER (money collector) ===
      const px = 60;
      const py = g.playerY;
      // Shadow
      ctx.fillStyle = "rgba(34, 197, 94, 0.15)";
      ctx.fillRect(px + 2, GROUND_Y - 2, PLAYER_W - 4, 4);
      // Body (suit jacket)
      ctx.fillStyle = "#1e3a5f";
      ctx.fillRect(px + 5, py + 12, PLAYER_W - 10, PLAYER_H - 20);
      // Head
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(px + PLAYER_W / 2, py + 9, 10, 0, Math.PI * 2);
      ctx.fill();
      // Eyes (looking right — running forward)
      ctx.fillStyle = "#0f0f14";
      ctx.fillRect(px + 13, py + 7, 3, 3);
      ctx.fillRect(px + 18, py + 7, 3, 3);
      // Mouth (worried expression)
      ctx.strokeStyle = "#0f0f14";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(px + PLAYER_W / 2, py + 15, 4, 0, Math.PI);
      ctx.stroke();
      // Tie
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(px + PLAYER_W / 2 - 2, py + 19, 4, 8);
      // Legs (animated running)
      ctx.fillStyle = "#1a1a28";
      if (g.isJumping) {
        ctx.fillRect(px + 7, py + PLAYER_H - 12, 6, 12);
        ctx.fillRect(px + PLAYER_W - 13, py + PLAYER_H - 12, 6, 12);
      } else {
        const legOff = Math.sin(g.frameCount * 0.35) * 4;
        ctx.fillRect(px + 7, py + PLAYER_H - 12 + legOff, 6, 12);
        ctx.fillRect(px + PLAYER_W - 13, py + PLAYER_H - 12 - legOff, 6, 12);
      }
      // Small shield icon above player when jumping
      if (g.isJumping) {
        ctx.fillStyle = "rgba(34, 197, 94, 0.5)";
        ctx.beginPath();
        ctx.arc(px + PLAYER_W / 2, py - 6, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("\u2713", px + PLAYER_W / 2, py - 3);
      }

      // === HUD ===
      // Scams dodged counter
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 11px 'Inter', sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`\u26A0 Scams dodged: ${g.rugsAvoided}`, CANVAS_W - 16, 48);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px 'Inter', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${g.score}`, 16, 26);

      ctx.fillStyle = "#22c55e";
      ctx.font = "bold 16px 'Inter', sans-serif";
      ctx.fillText(`$${g.money.toFixed(2)} stacked`, 16, 48);

      ctx.font = "11px 'Inter', sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.textAlign = "right";
      ctx.fillText(`Speed: ${g.speed.toFixed(1)}x`, CANVAS_W - 16, 26);

      // === IDLE SCREEN ===
      if (g.state === "idle") {
        ctx.fillStyle = "rgba(7, 7, 16, 0.8)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 40px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GetRichQuick", CANVAS_W / 2, CANVAS_H / 2 - 45);

        ctx.fillStyle = "#fbbf24";
        ctx.font = "14px 'Inter', sans-serif";
        ctx.fillText("Stack money. Dodge scams. No regrets.", CANVAS_W / 2, CANVAS_H / 2 - 15);

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px 'Inter', sans-serif";
        ctx.fillText("Press SPACE or tap to start stacking", CANVAS_W / 2, CANVAS_H / 2 + 18);

        ctx.fillStyle = "#4ade80";
        ctx.font = "12px 'Inter', sans-serif";
        ctx.fillText("Grab cash bags \u2022 Jump over scams \u2022 Get rich or die trying", CANVAS_W / 2, CANVAS_H / 2 + 48);

        ctx.fillStyle = "#6b7280";
        ctx.font = "11px 'Inter', sans-serif";
        ctx.fillText("Investors here are never pishman.", CANVAS_W / 2, CANVAS_H / 2 + 72);
      }

      // === GAME OVER SCREEN ===
      if (g.state === "over") {
        ctx.fillStyle = "rgba(7, 7, 16, 0.85)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 34px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("SCAMMED!", CANVAS_W / 2, CANVAS_H / 2 - 55);

        ctx.fillStyle = "#9ca3af";
        ctx.font = "13px 'Inter', sans-serif";
        ctx.fillText("A scam got your bag. But real ones get back up.", CANVAS_W / 2, CANVAS_H / 2 - 30);

        ctx.fillStyle = "#ffffff";
        ctx.font = "18px 'Inter', sans-serif";
        ctx.fillText(`Score: ${g.score}  |  Scams dodged: ${g.rugsAvoided}`, CANVAS_W / 2, CANVAS_H / 2);

        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 24px 'Inter', sans-serif";
        ctx.fillText(`You stacked $${g.money.toFixed(2)} this round`, CANVAS_W / 2, CANVAS_H / 2 + 32);

        ctx.fillStyle = "#9ca3af";
        ctx.font = "14px 'Inter', sans-serif";
        ctx.fillText("Press ENTER or tap to stack again", CANVAS_W / 2, CANVAS_H / 2 + 62);

        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 11px 'Inter', sans-serif";
        ctx.fillText("No pishman. Get back in and stack more.", CANVAS_W / 2, CANVAS_H / 2 + 85);
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [endGame]);

  const handleCanvasClick = () => {
    const g = gameRef.current;
    if (g.state === "idle") startGame();
    else if (g.state === "playing") jump();
    else if (g.state === "over") startGame();
  };

  const handleCopyProof = async () => {
    await copyToClipboard(proofJson);
    setProofCopied(true);
    setTimeout(() => setProofCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div className="relative mx-auto overflow-hidden rounded-2xl border border-white/10" style={{ maxWidth: CANVAS_W }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={handleCanvasClick}
          onTouchStart={(e) => { e.preventDefault(); handleCanvasClick(); }}
          className="block w-full cursor-pointer"
        />
      </div>

      {/* Score display */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 text-sm flex-wrap">
        <span className="text-gray-400">
          Score: <span className="font-bold text-white">{score}</span>
        </span>
        <span className="text-brand-400 font-bold text-base">
          ${money.toFixed(2)} stacked
        </span>
        <span className="text-red-400 text-xs">
          Scams dodged: <span className="font-bold">{survived}</span>
        </span>
        <span className="text-gray-400">
          Best: <span className="font-bold text-brand-400">{bestScore}</span>
        </span>
      </div>

      {/* Game over card */}
      {gameState === "over" && (
        <div className="mx-auto max-w-lg glass-card p-5 space-y-4">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-red-400">Scammed this round</p>
            <p className="text-3xl font-bold text-brand-400 mt-1">${money.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">stacked before the scam hit</p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="rounded-lg bg-white/5 px-3 py-2 text-center">
              <p className="font-bold text-white">{score}</p>
              <p className="text-gray-500">Score</p>
            </div>
            <div className="rounded-lg bg-white/5 px-3 py-2 text-center">
              <p className="font-bold text-red-400">{survived}</p>
              <p className="text-gray-500">Scams dodged</p>
            </div>
            <div className="rounded-lg bg-white/5 px-3 py-2 text-center">
              <p className="font-bold text-brand-400">${money.toFixed(2)}</p>
              <p className="text-gray-500">Stacked</p>
            </div>
          </div>

          <div className="rounded-lg bg-black/30 p-3">
            <code className="text-[11px] text-gray-400 break-all select-all">{proofJson}</code>
          </div>

          <button onClick={handleCopyProof} className="btn-secondary w-full text-sm">
            {proofCopied ? "Copied!" : "Copy score proof"}
          </button>

          <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
            <p className="text-xs text-gray-400">Wallet connect required to claim earnings</p>
            <span className="mt-1 inline-block rounded-md bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-400">COMING SOON</span>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-[11px] text-gray-600 max-w-lg mx-auto">
        Demo game. No real money involved yet. Stack bags, not regrets. Always DYOR.
      </p>
    </div>
  );
}
