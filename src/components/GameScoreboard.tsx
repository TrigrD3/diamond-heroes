import React from 'react';
import type { MatchScoreboard, SeasonStandings } from '../types/game';

interface GameScoreboardProps {
  scoreboard: MatchScoreboard;
  season: SeasonStandings;
  homeTeamName: string;
  awayTeamName: string;
  onSpeedToggle?: (speed: number) => void;
  gameSpeed?: number;
}

export const GameScoreboard: React.FC<GameScoreboardProps> = ({
  scoreboard,
  homeTeamName,
  awayTeamName,
}) => {
  const { inning, isTop, playerScore, opponentScore, balls, strikes, outs, bases } = scoreboard;

  return (
    <div className="relative flex items-center justify-between w-full px-2 py-1 select-none pointer-events-auto">
      {/* Left: Home Team Badge (Texas) */}
      <div className="flex items-center gap-1.5 drop-shadow-md">
        <div className="relative flex items-center justify-center">
          <img
            src="/assets/images/ui/hud_tex_badge.png"
            alt={homeTeamName}
            className="h-12 w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>

      {/* Center: Authentic Hanging Scoreboard Box */}
      <div className="relative flex flex-col items-center">
        {/* Main Scoreboard Plaque */}
        <div className="bg-gradient-to-b from-[#2b2f3a] via-[#1a1c23] to-[#121318] border-2 border-[#4b5563] rounded-lg px-3 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex items-center gap-3">
          {/* Away Score */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">AWAY</span>
            <div className="text-2xl font-black text-[#f59e0b] bg-[#0f1117] border border-[#374151] px-2 py-0.5 rounded shadow-inner min-w-[32px] text-center font-mono">
              {opponentScore}
            </div>
          </div>

          {/* Center Inning Arrow & Diamond Base Indicators */}
          <div className="flex flex-col items-center">
            {/* Inning banner */}
            <div className="flex items-center gap-0.5 bg-[#111827] border border-[#374151] px-2 py-0.5 rounded-full text-[10px] font-black text-amber-300">
              <span>{isTop ? '▲' : '▼'}</span>
              <span>{inning}{inning === 1 ? 'st' : inning === 2 ? 'nd' : inning === 3 ? 'rd' : 'th'}</span>
            </div>

            {/* Base Diamond */}
            <div className="relative w-8 h-8 my-1">
              {/* 2nd Base */}
              <div
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border ${
                  bases[1]
                    ? 'bg-[#f59e0b] border-[#fbbf24] shadow-[0_0_6px_#f59e0b]'
                    : 'bg-[#374151] border-[#4b5563]'
                }`}
              />
              {/* 3rd Base */}
              <div
                className={`absolute top-1/2 left-0 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border ${
                  bases[2]
                    ? 'bg-[#f59e0b] border-[#fbbf24] shadow-[0_0_6px_#f59e0b]'
                    : 'bg-[#374151] border-[#4b5563]'
                }`}
              />
              {/* 1st Base */}
              <div
                className={`absolute top-1/2 right-0 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border ${
                  bases[0]
                    ? 'bg-[#f59e0b] border-[#fbbf24] shadow-[0_0_6px_#f59e0b]'
                    : 'bg-[#374151] border-[#4b5563]'
                }`}
              />
            </div>
          </div>

          {/* Home Score */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">HOME</span>
            <div className="text-2xl font-black text-[#38bdf8] bg-[#0f1117] border border-[#374151] px-2 py-0.5 rounded shadow-inner min-w-[32px] text-center font-mono">
              {playerScore}
            </div>
          </div>
        </div>

        {/* Count Lights Row: B S O */}
        <div className="bg-[#111827]/95 border-x-2 border-b-2 border-[#4b5563] px-3 py-0.5 rounded-b-md flex items-center gap-3 text-[11px] font-black shadow-md -mt-0.5">
          {/* Balls */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-mono">B</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border border-black ${
                    i < balls
                      ? 'bg-[#10b981] shadow-[0_0_5px_#10b981]'
                      : 'bg-[#1f2937]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Strikes */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-mono">S</span>
            <div className="flex gap-1">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border border-black ${
                    i < strikes
                      ? 'bg-[#ef4444] shadow-[0_0_5px_#ef4444]'
                      : 'bg-[#1f2937]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Outs */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-mono">O</span>
            <div className="flex gap-1">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full border border-black ${
                    i < outs
                      ? 'bg-[#ef4444] shadow-[0_0_5px_#ef4444]'
                      : 'bg-[#1f2937]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Away Team Badge (Oakland) */}
      <div className="flex items-center gap-1.5 drop-shadow-md">
        <div className="relative flex items-center justify-center">
          <img
            src="/assets/images/ui/hud_oak_badge.png"
            alt={awayTeamName}
            className="h-12 w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          />
        </div>
      </div>
    </div>
  );
};
