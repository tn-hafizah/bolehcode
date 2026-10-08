import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { RotateCcw, Trophy, Play, CheckCircle } from 'lucide-react';

interface GameProps {
  onScoreSubmit: (score: number, badgeId?: string) => void;
}

interface FlowNode {
  id: number;
  label: string;
  shape: 'oval' | 'parallelogram' | 'rectangle' | 'diamond';
  x: number;
  y: number;
  width: number;
  height: number;
  order: number;
}

export const FlowchartConnectorGame: React.FC<GameProps> = ({ onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'won'>('idle');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(35);
  const [feedback, setFeedback] = useState('Connect logic blocks from START to END!');
  
  const connectedNodesRef = useRef<number[]>([]);
  const nodesRef = useRef<FlowNode[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const initNodes = (width: number, height: number) => {
    // 6 flowchart elements in logical order:
    // 1. Start -> 2. Input N -> 3. Process (x*2) -> 4. Decision x > 10? -> 5. Output -> 6. End
    const steps: { label: string; shape: FlowNode['shape'] }[] = [
      { label: 'Start (Terminal)', shape: 'oval' },
      { label: 'Input: int n', shape: 'parallelogram' },
      { label: 'Process: n = n * 2', shape: 'rectangle' },
      { label: 'Decision: n > 10?', shape: 'diamond' },
      { label: 'Output "Pass"', shape: 'parallelogram' },
      { label: 'End (Terminal)', shape: 'oval' },
    ];

    // Distribute with enough spacing
    const nodes: FlowNode[] = [];
    const positions = [
      { x: width * 0.2, y: height * 0.2 },
      { x: width * 0.8, y: height * 0.22 },
      { x: width * 0.3, y: height * 0.5 },
      { x: width * 0.72, y: height * 0.52 },
      { x: width * 0.22, y: height * 0.82 },
      { x: width * 0.78, y: height * 0.8 },
    ];

    steps.forEach((step, idx) => {
      nodes.push({
        id: idx + 1,
        label: step.label,
        shape: step.shape,
        x: positions[idx].x,
        y: positions[idx].y,
        width: 140,
        height: 54,
        order: idx + 1,
      });
    });

    nodesRef.current = nodes;
    connectedNodesRef.current = [];
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Cyberpunk Background Grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Connection Arrows
    const connected = connectedNodesRef.current;
    if (connected.length > 1) {
      for (let i = 0; i < connected.length - 1; i++) {
        const fromNode = nodesRef.current.find((n) => n.id === connected[i]);
        const toNode = nodesRef.current.find((n) => n.id === connected[i + 1]);
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = '#00f0ff';
          ctx.lineWidth = 3;
          ctx.setLineDash([6, 3]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Arrow Head
          const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
          ctx.save();
          ctx.translate(toNode.x, toNode.y);
          ctx.rotate(angle);
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.moveTo(-12, -6);
          ctx.lineTo(0, 0);
          ctx.lineTo(-12, 6);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // Draw Nodes
    nodesRef.current.forEach((node) => {
      const isConnected = connected.includes(node.id);
      const isNextTarget = connected.length + 1 === node.order;

      ctx.save();
      ctx.translate(node.x, node.y);

      // Node shadow / glow
      if (isConnected) {
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 15;
      } else if (isNextTarget) {
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
      }

      ctx.fillStyle = isConnected ? '#064e3b' : '#0c1427';
      ctx.strokeStyle = isConnected ? '#10b981' : isNextTarget ? '#00f0ff' : '#334155';
      ctx.lineWidth = 2.5;

      const w = node.width;
      const h = node.height;

      // Draw Shapes
      if (node.shape === 'oval') {
        ctx.beginPath();
        ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (node.shape === 'parallelogram') {
        ctx.beginPath();
        ctx.moveTo(-w / 2 + 14, -h / 2);
        ctx.lineTo(w / 2, -h / 2);
        ctx.lineTo(w / 2 - 14, h / 2);
        ctx.lineTo(-w / 2, h / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (node.shape === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(0, -h / 2 - 4);
        ctx.lineTo(w / 2 + 4, 0);
        ctx.lineTo(0, h / 2 + 4);
        ctx.lineTo(-w / 2 - 4, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // Rectangle
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, 8);
        ctx.fill();
        ctx.stroke();
      }

      // Text inside node
      ctx.shadowBlur = 0;
      ctx.fillStyle = isConnected ? '#a7f3d0' : '#ffffff';
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, 0, 0);

      // Order indicator if connected
      if (isConnected) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(w / 2 - 6, -h / 2 + 6, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#064e3b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`${node.order}`, w / 2 - 6, -h / 2 + 6);
      }

      ctx.restore();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check which node was clicked
    const clicked = nodesRef.current.find((node) => {
      const dx = Math.abs(clickX - node.x);
      const dy = Math.abs(clickY - node.y);
      return dx < node.width / 2 && dy < node.height / 2;
    });

    if (!clicked) return;

    const currentOrderNeeded = connectedNodesRef.current.length + 1;

    if (clicked.order === currentOrderNeeded) {
      sound.playCoin();
      connectedNodesRef.current.push(clicked.id);
      setScore((prev) => prev + 25);
      setFeedback(`Correct! Connected to: ${clicked.label}`);

      // Check if complete
      if (connectedNodesRef.current.length === nodesRef.current.length) {
        sound.playWin();
        setGameState('won');
        setFeedback('Congratulations! Complete Algorithm Flowchart Assembled!');
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        onScoreSubmit(150, 'badge-speed');
      }
    } else {
      sound.playWrong();
      setFeedback(`Logic Error! Incorrect order. Locate step #${currentOrderNeeded}`);
    }

    draw();
  };

  const startGame = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (canvas) {
      initNodes(canvas.width, canvas.height);
    }
    setScore(0);
    setTimer(35);
    setGameState('playing');
    setFeedback('Click the START block to begin connecting!');

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          setGameState('gameover');
          sound.playWrong();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => draw(), 50);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 400;
      initNodes(canvas.width, canvas.height);
      draw();
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <div className="rounded-2xl bg-[#090d18] border border-cyan-500/40 p-4 md:p-6 space-y-4">
      {/* Game Bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-cyan-400 font-cyber">
            Flowchart Connector
          </h3>
          <p className="text-xs text-slate-400">
            Topic 1: Connect algorithmic flowchart blocks in correct execution order
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-code font-bold">
          <div className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300">
            Score: {score} XP
          </div>
          <div className={`px-3 py-1 rounded-xl border ${timer < 10 ? 'bg-red-950/60 text-red-400 border-red-500' : 'bg-slate-900 text-amber-400 border-slate-800'}`}>
            Time: {timer}s
          </div>
        </div>
      </div>

      <div className="text-xs font-mono-code text-center py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300">
        {feedback}
      </div>

      {/* Canvas Area */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] max-h-[420px] rounded-xl overflow-hidden bg-[#060912] border border-slate-800">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-pointer block"
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-lg font-bold text-white font-cyber mb-2">
              Assemble Algorithm Flowchart
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Connect blocks in sequence: Terminal Start &rarr; Input &rarr; Process &rarr; Decision &rarr; Output &rarr; End.
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-xl font-bold text-red-400 font-cyber mb-1">
              Time Ran Out!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Score reached: {score} XP
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
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
              Perfect Flowchart!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              You earned {score + 50} XP and mastered fundamental algorithm sequencing!
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
