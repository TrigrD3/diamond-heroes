import React from 'react';
import type { MatchScoreboard, LineupSlot } from '../types/game';

interface MatchSimulationViewProps {
  scoreboard: MatchScoreboard;
  homeLineup: LineupSlot[];
  awayLineup: LineupSlot[];
  homeTeamName: string;
  awayTeamName: string;
  currentSimBatterIndex: number;
  simOutcomeBanner: string | null;
  onSpeedChange: (speed: number) => void;
  gameSpeed: number;
  onSkipToUserAtBat: () => void;
}

export const MatchSimulationView: React.FC<MatchSimulationViewProps> = ({
  scoreboard,
  homeLineup,
  awayLineup,
  homeTeamName,
  awayTeamName,
  currentSimBatterIndex,
  simOutcomeBanner,
  onSpeedChange,
  gameSpeed,
  onSkipToUserAtBat,
}) => {
  const { inning, isTop, playerScore, opponentScore, inningScores, bases, outs } = scoreboard;

  // Trend icon helper
  const renderTrend = (trend: LineupSlot['trend']) => {
    switch (trend) {
      case 'up':
        return <span className="bg-[#b91c1c] text-white text-[10px] px-1 py-0.5 rounded font-black">▲</span>;
      case 'diag-up':
        return <span className="bg-[#d97706] text-white text-[10px] px-1 py-0.5 rounded font-black">↗</span>;
      case 'level':
        return <span className="bg-[#15803d] text-white text-[10px] px-1 py-0.5 rounded font-black">➡</span>;
      case 'diag-down':
        return <span className="bg-[#0284c7] text-white text-[10px] px-1 py-0.5 rounded font-black">↘</span>;
      case 'down':
        return <span className="bg-[#6b7280] text-white text-[10px] px-1 py-0.5 rounded font-black">▼</span>;
    }
  };

  return (
    <div className="relative w-full h-[520px] max-w-[800px] mx-auto select-none overflow-hidden bg-cover bg-center rounded-2xl shadow-2xl border-4 border-[#1e293b]"
      style={{ backgroundImage: `url('/bh_stadium_perfect.png')` }}
    >
      {/* Top Stadium Background Overlay */}
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* Top Line-Score Matrix Scoreboard */}
      <div className="relative z-10 w-full max-w-[540px] mx-auto mt-2 bg-[#181a20]/95 border-2 border-[#475569] rounded-lg shadow-xl overflow-hidden text-white font-mono">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr className="bg-[#0f172a] text-[#94a3b8] border-b border-[#334155] text-[10px]">
              <th className="py-1 px-3 text-left font-bold uppercase tracking-wider w-24">Team</th>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((inn) => (
                <th
                  key={inn}
                  className={`py-1 w-6 font-bold ${
                    inning === inn ? 'text-[#38bdf8] bg-[#1e293b]' : ''
                  }`}
                >
                  {inn}
                </th>
              ))}
              <th className="py-1 w-7 font-black text-[#f59e0b]">R</th>
              <th className="py-1 w-7 font-black text-[#cbd5e1]">H</th>
            </tr>
          </thead>
          <tbody>
            {/* Away Team Row */}
            <tr className="border-b border-[#334155]/60 bg-[#1e1b4b]/40">
              <td className="py-1 px-3 text-left font-extrabold text-[#f43f5e] truncate uppercase">
                {awayTeamName}
              </td>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((inn, idx) => (
                <td
                  key={inn}
                  className={`py-1 text-[11px] ${
                    inning === inn ? 'font-black text-amber-300' : 'text-slate-300'
                  }`}
                >
                  {inningScores.away[idx] !== undefined ? inningScores.away[idx] : '-'}
                </td>
              ))}
              <td className="py-1 font-black text-[#f59e0b] text-sm">{opponentScore}</td>
              <td className="py-1 font-black text-slate-200 text-xs">{inningScores.awayHits}</td>
            </tr>

            {/* Home Team Row */}
            <tr className="bg-[#0284c7]/20">
              <td className="py-1 px-3 text-left font-extrabold text-[#38bdf8] truncate uppercase">
                {homeTeamName}
              </td>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((inn, idx) => (
                <td
                  key={inn}
                  className={`py-1 text-[11px] ${
                    inning === inn ? 'font-black text-amber-300' : 'text-slate-300'
                  }`}
                >
                  {inningScores.home[idx] !== undefined ? inningScores.home[idx] : '-'}
                </td>
              ))}
              <td className="py-1 font-black text-[#f59e0b] text-sm">{playerScore}</td>
              <td className="py-1 font-black text-slate-200 text-xs">{inningScores.homeHits}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Speed Controls (Right Sidebar) */}
      <div className="absolute right-3 top-24 z-20 flex flex-col gap-1.5 bg-[#0f172a]/90 p-1.5 rounded-lg border border-[#334155] shadow-lg">
        <button
          onClick={() => onSpeedChange(1)}
          className={`w-8 h-8 rounded text-xs font-black transition-all cursor-pointer ${
            gameSpeed === 1 ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Normal Speed"
        >
          x1
        </button>
        <button
          onClick={() => onSpeedChange(2)}
          className={`w-8 h-8 rounded text-xs font-black transition-all cursor-pointer ${
            gameSpeed === 2 ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Fast 2x Speed"
        >
          x2
        </button>
        <button
          onClick={() => onSpeedChange(4)}
          className={`w-8 h-8 rounded text-xs font-black transition-all cursor-pointer ${
            gameSpeed === 4 ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-slate-800'
          }`}
          title="Super Fast 4x Speed"
        >
          x4
        </button>
        <div className="border-t border-slate-700 my-0.5" />
        <button
          onClick={onSkipToUserAtBat}
          className="w-8 h-8 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center cursor-pointer shadow"
          title="Fast Forward to Player Turn"
        >
          ⏩
        </button>
      </div>

      {/* Split Lineups & Center Inning Status */}
      <div className="relative z-10 w-full px-4 mt-2 flex items-start justify-between">
        {/* Left: Home Team Lineup (Texas) */}
        <div className="w-[310px] bg-[#e2e8f0]/95 rounded-xl border-2 border-[#64748b] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0284c7] to-[#0369a1] text-white px-3 py-1.5 flex items-center justify-between border-b-2 border-[#0284c7]">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm uppercase tracking-wide">{homeTeamName}</span>
            </div>
            <span className="text-xl font-black font-mono bg-black/40 px-2 rounded text-amber-300">
              {playerScore}
            </span>
          </div>

          {/* Subheader */}
          <div className="grid grid-cols-12 bg-[#cbd5e1] text-[#334155] text-[10px] font-black uppercase px-2 py-0.5 border-b border-[#94a3b8]">
            <div className="col-span-2 text-center">#</div>
            <div className="col-span-6">Player</div>
            <div className="col-span-2 text-right">AVG</div>
            <div className="col-span-2 text-center">Trend</div>
          </div>

          {/* 9 Batter Rows */}
          <div className="divide-y divide-slate-300 max-h-[300px] overflow-hidden">
            {homeLineup.map((batter, idx) => {
              const isCurrentBatter = isTop === false && currentSimBatterIndex === idx;
              const isUserBatter = batter.isPlayerUser;

              return (
                <div
                  key={batter.order}
                  className={`grid grid-cols-12 items-center px-2 py-0.5 text-xs transition-colors relative ${
                    isCurrentBatter
                      ? 'bg-amber-100 font-extrabold border-l-4 border-amber-500 text-slate-900'
                      : isUserBatter
                      ? 'bg-sky-50 font-bold text-sky-900'
                      : 'bg-white text-slate-800'
                  }`}
                >
                  <div className="col-span-2 flex items-center justify-center font-mono font-bold text-slate-500">
                    {batter.order}
                  </div>
                  <div className="col-span-6 flex items-center gap-1.5 truncate">
                    <img
                      src={batter.avatar}
                      alt={batter.name}
                      className="w-5 h-5 rounded-full bg-slate-200 border border-slate-300 object-cover shrink-0"
                    />
                    <span className={`truncate text-xs ${isUserBatter ? 'text-amber-700 font-black' : ''}`}>
                      {batter.name}
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-mono font-semibold text-slate-600">
                    {batter.avg}
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    {renderTrend(batter.trend)}
                  </div>

                  {/* Outcome Overlay Banner if batting right now */}
                  {isCurrentBatter && simOutcomeBanner && (
                    <div className="absolute inset-0 bg-red-600/90 text-white font-black text-xs uppercase flex items-center justify-center italic tracking-wider animate-pulse z-10">
                      {simOutcomeBanner}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Mini Diamond & Inning Count Status */}
        <div className="flex flex-col items-center justify-center gap-2 mt-4 bg-slate-900/85 backdrop-blur-md border-2 border-slate-700 rounded-2xl p-3 shadow-xl">
          {/* Base Diamond */}
          <div className="relative w-14 h-14">
            {/* 2nd Base */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-2 transition-colors duration-200 ${
                bases[1]
                  ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_#f59e0b]'
                  : 'bg-slate-700 border-slate-500'
              }`}
            />
            {/* 3rd Base */}
            <div
              className={`absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 rotate-45 border-2 transition-colors duration-200 ${
                bases[2]
                  ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_#f59e0b]'
                  : 'bg-slate-700 border-slate-500'
              }`}
            />
            {/* 1st Base */}
            <div
              className={`absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 rotate-45 border-2 transition-colors duration-200 ${
                bases[0]
                  ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_#f59e0b]'
                  : 'bg-slate-700 border-slate-500'
              }`}
            />
            {/* Home Plate */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-2.5 bg-white rounded-b-sm border border-slate-300 shadow-sm" />
          </div>

          {/* Inning & Outs */}
          <div className="text-center">
            <div className="text-[11px] font-black uppercase text-amber-300">
              {isTop ? '▲ Top' : '▼ Bot'} {inning}{inning === 1 ? 'st' : inning === 2 ? 'nd' : inning === 3 ? 'rd' : 'th'}
            </div>
            <div className="flex items-center gap-1.5 justify-center mt-1">
              <span className="text-[10px] font-bold text-slate-400">OUT</span>
              <div className="flex gap-1">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full border border-black ${
                      i < outs ? 'bg-red-500 shadow-[0_0_6px_#ef4444]' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Away Team Lineup (Oakland) */}
        <div className="w-[310px] bg-[#e2e8f0]/95 rounded-xl border-2 border-[#64748b] shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#dc2626] to-[#b91c1c] text-white px-3 py-1.5 flex items-center justify-between border-b-2 border-[#dc2626]">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm uppercase tracking-wide">{awayTeamName}</span>
            </div>
            <span className="text-xl font-black font-mono bg-black/40 px-2 rounded text-amber-300">
              {opponentScore}
            </span>
          </div>

          {/* Subheader */}
          <div className="grid grid-cols-12 bg-[#cbd5e1] text-[#334155] text-[10px] font-black uppercase px-2 py-0.5 border-b border-[#94a3b8]">
            <div className="col-span-2 text-center">#</div>
            <div className="col-span-6">Player</div>
            <div className="col-span-2 text-right">AVG</div>
            <div className="col-span-2 text-center">Trend</div>
          </div>

          {/* 9 Batter Rows */}
          <div className="divide-y divide-slate-300 max-h-[300px] overflow-hidden">
            {awayLineup.map((batter, idx) => {
              const isCurrentBatter = isTop === true && currentSimBatterIndex === idx;

              return (
                <div
                  key={batter.order}
                  className={`grid grid-cols-12 items-center px-2 py-0.5 text-xs transition-colors relative ${
                    isCurrentBatter
                      ? 'bg-amber-100 font-extrabold border-l-4 border-amber-500 text-slate-900'
                      : 'bg-white text-slate-800'
                  }`}
                >
                  <div className="col-span-2 flex items-center justify-center font-mono font-bold text-slate-500">
                    {batter.order}
                  </div>
                  <div className="col-span-6 flex items-center gap-1.5 truncate">
                    <img
                      src={batter.avatar}
                      alt={batter.name}
                      className="w-5 h-5 rounded-full bg-slate-200 border border-slate-300 object-cover shrink-0"
                    />
                    <span className="truncate text-xs">{batter.name}</span>
                  </div>
                  <div className="col-span-2 text-right font-mono font-semibold text-slate-600">
                    {batter.avg}
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    {renderTrend(batter.trend)}
                  </div>

                  {/* Outcome Overlay Banner if batting right now */}
                  {isCurrentBatter && simOutcomeBanner && (
                    <div className="absolute inset-0 bg-red-600/90 text-white font-black text-xs uppercase flex items-center justify-center italic tracking-wider animate-pulse z-10">
                      {simOutcomeBanner}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
