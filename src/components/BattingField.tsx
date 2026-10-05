import React, { useEffect, useRef, useState, useCallback } from 'react';
import type {
  PitchType,
  HitOutcome,
  MatchScoreboard,
  OpponentTeam,
  PlayerStats,
  PlayerGear,
  BatterCard,
  SeasonStandings
} from '../types/game';
import { PITCH_CONFIGS } from '../data/gameData';
import { sound } from '../utils/audio';
import { loadTransparentImage } from '../utils/imageLoader';
import { GameScoreboard } from './GameScoreboard';
import { GameBottomHUD } from './GameBottomHUD';
import confetti from 'canvas-confetti';

interface BattingFieldProps {
  opponent: OpponentTeam;
  playerStats: PlayerStats;
  playerGear: PlayerGear;
  activeCards: BatterCard[];
  scoreboard: MatchScoreboard;
  season: SeasonStandings;
  comboGauge: number;
  isAutoHomeRunReady: boolean;
  score: number;
  onInningEvent: (outcome: HitOutcome, runsScored: number, hitDesc: string, comboPointsEarned: number) => void;
  onBatterChanged: (newOrder: number) => void;
  onOpenLeaderboard: () => void;
  onActivateComboFever: () => void;
}

interface BallState {
  active: boolean;
  startTime: number;
  duration: number;
  x: number;
  y: number;
  scale: number;
  pitchType: PitchType;
  isBall: boolean;
  targetX: number;
  targetY: number;
  hit: boolean;
}

