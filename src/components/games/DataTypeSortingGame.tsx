import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { RotateCcw, Heart, Play } from 'lucide-react';

interface GameProps {
  onScoreSubmit: (score: number, badgeId?: string) => void;
}

type DataType = 'int' | 'double' | 'boolean' | 'char' | 'String';

interface FallingToken {
  val: string;
  type: DataType;
  x: number;
  y: number;
  speed: number;
}

export const DataTypeSortingGame: React.FC<GameProps> = ({ onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [activeBinIndex, setActiveBinIndex] = useState(0);

  const bins: DataType[] = ['int', 'double', 'boolean', 'char', 'String'];
  const binColors: Record<DataType, string> = {
    int: '#00f0ff',
    double: '#3b82f6',
    boolean: '#10b981',
    char: '#f59e0b',
    String: '#ec4899',
  };

  const sampleValues: { val: string; type: DataType }[] = [
    { val: '42', type: 'int' },
    { val: '-105', type: 'int' },
    { val: '2024', type: 'int' },
    { val: '3.1415', type: 'double' },
    { val: '0.99', type: 'double' },
    { val: '-12.5', type: 'double' },
    { val: 'true', type: 'boolean' },
    { val: 'false', type: 'boolean' },
    { val: "'A'", type: 'char' },
    { val: "'9'", type: 'char' },
    { val: "'@'", type: 'char' },
    { val: '"BolehCode"', type: 'String' },
    { val: '"Java"', type: 'String' },
    { val: '"UniSZA"', type: 'String' },
  ];

  const fallingTokensRef = useRef<FallingToken[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const activeBinRef = useRef(0);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);

  const spawnToken = (width: number) => {
    const item = sampleValues[Math.floor(Math.random() * sampleValues.length)];
    const binWidth = width / 5;
    // Spawn aligned with one of the bins
    const targetBin = Math.floor(Math.random() * 5);
    const x = targetBin * binWidth + binWidth / 2;

    fallingTokensRef.current.push({
      val: item.val,
      type: item.type,
      x,
      y: 10,
      speed: 1.8 + Math.min(2.5, scoreRef.current * 0.05),
    });
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const binWidth = canvas.width / 5;
    const binHeight = 65;
    const binY = canvas.height - binHeight;

    // Draw Bins at bottom
    bins.forEach((b, idx) => {
      const x = idx * binWidth;
      const isSelected = activeBinRef.current === idx;

      ctx.save();
      ctx.fillStyle = isSelected ? `${binColors[b]}25` : '#0f172a';
      ctx.strokeStyle = isSelected ? binColors[b] : '#334155';
      ctx.lineWidth = isSelected ? 3 : 1;
      if (isSelected) {
        ctx.shadowColor = binColors[b];
        ctx.shadowBlur = 12;
      }
      ctx.fillRect(x + 4, binY, binWidth - 8, binHeight - 4);
      ctx.strokeRect(x + 4, binY, binWidth - 8, binHeight - 4);

      // Bin Label
      ctx.shadowBlur = 0;
      ctx.fillStyle = binColors[b];
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b, x + binWidth / 2, binY + 22);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      ctx.fillText(`[${idx + 1}]`, x + binWidth / 2, binY + 44);
      ctx.restore();
    });

    if (gameState === 'playing') {
      // Spawn new tokens periodically
      if (Math.random() < 0.025 && fallingTokensRef.current.length < 3) {
        spawnToken(canvas.width);
      }

      // Update and draw falling tokens
      for (let i = fallingTokensRef.current.length - 1; i >= 0; i--) {
        const token = fallingTokensRef.current[i];
        token.y += token.speed;

        // Draw Token
        ctx.save();
        ctx.fillStyle = '#050a17';
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        const boxW = Math.max(70, ctx.measureText(token.val).width + 24);
        const boxH = 30;
        ctx.roundRect(token.x - boxW / 2, token.y - boxH / 2, boxW, boxH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(token.val, token.x, token.y);
        ctx.restore();

        // Check if token hit the bin level
        if (token.y >= binY - 10) {
          const binIndexUnderToken = Math.floor(token.x / binWidth);
          const chosenBin = bins[binIndexUnderToken];

          if (chosenBin === token.type) {
            sound.playCoin();
            scoreRef.current += 10;
            setScore(scoreRef.current);
          } else {
            sound.playWrong();
            livesRef.current -= 1;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
              setGameState('gameover');
              onScoreSubmit(scoreRef.current * 5);
            }
          }

          fallingTokensRef.current.splice(i, 1);
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  const handleSelectBin = (idx: number) => {
    activeBinRef.current = idx;
    setActiveBinIndex(idx);
    sound.playClick();

    // If there's a falling token close to bottom, steer it into this bin!
    if (fallingTokensRef.current.length > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const binWidth = canvas.width / 5;
      fallingTokensRef.current[0].x = idx * binWidth + binWidth / 2;
    }
  };

  const startGame = () => {
    sound.playClick();
    scoreRef.current = 0;
    livesRef.current = 3;
    setScore(0);
    setLives(3);
    fallingTokensRef.current = [];
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 380;
    }

    animFrameIdRef.current = requestAnimationFrame(gameLoop);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        handleSelectBin(parseInt(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 md:p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-cyber">
            Data Type Sorting
          </h3>
          <p className="text-xs text-slate-500">
            Topic 3: Sort falling values into the correct data type memory slot
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-code font-bold">
          <div className="flex items-center gap-1 text-rose-500">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? 'fill-current' : 'text-slate-300'}`}
              />
            ))}
          </div>
          <div className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700">
            Points: {score}
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] max-h-[400px] rounded-xl overflow-hidden bg-[#060912] border border-slate-800">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-lg font-bold text-white font-cyber mb-2">
              Match Memory Data Types
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Sort falling value tokens (int, double, boolean, char, String) into valid memory bins. Use the buttons below or keyboard keys 1-5!
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-sm shadow-xl transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-xl font-bold text-red-400 font-cyber mb-1">
              Type Mismatch Error!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Accumulated Score: {score} Points ({score * 5} XP)
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Touch buttons for mobile device friendliness */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {bins.map((b, idx) => (
          <button
            key={b}
            onClick={() => handleSelectBin(idx)}
            className={`py-2 px-1 rounded-xl text-center text-xs font-mono-code font-bold transition border ${
              activeBinIndex === idx
                ? 'bg-purple-500 text-slate-950 border-purple-400 shadow-md'
                : 'bg-slate-900/90 text-slate-200 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>{b}</div>
            <div className="text-[10px] opacity-60">[{idx + 1}]</div>
          </button>
        ))}
      </div>
    </div>
  );
};
