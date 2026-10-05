import React from 'react';
import type { PlayerStats } from '../types/game';
import { sound } from '../utils/audio';

interface PlayerCardProps {
  stats: PlayerStats;
  coins: number;
  level: number;
  exp: number;
  maxExp: number;
  statPoints: number;
  onUpgradeStat: (stat: keyof PlayerStats) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  stats,
  coins,
  level,
  exp,
  maxExp,
  statPoints,
  onUpgradeStat,
}) => {
  const statConfig: { key: keyof PlayerStats; label: string; desc: string; icon: string; color: string }[] = [
    {
      key: 'contact',
      label: 'Contact',
      desc: 'Expands the Aiming Circle diameter and widens sweet-spot timing window (Perfect/Good).',
      icon: '🎯',
      color: 'bg-emerald-500'
    },
    {
      key: 'power',
      label: 'Power',
      desc: 'Increases fly-ball launch distance, exit velocity, and Home Run clearing potential.',
      icon: '💥',
      color: 'bg-amber-500'
    },
    {
      key: 'luck',
      label: 'Luck',
      desc: 'Multiplies Combo Gauge points gained on base hits, accelerating 100% Guaranteed Home Runs.',
      icon: '🍀',
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl text-white">
      {/* Header Profile */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-4xl shadow-lg border border-blue-400">
            ⚾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">Your Avatar Slugger</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                LVL {level}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Franchise Captain & Cleanup Batter</div>
          </div>
        </div>

        {/* Level EXP Bar & Coins */}
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end font-extrabold text-amber-400 text-lg">
            <span>🪙 {coins}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-slate-400">EXP:</span>
            <div className="w-28 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (exp / maxExp) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-slate-400">{exp}/{maxExp}</span>
          </div>
        </div>
      </div>

      {/* Available Skill Points Announcement */}
      {statPoints > 0 ? (
        <div className="mt-4 p-3.5 bg-gradient-to-r from-amber-950/60 to-yellow-950/40 border border-amber-500 rounded-xl flex items-center justify-between">
          <div className="text-xs text-amber-200">
            <strong className="text-amber-400 font-bold">You have {statPoints} unallocated Skill Point{statPoints > 1 ? 's' : ''}!</strong> Allocate points to Contact, Power, or Luck.
          </div>
          <span className="text-xs bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded-md animate-pulse">
            +{statPoints} PTS
          </span>
        </div>
      ) : (
        <div className="mt-3 text-xs text-slate-400 italic">
          Level up by winning matches in the 30-game season or completing quests to earn more Skill Points!
        </div>
      )}

      {/* 3 Core Stats Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {statConfig.map(({ key, label, desc, icon, color }) => {
          const val = stats[key];
          return (
            <div key={key} className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl hover:border-slate-600 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold flex items-center gap-1.5 text-slate-200">
                    <span>{icon}</span> {label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white">{val}</span>
                    {statPoints > 0 && (
                      <button
                        onClick={() => {
                          sound.playCoin();
                          onUpgradeStat(key);
                        }}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-90 text-white font-black px-2 py-0.5 rounded shadow cursor-pointer transition-transform"
                        title={`Upgrade ${label}`}
                      >
                        +1
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden mb-2 border border-slate-700">
                  <div className={`${color} h-full rounded-full transition-all duration-300`} style={{ width: `${Math.min(100, val)}%` }} />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-tight mt-2">{desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
