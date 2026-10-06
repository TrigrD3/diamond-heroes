import React, { useState } from 'react';
import type { PlayerStats, SeasonStandings } from '../types/game';
import { sound } from '../utils/audio';

interface ClubhouseLobbyProps {
  playerStats: PlayerStats;
  season: SeasonStandings;
  level: number;
  exp: number;
  maxExp: number;
  coins: number;
  cash: number;
  energy: number;
  score: number;
  onPlayBall: () => void;
  onOpenTraining: () => void;
  onOpenShop: () => void;
  onOpenCards: () => void;
  onOpenPlayer: () => void;
  onCollectReward: (coinsEarned: number, expEarned: number) => void;
}

interface GroundItem {
  id: string;
  type: 'glove' | 'bat' | 'bottle' | 'ball';
  x: number;
  y: number;
  collected: boolean;
  rewardCoins: number;
  rewardExp: number;
}

export const ClubhouseLobby: React.FC<ClubhouseLobbyProps> = ({
  season,
  level,
  score,
  onPlayBall,
  onOpenTraining,
  onOpenShop,
  onOpenCards,
  onOpenPlayer,
  onCollectReward,
}) => {
  // Ground cleanup items (authentic Facebook Syntasia mechanic: click field trash to get coins/EXP)
  const [groundItems, setGroundItems] = useState<GroundItem[]>([
    { id: 'item-1', type: 'glove', x: 210, y: 340, collected: false, rewardCoins: 45, rewardExp: 10 },
    { id: 'item-2', type: 'bat', x: 290, y: 355, collected: false, rewardCoins: 75, rewardExp: 15 },
    { id: 'item-3', type: 'ball', x: 375, y: 330, collected: false, rewardCoins: 30, rewardExp: 8 },
    { id: 'item-4', type: 'bottle', x: 530, y: 345, collected: false, rewardCoins: 50, rewardExp: 12 },
  ]);

  const [floatingBonus, setFloatingBonus] = useState<{ id: string; text: string; x: number; y: number } | null>(null);

  const handleCollectItem = (item: GroundItem) => {
    if (item.collected) return;
    sound.playCoin();
    setGroundItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, collected: true } : i))
    );
    setFloatingBonus({
      id: item.id,
      text: `+${item.rewardCoins} 🪙 +${item.rewardExp} ⭐`,
      x: item.x,
      y: item.y - 20,
    });
    onCollectReward(item.rewardCoins, item.rewardExp);

    setTimeout(() => {
      setFloatingBonus(null);
    }, 1200);
  };

  return (
    <div
      className="relative w-full h-[520px] max-w-[800px] mx-auto select-none overflow-hidden bg-cover bg-center rounded-2xl shadow-2xl border-4 border-[#1e293b]"
      style={{ backgroundImage: `url('/assets/images/stadium/bh_stadium_1200.png')` }}
    >
      {/* Stadium Sunlight Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30 pointer-events-none" />

      {/* Top Center: Clubhouse League Standing Banner */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#0f172a]/95 border-2 border-[#38bdf8] px-5 py-1.5 rounded-full shadow-2xl backdrop-blur-md">
        <span className="text-amber-400 font-black text-sm uppercase tracking-wider">
          ⚾ {season.seasonNumber}st REGULAR SEASON
        </span>
        <span className="text-slate-400 font-bold text-xs">|</span>
        <span className="text-sky-300 font-extrabold text-xs">
          Match #{season.gameNumber}/30
        </span>
      </div>

      {/* Left Quick Action Badges */}
      <div className="absolute left-4 top-16 z-20 flex flex-col gap-3">
        {/* Tier League Badge */}
        <button
          onClick={onPlayBall}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          title="Single-A League Division"
        >
          <span className="text-white font-black text-sm tracking-tighter">1A</span>
          <span className="absolute -bottom-1 text-[8px] bg-slate-900 text-amber-300 font-black px-1 rounded uppercase">
            LEAGUE
          </span>
        </button>

        {/* Skill Training Badge */}
        <button
          onClick={onOpenTraining}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-blue-500 border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          title="Athlete Training Facility"
        >
          <span className="text-xl">🏋️</span>
          <span className="absolute -bottom-1 text-[8px] bg-slate-900 text-sky-300 font-black px-1 rounded uppercase">
            TRAIN
          </span>
        </button>

        {/* Recruiter Draft Gacha Badge */}
        <button
          onClick={onOpenCards}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 to-red-500 border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          title="Recruiter Batter Cards"
        >
          <span className="text-xl">🃏</span>
          <span className="absolute -bottom-1 text-[8px] bg-slate-900 text-amber-300 font-black px-1 rounded uppercase">
            DRAFT
          </span>
        </button>

        {/* Pro Gear Shop */}
        <button
          onClick={onOpenShop}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 border-2 border-white shadow-xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          title="Pro Gear Clubhouse Shop"
        >
          <span className="text-xl">🏪</span>
          <span className="absolute -bottom-1 text-[8px] bg-slate-900 text-emerald-300 font-black px-1 rounded uppercase">
            SHOP
          </span>
        </button>
      </div>

      {/* Top Right: Ticket Booth / Clubhouse Counter */}
      <div className="absolute right-4 top-16 z-20 flex flex-col items-end">
        <div className="bg-[#181a20]/95 border-2 border-[#475569] rounded-xl px-3 py-1.5 shadow-xl flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-base shadow">
            🎟️
          </div>
          <div>
            <div className="text-[10px] uppercase font-black text-slate-300">TICKETS</div>
            <div className="text-xs font-mono font-bold text-amber-300">Free: 5:00</div>
          </div>
        </div>
      </div>

      {/* Warm-Up Teammates Stretching & Tossing Across Outfield Dirt & Grass */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Fielder warm-up stretch */}
        <div className="absolute top-[230px] left-[210px] flex flex-col items-center animate-pulse">
          <img src="/assets/images/characters/bh_fielder_clean.png" alt="Teammate" className="w-9 h-9" />
          <span className="text-[9px] bg-black/70 text-slate-200 px-1 rounded font-bold">Marco</span>
        </div>

        {/* Shortstop warm-up catch */}
        <div className="absolute top-[260px] left-[320px] flex flex-col items-center">
          <img src="/assets/images/characters/bh_fielder_clean.png" alt="Teammate" className="w-9 h-9 transform scale-x-[-1]" />
          <span className="text-[9px] bg-black/70 text-slate-200 px-1 rounded font-bold">Lucas</span>
        </div>

        {/* Pitcher on Mound throwing warmups */}
        <div className="absolute top-[220px] left-[380px] flex flex-col items-center">
          <img src="/assets/images/characters/bh_pitcher_transparent.png" alt="Pitcher" className="w-14 h-14" />
          <span className="text-[9px] bg-black/70 text-emerald-300 px-1 rounded font-bold">Mound</span>
        </div>

        {/* 2nd Baseman stretching */}
        <div className="absolute top-[260px] left-[480px] flex flex-col items-center">
          <img src="/assets/images/characters/bh_fielder_clean.png" alt="Teammate" className="w-9 h-9" />
          <span className="text-[9px] bg-black/70 text-slate-200 px-1 rounded font-bold">Kirby</span>
        </div>

        {/* Right Fielder warm-up */}
        <div className="absolute top-[230px] left-[590px] flex flex-col items-center">
          <img src="/assets/images/characters/bh_fielder_clean.png" alt="Teammate" className="w-9 h-9 transform scale-x-[-1]" />
          <span className="text-[9px] bg-black/70 text-slate-200 px-1 rounded font-bold">Jake</span>
        </div>
      </div>

      {/* Interactive Ground Cleanup Items (Click to Earn Free Coins & EXP) */}
      {groundItems.map((item) =>
        !item.collected ? (
          <button
            key={item.id}
            onClick={() => handleCollectItem(item)}
            className="absolute z-20 group transform hover:scale-125 transition-transform cursor-pointer drop-shadow-lg"
            style={{ left: `${item.x}px`, top: `${item.y}px` }}
            title="Click to clean up and collect coins!"
          >
            {item.type === 'glove' && (
              <img src="/assets/images/items_glove.png" alt="Glove" className="w-8 h-8 animate-bounce" />
            )}
            {item.type === 'bat' && (
              <img src="/assets/images/items_broken_bat.png" alt="Broken Bat" className="w-10 h-5" />
            )}
            {item.type === 'bottle' && (
              <img src="/assets/images/items_bottle.png" alt="Can" className="w-6 h-6" />
            )}
            {item.type === 'ball' && (
              <img src="/assets/images/characters/bh_ball_clean.png" alt="Ball" className="w-5 h-5 animate-pulse" />
            )}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] bg-amber-500 text-slate-950 font-black px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow">
              CLEAN 🪙
            </span>
          </button>
        ) : null
      )}

      {/* Floating Bonus Coin Effect */}
      {floatingBonus && (
        <div
          className="absolute z-30 font-black text-amber-300 text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-out fade-out slide-out-to-top duration-1000 pointer-events-none"
          style={{ left: `${floatingBonus.x}px`, top: `${floatingBonus.y}px` }}
        >
          {floatingBonus.text}
        </div>
      )}

      {/* Home Plate Pentagon Geometry in Foreground Dirt */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-20 h-16 pointer-events-none opacity-80">
        <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
          <polygon points="10,10 90,10 90,45 50,75 10,45" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />
        </svg>
      </div>

      {/* Slugger Avatar Character Standing in Batter's Box with Duffel Bag */}
      <div className="absolute bottom-6 right-[190px] z-20 flex items-end">
        {/* Duffel Bag on Ground */}
        <img
          src="/assets/images/items_duffel_bag.png"
          alt="Duffel Bag"
          className="w-12 h-9 -mr-3 z-10 drop-shadow-md"
        />

        {/* Batter Chibi Hero Avatar */}
        <div
          onClick={onOpenPlayer}
          className="relative group cursor-pointer transform hover:scale-105 transition-transform"
          title="Click to view My Slugger profile & stats"
        >
          <img
            src="/assets/images/characters/bh_batter_intact_clean.png"
            alt="Andy Slugger"
            className="w-32 h-auto drop-shadow-2xl"
          />

          {/* Season Stats Plaque next to Avatar (Classic Facebook HUD) */}
          <div className="absolute -right-36 top-6 bg-[#0f172a]/95 border-2 border-[#334155] rounded-xl p-2.5 shadow-2xl text-[11px] font-sans w-32 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1 mb-1 font-bold">
              <span className="text-white font-black">Andy (You)</span>
              <span className="text-amber-400 font-black">Lv.{level}</span>
            </div>
            <div className="space-y-0.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">AVG:</span>
                <span className="text-amber-300 font-bold">.692</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">HR:</span>
                <span className="text-rose-400 font-bold">{season.wins * 2 + 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">RBI:</span>
                <span className="text-sky-300 font-bold">{season.wins * 4 + 3}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">HITS:</span>
                <span className="text-emerald-300 font-bold">{season.wins * 6 + 7}</span>
              </div>
            </div>
            <div className="mt-1.5 pt-1 border-t border-slate-700/80 text-[9px] text-center text-amber-300 font-black">
              ⭐ UPGRADE STATS
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Score Counter & PLAY BALL / NEXT MATCH Action Button */}
      <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        {/* Global Leaderboard Score Display */}
        <div className="bg-[#0f172a]/95 border-2 border-[#475569] px-4 py-2 rounded-xl shadow-2xl flex items-center gap-3">
          <span className="text-xs uppercase font-black text-slate-400 tracking-wider">SCORE</span>
          <span className="text-xl font-black font-mono text-white tracking-widest drop-shadow">
            {score.toLocaleString()}
          </span>
        </div>

        {/* Giant Green Authentic PLAY BALL / NEXT MATCH Button */}
        <button
          onClick={onPlayBall}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 hover:from-emerald-400 hover:to-green-600 text-white font-black text-lg px-8 py-3 rounded-2xl shadow-[0_8px_20px_rgba(16,185,129,0.5)] border-2 border-emerald-300 hover:scale-105 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
        >
          <span className="text-2xl group-hover:rotate-12 transition-transform">⚾</span>
          <span>PLAY BALL (5⚡)</span>
          <span className="text-xs bg-emerald-900/80 px-2 py-0.5 rounded-lg border border-emerald-400 font-mono">
            NEXT MATCH
          </span>
        </button>
      </div>
    </div>
  );
};
