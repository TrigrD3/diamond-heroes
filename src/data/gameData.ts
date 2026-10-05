import type {
  BatterCard,
  OpponentTeam,
  PlayerGear,
  PitchConfig,
  PitchType,
  StadiumUpgrade,
  PlayerStats
} from '../types/game';

export const INITIAL_PLAYER_STATS: PlayerStats = {
  contact: 45,
  power: 52,
  luck: 42,
  speed: 46,
};

export const INITIAL_GEAR: PlayerGear = {
  bat: {
    id: 'bat_wood',
    name: 'Standard Wood Bat',
    powerBonus: 10,
    contactBonus: 6,
    costCoins: 0,
    costCash: 0,
    owned: true,
    icon: '🪵'
  },
  gloves: {
    id: 'glove_leather',
    name: 'Syntasia Leather Mitt',
    contactBonus: 8,
    luckBonus: 5,
    costCoins: 0,
    costCash: 0,
    owned: true,
    icon: '🧤'
  },
  cleats: {
    id: 'cleats_rookie',
    name: 'Rookie Diamond Cleats',
    speedBonus: 10,
    luckBonus: 6,
    costCoins: 0,
    costCash: 0,
    owned: true,
    icon: '👟'
  }
};

export const INITIAL_STADIUM: StadiumUpgrade = {
  level: 1,
  name: 'Sandlot Bleachers',
  capacity: 2500,
  bonusCoinMultiplier: 1.0,
  upgradeCost: 500
};

export const STADIUM_LEVELS: StadiumUpgrade[] = [
  { level: 1, name: 'Sandlot Bleachers', capacity: 2500, bonusCoinMultiplier: 1.0, upgradeCost: 500 },
  { level: 2, name: 'County Diamond Park', capacity: 8500, bonusCoinMultiplier: 1.25, upgradeCost: 1200 },
  { level: 3, name: 'Metro Municipal Stadium', capacity: 22000, bonusCoinMultiplier: 1.6, upgradeCost: 2800 },
  { level: 4, name: 'Neo Champions Colosseum', capacity: 55000, bonusCoinMultiplier: 2.2, upgradeCost: 6500 }
];

export const INITIAL_CARDS: BatterCard[] = [
  {
    id: 'hero_you',
    name: 'Your Avatar Slugger',
    grade: 'Hero',
    cardClass: 'S',
    position: 'DH',
    contact: 55,
    power: 60,
    luck: 50,
    speed: 52,
    specialAbility: 'COMBO BURST: Multiplies combo gauge points gained by 1.5x',
    cardArtColor: '#eab308'
  },
  {
    id: 'card_1',
    name: 'Kenji "Lightning" Sato',
    grade: 'Elite',
    cardClass: 'A',
    position: 'CF',
    contact: 58,
    power: 45,
    luck: 60,
    speed: 72,
    specialAbility: 'LEADOFF HITTER: Expands aiming sweet spot in 1st at-bat',
    cardArtColor: '#8b5cf6'
  },
  {
    id: 'card_2',
    name: 'Big Mac Vance',
    grade: 'Hero',
    cardClass: 'S',
    position: '1B',
    contact: 52,
    power: 78,
    luck: 40,
    speed: 30,
    specialAbility: 'CLEANUP SLUGGER: +20% distance on all fly balls',
    cardArtColor: '#ef4444'
  },
  {
    id: 'card_3',
    name: 'Marcus "Glove" Brody',
    grade: 'Rare',
    cardClass: 'B',
    position: 'SS',
    contact: 62,
    power: 40,
    luck: 55,
    speed: 64,
    specialAbility: 'CLUTCH CONTACT: Reduces strikeout chance with 2 strikes',
    cardArtColor: '#3b82f6'
  },
  {
    id: 'card_4',
    name: 'Tatsuya Yamada',
    grade: 'Normal',
    cardClass: 'C',
    position: '3B',
    contact: 48,
    power: 44,
    luck: 46,
    speed: 50,
    specialAbility: 'SOLID BASE: Standard baseline contact',
    cardArtColor: '#64748b'
  }
];

export const PITCH_CONFIGS: Record<PitchType, PitchConfig> = {
  '4-Seam Fastball': {
    name: '4-Seam Fastball',
    baseSpeedMph: 94,
    flightMs: 820,
    breakX: 0,
    breakY: 0,
    color: '#ef4444'
  },
  'Curveball': {
    name: 'Curveball',
    baseSpeedMph: 76,
    flightMs: 1250,
    breakX: -30,
    breakY: 50,
    color: '#3b82f6'
  },
  'Slider': {
    name: 'Slider',
    baseSpeedMph: 85,
    flightMs: 1050,
    breakX: 45,
    breakY: 20,
    color: '#eab308'
  },
  'Changeup': {
    name: 'Changeup',
    baseSpeedMph: 73,
    flightMs: 1350,
    breakX: 12,
    breakY: 35,
    color: '#10b981'
  },
  'Sinker': {
    name: 'Sinker',
    baseSpeedMph: 88,
    flightMs: 980,
    breakX: -18,
    breakY: 45,
    color: '#a855f7'
  }
};

