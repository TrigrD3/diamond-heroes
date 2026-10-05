import React from 'react';
import type { TeamMember, PlayerStats } from '../types/game';

interface TeamRosterProps {
  roster: TeamMember[];
  playerStats: PlayerStats;
  onMoveOrder: (index: number, direction: 'up' | 'down') => void;
}

export const TeamRoster: React.FC<TeamRosterProps> = ({
  roster,
  playerStats,
  onMoveOrder,
}) => {
  return (
    <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>⚾ Team Lineup & Roster</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage batting lineup order and inspect player ratings</p>
        </div>
        <div className="text-xs bg-slate-800 text-sky-400 font-bold px-3 py-1.5 rounded-lg border border-slate-700">
          9-Player Roster
        </div>
      </div>

      {/* Batting Order List */}
      <div className="space-y-2 mt-4">
        {roster.map((player, idx) => {
          const isUser = player.id === 'hero';
          const stats = isUser ? playerStats : player.stats;

          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isUser
                  ? 'bg-amber-950/20 border-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                  : 'bg-slate-800/60 border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Batting order number badge */}
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs text-slate-300">
                  #{idx + 1}
                </div>

                <div className="text-2xl">{player.portrait}</div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{player.name}</span>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                      {player.position}
                    </span>
                    {isUser && (
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                    <span>Contact: <strong className="text-emerald-400">{stats.contact}</strong></span>
                    <span>Power: <strong className="text-amber-400">{stats.power}</strong></span>
                    <span>Luck: <strong className="text-purple-400">{stats.luck}</strong></span>
                    <span>Speed: <strong className="text-sky-400">{stats.speed}</strong></span>
                  </div>
                </div>
              </div>

              {/* Lineup Re-ordering buttons */}
              <div className="flex items-center gap-1">
                <button
                  disabled={idx === 0}
                  onClick={() => onMoveOrder(idx, 'up')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    idx === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 bg-slate-700 hover:bg-slate-600'
                  }`}
                  title="Move Up in Lineup"
                >
                  ▲
                </button>
                <button
                  disabled={idx === roster.length - 1}
                  onClick={() => onMoveOrder(idx, 'down')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    idx === roster.length - 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 bg-slate-700 hover:bg-slate-600'
                  }`}
                  title="Move Down in Lineup"
                >
                  ▼
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
