import React from 'react';
import type { DailyQuest } from '../types/game';
import { sound } from '../utils/audio';

interface QuestsModalProps {
  quests: DailyQuest[];
  onClaimQuest: (questId: string) => void;
  onClose: () => void;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  quests,
  onClaimQuest,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border-2 border-slate-700 max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 text-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <h3 className="text-lg font-black uppercase text-amber-400">Daily Quests & Challenges</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-sm px-2 py-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          {quests.map((q) => {
            const isReady = q.current >= q.goal && !q.completed;
            const pct = Math.min(100, (q.current / q.goal) * 100);

            return (
              <div
                key={q.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  q.completed
                    ? 'bg-slate-900/60 border-slate-800 opacity-60'
                    : isReady
                    ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                    : 'bg-slate-800/80 border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="font-bold text-sm text-slate-100">{q.title}</div>
                  <span className="text-xs font-black text-amber-400">🪙 +{q.rewardCoins}</span>
                </div>

                <div className="flex items-center gap-2 my-1.5">
                  <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-400">{q.current}/{q.goal}</span>
                </div>

                <div className="flex justify-end pt-1">
                  {q.completed ? (
                    <span className="text-xs text-emerald-400 font-bold">✓ Claimed</span>
                  ) : isReady ? (
                    <button
                      onClick={() => {
                        sound.playCoin();
                        onClaimQuest(q.id);
                      }}
                      className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-1 rounded-lg cursor-pointer shadow active:scale-95 transition-transform"
                    >
                      Claim Reward
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">In Progress</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
