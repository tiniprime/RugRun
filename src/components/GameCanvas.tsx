import { useRef, useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { addScore, setBestScore, getBestScore } from "../lib/storage";
import { truncatePubkey, copyToClipboard } from "../lib/format";

type GameState = "idle" | "playing" | "over";

interface Obstacle {
  x: number;
  width: number;
  height: number;
  color: string;
}

interface Coin {
  x: number;
  y: number;
  collected: boolean;
}

interface ScoreProof {
  wallet: string;
  score: number;
  timestamp: number;
  nonce: string;
}

const CANVAS_W = 800;
const CANVAS_H = 320;
const GROUND_Y = CANVAS_H - 40;
const PLAYER_W = 28;
const PLAYER_H = 40;
const GRAVITY = 0.7;
const JUMP_FORCE = -13;
const BASE_SPEED = 4;

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const { publicKey, signMessage } = useWallet();

  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [bestScore, setBest] = useState(0);
  const [proofJson, setProofJson] = useState("");
  const [signedProof, setSignedProof] = useState("");
  const [proofCopied, setProofCopied] = useState(false);
  const [signing, setSigning] = useState(false);

  // Game state refs (not in React state to avoid re-renders during game loop)
  const gameRef = useRef({
    state: "idle" as GameState,
    playerY: GROUND_Y - PLAYER_H,
    playerVY: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    coins: [] as Coin[],
    score: 0,
    speed: BASE_SPEED,
    frameCount: 0,
    groundOffset: 0,
  });

  const walletKey = publicKey ? publicKey.toBase58() : "guest";

  useEffect(() => {
    setBest(getBestScore(walletKey));
  }, [walletKey]);

  const resetGame = useCallback(() => {
    const g = gameRef.current;
    g.playerY = GROUND_Y - PLAYER_H;
    g.playerVY = 0;
    g.isJumping = false;
    g.obstacles = [];
    g.coins = [];
    g.score = 0;
    g.speed = BASE_SPEED;
    g.frameCount = 0;
    g.groundOffset = 0;
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    gameRef.current.state = "playing";
    setGameState("playing");
    setScore(0);
    setProofJson("");
    setSignedProof("");
  }, [resetGame]);

  const endGame = useCallback(() => {
    const g = gameRef.current;
    g.state = "over";
    setGameState("over");
    setScore(g.score);

    // Save scores
    addScore(walletKey, g.score);
    setBestScore(walletKey, g.score);
    setBest(getBestScore(walletKey));

    // Build proof
    const proof: ScoreProof = {
      wallet: walletKey,
      score: g.score,
      timestamp: Date.now(),
      nonce: crypto.randomUUID(),
    };
    setProofJson(JSON.stringify(proof));
  }, [walletKey]);

  const jump = useCallback(() => {
    const g = gameRef.current;
    if (g.state === "idle") {
      startGame();
      return;
    }
    if (g.state === "playing" && !g.isJumping) {
      g.playerVY = JUMP_FORCE;
      g.isJumping = true;
    }
  }, [startGame]);

  // Input handling
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
      if (e.code === "Enter" && gameRef.current.state === "over") {
        startGame();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump, startGame]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const g = gameRef.current;

      // Clear
      ctx.fillStyle = "#0f0f14";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Stars
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      for (let i = 0; i < 30; i++) {
        const sx = ((i * 137 + g.groundOffset * 0.2) % CANVAS_W);
        const sy = (i * 47) % (GROUND_Y - 60);
        ctx.fillRect(sx, sy + 10, 1.5, 1.5);
      }

      // Ground
      ctx.fillStyle = "#1c1c26";
      ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);

      // Ground line pattern
      ctx.strokeStyle = "#2e2e3d";
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_W + 40; i += 40) {
        const x = ((i - g.groundOffset * 2) % (CANVAS_W + 40) + CANVAS_W + 40) % (CANVAS_W + 40) - 20;
        ctx.beginPath();
        ctx.moveTo(x, GROUND_Y);
        ctx.lineTo(x, CANVAS_H);
        ctx.stroke();
      }

      if (g.state === "playing") {
        g.frameCount++;
        g.speed = BASE_SPEED + Math.floor(g.frameCount / 500) * 0.5;
        g.groundOffset += g.speed;

        // Score
        if (g.frameCount % 5 === 0) g.score++;

        // Spawn obstacles
        if (g.frameCount % Math.max(40, 80 - Math.floor(g.frameCount / 300) * 5) === 0) {
          const h = 20 + Math.random() * 35;
          g.obstacles.push({
            x: CANVAS_W + 20,
            width: 20 + Math.random() * 15,
            height: h,
            color: Math.random() > 0.5 ? "#ef4444" : "#f97316",
          });
        }

        // Spawn coins
        if (g.frameCount % 90 === 0 && Math.random() > 0.4) {
          g.coins.push({
            x: CANVAS_W + 20,
            y: GROUND_Y - 60 - Math.random() * 80,
            collected: false,
          });
        }

        // Update player
        g.playerVY += GRAVITY;
        g.playerY += g.playerVY;
        if (g.playerY >= GROUND_Y - PLAYER_H) {
          g.playerY = GROUND_Y - PLAYER_H;
          g.playerVY = 0;
          g.isJumping = false;
        }

        // Update obstacles
        g.obstacles = g.obstacles.filter((o) => o.x + o.width > -10);
        for (const o of g.obstacles) {
          o.x -= g.speed;

          // Collision
          const px = 60, py = g.playerY;
          if (
            px + PLAYER_W > o.x + 4 &&
            px < o.x + o.width - 4 &&
            py + PLAYER_H > GROUND_Y - o.height + 4
          ) {
            endGame();
            break;
          }
        }

        // Update coins
        for (const c of g.coins) {
          c.x -= g.speed;
          if (!c.collected) {
            const px = 60, py = g.playerY;
            if (
              px + PLAYER_W > c.x - 6 &&
              px < c.x + 18 &&
              py + PLAYER_H > c.y - 6 &&
              py < c.y + 18
            ) {
              c.collected = true;
              g.score += 10;
            }
          }
        }
        g.coins = g.coins.filter((c) => c.x > -20);

        setScore(g.score);
      }

      // Draw obstacles (rugs)
      for (const o of g.obstacles) {
        // Rug pattern
        ctx.fillStyle = o.color;
        ctx.fillRect(o.x, GROUND_Y - o.height, o.width, o.height);
        // Rug fringe
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(o.x, GROUND_Y - o.height, o.width, 4);
        // "RUG" text on obstacle
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.font = "bold 8px monospace";
        ctx.textAlign = "center";
        if (o.height > 25) {
          ctx.fillText("RUG", o.x + o.width / 2, GROUND_Y - o.height / 2 + 3);
        }
      }

      // Draw coins (SOL shards)
      for (const c of g.coins) {
        if (!c.collected) {
          ctx.fillStyle = "#fbbf24";
          ctx.beginPath();
          ctx.arc(c.x + 6, c.y + 6, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#0f0f14";
          ctx.font = "bold 9px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("S", c.x + 6, c.y + 10);
        }
      }

      // Draw player
      const px = 60;
      const py = g.playerY;
      // Body
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(px + 4, py + 8, PLAYER_W - 8, PLAYER_H - 16);
      // Head
      ctx.fillStyle = "#4ade80";
      ctx.beginPath();
      ctx.arc(px + PLAYER_W / 2, py + 8, 9, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = "#0f0f14";
      ctx.fillRect(px + 10, py + 5, 3, 3);
      ctx.fillRect(px + 16, py + 5, 3, 3);
      // Legs (animated)
      ctx.fillStyle = "#16a34a";
      if (g.isJumping) {
        ctx.fillRect(px + 6, py + PLAYER_H - 10, 6, 10);
        ctx.fillRect(px + PLAYER_W - 12, py + PLAYER_H - 10, 6, 10);
      } else {
        const legOff = Math.sin(g.frameCount * 0.3) * 3;
        ctx.fillRect(px + 6, py + PLAYER_H - 10 + legOff, 6, 10);
        ctx.fillRect(px + PLAYER_W - 12, py + PLAYER_H - 10 - legOff, 6, 10);
      }

      // HUD
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px 'Inter', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`Score: ${g.score}`, 16, 28);

      ctx.font = "12px 'Inter', sans-serif";
      ctx.fillStyle = "#9ca3af";
      ctx.textAlign = "right";
      ctx.fillText(`Speed: ${g.speed.toFixed(1)}x`, CANVAS_W - 16, 28);

      // Idle screen
      if (g.state === "idle") {
        ctx.fillStyle = "rgba(15, 15, 20, 0.7)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        ctx.fillStyle = "#22c55e";
        ctx.font = "bold 36px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("RugRun", CANVAS_W / 2, CANVAS_H / 2 - 30);

        ctx.fillStyle = "#9ca3af";
        ctx.font = "16px 'Inter', sans-serif";
        ctx.fillText("Press SPACE or tap to start", CANVAS_W / 2, CANVAS_H / 2 + 10);

        ctx.font = "13px 'Inter', sans-serif";
        ctx.fillText("Dodge the rugs. Collect SOL shards.", CANVAS_W / 2, CANVAS_H / 2 + 40);
      }

      // Game over screen
      if (g.state === "over") {
        ctx.fillStyle = "rgba(15, 15, 20, 0.8)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        ctx.fillStyle = "#ef4444";
        ctx.font = "bold 32px 'Inter', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("RUGGED!", CANVAS_W / 2, CANVAS_H / 2 - 40);

        ctx.fillStyle = "#ffffff";
        ctx.font = "20px 'Inter', sans-serif";
        ctx.fillText(`Score: ${g.score}`, CANVAS_W / 2, CANVAS_H / 2);

        ctx.fillStyle = "#9ca3af";
        ctx.font = "14px 'Inter', sans-serif";
        ctx.fillText("Press ENTER or tap to play again", CANVAS_W / 2, CANVAS_H / 2 + 35);
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

  const handleSign = async () => {
    if (!signMessage || !proofJson) return;
    setSigning(true);
    try {
      const encoded = new TextEncoder().encode(proofJson);
      const sig = await signMessage(encoded);
      const fullProof = JSON.stringify({
        proof: JSON.parse(proofJson),
        signature: btoa(String.fromCharCode(...sig)),
      });
      setSignedProof(fullProof);
    } catch (e) {
      console.error("Sign failed:", e);
    } finally {
      setSigning(false);
    }
  };

  const handleCopyProof = async () => {
    const text = signedProof || proofJson;
    await copyToClipboard(text);
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
          onTouchStart={(e) => {
            e.preventDefault();
            handleCanvasClick();
          }}
          className="block w-full cursor-pointer"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Score display */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <span className="text-gray-400">
          Score: <span className="font-bold text-white">{score}</span>
        </span>
        <span className="text-gray-400">
          Best: <span className="font-bold text-brand-400">{bestScore}</span>
        </span>
        {publicKey && (
          <span className="text-gray-500 text-xs">
            Playing as {truncatePubkey(publicKey.toBase58())}
          </span>
        )}
      </div>

      {/* Proof section */}
      {gameState === "over" && (
        <div className="mx-auto max-w-lg glass-card p-4 space-y-3">
          <h4 className="font-semibold text-sm text-center">Score Proof</h4>

          {publicKey && signMessage ? (
            <>
              {!signedProof ? (
                <button onClick={handleSign} disabled={signing} className="btn-primary w-full text-sm">
                  {signing ? "Signing..." : "Sign score proof with wallet"}
                </button>
              ) : (
                <p className="text-xs text-brand-400 text-center">Signed successfully!</p>
              )}
            </>
          ) : (
            <p className="text-xs text-gray-500 text-center">
              {publicKey ? "Wallet doesn't support message signing." : "Connect wallet to sign proof."}
            </p>
          )}

          <div className="rounded-lg bg-black/30 p-3 max-h-24 overflow-auto">
            <code className="text-[11px] text-gray-400 break-all select-all">
              {signedProof || proofJson}
            </code>
          </div>

          <button onClick={handleCopyProof} className="btn-secondary w-full text-sm">
            {proofCopied ? "Copied!" : signedProof ? "Copy signed proof" : "Copy unsigned proof"}
          </button>

          <p className="text-[11px] text-gray-500 text-center leading-relaxed">
            Paste this proof in our X thread / Discord to claim rewards (manual verification).
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-[11px] text-gray-600 max-w-lg mx-auto">
        Frontend-only demo. Scores can be spoofed. Rewards are discretionary.
      </p>
    </div>
  );
}
