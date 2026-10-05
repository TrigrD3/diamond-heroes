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
  CARD_PACK_POOL,
  INITIAL_HOME_LINEUP,
  INITIAL_AWAY_LINEUP
} from './data/gameData';
import { BattingField } from './components/BattingField';
import { MatchSimulationView } from './components/MatchSimulationView';
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

  // Match View Mode: 'SIMULATION' (lineup card & teammate simulation) or 'BAT' (player 3D duel)
  const [matchMode, setMatchMode] = useState<'SIMULATION' | 'BAT'>('SIMULATION');
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [simBatterIdx, setSimBatterIdx] = useState<number>(0);
  const [simBanner, setSimBanner] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState<number>(7067);

  // Lineups
  const [homeLineup] = useState(INITIAL_HOME_LINEUP);
  const [awayLineup] = useState(INITIAL_AWAY_LINEUP);

  // Authentic Syntasia Facebook Currencies & Energy (15 max, 5 per match)
  const [energy, setEnergy] = useState<number>(15);
  const [coins, setCoins] = useState<number>(6784);
  const [cash, setCash] = useState<number>(0);
  const [level, setLevel] = useState<number>(3);
  const [exp, setExp] = useState<number>(508);
  const [maxExp, setMaxExp] = useState<number>(850);
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
    isTop: true,
    playerScore: 0,
    opponentScore: 0,
    balls: 0,
    strikes: 0,
    outs: 0,
    bases: [false, false, false],
    totalInnings: 3,
    currentBatterOrder: 1,
    inningScores: {
      home: [0, 0, 0],
      away: [0, 0, 0],
      homeHits: 1,
      awayHits: 1,
    },
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

    setScoreboard({
      inning: 1,
      isTop: true, // Away team bats first
      playerScore: 0,
      opponentScore: 0,
      balls: 0,
      strikes: 0,
      outs: 0,
      bases: [false, false, false],
      totalInnings: 3,
      currentBatterOrder: 1,
      inningScores: {
        home: [0, 0, 0],
        away: [0, 0, 0],
        homeHits: 0,
        awayHits: 0,
      },
    });
    setMatchScore(4050);
    setSimBatterIdx(0);
    setSimBanner(null);
    setMatchMode('SIMULATION');
    setMatchHistory([`Match started: Texas vs ${oppToUse.name}!`]);
    setMatchEndResult(null);
    setActiveTab('MATCH');
  };

  // Teammate & Opponent At-Bat Simulator Effect
  useEffect(() => {
    if (activeTab !== 'MATCH' || matchMode !== 'SIMULATION' || matchEndResult) return;

    const delay = Math.max(400, Math.round(1800 / gameSpeed));
    const timer = setTimeout(() => {
      setScoreboard((prev) => {
        const isTop = prev.isTop;
        const currentLineup = isTop ? awayLineup : homeLineup;
        const batter = currentLineup[simBatterIdx % 9];

        // Check if it is the USER batter's turn (Home order #3, Andy)
        if (!isTop && batter.isPlayerUser) {
          // Switch to 3D batting duel!
          sound.playCheer();
          setMatchMode('BAT');
          return {
            ...prev,
            currentBatterOrder: batter.order,
          };
        }

        // Simulate At-Bat outcome for AI / teammate
        const outcomes = ['FLY OUT', 'GROUND OUT', 'STRIKE OUT', 'SINGLE', 'DOUBLE', 'WALK'];
        const weights = [0.3, 0.28, 0.16, 0.16, 0.06, 0.04];
        let roll = Math.random();
        let chosen = 'FLY OUT';
        let cum = 0;
        for (let i = 0; i < outcomes.length; i++) {
          cum += weights[i];
          if (roll <= cum) {
            chosen = outcomes[i];
            break;
          }
        }

        setSimBanner(chosen);
        setTimeout(() => setSimBanner(null), delay * 0.75);

        let { outs, bases, playerScore, opponentScore, inningScores, inning, totalInnings } = prev;
        const innIdx = Math.max(0, inning - 1);

        if (chosen.includes('OUT')) {
          outs += 1;
        } else if (chosen === 'SINGLE') {
          if (bases[2]) {
            if (isTop) opponentScore += 1;
            else playerScore += 1;
          }
          bases = [true, bases[0], bases[1]];
          if (isTop) inningScores.awayHits += 1;
          else inningScores.homeHits += 1;
        } else if (chosen === 'DOUBLE') {
          const runs = (bases[1] ? 1 : 0) + (bases[2] ? 1 : 0);
          if (isTop) opponentScore += runs;
          else playerScore += runs;
          bases = [false, true, bases[0]];
          if (isTop) inningScores.awayHits += 1;
          else inningScores.homeHits += 1;
        }

        // Update Inning Scores
        const updatedHomeScores = [...inningScores.home];
        const updatedAwayScores = [...inningScores.away];
        if (isTop) updatedAwayScores[innIdx] = opponentScore;
        else updatedHomeScores[innIdx] = playerScore;

        let nextTop = isTop;
        let nextInning = inning;
        let nextBatterIdx = simBatterIdx + 1;

        if (outs >= 3) {
          outs = 0;
          bases = [false, false, false];
          if (isTop) {
            // Half-inning switch: Now Home team bats
            nextTop = false;
            nextBatterIdx = 0;
          } else {
            // Full Inning ended: Move to next inning
            if (inning < totalInnings) {
              nextInning += 1;
              nextTop = true;
              nextBatterIdx = 0;
            } else {
              // Game over!
              const won = playerScore >= opponentScore;
              setTimeout(() => handleMatchFinished(won), 500);
            }
          }
        }

        setSimBatterIdx(nextBatterIdx);
        setMatchScore((s) => s + (chosen.includes('OUT') ? 20 : 150));

        return {
          ...prev,
          outs,
          bases,
          playerScore,
          opponentScore,
          isTop: nextTop,
          inning: nextInning,
          currentBatterOrder: currentLineup[nextBatterIdx % 9].order,
          inningScores: {
            ...inningScores,
            home: updatedHomeScores,
            away: updatedAwayScores,
          },
        };
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [activeTab, matchMode, simBatterIdx, gameSpeed, awayLineup, homeLineup, matchEndResult]);

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

    setMatchScore((s) => s + (outcome === 'Home Run' ? 3000 : outcome === 'Triple' ? 1800 : outcome === 'Double' ? 1200 : outcome === 'Single' ? 700 : 50));

    // When player at-bat ends (not a non-strikeout strike or foul), transition back to simulation view after 2.5s
    const isAtBatFinished = outcome === 'Home Run' || outcome === 'Triple' || outcome === 'Double' || outcome === 'Single' || outcome === 'Out' || (outcome === 'Strike' && scoreboard.strikes >= 2) || (outcome === 'Ball' && scoreboard.balls >= 3);

    if (isAtBatFinished) {
      setTimeout(() => {
        setMatchMode('SIMULATION');
        setSimBatterIdx((idx) => idx + 1);
      }, 2400);
    }

    setScoreboard((prev) => {
      let { balls, strikes, outs, bases, playerScore, opponentScore, inning, totalInnings, inningScores } = prev;
      const innIdx = Math.max(0, inning - 1);

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

        inningScores.homeHits += 1;
      }

      const updatedHomeScores = [...inningScores.home];
      updatedHomeScores[innIdx] = playerScore;

      let nextTop = prev.isTop;
      let nextInning = inning;

      if (outs >= 3) {
        outs = 0;
        bases = [false, false, false];
        if (inning < totalInnings) {
          nextInning += 1;
          nextTop = true;
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
        inning: nextInning,
        isTop: nextTop,
        inningScores: {
          ...inningScores,
          home: updatedHomeScores,
        },
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
          <div className="flex items-center flex-wrap gap-3 text-xs">
            {/* Rookie Tier Badge + Level Star & EXP Bar */}
            <div className="flex items-center gap-2 bg-[#181a20]/90 border border-[#374151] px-2.5 py-1 rounded-xl shadow-md">
              <img src="/assets/images/ui/hud_rookie.png" alt="Rookie" className="h-7 w-auto object-contain" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-black text-amber-300">★ Lv. {level}</span>
                  <span className="text-[10px] font-mono text-slate-300">({exp}/{maxExp})</span>
                </div>
                <div className="w-20 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-700 mt-0.5">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (exp / maxExp) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Energy Meter (Cost: 5 per match) */}
            <div className="bg-[#181a20]/90 border border-[#374151] px-2.5 py-1 rounded-xl flex items-center gap-2 shadow-sm">
              <span className="text-emerald-400 font-black">⚡ {energy}/15</span>
              <div className="w-16 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(energy / 15) * 100}%` }}
                />
              </div>
              <button
                onClick={handleRefillEnergy}
                className="text-[9px] bg-[#16a34a] hover:bg-[#15803d] text-white font-black px-1.5 py-0.5 rounded transition-transform active:scale-95 cursor-pointer shadow"
                title="Refill with 5 Cash"
              >
                +ADD
              </button>
            </div>

            {/* Coins */}
            <div className="bg-[#181a20]/90 border border-[#374151] px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-bold shadow-sm">
              <span className="text-amber-400 font-black">🪙 {coins.toLocaleString()}</span>
              <button
                onClick={() => setCoins((c) => c + 1000)}
                className="text-[9px] bg-amber-600 hover:bg-amber-500 text-white font-black px-1.5 py-0.5 rounded cursor-pointer"
              >
                +ADD
              </button>
            </div>

            {/* Cash */}
            <div className="bg-[#181a20]/90 border border-[#374151] px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-bold shadow-sm">
              <span className="text-emerald-400 font-black">💵 {cash}</span>
              <button
                onClick={() => setCash((c) => c + 10)}
                className="text-[9px] bg-emerald-700 hover:bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded cursor-pointer"
              >
                +ADD
              </button>
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
          <div className="flex flex-col items-center justify-center space-y-3">
            {/* View Mode Switching: Simulation View vs Batting Duel */}
            {matchMode === 'SIMULATION' ? (
              <MatchSimulationView
                scoreboard={scoreboard}
                homeLineup={homeLineup}
                awayLineup={awayLineup}
                homeTeamName="Texas"
                awayTeamName={currentOpponent.name}
                currentSimBatterIndex={simBatterIdx}
                simOutcomeBanner={simBanner}
                onSpeedChange={(spd) => setGameSpeed(spd)}
                gameSpeed={gameSpeed}
                onSkipToUserAtBat={() => {
                  sound.playCheer();
                  setMatchMode('BAT');
                }}
              />
            ) : (
              <BattingField
                opponent={currentOpponent}
                playerStats={playerStats}
                playerGear={playerGear}
                activeCards={cards}
                scoreboard={scoreboard}
                season={season}
                comboGauge={comboGauge}
                isAutoHomeRunReady={isAutoHomeRunReady}
                score={matchScore}
                onInningEvent={handleInningEvent}
                onBatterChanged={handleBatterChanged}
                onOpenLeaderboard={() => alert('Global Facebook Leaderboard: Rank #12 (Score: ' + matchScore + ')')}
                onActivateComboFever={() => {
                  if (isAutoHomeRunReady) sound.playCheer();
                }}
              />
            )}

            {/* Quick Match Mode Switcher & In-Game Announcer Bar */}
            <div className="max-w-[800px] mx-auto w-full bg-[#181a20]/95 border-2 border-[#334155] rounded-xl p-3 text-xs flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-black text-amber-400 shrink-0">📢 ANNOUNCER:</span>
                <span className="text-slate-200 truncate font-mono">
                  {matchMode === 'SIMULATION'
                    ? `Teammates in play! Watch simulation or click ⏩ to bat with Andy (#3 in lineup)!`
                    : matchHistory[0]}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setMatchMode(matchMode === 'SIMULATION' ? 'BAT' : 'SIMULATION')}
                  className="text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 font-black px-2.5 py-1 rounded-lg border border-slate-600 transition-colors cursor-pointer"
                >
                  {matchMode === 'SIMULATION' ? '🏏 Switch to Batting Duel' : '📋 Switch to Lineup View'}
                </button>
                <button
                  onClick={() => startNewMatch()}
                  className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Restart (5⚡)
                </button>
              </div>
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
