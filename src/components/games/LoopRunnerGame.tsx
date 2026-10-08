import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { RotateCcw, Trophy, Play } from 'lucide-react';

interface GameProps {
  onScoreSubmit: (score: number, badgeId?: string) => void;
}

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: 'infinite_loop' | 'break_token';
}

export const LoopRunnerGame: React.FC<GameProps> = ({ onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const runnerRef = useRef({
    x: 60,
    y: 280,
    vy: 0,
    isJumping: false,
    radius: 18,
  });

  const obstaclesRef = useRef<Obstacle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const loopCounterRef = useRef(0);
  const speedRef = useRef(4.5);

  const jump = () => {
    if (gameState !== 'playing') return;
    const runner = runnerRef.current;
    if (!runner.isJumping) {
      runner.vy = -12;
      runner.isJumping = true;
      sound.playJump();
    }
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const groundY = canvas.height - 50;

    // Background Cyber Grid Scrolling
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Ground line
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (gameState === 'playing') {
      const runner = runnerRef.current;

      // Gravity and Runner Physics
      runner.vy += 0.65;
      runner.y += runner.vy;

      if (runner.y >= groundY - runner.radius) {
        runner.y = groundY - runner.radius;
        runner.vy = 0;
        runner.isJumping = false;
      }

      // Loop counter increment
      loopCounterRef.current += 1;
      if (loopCounterRef.current % 5 === 0) {
        setScore((prev) => prev + 1);
      }

      // Speed scale
      speedRef.current = 4.5 + Math.min(4, score * 0.03);

      // Spawn obstacles
      if (Math.random() < 0.02 && obstaclesRef.current.length < 3) {
        const lastObs = obstaclesRef.current[obstaclesRef.current.length - 1];
        if (!lastObs || lastObs.x < canvas.width - 200) {
          const isToken = Math.random() < 0.35;
          obstaclesRef.current.push({
            x: canvas.width,
            width: isToken ? 28 : 34,
            height: isToken ? 28 : 42,
            type: isToken ? 'break_token' : 'infinite_loop',
          });
        }
      }

      // Update Obstacles
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.x -= speedRef.current;

        const obsY = obs.type === 'break_token' ? groundY - 65 : groundY - obs.height;

        // Draw obstacle
        ctx.save();
        if (obs.type === 'break_token') {
          // Token: i++
          ctx.fillStyle = '#00f0ff';
          ctx.strokeStyle = '#ffffff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obsY + obs.height / 2, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#060912';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('i++', obs.x + obs.width / 2, obsY + obs.height / 2);
        } else {
          // Hazard: while(true)
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#f87171';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(obs.x, groundY);
          ctx.lineTo(obs.x + obs.width / 2, groundY - obs.height);
          ctx.lineTo(obs.x + obs.width, groundY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('while(true)', obs.x + obs.width / 2, groundY - obs.height - 4);
        }
        ctx.restore();

        // Collision check
        const runnerLeft = runner.x - runner.radius;
        const runnerRight = runner.x + runner.radius;
        const runnerTop = runner.y - runner.radius;
        const runnerBottom = runner.y + runner.radius;

        const obsLeft = obs.x;
        const obsRight = obs.x + obs.width;
        const obsTop = obsY;
        const obsBottom = obsY + obs.height;

        const isColliding =
          runnerRight > obsLeft &&
          runnerLeft < obsRight &&
          runnerBottom > obsTop &&
          runnerTop < obsBottom;

        if (isColliding) {
          if (obs.type === 'break_token') {
            sound.playCoin();
            setScore((prev) => prev + 15);
            obstaclesRef.current.splice(i, 1);
          } else {
            // Hit Infinite Loop Hazard!
            sound.playWrong();
            setGameState('gameover');
            setHighScore((prev) => Math.max(prev, score));
            onScoreSubmit(score * 2, score >= 100 ? 'badge-loopninja' : undefined);
            return;
          }
        }

        // Remove offscreen obstacles
        if (obs.x + obs.width < 0) {
          obstaclesRef.current.splice(i, 1);
        }
      }
    }

    // Draw Runner Character (Duke Cyber Avatar)
    const runner = runnerRef.current;
    ctx.save();
    ctx.translate(runner.x, runner.y);
    ctx.fillStyle = '#ec4899';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, runner.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Duke Visor & Code text
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('{;}', 0, 0);
    ctx.restore();

    animFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  const startGame = () => {
    sound.playClick();
    setScore(0);
    loopCounterRef.current = 0;
    obstaclesRef.current = [];
    const canvas = canvasRef.current;
    if (canvas) {
      runnerRef.current.y = canvas.height - 50 - 18;
      runnerRef.current.vy = 0;
      runnerRef.current.isJumping = false;
    }
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 360;
      runnerRef.current.y = canvas.height - 50 - 18;
    }

    animFrameIdRef.current = requestAnimationFrame(gameLoop);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, score]);

  return (
    <div className="rounded-2xl bg-[#090d18] border border-cyan-500/40 p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-pink-400 font-cyber">
            Loop Runner
          </h3>
          <p className="text-xs text-slate-400">
            Topic 4: Jump over &ldquo;while(true)&rdquo; traps and collect iteration &ldquo;i++&rdquo; tokens
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-code font-bold">
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-pink-300">
            Iteration: i = {score}
          </div>
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-400">
            Record: {highScore}
          </div>
        </div>
      </div>

      <div
        className="relative w-full aspect-[4/3] md:aspect-[16/9] max-h-[380px] rounded-xl overflow-hidden bg-[#060912] border border-slate-800 select-none cursor-pointer"
        onClick={jump}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-lg font-bold text-white font-cyber mb-2">
              Infinite Loop Runner
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Tap the screen or press [SPACE] / [Arrow Up] to jump over while(true) hazards. Collect i++ tokens to boost your loop iteration count!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-sm shadow-xl transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-xl font-bold text-red-400 font-cyber mb-1">
              Trapped in an Infinite Loop!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Iterations Reached: i = {score} ({score * 2} XP)
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 text-slate-950 font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Run Again</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-400 font-mono-code">
        💡 Tip: Reach score i = 100 iterations to unlock the special <span className="text-pink-400 font-bold">Loop Ninja</span> badge!
      </div>
    </div>
  );
};
