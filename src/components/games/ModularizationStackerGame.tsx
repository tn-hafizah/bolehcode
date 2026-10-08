import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { RotateCcw, Trophy, Play } from 'lucide-react';

interface GameProps {
  onScoreSubmit: (score: number, badgeId?: string) => void;
}

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  name: string;
}

export const ModularizationStackerGame: React.FC<GameProps> = ({ onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const blockHeight = 32;
  const moduleNames = [
    'main()',
    'validateUser()',
    'calculateTax()',
    'formatOutput()',
    'fetchRecord()',
    'encryptData()',
    'generateToken()',
    'renderReport()',
    'closeConnection()',
  ];

  const colors = [
    '#00f0ff', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'
  ];

  const stackRef = useRef<Block[]>([]);
  const currentBlockRef = useRef<{
    x: number;
    y: number;
    width: number;
    speed: number;
    direction: number;
    color: string;
    name: string;
  }>({
    x: 50,
    y: 0,
    width: 160,
    speed: 3.5,
    direction: 1,
    color: '#00f0ff',
    name: 'main()',
  });

  const animFrameIdRef = useRef<number | null>(null);

  const initGame = (width: number, height: number) => {
    const baseWidth = Math.min(220, width * 0.5);
    const baseX = (width - baseWidth) / 2;
    const baseY = height - blockHeight - 20;

    stackRef.current = [
      {
        x: baseX,
        y: baseY,
        width: baseWidth,
        height: blockHeight,
        color: '#1e293b',
        name: 'ROOT: System Architecture',
      },
    ];

    currentBlockRef.current = {
      x: 20,
      y: baseY - blockHeight,
      width: baseWidth,
      speed: 3.5,
      direction: 1,
      color: colors[0],
      name: moduleNames[0],
    };

    setScore(0);
  };

  const handlePlaceBlock = () => {
    if (gameState !== 'playing') return;

    const stack = stackRef.current;
    const current = currentBlockRef.current;
    const topStackBlock = stack[stack.length - 1];

    const diff = current.x - topStackBlock.x;

    if (Math.abs(diff) >= current.width) {
      // Missed completely -> Game Over
      sound.playWrong();
      setGameState('gameover');
      if (score > highScore) setHighScore(score);
      onScoreSubmit(score * 15, score >= 8 ? 'badge-problemsolver' : undefined);
      return;
    }

    // Cut off excess
    sound.playCoin();
    let newWidth = current.width - Math.abs(diff);
    let newX = diff > 0 ? current.x : topStackBlock.x;

    // Perfect alignment bonus
    if (Math.abs(diff) < 4) {
      newWidth = topStackBlock.width;
      newX = topStackBlock.x;
      sound.playCorrect();
    }

    stack.push({
      x: newX,
      y: current.y,
      width: newWidth,
      height: blockHeight,
      color: current.color,
      name: current.name,
    });

    const newScore = stack.length - 1;
    setScore(newScore);

    // Prepare next block
    const canvas = canvasRef.current;
    const nextWidth = newWidth;
    const nextColor = colors[newScore % colors.length];
    const nextName = moduleNames[newScore % moduleNames.length];
    const nextSpeed = Math.min(7.5, 3.5 + newScore * 0.3);

    // Shift stack down if getting too high
    if (current.y < 120 && canvas) {
      stack.forEach((b) => (b.y += blockHeight));
    }

    currentBlockRef.current = {
      x: 0,
      y: current.y - blockHeight,
      width: nextWidth,
      speed: nextSpeed,
      direction: Math.random() > 0.5 ? 1 : -1,
      color: nextColor,
      name: nextName,
    };
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Cyberpunk grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Update moving block
    if (gameState === 'playing') {
      const cur = currentBlockRef.current;
      cur.x += cur.speed * cur.direction;
      if (cur.x + cur.width > canvas.width) {
        cur.direction = -1;
      } else if (cur.x < 0) {
        cur.direction = 1;
      }
    }

    // Render Stacked Blocks
    stackRef.current.forEach((b, idx) => {
      ctx.save();
      ctx.fillStyle = b.color;
      ctx.strokeStyle = '#ffffff22';
      ctx.lineWidth = 1;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = idx === stackRef.current.length - 1 ? 12 : 4;
      ctx.fillRect(b.x, b.y, b.width, b.height);
      ctx.strokeRect(b.x, b.y, b.width, b.height);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (b.width > 50) {
        ctx.fillText(b.name, b.x + b.width / 2, b.y + b.height / 2);
      }
      ctx.restore();
    });

    // Render Current Moving Block
    if (gameState === 'playing') {
      const cur = currentBlockRef.current;
      ctx.save();
      ctx.fillStyle = cur.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.shadowColor = cur.color;
      ctx.shadowBlur = 15;
      ctx.fillRect(cur.x, cur.y, cur.width, blockHeight);
      ctx.strokeRect(cur.x, cur.y, cur.width, blockHeight);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#0a0e17';
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cur.name, cur.x + cur.width / 2, cur.y + blockHeight / 2);
      ctx.restore();
    }

    animFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  const startGame = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (canvas) {
      initGame(canvas.width, canvas.height);
    }
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 400;
      initGame(canvas.width, canvas.height);
    }

    animFrameIdRef.current = requestAnimationFrame(gameLoop);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlaceBlock();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]);

  return (
    <div className="rounded-2xl bg-[#090d18] border border-cyan-500/40 p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-blue-400 font-cyber">
            Modularization Stacker
          </h3>
          <p className="text-xs text-slate-400">
            Topic 2: Stack oscillating function modules precisely on top of one another
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-code font-bold">
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300">
            Layers: {score}
          </div>
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
            Record: {highScore}
          </div>
        </div>
      </div>

      <div
        className="relative w-full aspect-[4/3] md:aspect-[16/9] max-h-[420px] rounded-xl overflow-hidden bg-[#060912] border border-slate-800 select-none cursor-pointer"
        onClick={handlePlaceBlock}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-lg font-bold text-white font-cyber mb-2">
              Build Modular Architecture
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Tap the screen or press [SPACE] to drop the oscillating function module. Stack as high as possible!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-sm shadow-xl transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-xl font-bold text-red-400 font-cyber mb-1">
              Module Disconnected from Structure!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Height Reached: {score} Modules ({score * 15} XP)
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-slate-950 font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Stack Again</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-400 font-mono-code">
        💡 Tip: Tap anywhere on the canvas or press [SPACE] to drop the module block.
      </div>
    </div>
  );
};
