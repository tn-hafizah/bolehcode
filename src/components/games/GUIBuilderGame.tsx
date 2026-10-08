import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../../utils/audio';
import { RotateCcw, Trophy, Play, CheckCircle } from 'lucide-react';

interface GameProps {
  onScoreSubmit: (score: number, badgeId?: string) => void;
}

interface GuiSlot {
  id: string;
  label: string;
  region: string;
  expectedComponent: string;
  placedComponent: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const GUIBuilderGame: React.FC<GameProps> = ({ onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');
  const [score, setScore] = useState(0);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('Select a Swing component below and attach it to the correct JFrame slot');

  const componentsToPlace = [
    { name: 'JLabel (Title)', id: 'label_title', desc: 'Form Header (NORTH)' },
    { name: 'JTextField', id: 'text_user', desc: 'Username Input (CENTER 1)' },
    { name: 'JPasswordField', id: 'pass_field', desc: 'Password Input (CENTER 2)' },
    { name: 'JButton', id: 'btn_login', desc: 'Action Button (SOUTH)' },
  ];

  const slotsRef = useRef<GuiSlot[]>([]);

  const initSlots = (width: number, height: number) => {
    const frameW = Math.min(380, width * 0.75);
    const frameH = 260;
    const frameX = (width - frameW) / 2;
    const frameY = (height - frameH) / 2;

    slotsRef.current = [
      {
        id: 'slot_north',
        label: 'BorderLayout.NORTH',
        region: 'NORTH',
        expectedComponent: 'label_title',
        placedComponent: null,
        x: frameX + 20,
        y: frameY + 45,
        width: frameW - 40,
        height: 38,
      },
      {
        id: 'slot_center1',
        label: 'CENTER: Username Field',
        region: 'CENTER 1',
        expectedComponent: 'text_user',
        placedComponent: null,
        x: frameX + 20,
        y: frameY + 95,
        width: frameW - 40,
        height: 38,
      },
      {
        id: 'slot_center2',
        label: 'CENTER: Password Field',
        region: 'CENTER 2',
        expectedComponent: 'pass_field',
        placedComponent: null,
        x: frameX + 20,
        y: frameY + 145,
        width: frameW - 40,
        height: 38,
      },
      {
        id: 'slot_south',
        label: 'BorderLayout.SOUTH',
        region: 'SOUTH',
        expectedComponent: 'btn_login',
        placedComponent: null,
        x: frameX + 50,
        y: frameY + 195,
        width: frameW - 100,
        height: 42,
      },
    ];
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frameW = Math.min(380, canvas.width * 0.75);
    const frameH = 260;
    const frameX = (canvas.width - frameW) / 2;
    const frameY = (canvas.height - frameH) / 2;

    // Draw JFrame Window
    ctx.save();
    ctx.fillStyle = '#0b1120';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 12;
    ctx.roundRect(frameX, frameY, frameW, frameH, 12);
    ctx.fill();
    ctx.stroke();

    // Window Title Bar
    ctx.fillStyle = '#1e293b';
    ctx.roundRect(frameX, frameY, frameW, 32, [12, 12, 0, 0]);
    ctx.fill();

    // Window Dots
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(frameX + 16, frameY + 16, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(frameX + 32, frameY + 16, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(frameX + 48, frameY + 16, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('JFrame: "Student Login System"', frameX + frameW / 2, frameY + 20);
    ctx.restore();

    // Draw Slots
    slotsRef.current.forEach((slot) => {
      ctx.save();
      const isFilled = slot.placedComponent !== null;

      ctx.fillStyle = isFilled ? '#064e3b' : 'rgba(30, 41, 59, 0.6)';
      ctx.strokeStyle = isFilled ? '#10b981' : '#475569';
      ctx.lineWidth = isFilled ? 2 : 1;
      if (!isFilled) {
        ctx.setLineDash([4, 4]);
      }

      ctx.roundRect(slot.x, slot.y, slot.width, slot.height, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isFilled ? '#a7f3d0' : '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let text = slot.label;
      if (isFilled) {
        if (slot.expectedComponent === 'label_title') text = 'JLabel: "BolehCode Login"';
        if (slot.expectedComponent === 'text_user') text = 'JTextField: [username]';
        if (slot.expectedComponent === 'pass_field') text = 'JPasswordField: [••••••••]';
        if (slot.expectedComponent === 'btn_login') text = 'JButton: [Login]';
      }

      ctx.fillText(text, slot.x + slot.width / 2, slot.y + slot.height / 2);
      ctx.restore();
    });
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing' || !selectedTool) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check which slot was clicked
    const clickedSlot = slotsRef.current.find(
      (s) =>
        clickX >= s.x &&
        clickX <= s.x + s.width &&
        clickY >= s.y &&
        clickY <= s.y + s.height
    );

    if (!clickedSlot) return;

    if (clickedSlot.placedComponent) {
      setFeedback('This slot is already filled!');
      return;
    }

    if (clickedSlot.expectedComponent === selectedTool) {
      sound.playCoin();
      clickedSlot.placedComponent = selectedTool;
      setScore((prev) => prev + 25);
      setSelectedTool(null);
      setFeedback(`Successfully mounted component into ${clickedSlot.region}!`);

      // Check if all slots filled
      const allFilled = slotsRef.current.every((s) => s.placedComponent !== null);
      if (allFilled) {
        sound.playWin();
        setGameState('won');
        setFeedback('Congratulations! Java Swing GUI layout is completely assembled!');
        onScoreSubmit(100, 'badge-oop');
      }
    } else {
      sound.playWrong();
      setFeedback(`Layout mismatch! This component does not belong in the ${clickedSlot.region} slot.`);
    }

    draw();
  };

  const startGame = () => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (canvas) initSlots(canvas.width, canvas.height);
    setScore(0);
    setSelectedTool(null);
    setGameState('playing');
    setFeedback('Select a component below and place it into a JFrame slot');
    setTimeout(() => draw(), 50);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 360;
      initSlots(canvas.width, canvas.height);
      draw();
    }
  }, []);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 md:p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-cyber">
            GUI Builder
          </h3>
          <p className="text-xs text-slate-500">
            Topic 7: Mount Java Swing components (JButton, JLabel, JTextField) inside JFrame container
          </p>
        </div>

        <div className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono-code font-bold text-xs">
          Score: {score} XP
        </div>
      </div>

      <div className="text-xs font-mono-code text-center py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-200 text-indigo-700">
        {feedback}
      </div>

      <div className="relative w-full aspect-[4/3] md:aspect-[16/9] max-h-[380px] rounded-xl overflow-hidden bg-[#060912] border border-slate-800">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full block cursor-pointer"
        />

        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-lg font-bold text-white font-cyber mb-2">
              Build Java GUI Interface
            </h4>
            <p className="text-xs text-slate-300 max-w-sm mb-4">
              Select Swing components from the dock below and attach them into matching BorderLayout areas.
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Game</span>
            </button>
          </div>
        )}

        {gameState === 'won' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
            <Trophy className="w-12 h-12 text-amber-400 mb-2 animate-bounce" />
            <h4 className="text-xl font-bold text-emerald-400 font-cyber mb-1">
              GUI Application Successfully Created!
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Your JFrame, JPanel, and interactive components are ready to launch!
            </p>
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Build Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Component Palette Dock */}
      {gameState === 'playing' && (
        <div className="space-y-2">
          <span className="text-[11px] font-mono-code text-slate-400 block">
            Select Component to Mount:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {componentsToPlace.map((comp) => {
              const isSelected = selectedTool === comp.id;
              const isAlreadyPlaced = slotsRef.current.some(
                (s) => s.placedComponent === comp.id
              );

              return (
                <button
                  key={comp.id}
                  disabled={isAlreadyPlaced}
                  onClick={() => {
                    sound.playClick();
                    setSelectedTool(comp.id);
                    setFeedback(`Selected: ${comp.name}. Now click the target slot on the JFrame window!`);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    isAlreadyPlaced
                      ? 'bg-slate-950/60 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="text-xs font-mono-code font-bold">{comp.name}</div>
                  <div className="text-[10px] opacity-75">{comp.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
