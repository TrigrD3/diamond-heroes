export interface PlayerStats {
  contact: number; // Widens sweet spot aiming circle & timing forgiveness
  power: number;   // Boosts fly-ball distance & Home Run chance
  luck: number;    // Multiplies combo gauge points & lucky smash hits
  speed: number;   // Extra bases stealing & running
}

export type CardGrade = 'Hero' | 'Elite' | 'Rare' | 'Normal';
export type CardClass = 'S' | 'A' | 'B' | 'C';

export interface BatterCard {
  id: string;
  name: string;
  grade: CardGrade;
  cardClass: CardClass;
  position: string;
  contact: number;
  power: number;
  luck: number;
  speed: number;
  specialAbility: string;
  cardArtColor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: 'Batter' | 'Pitcher';
  position: string;
  order: number;
  stats: PlayerStats;
  portrait: string;
}

export interface PlayerGear {

  bat: { id: string; name: string; powerBonus: number; contactBonus: number; costCoins: number; costCash: number; owned: boolean; icon: string };
  gloves: { id: string; name: string; contactBonus: number; luckBonus: number; costCoins: number; costCash: number; owned: boolean; icon: string };
  cleats: { id: string; name: string; speedBonus: number; luckBonus: number; costCoins: number; costCash: number; owned: boolean; icon: string };
}

export interface StadiumUpgrade {
  level: number;
  name: string;
  capacity: number;
  bonusCoinMultiplier: number;
  upgradeCost: number;
}

export type PitchType = '4-Seam Fastball' | 'Curveball' | 'Changeup' | 'Slider' | 'Sinker';

export interface PitchConfig {
  name: PitchType;
  baseSpeedMph: number;
  flightMs: number;
  breakX: number;
  breakY: number;
  color: string;
}

export type SwingTiming = 'PERFECT' | 'GOOD' | 'EARLY' | 'LATE' | 'MISS';
export type HitOutcome = 'Home Run' | 'Triple' | 'Double' | 'Single' | 'Out' | 'Foul' | 'Strike' | 'Ball';

export interface MatchScoreboard {
  inning: number;
  isTop: boolean; // false = bottom inning (player batting)
  playerScore: number;
  opponentScore: number;
  balls: number;
  strikes: number;
  outs: number;
  bases: [boolean, boolean, boolean];
  totalInnings: number;
}

export interface OpponentTeam {
  id: string;
  name: string;
  difficulty: number;
  tier: 'Rookie League' | 'Minor League' | 'Major League' | 'Champions Cup';
  pitcherName: string;
  pitcherVelocity: number;
  pitcherRepertoire: PitchType[];
  rewardCoins: number;
  rewardExp: number;
}
