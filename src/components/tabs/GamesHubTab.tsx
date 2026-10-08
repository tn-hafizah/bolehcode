import React, { useState } from 'react';
import { GameId, UserProfile } from '../../types';
import { MINI_GAMES_LIST } from '../../data/gamesMeta';
import { FlowchartConnectorGame } from '../games/FlowchartConnectorGame';
import { ModularizationStackerGame } from '../games/ModularizationStackerGame';
import { DataTypeSortingGame } from '../games/DataTypeSortingGame';
import { LoopRunnerGame } from '../games/LoopRunnerGame';
import { Array2DShooterGame } from '../games/Array2DShooterGame';
import { RecursionStackGame } from '../games/RecursionStackGame';
import { GUIBuilderGame } from '../games/GUIBuilderGame';
import { FileStreamCatchGame } from '../games/FileStreamCatchGame';
import { 
  Gamepad2, 
  Sparkles, 
  GitFork, 
  Layers, 
  Cpu, 
  Repeat, 
  Target, 
  Code2, 
  Layout, 
  FileText, 
  ChevronLeft, 
  Info 
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface GamesHubTabProps {
  user: UserProfile;
  onAwardXP: (xp: number, badgeId?: string) => void;
}

export const GamesHubTab: React.FC<GamesHubTabProps> = ({ user: _user, onAwardXP }) => {
  const [selectedGameId, setSelectedGameId] = useState<GameId | null>('flowchart');

  const selectedGameMeta = MINI_GAMES_LIST.find((g) => g.id === selectedGameId);

  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'GitFork': return <GitFork className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Repeat': return <Repeat className={className} />;
      case 'Target': return <Target className={className} />;
      case 'Code2': return <Code2 className={className} />;
      case 'Layout': return <Layout className={className} />;
      case 'FileText': return <FileText className={className} />;
      default: return <Gamepad2 className={className} />;
    }
  };

  const handleScoreSubmit = (score: number, badgeId?: string) => {
    onAwardXP(score, badgeId);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0c1324] via-[#090e1c] to-[#180e2b] border border-cyan-500/30 p-5 md:p-7 shadow-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono-code font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>8 Topic-Based HTML5 Canvas Mini-Games</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-cyber tracking-tight">
              Interactive Code Games Hub
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Grasp fundamental Java programming concepts through interactive HTML5 canvas games. Learn through play, earn XP rewards, and unlock exclusive badges!
            </p>
          </div>
        </div>

        {/* 8 Game Thumbnails Navigation Carousel/Grid */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MINI_GAMES_LIST.map((game) => {
            const isSelected = selectedGameId === game.id;
            return (
              <button
                key={game.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedGameId(game.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>{renderIcon(game.icon, 'w-4 h-4')}</span>
                <span>Topic {game.topicNumber}: {game.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Game Window */}
      {selectedGameMeta && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedGameId(null)}
              className="lg:hidden flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Games Hub</span>
            </button>
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>{selectedGameMeta.concept}</span>
            </div>
          </div>

          {/* Active Canvas Game Component Rendering */}
          {selectedGameId === 'flowchart' && (
            <FlowchartConnectorGame onScoreSubmit={handleScoreSubmit} />
          )}
          {selectedGameId === 'modularization' && (
            <ModularizationStackerGame onScoreSubmit={handleScoreSubmit} />
          )}
          {selectedGameId === 'datatype' && (
            <DataTypeSortingGame onScoreSubmit={handleScoreSubmit} />
          )}
          {selectedGameId === 'looprunner' && (
            <LoopRunnerGame onScoreSubmit={handleScoreSubmit} />
          )}
          {selectedGameId === 'array2d' && (
            <Array2DShooterGame onScoreSubmit={handleScoreSubmit} />
          )}
          {selectedGameId === 'recursion' && (
            <RecursionStackGame onScoreSubmit={handleScoreSubmit} />
          )}
          {selectedGameId === 'guibuilder' && (
            <GUIBuilderGame onScoreSubmit={handleScoreSubmit} />
          )}
          {selectedGameId === 'filestream' && (
            <FileStreamCatchGame onScoreSubmit={handleScoreSubmit} />
          )}

          {/* Instructions Box for Current Game */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-cyan-400 font-cyber flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Game Guide &amp; Learning Objectives:
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
              {selectedGameMeta.instructions.map((inst, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Grid of All 8 Games */}
      {!selectedGameId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
          {MINI_GAMES_LIST.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                sound.playClick();
                setSelectedGameId(game.id);
              }}
              className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all duration-300 group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-mono-code font-bold">
                    Topic 0{game.topicNumber}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900 text-cyan-400 group-hover:scale-110 transition">
                    {renderIcon(game.icon, 'w-5 h-5')}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white font-cyber group-hover:text-cyan-300 transition">
                  {game.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {game.concept}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span>Play Now</span>
                <span className="group-hover:translate-x-1 transition">&rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
