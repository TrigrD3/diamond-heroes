import React, { useState } from 'react';
import type { PlayerGear } from '../types/game';
import { SHOP_ITEMS } from '../data/gameData';
import { sound } from '../utils/audio';

interface ProShopProps {
  coins: number;
  currentGear: PlayerGear;
  onEquipBat: (bat: PlayerGear['bat']) => void;
  onEquipGloves: (gloves: PlayerGear['gloves']) => void;
  onEquipCleats: (cleats: PlayerGear['cleats']) => void;
  onBuyItem: (category: 'bats' | 'gloves' | 'cleats', id: string, cost: number) => void;
}

export const ProShop: React.FC<ProShopProps> = ({
  coins,
  currentGear,
  onEquipBat,
  onEquipGloves,
  onEquipCleats,
  onBuyItem,
}) => {
  const [activeTab, setActiveTab] = useState<'bats' | 'gloves' | 'cleats'>('bats');

  return (
    <div className="bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-6 shadow-xl text-white">
      {/* Shop Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>🏪 Clubhouse Pro Shop</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Upgrade your bats, gloves, and cleats for attribute bonuses</p>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase font-bold text-slate-400 block">Funds</span>
          <span className="text-xl font-black text-amber-400">🪙 {coins}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mt-4 border-b border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('bats')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'bats' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🪵 Bats
        </button>
        <button
          onClick={() => setActiveTab('gloves')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'gloves' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          🧤 Batting Gloves
        </button>
        <button
          onClick={() => setActiveTab('cleats')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'cleats' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          👟 Cleats
        </button>
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {SHOP_ITEMS[activeTab].map((item) => {
          const isEquipped =
            activeTab === 'bats'
              ? currentGear.bat.id === item.id
              : activeTab === 'gloves'
              ? currentGear.gloves.id === item.id
              : currentGear.cleats.id === item.id;

          const isOwned = item.costCoins === 0 || item.owned;
          const canAfford = coins >= item.costCoins;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isEquipped
                  ? 'bg-amber-950/30 border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-800/80 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1.5 bg-slate-900 rounded-lg border border-slate-700">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{item.name}</h4>
                      {isEquipped && (
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase">
                          EQUIPPED
                        </span>
                      )}
                    </div>
                  </div>
                  {!isOwned && (
                    <span className="text-sm font-extrabold text-amber-400">🪙 {item.costCoins}</span>
                  )}
                </div>

                {/* Attribute Buff Tags */}
                <div className="flex flex-wrap gap-1.5 my-2">
                  {'powerBonus' in item && (
                    <span className="text-xs bg-amber-950/60 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded font-semibold">
                      +{item.powerBonus} Power
                    </span>
                  )}
                  {'contactBonus' in item && (
                    <span className="text-xs bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded font-semibold">
                      +{item.contactBonus} Contact
                    </span>
                  )}
                  {'luckBonus' in item && (
                    <span className="text-xs bg-purple-950/60 text-purple-300 border border-purple-800/60 px-2 py-0.5 rounded font-semibold">
                      +{item.luckBonus} Luck
                    </span>
                  )}
                  {'speedBonus' in item && (
                    <span className="text-xs bg-sky-950/60 text-sky-300 border border-sky-800/60 px-2 py-0.5 rounded font-semibold">
                      +{item.speedBonus} Speed
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 pt-2 border-t border-slate-700/60 flex justify-end">
                {isEquipped ? (
                  <span className="text-xs text-amber-400 font-bold py-1">In Use</span>
                ) : isOwned ? (
                  <button
                    onClick={() => {
                      sound.playCoin();
                      if (activeTab === 'bats') onEquipBat(item as any);
                      if (activeTab === 'gloves') onEquipGloves(item as any);
                      if (activeTab === 'cleats') onEquipCleats(item as any);
                    }}
                    className="text-xs bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                  >
                    Equip
                  </button>
                ) : (
                  <button
                    disabled={!canAfford}
                    onClick={() => {
                      if (canAfford) {
                        sound.playCoin();
                        onBuyItem(activeTab, item.id, item.costCoins);
                      }
                    }}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-transform ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Purchase' : 'Need Coins'}
                  </button>
                )}
              </div>
            </div>
          );

        })}
      </div>
    </div>
  );
};
