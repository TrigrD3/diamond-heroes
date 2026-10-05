import { useState, useEffect } from 'react';
import type {
  PlayerStats,
  PlayerGear,
  BatterCard,
  OpponentTeam,
  MatchScoreboard,
  HitOutcome,
  StadiumUpgrade,
  SeasonStandings,
  DailyQuest
} from './types/game';
import {
  INITIAL_PLAYER_STATS,
  INITIAL_GEAR,
  INITIAL_CARDS,
  INITIAL_STADIUM,
  INITIAL_SEASON,
  INITIAL_QUESTS,
  LEAGUE_OPPONENTS,
  SHOP_ITEMS,
  CARD_PACK_POOL
} from './data/gameData';
import { Scoreboard } from './components/Scoreboard';
import { BattingField } from './components/BattingField';
import { PlayerCard } from './components/PlayerCard';
import { ProShop } from './components/ProShop';
import { CardsManager } from './components/CardsManager';
import { StadiumManager } from './components/StadiumManager';
import { LeagueHub } from './components/LeagueHub';
import { QuestsModal } from './components/QuestsModal';
import { sound } from './utils/audio';

type ActiveTab = 'MATCH' | 'CARDS' | 'PLAYER' | 'SHOP' | 'STADIUM' | 'LEAGUE';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('MATCH');

  // Authentic Syntasia Facebook Currencies & Energy (15 max, 5 per match)
  const [energy, setEnergy] = useState<number>(15);
  const [coins, setCoins] = useState<number>(1500);
  const [cash, setCash] = useState<number>(20);
  const [level, setLevel] = useState<number>(1);
  const [exp, setExp] = useState<number>(40);
  const [maxExp, setMaxExp] = useState<number>(100);
  const [statPoints, setStatPoints] = useState<number>(3);
  const [unlockedTierIndex, setUnlockedTierIndex] = useState<number>(0);

  // 30-Game Season State
  const [season, setSeason] = useState<SeasonStandings>(INITIAL_SEASON);
  const [quests, setQuests] = useState<DailyQuest[]>(INITIAL_QUESTS);
  const [showQuestsModal, setShowQuestsModal] = useState<boolean>(false);

  // Player RPG stats & Gear
  const [playerStats, setPlayerStats] = useState<PlayerStats>(INITIAL_PLAYER_STATS);
  const [playerGear, setPlayerGear] = useState<PlayerGear>(INITIAL_GEAR);

  // Special Batter Cards deck & Stadium
  const [cards, setCards] = useState<BatterCard[]>(INITIAL_CARDS);
  const [stadium, setStadium] = useState<StadiumUpgrade>(INITIAL_STADIUM);

  // Opponent & Match state
  const [currentOpponent, setCurrentOpponent] = useState<OpponentTeam>(LEAGUE_OPPONENTS[0]);

  // COMBO FEVER GAUGE (0 - 100%)
  const [comboGauge, setComboGauge] = useState<number>(35);
  const [isAutoHomeRunReady, setIsAutoHomeRunReady] = useState<boolean>(false);

  const [scoreboard, setScoreboard] = useState<MatchScoreboard>({
    inning: 1,
    isTop: false,
    playerScore: 0,
    opponentScore: 0,
    balls: 0,
    strikes: 0,
    outs: 0,
    bases: [false, false, false],
    totalInnings: 3,
    currentBatterOrder: 1,
  });

  const [matchHistory, setMatchHistory] = useState<string[]>([
    'Play Ball! Move your cursor to the Aiming Circle and swing with precision!'
  ]);
  const [matchEndResult, setMatchEndResult] = useState<{
    won: boolean;
    coinsWon: number;
    expWon: number;
    seasonSummary: string;
  } | null>(null);

  // Energy timer refill (1 energy point every 45 seconds up to 15)
  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prev) => (prev < 15 ? prev + 1 : prev));
    }, 45000);
    return () => clearInterval(timer);
  }, []);

  // Update combo home run ready flag
  useEffect(() => {
    if (comboGauge >= 100) {
      setIsAutoHomeRunReady(true);
    } else {
      setIsAutoHomeRunReady(false);
    }
  }, [comboGauge]);

  // Upgrade player stat
  const handleUpgradeStat = (statKey: keyof PlayerStats) => {
    if (statPoints <= 0) return;
    setStatPoints((pts) => pts - 1);
    setPlayerStats((prev) => ({
      ...prev,
      [statKey]: prev[statKey] + 1,
    }));
  };

  // Buy Shop Gear
  const handleBuyItem = (category: 'bats' | 'gloves' | 'helmet' | 'goggles', id: string, costCoins: number) => {
    if (coins < costCoins) return;
    setCoins((c) => c - costCoins);
    if (category === 'bats') {
      const item = SHOP_ITEMS.bats.find((b) => b.id === id);
      if (item) setPlayerGear((g) => ({ ...g, bat: { ...item, costCash: 0, owned: true } }));
    } else if (category === 'gloves') {
      const item = SHOP_ITEMS.gloves.find((gl) => gl.id === id);
      if (item) setPlayerGear((g) => ({ ...g, gloves: { ...item, costCash: 0, owned: true } }));
    } else if (category === 'helmet') {
      const item = SHOP_ITEMS.helmet.find((h) => h.id === id);
      if (item) setPlayerGear((g) => ({ ...g, helmet: { ...item, costCash: 0, owned: true } }));
    } else if (category === 'goggles') {
      const item = SHOP_ITEMS.goggles.find((go) => go.id === id);
      if (item) setPlayerGear((g) => ({ ...g, goggles: { ...item, costCash: 0, owned: true } }));
    }
  };

  // Open Batter Card Pack
  const handleOpenPack = (type: 'Standard' | 'Elite') => {
    const cost = type === 'Standard' ? 600 : 1800;
    if (coins < cost) return;
    setCoins((c) => c - cost);

    const pool = type === 'Elite'
      ? CARD_PACK_POOL.filter((c) => c.grade === 'Hero' || c.grade === 'Elite')
      : CARD_PACK_POOL;
    const drawn = pool[Math.floor(Math.random() * pool.length)];

    setCards((prev) => {
      const updated = [...prev];
      if (updated.length >= 5) {
        updated[updated.length - 1] = drawn;
      } else {
        updated.push(drawn);
      }
      return updated;
    });
  };

  // Upgrade Stadium
  const handleUpgradeStadium = (nextLevel: StadiumUpgrade) => {
    if (coins < nextLevel.upgradeCost) return;
    setCoins((c) => c - nextLevel.upgradeCost);
    setStadium(nextLevel);
  };

  // Claim Daily Quest
  const handleClaimQuest = (questId: string) => {
    const q = quests.find((quest) => quest.id === questId);
    if (!q || q.completed) return;
    setCoins((c) => c + q.rewardCoins);
    setQuests((prev) =>
      prev.map((item) => (item.id === questId ? { ...item, completed: true } : item))
    );
  };

  // Start new match (Costs 5 Energy)
  const startNewMatch = (opp?: OpponentTeam) => {
    if (energy < 5) {
      alert('Out of Energy! Matches require 5 Energy. Refills over time or instantly with 5 Cash.');
      return;
    }

    setEnergy((e) => e - 5);
    const oppToUse = opp || currentOpponent;
    setCurrentOpponent(oppToUse);

    const initialOppRuns = Math.floor(Math.random() * (oppToUse.difficulty + 1));
    setScoreboard({
      inning: 1,
      isTop: false,
      playerScore: 0,
      opponentScore: initialOppRuns,
      balls: 0,
      strikes: 0,
      outs: 0,
      bases: [false, false, false],
      totalInnings: 3,
      currentBatterOrder: 1,
    });
    setMatchHistory([`Match started vs ${oppToUse.name}! Pitcher: ${oppToUse.pitcherName}`]);
    setMatchEndResult(null);
    setActiveTab('MATCH');
  };

  // Refill Energy with Cash
  const handleRefillEnergy = () => {
    if (cash < 5) return;
    sound.playCoin();
    setCash((c) => c - 5);
    setEnergy(15);
  };

  // Handle Batter Rotation
  const handleBatterChanged = (newOrder: number) => {
    setScoreboard((prev) => ({ ...prev, currentBatterOrder: newOrder }));
  };

  // Handle Inning Event
  const handleInningEvent = (
    outcome: HitOutcome,
    runsScored: number,
    hitDesc: string,
    comboPointsEarned: number
  ) => {
    setMatchHistory((prev) => [hitDesc, ...prev.slice(0, 7)]);

    // Quest tracking
    if (outcome === 'Home Run') {
      setQuests((prev) =>
        prev.map((q) => (q.id === 'q1' ? { ...q, current: Math.min(q.goal, q.current + 1) } : q))
      );
    }
    if (comboGauge + comboPointsEarned >= 100) {
      setQuests((prev) =>
        prev.map((q) => (q.id === 'q2' ? { ...q, current: Math.min(q.goal, q.current + 1) } : q))
      );
    }

    // Update COMBO GAUGE
    if (isAutoHomeRunReady && outcome === 'Home Run') {
      setComboGauge(0);
    } else {
      setComboGauge((g) => Math.min(100, g + comboPointsEarned));
    }

    setScoreboard((prev) => {
      let { balls, strikes, outs, bases, playerScore, opponentScore, inning, totalInnings } = prev;

      if (outcome === 'Ball') {
        balls += 1;
        if (balls >= 4) {
          balls = 0;
          strikes = 0;
          if (bases[0] && bases[1] && bases[2]) playerScore += 1;
          else if (bases[0] && bases[1]) bases = [true, true, true];
          else if (bases[0]) bases = [true, true, false];
          else bases = [true, false, false];
        }
      } else if (outcome === 'Strike') {
        strikes += 1;
        if (strikes >= 3) {
          outs += 1;
          strikes = 0;
          balls = 0;
        }
      } else if (outcome === 'Foul') {
        if (strikes < 2) strikes += 1;
      } else if (outcome === 'Out') {
        outs += 1;
        strikes = 0;
        balls = 0;
      } else {
        balls = 0;
        strikes = 0;
        playerScore += runsScored;

        if (outcome === 'Home Run') bases = [false, false, false];
        else if (outcome === 'Triple') bases = [false, false, true];
        else if (outcome === 'Double') bases = [false, true, false];
        else if (outcome === 'Single') bases = [true, bases[0], bases[1]];
      }

      if (outs >= 3) {
        outs = 0;
        bases = [false, false, false];
        opponentScore += Math.random() < 0.35 ? 1 : 0;

        if (inning < totalInnings) {
          inning += 1;
        } else {
          const playerWon = playerScore >= opponentScore;
          setTimeout(() => handleMatchFinished(playerWon), 600);
        }
      }

      return {
        ...prev,
        balls,
        strikes,
        outs,
        bases,
        playerScore,
        opponentScore,
        inning,
      };
    });
  };

  // Match Result & 30-Game Season Progression
  const handleMatchFinished = (playerWon: boolean) => {
    const stadiumMult = stadium.bonusCoinMultiplier;
    const baseCoins = playerWon ? currentOpponent.rewardCoins : Math.round(currentOpponent.rewardCoins * 0.3);
    const coinsWon = Math.round(baseCoins * stadiumMult);
    const expWon = playerWon ? currentOpponent.rewardExp : Math.round(currentOpponent.rewardExp * 0.3);

    setCoins((c) => c + coinsWon);

    setExp((prevExp) => {
      let newExp = prevExp + expWon;
      if (newExp >= maxExp) {
        newExp -= maxExp;
        setLevel((l) => l + 1);
        setMaxExp((m) => Math.round(m * 1.3));
        setStatPoints((pts) => pts + 2);
        setCash((cashVal) => cashVal + 2);
      }
      return newExp;
    });

    // Advance 30-Game Season record
    let seasonSummaryText = '';
    setSeason((prevSeason) => {
      const newWins = playerWon ? prevSeason.wins + 1 : prevSeason.wins;
      const newLosses = !playerWon ? prevSeason.losses + 1 : prevSeason.losses;
      let newGameNum = prevSeason.gameNumber + 1;
      let newSeasonNum = prevSeason.seasonNumber;
      let isPlayoffs = prevSeason.isPlayoffs;

      // Calculate dynamic rank out of 8 teams
      const winRate = newWins / Math.max(1, newWins + newLosses);
      const calculatedRank = Math.max(1, Math.min(8, 8 - Math.round(winRate * 7)));

      if (newGameNum > 30) {
        // Season concluded! Check if qualified for playoffs (Top 4)
        if (calculatedRank <= 4) {
          isPlayoffs = true;
          seasonSummaryText = `🎉 CONGRATULATIONS! You finished Season #${newSeasonNum} at Rank #${calculatedRank} and qualified for the PLAYOFFS!`;
        } else {
          seasonSummaryText = `Season #${newSeasonNum} concluded at Rank #${calculatedRank}. Preparing Season #${newSeasonNum + 1}!`;
          newSeasonNum += 1;
          newGameNum = 1;
          isPlayoffs = false;
        }
      } else {
        seasonSummaryText = `Season #${newSeasonNum} Record: ${newWins}W - ${newLosses}L (Rank #${calculatedRank})`;
      }

      return {
        ...prevSeason,
        seasonNumber: newSeasonNum,
        gameNumber: newGameNum,
        wins: newWins,
        losses: newLosses,
        rank: calculatedRank,
        isPlayoffs,
      };
    });

    // Quest update
    if (playerWon) {
      setQuests((prev) =>
        prev.map((q) => (q.id === 'q3' ? { ...q, current: Math.min(q.goal, q.current + 1) } : q))
      );
    }

    const currentTierIdx = LEAGUE_OPPONENTS.findIndex((o) => o.id === currentOpponent.id);
    if (playerWon && currentTierIdx === unlockedTierIndex && unlockedTierIndex < LEAGUE_OPPONENTS.length - 1) {
      setUnlockedTierIndex((idx) => idx + 1);
    }

    setMatchEndResult({ won: playerWon, coinsWon, expWon, seasonSummary: seasonSummaryText });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Syntasia Facebook Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 font-black">
              ⚾
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>DIAMOND HEROES</span>
                <span className="text-[10px] bg-red-600 font-extrabold text-white px-1.5 py-0.5 rounded tracking-wide uppercase">
                  Facebook Classic
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Syntasia Baseball Heroes 2012 Recreation</p>
            </div>
          </div>

          {/* Authentic HUD Bar */}
          <div className="flex items-center flex-wrap gap-2.5 text-xs">
            {/* Energy Meter (Cost: 5 per match) */}
            <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
              <span className="text-amber-400 font-bold">⚡ ENERGY</span>
              <div className="w-20 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(energy / 15) * 100}%` }}
                />
              </div>
              <span className="font-mono font-bold text-white">{energy}/15</span>
              {energy < 15 && (
                <button
                  onClick={handleRefillEnergy}
                  className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded transition-transform active:scale-95 cursor-pointer"
                  title="Refill with 5 Cash"
                >
                  +Refill (5💵)
                </button>
              )}
            </div>

            {/* Coins */}
            <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold shadow-sm">
              <span className="text-amber-400">🪙</span>
              <span className="font-mono">{coins}</span>
            </div>

            {/* Cash */}
            <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold shadow-sm">
              <span className="text-emerald-400">💵</span>
              <span className="font-mono">{cash}</span>
            </div>

            {/* Level */}
            <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold shadow-sm">
              <span className="text-sky-400">LVL</span>
              <span className="font-mono">{level}</span>
            </div>

            {/* Quests button */}
            <button
              onClick={() => setShowQuestsModal(true)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            >
              📜 Quests
              {quests.some((q) => q.current >= q.goal && !q.completed) && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>

            {statPoints > 0 && (
              <button
                onClick={() => setActiveTab('PLAYER')}
                className="bg-amber-500 text-slate-950 font-black px-2.5 py-1.5 rounded-xl animate-bounce flex items-center gap-1 shadow-md cursor-pointer"
              >
                ⭐ +{statPoints} SKILL PTS
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1 sm:gap-2 overflow-x-auto pb-2 pt-1 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('MATCH')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'MATCH'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ⚾ Batting Duel
          </button>
          <button
            onClick={() => setActiveTab('CARDS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'CARDS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🃏 Batter Cards (Draft)
          </button>
          <button
            onClick={() => setActiveTab('PLAYER')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'PLAYER'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ⭐ My Slugger {statPoints > 0 && '•'}
          </button>
          <button
            onClick={() => setActiveTab('SHOP')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'SHOP'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🏪 Pro Shop
          </button>
          <button
            onClick={() => setActiveTab('STADIUM')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'STADIUM'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🏟️ Stadium
          </button>
          <button
            onClick={() => setActiveTab('LEAGUE')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'LEAGUE'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🏆 Leagues
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex flex-col justify-center">
        {activeTab === 'MATCH' && (
          <div className="space-y-4">
            <Scoreboard
              scoreboard={scoreboard}
              season={season}
              playerName="You & Heroes"
              opponentName={currentOpponent.name}
            />

            <BattingField
              opponent={currentOpponent}
              playerStats={playerStats}
              playerGear={playerGear}
              activeCards={cards}
              scoreboard={scoreboard}
              comboGauge={comboGauge}
              isAutoHomeRunReady={isAutoHomeRunReady}
              onInningEvent={handleInningEvent}
              onBatterChanged={handleBatterChanged}
            />

            <div className="max-w-4xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-bold text-amber-400 shrink-0">📢 Announcer:</span>
                <span className="text-slate-300 truncate font-mono">
                  {matchHistory[0]}
                </span>
              </div>
              <button
                onClick={() => startNewMatch()}
                className="text-[11px] text-slate-400 hover:text-white underline shrink-0 ml-2 cursor-pointer"
              >
                Restart (5⚡)
              </button>
            </div>
          </div>
        )}

        {activeTab === 'CARDS' && (
          <div className="max-w-4xl mx-auto w-full">
            <CardsManager
              cards={cards}
              coins={coins}
              cash={cash}
              onOpenPack={handleOpenPack}
              onSwapCardPosition={() => {}}
            />
          </div>
        )}

        {activeTab === 'PLAYER' && (
          <div className="max-w-4xl mx-auto w-full">
            <PlayerCard
              stats={playerStats}
              coins={coins}
              level={level}
              exp={exp}
              maxExp={maxExp}
              statPoints={statPoints}
              onUpgradeStat={handleUpgradeStat}
            />
          </div>
        )}

        {activeTab === 'SHOP' && (
          <div className="max-w-4xl mx-auto w-full">
            <ProShop
              coins={coins}
              currentGear={playerGear}
              onEquipBat={(bat) => setPlayerGear((g) => ({ ...g, bat: { ...bat, costCash: 0 } }))}
              onEquipGloves={(gloves) => setPlayerGear((g) => ({ ...g, gloves: { ...gloves, costCash: 0 } }))}
              onEquipHelmet={(helmet) => setPlayerGear((g) => ({ ...g, helmet: { ...helmet, costCash: 0 } }))}
              onEquipGoggles={(goggles) => setPlayerGear((g) => ({ ...g, goggles: { ...goggles, costCash: 0 } }))}
              onBuyItem={handleBuyItem}
            />
          </div>
        )}

        {activeTab === 'STADIUM' && (
          <div className="max-w-4xl mx-auto w-full">
            <StadiumManager
              currentStadium={stadium}
              coins={coins}
              onUpgradeStadium={handleUpgradeStadium}
            />
          </div>
        )}

        {activeTab === 'LEAGUE' && (
          <div className="max-w-4xl mx-auto w-full">
            <LeagueHub
              currentOpponent={currentOpponent}
              unlockedTierIndex={unlockedTierIndex}
              onSelectOpponent={(opp) => setCurrentOpponent(opp)}
              onStartMatch={() => startNewMatch(currentOpponent)}
            />
          </div>
        )}
      </main>

      {/* Match Conclusion Modal */}
      {matchEndResult && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border-2 border-slate-700 max-w-md w-full rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="text-5xl">{matchEndResult.won ? '🏆' : '⚾'}</div>
            <h3 className={`text-2xl font-black uppercase ${matchEndResult.won ? 'text-amber-400' : 'text-slate-300'}`}>
              {matchEndResult.won ? 'VICTORY!' : 'GAME OVER'}
            </h3>
            <p className="text-sm text-slate-300">
              {matchEndResult.won
                ? `You crushed ${currentOpponent.name} and collected stadium bonuses!`
                : `A tough duel against ${currentOpponent.name}. Upgrade your batter cards and strike back!`}
            </p>

            <div className="text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-amber-300 font-bold">
              {matchEndResult.seasonSummary}
            </div>

            <div className="bg-slate-800 rounded-xl p-3 flex justify-around text-sm font-bold border border-slate-700">
              <div>
                <div className="text-xs text-slate-400">Coins Earned</div>
                <div className="text-amber-400 text-lg">+{matchEndResult.coinsWon} 🪙</div>
              </div>
              <div className="border-r border-slate-700" />
              <div>
                <div className="text-xs text-slate-400">EXP Gained</div>
                <div className="text-indigo-400 text-lg">+{matchEndResult.expWon} ⭐</div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => startNewMatch()}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Next Game (5⚡)
              </button>
              <button
                onClick={() => {
                  setMatchEndResult(null);
                  setActiveTab('LEAGUE');
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-sm transition-all border border-slate-700 cursor-pointer"
              >
                League Standings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Quests Modal */}
      {showQuestsModal && (
        <QuestsModal
          quests={quests}
          onClaimQuest={handleClaimQuest}
          onClose={() => setShowQuestsModal(false)}
        />
      )}
    </div>
  );
}

export default App;
