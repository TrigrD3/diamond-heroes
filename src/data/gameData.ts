import type {
  BatterCard,
  OpponentTeam,
  PlayerGear,
  PitchConfig,
  PitchType,
  StadiumUpgrade,
  PlayerStats,
  SeasonStandings,
  DailyQuest,
  LineupSlot
} from '../types/game';

export const INITIAL_HOME_LINEUP: LineupSlot[] = [
  { order: 1, name: 'Marco', avatar: '/assets/avatars/face_marco.png', avg: '.200', trend: 'up' },
  { order: 2, name: 'Lucas', avatar: '/assets/avatars/face_lucas.png', avg: '.201', trend: 'diag-up' },
  { order: 3, name: 'Andy', avatar: '/assets/avatars/face_andy.png', avg: '.657', trend: 'diag-up', isPlayerUser: true },
  { order: 4, name: 'Kirby', avatar: '/assets/avatars/face_kirby.png', avg: '.200', trend: 'diag-up' },
  { order: 5, name: 'Aaron', avatar: '/assets/avatars/face_aaron.png', avg: '.201', trend: 'level' },
  { order: 6, name: 'Anton', avatar: '/assets/avatars/face_anton.png', avg: '.200', trend: 'level' },
  { order: 7, name: 'Jake', avatar: '/assets/avatars/face_jake.png', avg: '.200', trend: 'level' },
  { order: 8, name: 'Andy', avatar: '/assets/avatars/face_andy.png', avg: '.201', trend: 'diag-down' },
  { order: 9, name: 'Leon', avatar: '/assets/avatars/face_leon.png', avg: '.201', trend: 'diag-down' },
];

export const INITIAL_AWAY_LINEUP: LineupSlot[] = [
  { order: 1, name: 'Kyle', avatar: '/assets/avatars/face_kyle.png', avg: '.254', trend: 'up' },
  { order: 2, name: 'Jake', avatar: '/assets/avatars/face_jake.png', avg: '.244', trend: 'diag-up' },
  { order: 3, name: 'Fonzo', avatar: '/assets/avatars/face_fonzo.png', avg: '.556', trend: 'down' },
  { order: 4, name: 'Leon', avatar: '/assets/avatars/face_leon.png', avg: '.232', trend: 'level' },
  { order: 5, name: 'Lucas', avatar: '/assets/avatars/face_lucas.png', avg: '.231', trend: 'level' },
  { order: 6, name: 'Aaron', avatar: '/assets/avatars/face_aaron.png', avg: '.225', trend: 'down' },
  { order: 7, name: 'Alex', avatar: '/assets/avatars/face_anton.png', avg: '.246', trend: 'diag-up' },
  { order: 8, name: 'Kirby', avatar: '/assets/avatars/face_kirby.png', avg: '.235', trend: 'level' },
  { order: 9, name: 'Fredrick', avatar: '/assets/avatars/face_marco.png', avg: '.231', trend: 'diag-down' },
];

export const INITIAL_PLAYER_STATS: PlayerStats = {
  contact: 45, // Contact: Aim circle width & sweet spot forgiveness
  power: 50,   // Power: Fly-ball distance & Home Run rate
  luck: 42,    // Luck: Combo gauge points gained per base hit
};

export const INITIAL_GEAR: PlayerGear = {
  bat: {
    id: 'bat_wood',
    name: 'Maple Wood Slugger',
    powerBonus: 10,
    contactBonus: 6,
    costCoins: 0,
    costCash: 0,
    owned: true,
    icon: '🪵'
  },
  gloves: {
    id: 'glove_leather',
    name: 'Syntasia Pro Grip Mitt',
    contactBonus: 8,
    luckBonus: 6,
    costCoins: 0,
    costCash: 0,
    owned: true,
    icon: '🧤'
  },
  helmet: {
    id: 'helmet_classic',
    name: 'Blue Diamond Batting Helmet',
    contactBonus: 6,
    powerBonus: 4,
    costCoins: 0,
    costCash: 0,
    owned: true,
    icon: '⛑️'
  },
  goggles: {
    id: 'goggles_tinted',
    name: 'Eagle Eye Sports Goggles',
    contactBonus: 10,
    luckBonus: 8,
    costCoins: 0,
    costCash: 0,
    owned: true,
    icon: '🥽'
  }
};

export const INITIAL_SEASON: SeasonStandings = {
  seasonNumber: 1,
  gameNumber: 1,
  totalGames: 30,
  wins: 0,
  losses: 0,
  rank: 5,
  isPlayoffs: false
};

export const INITIAL_QUESTS: DailyQuest[] = [
  { id: 'q1', title: 'Hit 2 Home Runs in any match', goal: 2, current: 0, rewardCoins: 350, completed: false },
  { id: 'q2', title: 'Trigger Combo Fever 1 time', goal: 1, current: 0, rewardCoins: 450, completed: false },
  { id: 'q3', title: 'Win 2 Season Matches', goal: 2, current: 0, rewardCoins: 600, completed: false },
];

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
    specialAbility: 'SOLID BASE: Standard baseline contact',
    cardArtColor: '#64748b'
  }
];