export const BattingField: React.FC<BattingFieldProps> = ({
  opponent,
  playerStats,
  playerGear,
  activeCards,
  scoreboard,
  season,
  comboGauge,
  isAutoHomeRunReady,
  score,
  onInningEvent,
  onBatterChanged,
  onOpenLeaderboard,
  onActivateComboFever,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [pitchPrompt, setPitchPrompt] = useState<'READY' | 'PITCHING' | 'HIT' | 'RESULT'>('READY');
  const [feedback, setFeedback] = useState<{ text: string; color: string; sub?: string } | null>(null);
  const [pitchDisplay, setPitchDisplay] = useState<{ type: PitchType; speedMph: number } | null>(null);

  const mousePosRef = useRef<{ x: number; y: number }>({ x: 400, y: 395 });

  const stadiumImgRef = useRef<HTMLImageElement | null>(null);
  const pitcherSpriteRef = useRef<CanvasImageSource | null>(null);
  const batterSpriteRef = useRef<CanvasImageSource | null>(null);
  const ballSpriteRef = useRef<HTMLImageElement | null>(null);

  const ballRef = useRef<BallState | null>(null);
  const swingProgressRef = useRef<number>(-1);
  const hitFlightRef = useRef<{
    active: boolean;
    x: number;
    y: number;
    vx: number;
    vy: number;
    vz: number;
    z: number;
    distFt: number;
  } | null>(null);

  // Active batter stats
  const currentCard = activeCards[(scoreboard.currentBatterOrder - 1) % activeCards.length] || activeCards[0];
  const isAvatarBatter = scoreboard.currentBatterOrder === 3;

  const currentContact = isAvatarBatter
    ? playerStats.contact + playerGear.bat.contactBonus + playerGear.gloves.contactBonus + playerGear.helmet.contactBonus + playerGear.goggles.contactBonus
    : currentCard.contact;

  const currentPower = isAvatarBatter
    ? playerStats.power + playerGear.bat.powerBonus + playerGear.helmet.powerBonus
    : currentCard.power;

  const currentLuck = isAvatarBatter
    ? playerStats.luck + playerGear.gloves.luckBonus + playerGear.goggles.luckBonus
    : currentCard.luck;

  const currentBatterName = isAvatarBatter ? 'Andy' : currentCard.name;

  // Aim circle radius
  const aimCircleRadius = Math.max(22, 16 + currentContact * 0.32);

  // Preload graphics
  useEffect(() => {
    const bg = new Image();
    bg.src = '/bh_stadium_perfect.png';
    bg.onload = () => {
      stadiumImgRef.current = bg;
    };

    const ballImg = new Image();
    ballImg.src = '/bh_ball_clean.png';
    ballImg.onload = () => {
      ballSpriteRef.current = ballImg;
    };

    loadTransparentImage('/pitcher.png')
      .then((sprite) => {
        pitcherSpriteRef.current = sprite;
      })
      .catch((err) => console.warn('Failed loading pitcher sprite', err));

    loadTransparentImage('/batter.png')
      .then((sprite) => {
        batterSpriteRef.current = sprite;
      })
      .catch((err) => console.warn('Failed loading batter sprite', err));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mousePosRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const throwPitch = useCallback(() => {
    if (pitchPrompt === 'PITCHING') return;

    const rep = opponent.pitcherRepertoire;
    const chosenPitchType = rep[Math.floor(Math.random() * rep.length)];
    const config = PITCH_CONFIGS[chosenPitchType];

    const baseMph = opponent.pitcherVelocity;
    const speedVariation = Math.random() * 6 - 3;
    const speedMph = Math.round(
      baseMph + (chosenPitchType === '4-Seam Fastball' ? 4 : chosenPitchType === 'Changeup' ? -12 : -4) + speedVariation
    );

    const flightDuration = Math.max(680, Math.min(1450, config.flightMs * (90 / speedMph)));

    // Strike zone center is (400, 395)
    const isOutside = Math.random() < 0.28;
    const offsetX = isOutside
      ? (Math.random() > 0.5 ? 58 + Math.random() * 25 : -58 - Math.random() * 25)
      : (Math.random() * 64 - 32);
    const offsetY = isOutside
      ? (Math.random() > 0.5 ? 55 + Math.random() * 22 : -55 - Math.random() * 22)
      : (Math.random() * 56 - 28);

    const targetX = 400 + offsetX + config.breakX;
    const targetY = 395 + offsetY + config.breakY;

    ballRef.current = {
      active: true,
      startTime: performance.now(),
      duration: flightDuration,
      x: 400,
      y: 220,
      scale: 0.22,
      pitchType: chosenPitchType,
      isBall: isOutside,
      targetX,
      targetY,
      hit: false,
    };

    setPitchDisplay({ type: chosenPitchType, speedMph });
    setPitchPrompt('PITCHING');
    setFeedback(null);
    sound.playPitch();
  }, [opponent, pitchPrompt]);

  const advanceBatterOrder = useCallback(() => {
    const nextOrder = scoreboard.currentBatterOrder >= 9 ? 1 : scoreboard.currentBatterOrder + 1;
    onBatterChanged(nextOrder);
  }, [scoreboard.currentBatterOrder, onBatterChanged]);

  const handleSwing = useCallback(() => {
    if (pitchPrompt !== 'PITCHING') {
      sound.playSwingWhoosh();
      swingProgressRef.current = 0;
      return;
    }

    const ball = ballRef.current;
    if (!ball || !ball.active || ball.hit) {
      sound.playSwingWhoosh();
      swingProgressRef.current = 0;
      return;
    }

    swingProgressRef.current = 0;
    const now = performance.now();
    const elapsed = now - ball.startTime;
    const diff = elapsed - ball.duration;

    const mouseX = mousePosRef.current.x;
    const mouseY = mousePosRef.current.y;
    const distToAimCircle = Math.hypot(mouseX - ball.targetX, mouseY - ball.targetY);
    const aimAccuracy = Math.max(0, 1 - (distToAimCircle / (aimCircleRadius * 1.5)));

    const contactFactor = currentContact / 50;
    const perfectWindow = 40 * contactFactor;
    const goodWindow = 100 * contactFactor;
    const hitTolerance = 170 * contactFactor;

    // Automatic Home Run if Combo Gauge is 100%!
    if (isAutoHomeRunReady && Math.abs(diff) <= hitTolerance) {
      ball.hit = true;
      ball.active = false;
      sound.playBatCrack('Homerun');
      sound.playCheer();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

      const dist = 430 + Math.random() * 50 + currentPower;
      hitFlightRef.current = {
        active: true,
        x: 400,
        y: 400,
        vx: 0,
        vy: -20,
        vz: 9,
        z: 0,
        distFt: Math.round(dist),
      };

      setFeedback({
        text: 'HOMERUN',
        color: '#facc15',
        sub: `GRAND SLAM (${Math.round(dist)} FT)!`,
      });
      setPitchPrompt('HIT');

      const runs = 1 + scoreboard.bases.filter(Boolean).length;
      setTimeout(() => {
        onInningEvent('Home Run', runs, `${currentBatterName} CRUSHED a COMBO HOME RUN ${Math.round(dist)} ft!`, 0);
        setPitchPrompt('RESULT');
        advanceBatterOrder();
      }, 1900);
      return;
    }

    if (distToAimCircle > aimCircleRadius * 1.5 || Math.abs(diff) > hitTolerance) {
      sound.playSwingWhoosh();
      sound.playStrike();
      ball.hit = true;
      ball.active = false;
      setFeedback({
        text: 'STRIKE',
        color: '#ef4444',
        sub: distToAimCircle > aimCircleRadius * 1.5 ? 'Missed Zone' : diff < 0 ? 'Too Early' : 'Too Late',
      });
      setPitchPrompt('RESULT');
      onInningEvent('Strike', 0, `${currentBatterName} swung and missed!`, 5);
      return;
    }

    ball.hit = true;
    ball.active = false;

    let timingLabel: 'PERFECT' | 'GOOD' | 'EARLY' | 'LATE' = 'GOOD';
    if (Math.abs(diff) <= perfectWindow) timingLabel = 'PERFECT';
    else if (Math.abs(diff) <= goodWindow) timingLabel = 'GOOD';
    else if (diff < 0) timingLabel = 'EARLY';
    else timingLabel = 'LATE';

    let outcome: HitOutcome = 'Single';
    let hitQuality: 'Normal' | 'Solid' | 'Homerun' = 'Normal';
    let baseDistance = 210 + currentPower * 2.1;
    let comboGained = Math.round(15 + currentLuck * 0.45);

    if (timingLabel === 'PERFECT' && aimAccuracy > 0.6) {
      const hrChance = Math.min(0.85, 0.4 + currentPower / 110 + (currentLuck > 50 ? 0.2 : 0));
      if (Math.random() < hrChance) {
        outcome = 'Home Run';
        hitQuality = 'Homerun';
        baseDistance = 390 + Math.random() * 60 + currentPower * 0.8;
        comboGained = 45;
      } else if (Math.random() < 0.3) {
        outcome = 'Triple';
        hitQuality = 'Solid';
        baseDistance = 330 + Math.random() * 30;
        comboGained = 35;
      } else {
        outcome = 'Double';
        hitQuality = 'Solid';
        baseDistance = 315 + Math.random() * 35;
        comboGained = 30;
      }
    } else if (timingLabel === 'GOOD') {
      const roll = Math.random();
      if (roll < 0.25 + currentPower / 220) {
        outcome = 'Double';
        hitQuality = 'Solid';
        baseDistance = 295 + Math.random() * 30;
        comboGained = 25;
      } else if (roll < 0.7) {
        outcome = 'Single';
        hitQuality = 'Normal';
        baseDistance = 230 + Math.random() * 25;
        comboGained = 20;
      } else {
        outcome = 'Out';
        hitQuality = 'Normal';
        baseDistance = 245;
        comboGained = 5;
      }
    } else {
      if (Math.random() < 0.5) {
        outcome = 'Foul';
        baseDistance = 150;
        comboGained = 5;
      } else if (Math.random() < 0.65) {
        outcome = 'Out';
        baseDistance = 210;
        comboGained = 5;
      } else {
        outcome = 'Single';
        baseDistance = 220;
        comboGained = 15;
      }
    }

    sound.playBatCrack(hitQuality);

    if (outcome === 'Home Run') {
      sound.playCheer();
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    }

    const angle = (Math.random() * 0.7 - 0.35) - Math.PI / 2;
    const speed = baseDistance / 18;
    hitFlightRef.current = {
      active: true,
      x: 400,
      y: 400,
      vx: Math.cos(angle) * speed * 0.5,
      vy: Math.sin(angle) * speed,
      vz: outcome === 'Home Run' ? 8.5 : 4.8,
      z: 0,
      distFt: Math.round(baseDistance),
    };

    setFeedback({
      text: outcome === 'Home Run' ? 'HOMERUN' : outcome.toUpperCase(),
      color: outcome === 'Home Run' ? '#facc15' : outcome === 'Out' ? '#f97316' : '#38bdf8',
      sub: `${Math.round(baseDistance)} FT • ${timingLabel}`,
    });
    setPitchPrompt('HIT');

    let runs = 0;
    if (outcome === 'Home Run') runs = 1 + scoreboard.bases.filter(Boolean).length;
    else if (outcome === 'Triple') runs = scoreboard.bases.filter(Boolean).length;
    else if (outcome === 'Double') runs = (scoreboard.bases[1] ? 1 : 0) + (scoreboard.bases[2] ? 1 : 0);
    else if (outcome === 'Single') runs = scoreboard.bases[2] ? 1 : 0;

    setTimeout(() => {
      onInningEvent(outcome, runs, `${currentBatterName} hit a ${outcome}! (${Math.round(baseDistance)} ft)`, comboGained);
      setPitchPrompt('RESULT');
      if (outcome !== 'Foul') {
        advanceBatterOrder();
      }
    }, 1800);
  }, [
    pitchPrompt,
    isAutoHomeRunReady,
    currentContact,
    currentPower,
    currentLuck,
    currentBatterName,
    aimCircleRadius,
    scoreboard.bases,
    onInningEvent,
    advanceBatterOrder,
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (pitchPrompt === 'READY' || pitchPrompt === 'RESULT') throwPitch();
        else handleSwing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pitchPrompt, throwPitch, handleSwing]);

  // Main Canvas Render Loop (800x520)
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, 800, 520);

      // 1. Stadium Background
      if (stadiumImgRef.current && stadiumImgRef.current.complete) {
        ctx.drawImage(stadiumImgRef.current, 0, 0, 800, 520);
      } else {
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(0, 0, 800, 240);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, 240, 800, 280);
      }

      // 2. Pitcher on Mound
      ctx.save();
      const pX = 400;
      const pY = 250;
      if (pitcherSpriteRef.current) {
        const bounce = pitchPrompt === 'PITCHING' ? Math.sin(now / 80) * 3 : 0;
        ctx.drawImage(pitcherSpriteRef.current, pX - 40, pY - 70 + bounce, 80, 80);
      } else {
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(pX, pY - 5, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 3. Home Plate Pentagon & Batter Boxes (Exact Geometry)
      // Home plate pentagon centered at x: 400, y: 440
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(375, 430);
      ctx.lineTo(425, 430);
      ctx.lineTo(435, 448);
      ctx.lineTo(400, 465);
      ctx.lineTo(365, 448);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Left and Right Batter Boxes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(260, 415, 80, 75); // Left box
      ctx.strokeRect(460, 415, 80, 75); // Right box

      // 4. White Rectangular Floating Strike Zone Box (screenshots_06.png)
      // Size: 96x96 centered at x: 400, y: 395 (x: 352 to 448, y: 347 to 443)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(352, 347, 96, 96);

      // Pitch Speed & Type Stamp Hovering Directly Above Strike Zone
      if (pitchDisplay) {
        ctx.save();
        ctx.font = '900 14px "Arial Black", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.lineWidth = 4;
        const textStr = `${pitchDisplay.speedMph} mph / ${pitchDisplay.type === '4-Seam Fastball' ? '4-Seam FB' : pitchDisplay.type}`;
        ctx.strokeText(textStr, 400, 338);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(textStr, 400, 338);
        ctx.restore();
      }

      // 5. Incoming Ball & Aiming Reticle
      const ball = ballRef.current;
      if (ball && ball.active) {
        const elapsed = now - ball.startTime;
        const progress = Math.min(1.15, elapsed / ball.duration);

        const currentX = 400 + (ball.targetX - 400) * progress;
        const arcY = Math.sin(progress * Math.PI) * -32;
        const currentY = 220 + (ball.targetY - 220) * progress + arcY;
        const currentScale = 0.25 + progress * 0.95;

        ball.x = currentX;
        ball.y = currentY;
        ball.scale = currentScale;

        // AIMING CIRCLE around target position
        ctx.save();
        ctx.strokeStyle = progress > 0.7 ? '#ef4444' : '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(ball.targetX, ball.targetY, aimCircleRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = progress > 0.7 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(56, 189, 248, 0.15)';
        ctx.beginPath();
        ctx.arc(ball.targetX, ball.targetY, aimCircleRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ball.targetX - 8, ball.targetY);
        ctx.lineTo(ball.targetX + 8, ball.targetY);
        ctx.moveTo(ball.targetX, ball.targetY - 8);
        ctx.lineTo(ball.targetX, ball.targetY + 8);
        ctx.stroke();
        ctx.restore();

        // Ball Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(currentX, 445, 8 * currentScale, 4 * currentScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Baseball
        if (ballSpriteRef.current && ballSpriteRef.current.complete) {
          const ballSize = 24 * currentScale;
          ctx.drawImage(
            ballSpriteRef.current,
            currentX - ballSize / 2,
            currentY - ballSize / 2,
            ballSize,
            ballSize
          );
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(currentX, currentY, 11 * currentScale, 0, Math.PI * 2);
          ctx.fill();
        }

        // Check if pitch crossed plate without swing
        if (progress >= 1.08 && !ball.hit) {
          ball.active = false;
          const isBall = ball.isBall;
          const outcome: HitOutcome = isBall ? 'Ball' : 'Strike';
          sound.playStrike();
          setFeedback({
            text: isBall ? 'BALL' : 'STRIKE',
            color: isBall ? '#38bdf8' : '#ef4444',
            sub: isBall ? 'Outside Strike Zone' : 'Called Strike in Zone',
          });
          setPitchPrompt('RESULT');
          onInningEvent(outcome, 0, isBall ? 'Ball outside the strike zone.' : 'Called strike right down the middle!', isBall ? 5 : 0);
          if (outcome === 'Strike' && scoreboard.strikes >= 2) {
            advanceBatterOrder();
          }
        }
      }

      // 6. Hit Flight Ball
      const flight = hitFlightRef.current;
      if (flight && flight.active) {
        flight.x += flight.vx;
        flight.y += flight.vy;
        flight.z += flight.vz;
        flight.vz -= 0.3;

        const bY = flight.y - flight.z;
        const scale = Math.max(0.2, 1 - flight.z / 200);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(flight.x, flight.y, 8 * scale, 4 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(flight.x, bY, 10 * scale, 0, Math.PI * 2);
        ctx.fill();

        if (flight.y < 120 || flight.z < 0) {
          flight.active = false;
        }
      }

      // 7. Batter Character in Left Batter Box
      ctx.save();
      const bX = 300;
      const bY = 445;

      let batAngle = 0;
      if (swingProgressRef.current >= 0) {
        swingProgressRef.current += 0.085;
        const swingT = swingProgressRef.current;
        if (swingT <= 1) {
          batAngle = Math.sin(swingT * Math.PI) * -0.38;
        } else {
          swingProgressRef.current = -1;
        }
      }

      if (batterSpriteRef.current) {
        ctx.translate(bX, bY);
        ctx.rotate(batAngle);
        ctx.drawImage(batterSpriteRef.current, -80, -170, 160, 170);
      } else {
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.arc(bX, bY - 20, 22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 8. Dynamic Mouse Reticle
      const mouse = mousePosRef.current;
      ctx.save();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [aimCircleRadius, pitchPrompt, scoreboard.strikes, pitchDisplay, advanceBatterOrder]);

  return (
    <div className="relative w-full max-w-[800px] mx-auto rounded-2xl overflow-hidden border-4 border-[#1e293b] bg-slate-900 shadow-2xl select-none">
      {/* Top Scoreboard Hanging Plaque */}
      <div className="absolute top-2 left-0 right-0 z-20 pointer-events-none">
        <GameScoreboard
          scoreboard={scoreboard}
          season={season}
          homeTeamName="Texas"
          awayTeamName="Oakland"
        />
      </div>

      {/* Top Right Mini Diamond Field Radar */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none drop-shadow-xl">
        <div className="relative w-16 h-16 bg-[#166534]/90 border-2 border-[#15803d] rounded-full overflow-hidden shadow-2xl flex items-center justify-center">
          {/* Infield dirt diamond */}
          <div className="w-9 h-9 bg-[#b45309] rotate-45 border border-amber-300 relative flex items-center justify-center">
            {/* 2nd Base */}
            <div
              className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                scoreboard.bases[1] ? 'bg-sky-400 border border-white animate-pulse' : 'bg-white'
              }`}
            />
            {/* 3rd Base */}
            <div
              className={`absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full ${
                scoreboard.bases[2] ? 'bg-sky-400 border border-white animate-pulse' : 'bg-white'
              }`}
            />
            {/* 1st Base */}
            <div
              className={`absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full ${
                scoreboard.bases[0] ? 'bg-sky-400 border border-white animate-pulse' : 'bg-white'
              }`}
            />
            {/* Home Plate */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-white rounded-b-sm" />
          </div>
        </div>
      </div>

      {/* Main Batting Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={520}
        onMouseMove={handleMouseMove}
        onClick={() => {
          if (pitchPrompt === 'READY' || pitchPrompt === 'RESULT') throwPitch();
          else handleSwing();
        }}
        className="w-full h-auto cursor-crosshair block select-none"
      />

      {/* Authentic Cartoon Result Stamp (e.g. STRIKE, BALL, HIT, HOMERUN) */}
      {feedback && (
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center z-30 animate-bounce">
          <div
            className="text-6xl font-black italic tracking-tighter drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] uppercase select-none font-sans"
            style={{
              color: feedback.color,
              WebkitTextStroke: '3px #000000',
              textShadow: '0 4px 12px rgba(0,0,0,0.8)',
            }}
          >
            {feedback.text}
          </div>
          {feedback.sub && (
            <div className="text-xs font-black text-white bg-black/80 px-3 py-1 rounded-full inline-block mt-1 border border-slate-600 shadow-md">
              {feedback.sub}
            </div>
          )}
        </div>
      )}

      {/* Bottom HUD: Avatar, Skills, Stats & Combo Dial */}
      <div className="absolute bottom-2 left-0 right-0 z-20">
        <GameBottomHUD
          batterName={currentBatterName}
          playerStats={playerStats}
          comboGauge={comboGauge}
          isComboReady={isAutoHomeRunReady}
          score={score}
          seasonStats={{
            avg: '.657',
            hr: 6,
            rbi: 14,
            hits: 23,
          }}
          onComboClick={onActivateComboFever}
          onLeaderboardClick={onOpenLeaderboard}
        />
      </div>

      {/* Pitch Action Floating Trigger Button */}
      <div className="absolute bottom-16 right-4 z-20 pointer-events-auto">
        {pitchPrompt === 'READY' || pitchPrompt === 'RESULT' ? (
          <button
            onClick={throwPitch}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm uppercase px-6 py-2.5 rounded-xl shadow-2xl border-2 border-emerald-300 active:scale-95 transition-transform cursor-pointer"
          >
            ⚾ Throw Pitch
          </button>
        ) : (
          <button
            onClick={handleSwing}
            className={`font-black text-base uppercase px-8 py-2.5 rounded-xl shadow-2xl transition-transform active:scale-95 cursor-pointer ${
              isAutoHomeRunReady
                ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-red-500 text-slate-950 animate-bounce border-2 border-yellow-200'
                : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border-2 border-amber-300'
            }`}
          >
            {isAutoHomeRunReady ? '🔥 GRAND SLAM SWING! 🔥' : '⚡ SWING BAT!'}
          </button>
        )}
      </div>
    </div>
  );
};
