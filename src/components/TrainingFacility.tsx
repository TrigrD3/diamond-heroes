import React, { useState } from 'react';
import type { PlayerStats } from '../types/game';
import { sound } from '../utils/audio';

interface TrainingFacilityProps {
  playerStats: PlayerStats;
  coins: number;
  cash: number;
  energy: number;
  level: number;
  onStatsUpdated: (newStats: PlayerStats) => void;
  onCoinsDeducted: (amount: number) => void;
  onEnergyUsed: (amount: number) => void;
}

interface TrainingDrill {
  id: string;
  name: string;
  category: keyof PlayerStats;
  icon: string;
  desc: string;
  statGain: number;
  coinCost: number;
  energyCost: number;
  durationSec: number;
}

export const TrainingFacility: React.FC<TrainingFacilityProps> = ({
  playerStats,
  coins,
  cash,
  energy,
  level,
  onStatsUpdated,
  onCoinsDeducted,
  onEnergyUsed,
}) => {
  const [activeDrill, setActiveDrill] = useState<TrainingDrill | null>(null);
  const [drillProgress, setDrillProgress] = useState<number>(0);
  const [drillSuccessBanner, setDrillSuccessBanner] = useState<string | null>(null);

  const drills: TrainingDrill[] = [
    {
      id: 'batting_cage',
      name: 'Batting Cage Precision Drill',
      category: 'contact',
      icon: '🎯',
      desc: 'Rapid machine-pitch target session to widen aiming sweet spot and contact radius.',
      statGain: 2,
      coinCost: 350,
      energyCost: 2,
      durationSec: 4,
    },
    {
      id: 'tire_slam',
      name: 'Heavy Sledge & Core Power Drive',
      category: 'power',
      icon: '💥',
      desc: 'Explosive rotational power workout to boost bat exit velocity and fly-ball distance.',
      statGain: 2,
      coinCost: 450,
      energyCost: 2,
      durationSec: 4,
    },
    {
      id: 'reflex_smash',
      name: 'Reaction Light & Lucky Bounce',
      category: 'luck',
      icon: '🍀',
      desc: 'Sensory training to boost lucky smash hits and accelerate Combo Fever gauge fills.',
      statGain: 2,
      coinCost: 400,
      energyCost: 2,
      durationSec: 4,
    },
    {
      id: 'master_camp',
      name: 'Syntasia All-Star Bootcamp',
      category: 'contact',
      icon: '⭐',
      desc: 'Intensive all-around coaching camp: +2 Contact, +2 Power, +2 Luck simultaneously!',
      statGain: 2,
      coinCost: 1100,
      energyCost: 4,
      durationSec: 6,
    },
  ];

  const handleStartDrill = (drill: TrainingDrill) => {
    if (coins < drill.coinCost || energy < drill.energyCost) return;

    onCoinsDeducted(drill.coinCost);
    onEnergyUsed(drill.energyCost);
    sound.playSwingWhoosh();

    setActiveDrill(drill);
    setDrillProgress(0);

    const stepMs = 100;
    const totalSteps = (drill.durationSec * 1000) / stepMs;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setDrillProgress(Math.min(100, Math.round((step / totalSteps) * 100)));

      if (step >= totalSteps) {
        clearInterval(interval);
        sound.playCheer();
        sound.playCoin();

        // Apply stat upgrades
        if (drill.id === 'master_camp') {
          onStatsUpdated({
            contact: playerStats.contact + 2,
            power: playerStats.power + 2,
            luck: playerStats.luck + 2,
          });
          setDrillSuccessBanner('⭐ Master Bootcamp Complete! +2 Contact, +2 Power, +2 Luck!');
        } else {
          onStatsUpdated({
            ...playerStats,
            [drill.category]: playerStats[drill.category] + drill.statGain,
          });
          setDrillSuccessBanner(
            `🎉 Drill Completed! +${drill.statGain} ${drill.category.toUpperCase()} permanently added!`
          );
        }

        setTimeout(() => {
          setActiveDrill(null);
          setDrillProgress(0);
          setDrillSuccessBanner(null);
        }, 2200);
      }
    }, stepMs);
  };

  return (
    <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl text-white space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>🏋️ Training Facility & Batting Cages</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
              Lv. {level} Facility
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Conduct specialized training drills to permanently raise Contact, Power, and Luck attributes!
          </p>
        </div>
        <div className="flex gap-3 text-sm font-bold">
          <span className="text-amber-400">🪙 {coins.toLocaleString()} Coins</span>
          <span className="text-emerald-400">💵 {cash} Cash</span>
          <span className="text-sky-400 font-mono">⚡ {energy}/15 Energy</span>
        </div>
      </div>

      {/* Current Batter Overview */}
      <div className="grid grid-cols-3 gap-3 bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-lg p-2.5">
          <div className="text-xs text-slate-400 uppercase font-bold">Target Contact</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">🎯 {playerStats.contact}</div>
          <div className="text-[10px] text-slate-400">Expanded Aim Circle & Sweet Spot</div>
        </div>
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-lg p-2.5">
          <div className="text-xs text-slate-400 uppercase font-bold">Raw Power</div>
          <div className="text-2xl font-black text-amber-400 mt-1">💥 {playerStats.power}</div>
          <div className="text-[10px] text-slate-400">Fly-ball Distance & Homeruns</div>
        </div>
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-lg p-2.5">
          <div className="text-xs text-slate-400 uppercase font-bold">Smash Luck</div>
          <div className="text-2xl font-black text-purple-400 mt-1">🍀 {playerStats.luck}</div>
          <div className="text-[10px] text-slate-400">Combo Fever Bonus Rate</div>
        </div>
      </div>

      {/* Active Drill In-Progress Banner */}
      {activeDrill && (
        <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-2 border-sky-400 p-5 rounded-2xl text-center shadow-2xl animate-pulse space-y-3">
          <div className="text-sm font-black text-sky-300 uppercase tracking-wider flex items-center justify-center gap-2">
            <span>{activeDrill.icon}</span>
            <span>Training In Progress: {activeDrill.name}</span>
          </div>
          <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-sky-500/50 p-0.5">
            <div
              className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full transition-all duration-100 shadow-lg"
              style={{ width: `${drillProgress}%` }}
            />
          </div>
          <div className="text-xs font-mono font-bold text-slate-300">
            {drillProgress}% Complete • Refining mechanics...
          </div>
        </div>
      )}

      {/* Success Notification */}
      {drillSuccessBanner && (
        <div className="bg-emerald-950/90 border-2 border-emerald-400 p-4 rounded-xl text-center text-sm font-black text-emerald-300 shadow-2xl animate-bounce">
          {drillSuccessBanner}
        </div>
      )}

      {/* Available Training Drills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drills.map((drill) => {
          const canAfford = coins >= drill.coinCost && energy >= drill.energyCost;
          const isTraining = activeDrill !== null;

          return (
            <div
              key={drill.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                drill.id === 'master_camp'
                  ? 'bg-gradient-to-b from-amber-950/40 via-purple-950/30 to-slate-900 border-amber-500/70 shadow-amber-500/10'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-black text-white flex items-center gap-2">
                    <span className="text-xl">{drill.icon}</span>
                    <span>{drill.name}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded">
                    +{drill.statGain} {drill.id === 'master_camp' ? 'ALL' : drill.category.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{drill.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-amber-400 font-bold">🪙 {drill.coinCost}</span>
                  <span className="text-emerald-400 font-bold">⚡ {drill.energyCost} Energy</span>
                  <span className="text-slate-400 font-bold">⏱️ {drill.durationSec}s</span>
                </div>

                <button
                  disabled={!canAfford || isTraining}
                  onClick={() => handleStartDrill(drill)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-transform cursor-pointer ${
                    canAfford && !isTraining
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 text-white active:scale-95 shadow-md'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isTraining ? 'Training...' : 'Begin Drill'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
