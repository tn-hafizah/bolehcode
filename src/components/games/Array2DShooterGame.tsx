import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { RotateCcw, Trophy, Play, Crosshair } from 'lucide-react';

interface GameProps {
  onScoreSubmit: (score: number, badgeId?: string) => void;
}

export const Array2DShooterGame: React.FC<GameProps> = ({ onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [targetRow, setTargetRow] = useState(0);
  const [targetCol, setTargetCol] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const rows = 4;
  const cols = 4;
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef({ r: 0, c: 0 });
  const scoreRef = useRef(0);
  const hitsCountRef = useRef(0);

  const generateNewTarget = () => {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    targetRef.current = { r, c };
    setTargetRow(r);
    setTargetCol(c);
  };

  const drawMatrix = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padX = 50;
    const padY = 40;
    const cellW = (canvas.width - padX * 2) / cols;
    const cellH = (canvas.height - padY * 2) / rows;

    // Draw Column Headers [0], [1], [2], [3]
    ctx.fillStyle = '#00f0ff';
    ctx.font = 'bold 12px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let c = 0; c < cols; c++) {
      ctx.fillText(`col[${c}]`, padX + c * cellW + cellW / 2, padY - 18);
    }

    // Draw Row Headers [0], [1], [2], [3]
    ctx.textAlign = 'right';
    for (let r = 0; r < rows; r++) {
      ctx.fillText(`row[${r}]`, padX - 12, padY + r * cellH + cellH / 2);
    }

    // Draw Grid Cells
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = padX + c * cellW;
        const y = padY + r * cellH;
        const isTarget = r === targetRef.current.r && c === targetRef.current.c;

        ctx.save();
        ctx.fillStyle = isTarget ? 'rgba(244, 63, 94, 0.15)' : '#0d1527';
        ctx.strokeStyle = isTarget ? '#f43f5e' : '#1e293b';
        ctx.lineWidth = isTarget ? 2.5 : 1;
        if (isTarget) {
          ctx.shadowColor = '#f43f5e';
          ctx.shadowBlur = 10;
        }

        ctx.beginPath();
        ctx.roundRect(x + 4, y + 4, cellW - 8, cellH - 8, 8);
        ctx.fill();
        ctx.stroke();

        // Cell coordinate label
        ctx.shadowBlur = 0;
        ctx.fillStyle = isTarget ? '#f43f5e' : '#64748b';
        ctx.font = isTarget ? 'bold 13px JetBrains Mono, monospace' : '11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`[${r}][${c}]`, x + cellW / 2, y + cellH / 2);

        if (isTarget) {
          // Target crosshair pulsing ring
          ctx.strokeStyle = '#f43f5e';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(x + cellW / 2, y + cellH / 2, Math.min(cellW, cellH) * 0.35, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.restore();
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const padX = 50;
    const padY = 40;
    const cellW = (canvas.width - padX * 2) / cols;
    const cellH = (canvas.height - padY * 2) / rows;

    const clickedCol = Math.floor((clickX - padX) / cellW);
    const clickedRow = Math.floor((clickY - padY) / cellH);

    if (
      clickedCol >= 0 &&
      clickedCol < cols &&
      clickedRow >= 0 &&
      clickedRow < rows
    ) {
      if (
        clickedRow === targetRef.current.r &&
        clickedCol === targetRef.current.c
      ) {
        sound.playShoot();
        scoreRef.current += 15;
        hitsCountRef.current += 1;
        setScore(scoreRef.current);
        generateNewTarget();
        drawMatrix();
      } else {
        sound.playWrong();
        scoreRef.current = Math.max(0, scoreRef.current - 5);
        setScore(scoreRef.current);
      }
    }
  };

  const startGame = () => {
    sound.playClick();
    scoreRef.current = 0;
    hitsCountRef.current = 0;
    setScore(0);
    setTimeLeft(30);
    setGameState('playing');
    generateNewTarget();

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          setGameState('gameover');
          sound.playWin();
          onScoreSubmit(
            scoreRef.current,
            scoreRef.current >= 60 ? 'badge-array' : undefined
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => drawMatrix(), 50);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 360;
      drawMatrix();
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <div className="rounded-2xl bg-[#090d18] border border-cyan-500/40 p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-rose-400 font-cyber">
            Array 2D Shooter
          </h3>
          <p className="text-xs text-slate-400">
            Topic 5: Blast the targeted 2D matrix coordinates &ldquo;matrix[row][col]&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-code font-bold">
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-rose-300">
            Score: {score} XP
          </div>
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
            Time: {timeLeft}s
          </div>
        </div>
      </div>

      {/* Target Radar Announcement */}
      {gameState === 'playing' && (
        <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-center gap-2 text-rose-300 font-mono-code text-sm font-bold animate-pulse">
          <Crosshair className="w-4 h-4 text-rose-400" />
          <span>TARGET: matrix[{targetRow}][{targetCol}]</span>
        </div>
      )}

      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] max-h-[380px] rounded-xl overflow-hidden bg-[#060912] border border-slate-800">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full block cursor-crosshair"
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-lg font-bold text-white font-cyber mb-2">
              Master 2D Matrix Indices
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Observe the requested coordinates (e.g., matrix[2][3]) and click the matching grid cell quickly!
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-sm shadow-xl transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h4 className="text-xl font-bold text-rose-400 font-cyber mb-1">
              Matrix Training Session Complete!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Index Accuracy: {hitsCountRef.current} Direct Hits ({score} XP)
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Shoot Again</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-400 font-mono-code">
        💡 Tip: Row indices are horizontal, column indices are vertical. Both start from 0!
      </div>
    </div>
  );
};
