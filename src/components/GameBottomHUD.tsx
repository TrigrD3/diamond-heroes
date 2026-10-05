import React from 'react';
import type { PlayerStats } from '../types/game';

interface GameBottomHUDProps {
  batterName: string;
  batterAvatar?: string;
  playerStats: PlayerStats;
  comboGauge: number; // 0 - 100
  isComboReady: boolean;
  score: number;
  seasonStats: {
    avg: string;
    hr: number;
    rbi: number;
    hits: number;
  };
  seasonGoals?: {
    hrCurrent: number;
    hrGoal: number;
    rbiCurrent: number;
    rbiGoal: number;
    passed: boolean;
  };
  onComboClick: () => void;
  onLeaderboardClick: () => void;
}

export const GameBottomHUD: React.FC<GameBottomHUDProps> = ({
  batterName,
  batterAvatar = '/hud_avatar.png',
  playerStats,
  comboGauge,
  isComboReady,
  score,
  seasonStats,
  seasonGoals = { hrCurrent: 7, hrGoal: 20, rbiCurrent: 17, rbiGoal: 55, passed: false },
  onComboClick,
  onLeaderboardClick,
}) => {
  return (
    <div className="relative w-full max-w-[800px] mx-auto select-none flex items-end justify-between px-2 pt-2 -mt-1 pointer-events-auto">
      {/* Left: Authentic Circular Combo Dial & Batter Plaque */}
      <div className="flex items-center gap-2">
        {/* Circular Combo Dial */}
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          {/* Dial SVG Outer Segments */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            {/* Background track circle */}
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke="#1e293b"
              strokeWidth="6"
            />
            {/* 10 arc dashes */}
            <circle
              cx="32"
              cy="32"
              r="26"
              fill="none"
              stroke={
                isComboReady
                  ? '#eab308'
                  : comboGauge > 60
                  ? '#22c55e'
                  : comboGauge > 30
                  ? '#38bdf8'
                  : '#3b82f6'
              }
              strokeWidth="6"
              strokeDasharray={`${(comboGauge / 100) * 163.3} 163.3`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          {/* Center Combo Button */}
          <button
            onClick={onComboClick}
            disabled={!isComboReady}
            className={`absolute w-10 h-10 rounded-full flex flex-col items-center justify-center font-black transition-transform active:scale-90 shadow-lg cursor-pointer ${
              isComboReady
                ? 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 animate-pulse border-2 border-yellow-200'
                : 'bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white border border-[#0284c7]'
            }`}
            title={isComboReady ? 'Activate COMBO FEVER!' : `${comboGauge}% Combo Charged`}
          >
            <span className="text-[8px] tracking-tight uppercase leading-none font-extrabold">COMBO</span>
            <span className="text-[10px] leading-none mt-0.5">{isComboReady ? 'MAX' : `${comboGauge}%`}</span>
          </button>
        </div>

        {/* Batter Info & Skill Badges Plaque */}
        <div className="bg-[#181a20]/95 border-2 border-[#475569] rounded-xl px-3 py-1.5 shadow-xl flex items-center gap-3">
          {/* Avatar with Name banner */}
          <div className="flex flex-col items-center">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400 bg-slate-800 shadow">
              <img src={batterAvatar} alt={batterName} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] font-black text-amber-300 truncate max-w-[65px] leading-tight mt-0.5">
              {batterName}
            </span>
          </div>

          {/* Skill Badges (Contact: C, Power: P, Luck: L) */}
          <div className="flex flex-col border-r border-slate-700 pr-3">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mb-0.5">SKILL</span>
            <div className="flex items-center gap-1.5 font-black text-xs">
              {/* Contact (Blue) */}
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-[#0284c7] text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                  C
                </span>
                <span className="text-white font-mono text-[11px]">{Math.floor(playerStats.contact / 20) || 1}</span>
              </div>
              {/* Power (Red) */}
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-[#dc2626] text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                  P
                </span>
                <span className="text-white font-mono text-[11px]">{Math.floor(playerStats.power / 20) || 1}</span>
              </div>
              {/* Luck (Green) */}
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-[#16a34a] text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                  L
                </span>
                <span className="text-white font-mono text-[11px]">{Math.floor(playerStats.luck / 20) || 1}</span>
              </div>
            </div>
          </div>

          {/* Season Stats Table (AVG, HR, RBI, HIT) */}
          <div className="grid grid-cols-4 gap-2 text-center border-r border-slate-700 pr-3 font-mono">
            <div>
              <div className="text-[9px] font-bold text-slate-400">AVG</div>
              <div className="text-xs font-black text-white">{seasonStats.avg}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400">HR</div>
              <div className="text-xs font-black text-white">{seasonStats.hr}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400">RBI</div>
              <div className="text-xs font-black text-white">{seasonStats.rbi}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-slate-400">HIT</div>
              <div className="text-xs font-black text-white">{seasonStats.hits}</div>
            </div>
          </div>

          {/* Season Goal Tracker */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">Season Goal!</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-300">
                HR <strong className="text-amber-400">{seasonGoals.hrCurrent}</strong>/{seasonGoals.hrGoal}
              </div>
              <div className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-300">
                RBI <strong className="text-amber-400">{seasonGoals.rbiCurrent}</strong>/{seasonGoals.rbiGoal}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Leaderboard Button & Score Display */}
      <div className="flex flex-col items-end">
        <button
          onClick={onLeaderboardClick}
          className="bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#38bdf8] hover:to-[#0284c7] text-white font-black text-[10px] uppercase px-4 py-1 rounded-t-lg border-t-2 border-x-2 border-[#38bdf8] shadow-md cursor-pointer tracking-wider"
        >
          LEADERBOARD
        </button>
        <div className="bg-[#0f172a] border-2 border-[#334155] px-4 py-1.5 rounded-b-xl rounded-tl-xl shadow-xl flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">SCORE</span>
          <span className="text-lg font-black font-mono text-[#38bdf8] drop-shadow-sm min-w-[70px] text-right">
            {score.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
