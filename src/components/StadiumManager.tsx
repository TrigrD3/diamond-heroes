import React from 'react';
import type { StadiumUpgrade } from '../types/game';
import { STADIUM_LEVELS } from '../data/gameData';
import { sound } from '../utils/audio';

interface StadiumManagerProps {
  currentStadium: StadiumUpgrade;
  coins: number;
  onUpgradeStadium: (nextLevel: StadiumUpgrade) => void;
}

export const StadiumManager: React.FC<StadiumManagerProps> = ({
  currentStadium,
  coins,
  onUpgradeStadium,
}) => {
  const nextTier = STADIUM_LEVELS.find((s) => s.level === currentStadium.level + 1);

  return (
    <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl text-white space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>🏟️ Home Stadium Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upgrade your stadium capacity to multiply match reward coins and boost ticket revenue
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block uppercase">Coin Vault</span>
          <span className="text-xl font-black text-amber-400">🪙 {coins}</span>
        </div>
      </div>

      {/* Active Stadium Showcase */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-800 border border-emerald-500/60 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-5">
          <div className="text-6xl p-4 bg-slate-900/80 rounded-2xl border border-emerald-500/40 shadow-lg">
            🏟️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded uppercase">
                Level {currentStadium.level}
              </span>
              <span className="text-xs text-slate-400 font-bold">Active Home Field</span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">{currentStadium.name}</h3>
            <div className="flex gap-4 text-xs text-slate-300 mt-2 font-semibold">
              <span>👥 Capacity: <strong className="text-emerald-400">{currentStadium.capacity.toLocaleString()} Seats</strong></span>
              <span>💰 Revenue Boost: <strong className="text-amber-400">+{Math.round((currentStadium.bonusCoinMultiplier - 1) * 100)}% Coins</strong></span>
            </div>
          </div>
        </div>

        {/* Upgrade Call to Action */}
        {nextTier ? (
          <div className="text-center md:text-right w-full md:w-auto">
            <div className="text-xs text-slate-400 mb-1">
              Next: <strong className="text-white">{nextTier.name}</strong> ({nextTier.capacity.toLocaleString()} seats)
            </div>
            <button
              disabled={coins < nextTier.upgradeCost}
              onClick={() => {
                sound.playCoin();
                sound.playCheer();
                onUpgradeStadium(nextTier);
              }}
              className={`w-full md:w-auto px-6 py-3 rounded-xl font-black text-sm uppercase transition-transform shadow-lg ${
                coins >= nextTier.upgradeCost
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 text-slate-950 active:scale-95 cursor-pointer'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Upgrade: 🪙 {nextTier.upgradeCost}
            </button>
          </div>
        ) : (
          <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500 px-4 py-2 rounded-xl text-xs font-black uppercase">
            ★ Maximum Stadium Tier Reached ★
          </div>
        )}
      </div>

      {/* Stadium Tier Ladder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {STADIUM_LEVELS.map((tier) => {
          const isCurrent = tier.level === currentStadium.level;
          const isPast = tier.level < currentStadium.level;

          return (
            <div
              key={tier.level}
              className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                  : isPast
                  ? 'bg-slate-900 border-slate-700 opacity-60'
                  : 'bg-slate-800/80 border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-black uppercase text-amber-400">LVL {tier.level}</span>
                {isCurrent && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                    ACTIVE
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">{tier.name}</h4>
              <div className="text-xs text-slate-400 mt-2 space-y-0.5 font-medium">
                <div>👥 {tier.capacity.toLocaleString()} Seats</div>
                <div>🪙 {tier.bonusCoinMultiplier}x Coins</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
