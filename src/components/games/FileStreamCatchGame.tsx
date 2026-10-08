import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { RotateCcw, Heart, Play, Trophy } from 'lucide-react';

interface GameProps {
  onScoreSubmit: (score: number, badgeId?: string) => void;
}

interface StreamItem {
  text: string;
  isGood: boolean;
  x: number;
  y: number;
  speed: number;
  radius: number;
}

export const FileStreamCatchGame: React.FC<GameProps> = ({ onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'won'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [caughtCount, setCaughtCount] = useState(0);

  const paddleRef = useRef({
    x: 250,
    width: 120,
    height: 22,
  });

  const streamItemsRef = useRef<StreamItem[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const caughtRef = useRef(0);

  const goodTokens = ['readLine()', 'data.txt', '\\n (newline)', 'char[1024]', 'EOF (-1)'];
  const badTokens = ['IOException', 'FileNotFound', 'NullPointer', 'CorruptedByte'];

  const spawnStreamItem = (width: number) => {
    const isGood = Math.random() > 0.35;
    const list = isGood ? goodTokens : badTokens;
    const text = list[Math.floor(Math.random() * list.length)];

    streamItemsRef.current.push({
      text,
      isGood,
      x: 30 + Math.random() * (width - 60),
      y: 10,
      speed: 2.2 + Math.min(2.5, caughtRef.current * 0.15),
      radius: 18,
    });
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const paddleY = canvas.height - 35;
    const paddle = paddleRef.current;

    // Draw Background Stream Lines
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    // Draw Paddle: BufferedReader
    ctx.save();
    ctx.fillStyle = '#0f766e';
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#2dd4bf';
    ctx.shadowBlur = 12;
    ctx.roundRect(paddle.x - paddle.width / 2, paddleY, paddle.width, paddle.height, 8);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('BufferedReader [BUFFER]', paddle.x, paddleY + paddle.height / 2);
    ctx.restore();

    if (gameState === 'playing') {
      // Periodic spawn
      if (Math.random() < 0.03 && streamItemsRef.current.length < 4) {
        spawnStreamItem(canvas.width);
      }

      // Update falling items
      for (let i = streamItemsRef.current.length - 1; i >= 0; i--) {
        const item = streamItemsRef.current[i];
        item.y += item.speed;

        // Draw item
        ctx.save();
        ctx.fillStyle = item.isGood ? '#042f2e' : '#450a0a';
        ctx.strokeStyle = item.isGood ? '#14b8a6' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.shadowColor = item.isGood ? '#14b8a6' : '#ef4444';
        ctx.shadowBlur = 8;

        const boxW = Math.max(80, ctx.measureText(item.text).width + 20);
        const boxH = 26;
        ctx.roundRect(item.x - boxW / 2, item.y - boxH / 2, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = item.isGood ? '#5eead4' : '#fca5a5';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.text, item.x, item.y);
        ctx.restore();

        // Collision with paddle
        const hitPaddle =
          item.y + boxH / 2 >= paddleY &&
          item.y - boxH / 2 <= paddleY + paddle.height &&
          item.x >= paddle.x - paddle.width / 2 &&
          item.x <= paddle.x + paddle.width / 2;

        if (hitPaddle) {
          if (item.isGood) {
            sound.playCoin();
            scoreRef.current += 15;
            caughtRef.current += 1;
            setScore(scoreRef.current);
            setCaughtCount(caughtRef.current);

            if (caughtRef.current >= 12) {
              sound.playWin();
              setGameState('won');
              onScoreSubmit(150, 'badge-stream');
              return;
            }
          } else {
            // Caught error!
            sound.playWrong();
            livesRef.current -= 1;
            setLives(livesRef.current);
            if (livesRef.current <= 0) {
              setGameState('gameover');
              onScoreSubmit(scoreRef.current);
              return;
            }
          }

          streamItemsRef.current.splice(i, 1);
          continue;
        }

        // Missed bottom
        if (item.y > canvas.height + 20) {
          streamItemsRef.current.splice(i, 1);
        }
      }
    }

    animFrameIdRef.current = requestAnimationFrame(gameLoop);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    paddleRef.current.x = Math.max(
      paddleRef.current.width / 2,
      Math.min(canvas.width - paddleRef.current.width / 2, mouseX)
    );
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    paddleRef.current.x = Math.max(
      paddleRef.current.width / 2,
      Math.min(canvas.width - paddleRef.current.width / 2, touchX)
    );
  };

  const startGame = () => {
    sound.playClick();
    scoreRef.current = 0;
    livesRef.current = 3;
    caughtRef.current = 0;
    setScore(0);
    setLives(3);
    setCaughtCount(0);
    streamItemsRef.current = [];
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 360;
      paddleRef.current.x = canvas.width / 2;
    }

    animFrameIdRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [gameState]);

  return (
    <div className="rounded-2xl bg-[#090d18] border border-cyan-500/40 p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-teal-400 font-cyber">
            File Stream Catch
          </h3>
          <p className="text-xs text-slate-400">
            Topic 8: Steer the BufferedReader buffer to catch text byte packets and avoid IOException
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-code font-bold">
          <div className="flex items-center gap-1 text-rose-400">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? 'fill-current' : 'text-slate-700'}`}
              />
            ))}
          </div>
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-teal-300">
            Captured: {caughtCount} / 12
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] max-h-[380px] rounded-xl overflow-hidden bg-[#060912] border border-slate-800">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="w-full h-full block cursor-ew-resize"
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-lg font-bold text-white font-cyber mb-2">
              Stream Text File Packets
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Move the BufferedReader buffer paddle to catch green text packets (readLine, EOF, char[]) and dodge red error packets (IOException)!
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-xl transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-xl font-bold text-red-400 font-cyber mb-1">
              Unhandled IOException!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              File stream terminated. Score: {score} XP
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
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
              File Successfully Read &amp; Parsed!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              BufferedReader buffer safe from stream corruption and memory leaks. (+150 XP)
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

      <div className="text-center text-xs text-slate-400 font-mono-code">
        💡 Tip: Move your finger or mouse left and right to control the BufferedReader buffer paddle.
      </div>
    </div>
  );
};
