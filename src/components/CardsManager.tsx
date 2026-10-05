import React, { useState } from 'react';
import type { BatterCard } from '../types/game';
import { CARD_PACK_POOL } from '../data/gameData';
import { sound } from '../utils/audio';

interface CardsManagerProps {
  cards: BatterCard[];
  coins: number;
  cash: number;
  onOpenPack: (packType: 'Standard' | 'Elite') => void;
  onSwapCardPosition: (cardId: string, position: string) => void;
}

export const CardsManager: React.FC<CardsManagerProps> = ({
  cards,
  coins,
  cash,
  onOpenPack,
}) => {
  const [packOpeningResult, setPackOpeningResult] = useState<BatterCard | null>(null);

  const handleBuyPack = (type: 'Standard' | 'Elite') => {
    const cost = type === 'Standard' ? 600 : 1800;
    if (coins < cost) return;

    sound.playCoin();
    sound.playBatCrack('Homerun');

    // Filter pack pool
    const candidates =
      type === 'Elite'
        ? CARD_PACK_POOL.filter((c) => c.grade === 'Hero' || c.grade === 'Elite')
        : CARD_PACK_POOL;
    const drawn = candidates[Math.floor(Math.random() * candidates.length)];

    setPackOpeningResult(drawn);
    onOpenPack(type);
  };

  return (
    <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl text-white space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>🃏 Special Batter Cards (Syntasia Recruiter)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Collect Hero, Elite, Rare, and Normal cards with S/A/B/C classes and unique skills
          </p>
        </div>
        <div className="flex gap-3 text-sm font-bold">
          <span className="text-amber-400">🪙 {coins} Coins</span>
          <span className="text-emerald-400">💵 {cash} Cash</span>
        </div>
      </div>

      {/* Card Packs Purchase Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Standard Pack */}
        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-sky-400">⚾ Standard Draft Pack</div>
            <div className="text-xs text-slate-400 mt-1">Grades: Normal, Rare, Elite (Classes C-A)</div>
            <div className="text-sm font-extrabold text-amber-400 mt-2">🪙 600 Coins</div>
          </div>
          <button
            disabled={coins < 600}
            onClick={() => handleBuyPack('Standard')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-transform ${
              coins >= 600
                ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 active:scale-95 cursor-pointer shadow-md'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Open Pack
          </button>
        </div>

        {/* Elite Hero Pack */}
        <div className="bg-gradient-to-r from-amber-950/40 to-purple-950/40 border border-amber-500/60 p-4 rounded-xl flex items-center justify-between">
          <div>
            <div className="text-sm font-black text-amber-400 flex items-center gap-1.5">
              <span>⭐ Elite Hero Draft Pack</span>
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded uppercase">Hot</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">High chance of Grade Hero / Elite (Class S & A)</div>
            <div className="text-sm font-extrabold text-amber-400 mt-2">🪙 1,800 Coins</div>
          </div>
          <button
            disabled={coins < 1800}
            onClick={() => handleBuyPack('Elite')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-transform ${
              coins >= 1800
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-slate-950 active:scale-95 cursor-pointer shadow-lg'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Open Pack
          </button>
        </div>
      </div>

      {/* Active 5-Batter Lineup Deck */}
      <div>
        <div className="text-sm font-extrabold text-slate-300 uppercase tracking-wider mb-3">
          Your Active Batter Card Deck (5 Cards)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {cards.map((c) => {
            const isHero = c.grade === 'Hero';
            const isElite = c.grade === 'Elite';

            return (
              <div
                key={c.id}
                className={`rounded-2xl p-4 border flex flex-col justify-between transition-all shadow-lg ${
                  isHero
                    ? 'bg-gradient-to-b from-amber-950/70 to-slate-900 border-amber-500 shadow-amber-500/10'
                    : isElite
                    ? 'bg-gradient-to-b from-purple-950/70 to-slate-900 border-purple-500'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        isHero
                          ? 'bg-amber-500 text-slate-950'
                          : isElite
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {c.grade}
                    </span>
                    <span className="text-xs font-mono font-black text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                      Class {c.cardClass}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <div className="text-3xl">⚾</div>
                    <div className="font-black text-sm text-white mt-1 leading-tight">{c.name}</div>
                    <div className="text-[11px] font-mono text-slate-400 uppercase mt-0.5">
                      Position: <strong className="text-white">{c.position}</strong>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-900/80 rounded-lg p-2 text-[11px] border border-slate-700/80 my-2">
                    <div>🎯 Con: <strong className="text-emerald-400">{c.contact}</strong></div>
                    <div>💥 Pow: <strong className="text-amber-400">{c.power}</strong></div>
                    <div>🍀 Lck: <strong className="text-purple-400">{c.luck}</strong></div>
                    <div>⚡ Spd: <strong className="text-sky-400">{c.speed}</strong></div>
                  </div>

                  {/* Special Ability */}
                  <div className="text-[10px] text-amber-200/90 bg-amber-950/30 border border-amber-800/40 rounded p-1.5 leading-tight">
                    {c.specialAbility}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Reveal Modal */}
      {packOpeningResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-amber-500 max-w-sm w-full rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="text-5xl animate-bounce">✨ 🃏 ✨</div>
            <h3 className="text-xl font-black text-amber-400 uppercase tracking-wide">
              New Batter Recruited!
            </h3>

            <div className="bg-gradient-to-b from-amber-950/80 to-slate-900 border-2 border-amber-400 rounded-2xl p-4 text-center shadow-xl">
              <span className="text-xs bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded uppercase">
                {packOpeningResult.grade} • Class {packOpeningResult.cardClass}
              </span>
              <div className="text-lg font-black text-white mt-2">{packOpeningResult.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">Position: {packOpeningResult.position}</div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-2 rounded-lg mt-3 border border-slate-700">
                <div>🎯 Contact: <strong className="text-emerald-400">{packOpeningResult.contact}</strong></div>
                <div>💥 Power: <strong className="text-amber-400">{packOpeningResult.power}</strong></div>
                <div>🍀 Luck: <strong className="text-purple-400">{packOpeningResult.luck}</strong></div>
                <div>⚡ Speed: <strong className="text-sky-400">{packOpeningResult.speed}</strong></div>
              </div>

              <div className="text-xs text-amber-300 mt-2 p-1.5 bg-amber-950/40 rounded border border-amber-800/40">
                {packOpeningResult.specialAbility}
              </div>
            </div>

            <button
              onClick={() => setPackOpeningResult(null)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              Add to Squad
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