export const LEAGUE_OPPONENTS: OpponentTeam[] = [
  {
    id: 'rookie_sandlot',
    name: 'Sandlot Bandits',
    difficulty: 1,
    tier: 'Rookie League',
    pitcherName: 'Dusty Miller',
    pitcherVelocity: 74,
    pitcherRepertoire: ['4-Seam Fastball', 'Changeup'],
    rewardCoins: 180,
    rewardExp: 90,
  },
  {
    id: 'minor_grizzlies',
    name: 'Silver Peak Grizzlies',
    difficulty: 2,
    tier: 'Minor League',
    pitcherName: 'Hank Stone',
    pitcherVelocity: 85,
    pitcherRepertoire: ['4-Seam Fastball', 'Curveball', 'Changeup'],
    rewardCoins: 350,
    rewardExp: 160,
  },
  {
    id: 'major_cyclones',
    name: 'Metro Cyclones',
    difficulty: 3,
    tier: 'Major League',
    pitcherName: 'Randy "Viper" King',
    pitcherVelocity: 94,
    pitcherRepertoire: ['4-Seam Fastball', 'Curveball', 'Slider', 'Sinker'],
    rewardCoins: 650,
    rewardExp: 300,
  },
  {
    id: 'champs_titans',
    name: 'Neo Olympus Titans',
    difficulty: 4,
    tier: 'Champions Cup',
    pitcherName: 'Kaiser Von Blitz',
    pitcherVelocity: 102,
    pitcherRepertoire: ['4-Seam Fastball', 'Slider', 'Curveball', 'Sinker'],
    rewardCoins: 1200,
    rewardExp: 550,
  }
];

export const SHOP_ITEMS = {
  bats: [
    { id: 'bat_wood', name: 'Standard Wood Bat', powerBonus: 10, contactBonus: 6, costCoins: 0, costCash: 0, owned: true, icon: '🪵' },
    { id: 'bat_aluminum', name: 'Thunder Metal Bat', powerBonus: 22, contactBonus: 12, costCoins: 500, costCash: 0, owned: false, icon: '⚡' },
    { id: 'bat_flame', name: 'Syntasia Flame Slugger', powerBonus: 38, contactBonus: 20, costCoins: 1400, costCash: 15, owned: false, icon: '🔥' },
    { id: 'bat_diamond', name: 'Diamond Grandslammer', powerBonus: 55, contactBonus: 28, costCoins: 3200, costCash: 40, owned: false, icon: '💎' },
  ],
  gloves: [
    { id: 'glove_leather', name: 'Syntasia Leather Mitt', contactBonus: 8, luckBonus: 5, costCoins: 0, costCash: 0, owned: true, icon: '🧤' },
    { id: 'glove_pro', name: 'Pro Grip Fielding Glove', contactBonus: 18, luckBonus: 12, costCoins: 450, costCash: 0, owned: false, icon: '🛡️' },
    { id: 'glove_gold', name: 'Golden Web Clutch Mitt', contactBonus: 32, luckBonus: 24, costCoins: 1300, costCash: 20, owned: false, icon: '✨' },
  ],
  cleats: [
    { id: 'cleats_rookie', name: 'Rookie Diamond Cleats', speedBonus: 10, luckBonus: 6, costCoins: 0, costCash: 0, owned: true, icon: '👟' },
    { id: 'cleats_sprint', name: 'Turbo Base Stealers', speedBonus: 24, luckBonus: 15, costCoins: 600, costCash: 0, owned: false, icon: '🚀' },
    { id: 'cleats_flash', name: 'Flash Lightning Cleats', speedBonus: 42, luckBonus: 28, costCoins: 1600, costCash: 25, owned: false, icon: '⚡' },
  ]
};

export const CARD_PACK_POOL: BatterCard[] = [
  { id: 'c_hero_1', name: 'Babe "Colossus" Cruz', grade: 'Hero', cardClass: 'S', position: 'DH', contact: 65, power: 85, luck: 60, speed: 40, specialAbility: 'HOMERUN FRENZY: 2.0x Combo Points on fly balls', cardArtColor: '#eab308' },
  { id: 'c_hero_2', name: 'Shohei "Phenom" Tanaka', grade: 'Hero', cardClass: 'S', position: 'RF', contact: 78, power: 80, luck: 65, speed: 70, specialAbility: 'TWO-WAY ACE: Adds +15% sweet-spot window', cardArtColor: '#eab308' },
  { id: 'c_elite_1', name: 'Nate "Cannon" Diaz', grade: 'Elite', cardClass: 'A', position: '3B', contact: 64, power: 70, luck: 52, speed: 55, specialAbility: 'POWER SURGE: Doubles extra base chance', cardArtColor: '#8b5cf6' },
  { id: 'c_elite_2', name: 'Lucas "Speeder" Vance', grade: 'Elite', cardClass: 'A', position: 'LF', contact: 70, power: 50, luck: 58, speed: 82, specialAbility: 'GAP SPLITTER: Extra base on all singles', cardArtColor: '#8b5cf6' },
  { id: 'c_rare_1', name: 'Bobby "Iron" Ross', grade: 'Rare', cardClass: 'B', position: 'C', contact: 55, power: 58, luck: 48, speed: 38, specialAbility: 'WALL BEHIND: Cuts strikeout chance', cardArtColor: '#3b82f6' },
  { id: 'c_rare_2', name: 'Jin "Flash" Morita', grade: 'Rare', cardClass: 'B', position: '2B', contact: 60, power: 45, luck: 50, speed: 68, specialAbility: 'CLEAN CONTACT: +10 Contact in away games', cardArtColor: '#3b82f6' },
  { id: 'c_norm_1', name: 'Danny Miller', grade: 'Normal', cardClass: 'C', position: 'CF', contact: 45, power: 40, luck: 42, speed: 50, specialAbility: 'ROOKIE SWING: Standard hit bonus', cardArtColor: '#64748b' },
  { id: 'c_norm_2', name: 'Tommy Green', grade: 'Normal', cardClass: 'C', position: '1B', contact: 42, power: 48, luck: 40, speed: 35, specialAbility: 'SLUGGER ROOKIE: Standard power bonus', cardArtColor: '#64748b' }
];
