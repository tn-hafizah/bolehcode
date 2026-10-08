import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { RotateCcw, Trophy, Play, ArrowDown, ArrowUp } from 'lucide-react';

interface GameProps {
  onScoreSubmit: (score: number, badgeId?: string) => void;
}

interface StackFrame {
  name: string;
  n: number;
  returnedValue?: number;
}

export const RecursionStackGame: React.FC<GameProps> = ({ onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'won'>('idle');
  const [score, setScore] = useState(0);
  const [currentN, setCurrentN] = useState(4);
  const [feedback, setFeedback] = useState('Press PUSH to invoke recursive function fact(n-1)');

  const stackRef = useRef<StackFrame[]>([]);
  const baseCaseReachedRef = useRef(false);

  const drawStack = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const stackW = 260;
    const stackH = 280;
    const stackX = (canvas.width - stackW) / 2;
    const stackY = canvas.height - stackH - 25;

    // Draw Memory Call Stack Bucket Container
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    // Left border
    ctx.moveTo(stackX, stackY);
    ctx.lineTo(stackX, stackY + stackH);
    // Bottom border
    ctx.lineTo(stackX + stackW, stackY + stackH);
    // Right border
    ctx.lineTo(stackX + stackW, stackY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Stack Header Label
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('JVM CALL STACK MEMORY', canvas.width / 2, stackY - 10);

    // Max capacity warning line
    const maxCapacityY = stackY + 35;
    ctx.strokeStyle = '#ef4444';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(stackX, maxCapacityY);
    ctx.lineTo(stackX + stackW, maxCapacityY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ef4444';
    ctx.font = '9px monospace';
    ctx.fillText('DANGER: STACKOVERFLOW THRESHOLD', canvas.width / 2, maxCapacityY - 4);

    // Draw Frames inside stack from bottom up
    const frameHeight = 42;
    const stack = stackRef.current;

    stack.forEach((frame, idx) => {
      const frameY = stackY + stackH - (idx + 1) * frameHeight - 4;

      ctx.save();
      ctx.fillStyle = frame.returnedValue !== undefined ? '#064e3b' : '#1e1b4b';
      ctx.strokeStyle = frame.returnedValue !== undefined ? '#10b981' : '#818cf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(stackX + 8, frameY, stackW - 16, frameHeight - 4, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label =
        frame.returnedValue !== undefined
          ? `${frame.name} => Return ${frame.returnedValue}`
          : `${frame.name} [Awaiting Result]`;
      ctx.fillText(label, canvas.width / 2, frameY + frameHeight / 2 - 2);
      ctx.restore();
    });
  };

  const handlePush = () => {
    if (gameState !== 'playing') return;

    if (baseCaseReachedRef.current) {
      sound.playWrong();
      setFeedback('Base case n == 1 reached! You must press [POP / RETURN] now!');
      return;
    }

    const nextN = currentN > 1 ? currentN - 1 : 1;
    stackRef.current.push({
      name: `factorial(${currentN})`,
      n: currentN,
    });

    sound.playClick();
    setScore((prev) => prev + 15);

    if (currentN === 1) {
      baseCaseReachedRef.current = true;
      sound.playCorrect();
      setFeedback('🔥 BASE CASE (n == 1) REACHED! Now press [POP / RETURN]!');
    } else {
      setCurrentN(nextN);
      setFeedback(`Invoked: factorial(${nextN}). Continue until Base Case!`);
    }

    // Check StackOverflow limit
    if (stackRef.current.length > 5) {
      sound.playWrong();
      setGameState('gameover');
      setFeedback('Error: java.lang.StackOverflowError! Excessive recursion depth!');
      onScoreSubmit(score);
      return;
    }

    drawStack();
  };

  const handlePop = () => {
    if (gameState !== 'playing') return;

    if (!baseCaseReachedRef.current) {
      sound.playWrong();
      setFeedback('Base Case not reached yet! Must PUSH until n == 1 first!');
      return;
    }

    if (stackRef.current.length === 0) return;

    sound.playCoin();
    const popped = stackRef.current.pop();
    setScore((prev) => prev + 25);

    if (stackRef.current.length === 0) {
      sound.playWin();
      setGameState('won');
      setFeedback('Congratulations! Complete recursive execution finished without memory errors!');
      onScoreSubmit(120, 'badge-oop');
    } else {
      setFeedback(`Value returned from ${popped?.name}! Continue popping to caller function.`);
    }

    drawStack();
  };

  const startGame = () => {
    sound.playClick();
    setScore(0);
    setCurrentN(4);
    stackRef.current = [
      {
        name: 'main() -> fact(4)',
        n: 4,
      },
    ];
    baseCaseReachedRef.current = false;
    setGameState('playing');
    setFeedback('Invoke next recursion: factorial(3) with [PUSH] button');
    setTimeout(() => drawStack(), 50);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 360;
      drawStack();
    }
  }, []);

  return (
    <div className="rounded-2xl bg-[#090d18] border border-cyan-500/40 p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-amber-400 font-cyber">
            Recursion Call Stack
          </h3>
          <p className="text-xs text-slate-400">
            Topic 6: Control recursive call stack frames (PUSH &amp; POP) and avoid StackOverflowError
          </p>
        </div>

        <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-mono-code font-bold text-xs">
          Score: {score} XP
        </div>
      </div>

      <div className="text-xs font-mono-code text-center py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300">
        {feedback}
      </div>

      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] max-h-[380px] rounded-xl overflow-hidden bg-[#060912] border border-slate-800">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-lg font-bold text-white font-cyber mb-2">
              Control Recursion Call Stack
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Calculate recursive factorial: Press PUSH to descend call frames, then press POP once the base case is reached!
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-xl font-bold text-red-400 font-cyber mb-1">
              StackOverflowError Occurred!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Recursion exceeded maximum call stack memory capacity.
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {gameState === 'won' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h4 className="text-xl font-bold text-emerald-400 font-cyber mb-1">
              Recursion Completed Perfectly!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              You earned {score + 30} XP and mastered call stack mechanics!
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              <Play className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons: PUSH and POP */}
      {gameState === 'playing' && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePush}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg transition active:scale-95"
          >
            <ArrowDown className="w-4 h-4" />
            <span>[PUSH] Invoke Recursion fact({currentN})</span>
          </button>
          <button
            onClick={handlePop}
            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition active:scale-95"
          >
            <ArrowUp className="w-4 h-4" />
            <span>[POP] Return Value (Unwind)</span>
          </button>
        </div>
      )}
    </div>
  );
};