export const PITCH_CONFIGS: Record<PitchType, PitchConfig> = {
  '4-Seam Fastball': {
    name: '4-Seam Fastball',
    baseSpeedMph: 95,
    flightMs: 800,
    breakX: 0,
    breakY: 0,
    color: '#ef4444'
  },
  'Curveball': {
    name: 'Curveball',
    baseSpeedMph: 75,
    flightMs: 1250,
    breakX: -32,
    breakY: 52,
    color: '#3b82f6'
  },
  'Slider': {
    name: 'Slider',
    baseSpeedMph: 86,
    flightMs: 1020,
    breakX: 45,
    breakY: 20,
    color: '#eab308'
  },
  'Changeup': {
    name: 'Changeup',
    baseSpeedMph: 72,
    flightMs: 1350,
    breakX: 12,
    breakY: 36,
    color: '#10b981'
  },
  'Sinker': {
    name: 'Sinker',
    baseSpeedMph: 88,
    flightMs: 960,
    breakX: -18,
    breakY: 48,
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
    rewardCoins: 200,
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
    rewardCoins: 380,
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
    rewardCoins: 700,
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
    rewardCoins: 1300,
    rewardExp: 550,
  }
];

export const SHOP_ITEMS = {
  bats: [
    { id: 'bat_wood', name: 'Maple Wood Slugger', powerBonus: 10, contactBonus: 6, costCoins: 0, costCash: 0, owned: true, icon: '🪵' },
    { id: 'bat_aluminum', name: 'Thunder Metal Bat', powerBonus: 22, contactBonus: 12, costCoins: 500, costCash: 0, owned: false, icon: '⚡' },
    { id: 'bat_flame', name: 'Syntasia Flame Slugger', powerBonus: 38, contactBonus: 20, costCoins: 1400, costCash: 15, owned: false, icon: '🔥' },
    { id: 'bat_diamond', name: 'Diamond Grandslammer', powerBonus: 55, contactBonus: 28, costCoins: 3200, costCash: 40, owned: false, icon: '💎' },
  ],
  gloves: [
    { id: 'glove_leather', name: 'Syntasia Pro Grip Mitt', contactBonus: 8, luckBonus: 6, costCoins: 0, costCash: 0, owned: true, icon: '🧤' },
    { id: 'glove_pro', name: 'Golden Web Clutch Mitt', contactBonus: 18, luckBonus: 14, costCoins: 450, costCash: 0, owned: false, icon: '🛡️' },
    { id: 'glove_gold', name: 'Supreme Diamond Web Glove', contactBonus: 32, luckBonus: 26, costCoins: 1300, costCash: 20, owned: false, icon: '✨' },
  ],
  helmet: [
    { id: 'helmet_classic', name: 'Blue Diamond Batting Helmet', contactBonus: 6, powerBonus: 4, costCoins: 0, costCash: 0, owned: true, icon: '⛑️' },
    { id: 'helmet_titanium', name: 'Titanium Shell Guard', contactBonus: 16, powerBonus: 12, costCoins: 550, costCash: 0, owned: false, icon: '🛡️' },
  ],
  goggles: [
    { id: 'goggles_tinted', name: 'Eagle Eye Sports Goggles', contactBonus: 10, luckBonus: 8, costCoins: 0, costCash: 0, owned: true, icon: '🥽' },
    { id: 'goggles_laser', name: 'Laser Focus Radar Goggles', contactBonus: 25, luckBonus: 22, costCoins: 1200, costCash: 18, owned: false, icon: '🕶️' },
  ]
};

export const CARD_PACK_POOL: BatterCard[] = [
  { id: 'c_hero_1', name: 'Babe "Colossus" Cruz', grade: 'Hero', cardClass: 'S', position: 'DH', contact: 65, power: 85, luck: 60, specialAbility: 'HOMERUN FRENZY: 2.0x Combo Points on fly balls', cardArtColor: '#eab308' },
  { id: 'c_hero_2', name: 'Shohei "Phenom" Tanaka', grade: 'Hero', cardClass: 'S', position: 'RF', contact: 78, power: 80, luck: 65, specialAbility: 'TWO-WAY ACE: Adds +15% sweet-spot window', cardArtColor: '#eab308' },
  { id: 'c_elite_1', name: 'Nate "Cannon" Diaz', grade: 'Elite', cardClass: 'A', position: '3B', contact: 64, power: 70, luck: 52, specialAbility: 'POWER SURGE: Doubles extra base chance', cardArtColor: '#8b5cf6' },
  { id: 'c_elite_2', name: 'Lucas "Speeder" Vance', grade: 'Elite', cardClass: 'A', position: 'LF', contact: 70, power: 50, luck: 58, specialAbility: 'GAP SPLITTER: Extra base on all singles', cardArtColor: '#8b5cf6' },
  { id: 'c_rare_1', name: 'Bobby "Iron" Ross', grade: 'Rare', cardClass: 'B', position: 'C', contact: 55, power: 58, luck: 48, specialAbility: 'WALL BEHIND: Cuts strikeout chance', cardArtColor: '#3b82f6' },
  { id: 'c_rare_2', name: 'Jin "Flash" Morita', grade: 'Rare', cardClass: 'B', position: '2B', contact: 60, power: 45, luck: 50, specialAbility: 'CLEAN CONTACT: +10 Contact in away games', cardArtColor: '#3b82f6' },
  { id: 'c_norm_1', name: 'Danny Miller', grade: 'Normal', cardClass: 'C', position: 'CF', contact: 45, power: 40, luck: 42, specialAbility: 'ROOKIE SWING: Standard hit bonus', cardArtColor: '#64748b' },
  { id: 'c_norm_2', name: 'Tommy Green', grade: 'Normal', cardClass: 'C', position: '1B', contact: 42, power: 48, luck: 40, specialAbility: 'SLUGGER ROOKIE: Standard power bonus', cardArtColor: '#64748b' }
];
