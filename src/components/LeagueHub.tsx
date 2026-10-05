import React from 'react';
import type { OpponentTeam } from '../types/game';
import { LEAGUE_OPPONENTS } from '../data/gameData';
import { sound } from '../utils/audio';

interface LeagueHubProps {
  currentOpponent: OpponentTeam;
  unlockedTierIndex: number;
  onSelectOpponent: (opponent: OpponentTeam) => void;
  onStartMatch: () => void;
}

export const LeagueHub: React.FC<LeagueHubProps> = ({
  currentOpponent,
  unlockedTierIndex,
  onSelectOpponent,
  onStartMatch,
}) => {
  return (
    <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>🏆 World League Tour</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Climb from the Rookie Sandlots all the way to the Champions Cup!</p>
        </div>
        <button
          onClick={() => {
            sound.playBatCrack('Solid');
            onStartMatch();
          }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm uppercase px-6 py-2.5 rounded-xl shadow-lg border border-amber-300 active:scale-95 transition-all"
        >
          Play Match! ⚾
        </button>
      </div>

      {/* Opponent League Ladder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {LEAGUE_OPPONENTS.map((opp, idx) => {
          const isUnlocked = idx <= unlockedTierIndex;
          const isSelected = opp.id === currentOpponent.id;

          return (
            <div
              key={opp.id}
              onClick={() => {
                if (isUnlocked) {
                  sound.playPitch();
                  onSelectOpponent(opp);
                }
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/40 shadow-xl'
                  : isUnlocked
                  ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                  : 'bg-slate-900/60 border-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-700">
                  {opp.tier}
                </span>
                {isSelected && (
                  <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded">
                    CURRENT CHALLENGE
                  </span>
                )}
                {!isUnlocked && (
                  <span className="text-xs text-slate-500 font-bold">🔒 Locked</span>
                )}
              </div>

              <h3 className="text-lg font-black text-white">{opp.name}</h3>

              <div className="bg-slate-900/90 rounded-xl p-3 my-3 border border-slate-700/80 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ace Pitcher:</span>
                  <span className="font-bold text-white">{opp.pitcherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fastball Speed:</span>
                  <span className="font-bold text-rose-400">{opp.pitcherVelocity} MPH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pitches:</span>
                  <span className="font-bold text-sky-400">{opp.pitcherRepertoire.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                <span className="text-slate-400">Reward:</span>
                <div className="flex gap-2">
                  <span className="font-bold text-amber-400">🪙 +{opp.rewardCoins}</span>
                  <span className="font-bold text-indigo-400">⭐ +{opp.rewardExp} EXP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
