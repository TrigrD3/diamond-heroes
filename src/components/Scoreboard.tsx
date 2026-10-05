import React from 'react';
import type { MatchScoreboard, SeasonStandings } from '../types/game';

interface ScoreboardProps {
  scoreboard: MatchScoreboard;
  season: SeasonStandings;
  playerName: string;
  opponentName: string;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  scoreboard,
  season,
  playerName,
  opponentName,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border-2 border-slate-700/80 rounded-2xl p-4 shadow-xl mb-4 text-white">
      {/* 30-Game Season Header Status */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-amber-400 uppercase tracking-wider">
            Season #{season.seasonNumber} • Game {season.gameNumber} of {season.totalGames}
          </span>
          {season.isPlayoffs && (
            <span className="bg-red-600 text-white font-black px-2 py-0.5 rounded uppercase">
              Playoffs
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-slate-300 font-semibold">
          <span>Record: <strong className="text-white">{season.wins}W - {season.losses}L</strong></span>
          <span>League Rank: <strong className="text-amber-400">#{season.rank}</strong></span>
          <span className="text-slate-400 text-[11px]">(Top 4 Reach Playoffs)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Team Matchup & Runs */}
        <div className="flex items-center justify-between md:justify-start gap-4 border-b md:border-b-0 md:border-r border-slate-700 pb-3 md:pb-0 md:pr-4">
          <div className="text-center flex-1">
            <div className="text-xs text-slate-400 font-semibold uppercase truncate">{playerName}</div>
            <div className="text-3xl font-black text-sky-400">{scoreboard.playerScore}</div>
          </div>
          <div className="text-sm font-bold text-slate-500">VS</div>
          <div className="text-center flex-1">
            <div className="text-xs text-slate-400 font-semibold uppercase truncate">{opponentName}</div>
            <div className="text-3xl font-black text-rose-400">{scoreboard.opponentScore}</div>
          </div>
        </div>

        {/* Inning & Count Status (Balls / Strikes / Outs) */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-700 pb-3 md:pb-0 md:pr-4">
          <div className="text-xs uppercase font-extrabold text-amber-400 tracking-wider mb-1">
            {scoreboard.isTop ? '▲ Top' : '▼ Bottom'} Inning {scoreboard.inning} / {scoreboard.totalInnings}
          </div>
          <div className="flex items-center gap-4 text-sm font-bold mt-1">
            {/* Balls Count */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">B</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full border border-slate-600 ${
                      idx < scoreboard.balls ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Strikes Count */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">S</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full border border-slate-600 ${
                      idx < scoreboard.strikes ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Outs Count */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">O</span>
              <div className="flex gap-1">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full border border-slate-600 ${
                      idx < scoreboard.outs ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 mt-2">
            Batting Order: <strong className="text-white">#{scoreboard.currentBatterOrder} in Lineup</strong>
          </div>
        </div>

        {/* Diamond Base Runners Display */}
        <div className="flex items-center justify-around">
          <div className="text-xs text-slate-400 font-medium">Bases:</div>
          <div className="relative w-14 h-14">
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-2 transition-colors duration-200 ${
                scoreboard.bases[1] ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,1)]' : 'bg-slate-800 border-slate-600'
              }`}
              title="2nd Base"
            />
            <div
              className={`absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 rotate-45 border-2 transition-colors duration-200 ${
                scoreboard.bases[2] ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,1)]' : 'bg-slate-800 border-slate-600'
              }`}
              title="3rd Base"
            />
            <div
              className={`absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 rotate-45 border-2 transition-colors duration-200 ${
                scoreboard.bases[0] ? 'bg-amber-400 border-amber-300 shadow-[0_0_8px_rgba(251,191,36,1)]' : 'bg-slate-800 border-slate-600'
              }`}
              title="1st Base"
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-2 bg-slate-600 rounded-b" />
          </div>

          <div className="text-xs text-slate-400 text-right">
            <div>Runners On: <strong className="text-white">{scoreboard.bases.filter(Boolean).length}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
