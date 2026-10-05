import React, { useEffect, useRef, useState, useCallback } from 'react';
import type {
  PitchType,
  HitOutcome,
  MatchScoreboard,
  OpponentTeam,
  PlayerStats,
  PlayerGear,
  BatterCard
} from '../types/game';
import { PITCH_CONFIGS } from '../data/gameData';
import { sound } from '../utils/audio';
import { loadTransparentImage } from '../utils/imageLoader';
import confetti from 'canvas-confetti';

interface BattingFieldProps {
  opponent: OpponentTeam;
  playerStats: PlayerStats;
  playerGear: PlayerGear;
  activeCards: BatterCard[];
  scoreboard: MatchScoreboard;
  comboGauge: number;
  isAutoHomeRunReady: boolean;
  onInningEvent: (outcome: HitOutcome, runsScored: number, hitDesc: string, comboPointsEarned: number) => void;
  onBatterChanged: (newOrder: number) => void;
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
  comboGauge,
  isAutoHomeRunReady,
  onInningEvent,
  onBatterChanged,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [pitchPrompt, setPitchPrompt] = useState<'READY' | 'PITCHING' | 'HIT' | 'RESULT'>('READY');
  const [feedback, setFeedback] = useState<{ text: string; color: string; sub?: string } | null>(null);
  const [pitchDisplay, setPitchDisplay] = useState<{ type: PitchType; speedMph: number } | null>(null);

  const mousePosRef = useRef<{ x: number; y: number }>({ x: 400, y: 440 });

  const stadiumImgRef = useRef<HTMLImageElement | null>(null);
  const pitcherSpriteRef = useRef<CanvasImageSource | null>(null);
  const batterSpriteRef = useRef<CanvasImageSource | null>(null);

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

  // Determine current active batter in lineup order
  // If order === 3 (The Avatar Slugger), use player stats + gear
  // Otherwise use special batter cards
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

  const currentBatterName = isAvatarBatter ? 'Your Avatar Slugger' : currentCard.name;

  // Contact radius
  const aimCircleRadius = Math.max(22, 16 + currentContact * 0.32);

  // Preload graphics
  useEffect(() => {
    const bg = new Image();
    bg.src = '/stadium.jpg';
    bg.onload = () => {
      stadiumImgRef.current = bg;
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

    const isOutside = Math.random() < 0.28;
    const offsetX = isOutside
      ? (Math.random() > 0.5 ? 85 + Math.random() * 35 : -85 - Math.random() * 35)
      : (Math.random() * 90 - 45);
    const offsetY = isOutside
      ? (Math.random() > 0.5 ? 75 + Math.random() * 30 : -75 - Math.random() * 30)
      : (Math.random() * 70 - 35);

    const targetX = 400 + offsetX + config.breakX;
    const targetY = 440 + offsetY + config.breakY;

    ballRef.current = {
      active: true,
      startTime: performance.now(),
      duration: flightDuration,
      x: 400,
      y: 260,
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
        y: 440,
        vx: 0,
        vy: -20,
        vz: 9,
        z: 0,
        distFt: Math.round(dist),
      };

      setFeedback({
        text: '🔥 COMBO GRAND SLAM! 🔥',
        color: '#facc15',
        sub: `Automatic Home Run (${Math.round(dist)} FT)!`,
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
        text: distToAimCircle > aimCircleRadius * 1.5 ? 'MISSED AIM CIRCLE!' : 'SWING & MISS!',
        color: '#ef4444',
        sub: diff < 0 ? 'Too Early' : 'Too Late',
      });
      setPitchPrompt('RESULT');
      onInningEvent('Strike', 0, `${currentBatterName} whiffed at the pitch!`, 5);
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
      y: 440,
      vx: Math.cos(angle) * speed * 0.5,
      vy: Math.sin(angle) * speed,
      vz: outcome === 'Home Run' ? 8.5 : 4.8,
      z: 0,
      distFt: Math.round(baseDistance),
    };

    setFeedback({
      text: `${timingLabel}! ${outcome.toUpperCase()}`,
      color: outcome === 'Home Run' ? '#facc15' : outcome === 'Out' ? '#f97316' : '#38bdf8',
      sub: `${Math.round(baseDistance)} FT • +${comboGained}% COMBO`,
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

  // Main Canvas 60 FPS Render Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, 800, 520);

      // Stadium Art
      if (stadiumImgRef.current && stadiumImgRef.current.complete) {
        ctx.drawImage(stadiumImgRef.current, 0, 0, 800, 520);
      } else {
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(0, 0, 800, 240);
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, 240, 800, 280);
      }

      // Home Plate & Markings
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(390, 452);
      ctx.lineTo(410, 452);
      ctx.lineTo(416, 463);
      ctx.lineTo(400, 474);
      ctx.lineTo(384, 463);
      ctx.closePath();
      ctx.fill();

      // Batter Boxes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 2;
      ctx.strokeRect(315, 430, 48, 68);
      ctx.strokeRect(437, 430, 48, 68);

      // Strike Zone Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(330, 375, 140, 130);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(330 + 140 / 3, 375);
      ctx.lineTo(330 + 140 / 3, 505);
      ctx.moveTo(330 + (140 / 3) * 2, 375);
      ctx.lineTo(330 + (140 / 3) * 2, 505);
      ctx.moveTo(330, 375 + 130 / 3);
      ctx.lineTo(470, 375 + 130 / 3);
      ctx.moveTo(330, 375 + (130 / 3) * 2);
      ctx.lineTo(470, 375 + (130 / 3) * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pitcher Sprite
      ctx.save();
      const pX = 400;
      const pY = 275;
      if (pitcherSpriteRef.current) {
        const bounce = pitchPrompt === 'PITCHING' ? Math.sin(now / 80) * 3 : 0;
        ctx.drawImage(pitcherSpriteRef.current, pX - 45, pY - 80 + bounce, 90, 90);
      } else {
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(pX, pY - 5, 14, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Ball & Aiming Circle
      const ball = ballRef.current;
      if (ball && ball.active) {
        const elapsed = now - ball.startTime;
        const progress = Math.min(1.15, elapsed / ball.duration);

        const currentX = 400 + (ball.targetX - 400) * progress;
        const arcY = Math.sin(progress * Math.PI) * -38;
        const currentY = 250 + (ball.targetY - 250) * progress + arcY;
        const currentScale = 0.22 + progress * 0.98;

        ball.x = currentX;
        ball.y = currentY;
        ball.scale = currentScale;

        // AIMING CIRCLE
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
        ctx.lineTo(ball.targetX + 8, ball.targetY);
        ctx.stroke();
        ctx.restore();

        // Shadow & Seams
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(currentX, 465, 7 * currentScale, 3.5 * currentScale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = PITCH_CONFIGS[ball.pitchType].color;
        ctx.lineWidth = 3.5 * currentScale;
        ctx.beginPath();
        ctx.moveTo(currentX - (ball.targetX - 400) * 0.18, currentY - 18);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 11 * currentScale, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 1.5 * currentScale;
        ctx.beginPath();
        ctx.arc(currentX - 3.5 * currentScale, currentY, 6.5 * currentScale, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(currentX + 3.5 * currentScale, currentY, 6.5 * currentScale, Math.PI / 2, -Math.PI / 2);
        ctx.stroke();

        if (progress >= 1.08 && !ball.hit) {
          ball.active = false;
          const isBall = ball.isBall;
          const outcome: HitOutcome = isBall ? 'Ball' : 'Strike';
          sound.playStrike();
          setFeedback({
            text: isBall ? 'BALL!' : 'CALLED STRIKE!',
            color: isBall ? '#38bdf8' : '#ef4444',
            sub: isBall ? 'Outside strike zone' : 'Looking in zone',
          });
          setPitchPrompt('RESULT');
          onInningEvent(outcome, 0, isBall ? 'Pitch taken outside.' : 'Caught looking in zone.', isBall ? 5 : 0);
          if (outcome === 'Strike' && scoreboard.strikes >= 2) {
            advanceBatterOrder();
          }
        }
      }

      // Hit Flight
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

        if (flight.y < 200 || flight.z < 0) {
          flight.active = false;
        }
      }

      // Batter Sprite
      ctx.save();
      const bX = 330;
      const bY = 470;

      let batAngle = 0;
      if (swingProgressRef.current >= 0) {
        swingProgressRef.current += 0.085;
        const swingT = swingProgressRef.current;
        if (swingT <= 1) {
          batAngle = Math.sin(swingT * Math.PI) * -0.35;
        } else {
          swingProgressRef.current = -1;
        }
      }

      if (batterSpriteRef.current) {
        ctx.translate(bX, bY);
        ctx.rotate(batAngle);
        ctx.drawImage(batterSpriteRef.current, -70, -140, 140, 140);
      } else {
        ctx.fillStyle = '#1d4ed8';
        ctx.beginPath();
        ctx.arc(bX, bY - 14, 18, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Mouse Aim Reticle
      const mouse = mousePosRef.current;
      ctx.save();
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
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
  }, [aimCircleRadius, pitchPrompt, scoreboard.strikes, advanceBatterOrder]);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-2xl">
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

      {/* Top Banner: Pitcher & Batter HUD */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl text-left shadow-lg">
          <div className="text-[10px] uppercase font-black tracking-wider text-amber-400">Duel Pitcher</div>
          <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <span>⚾ {opponent.pitcherName}</span>
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
              {pitchDisplay ? `${pitchDisplay.speedMph} MPH` : `${opponent.pitcherVelocity} MPH`}
            </span>
          </div>
          {pitchDisplay && (
            <div className="text-xs text-slate-300 font-medium">
              Pitch: <span className="font-bold text-sky-400">{pitchDisplay.type}</span>
            </div>
          )}
        </div>

        {/* Current Batter & Combo Meter */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl text-right shadow-lg min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
            <span className="text-amber-400">⚡ COMBO FEVER</span>
            <span className={isAutoHomeRunReady ? 'text-yellow-300 animate-pulse font-black' : 'text-slate-300'}>
              {comboGauge}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mt-1 border border-slate-600">
            <div
              className={`h-full transition-all duration-300 ${
                isAutoHomeRunReady
                  ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 animate-pulse'
                  : 'bg-gradient-to-r from-sky-500 to-indigo-500'
              }`}
              style={{ width: `${comboGauge}%` }}
            />
          </div>
          <div className="text-[11px] font-bold text-slate-200 mt-1">
            Batter #{scoreboard.currentBatterOrder}: <strong className="text-amber-400">{currentBatterName}</strong>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center animate-bounce">
          <div
            className="text-4xl sm:text-5xl font-black italic tracking-wide text-stroke px-6 py-2 rounded-2xl drop-shadow-2xl"
            style={{ color: feedback.color, backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
          >
            {feedback.text}
          </div>
          {feedback.sub && (
            <div className="text-sm font-bold text-white bg-slate-900/90 px-3 py-1 rounded-full inline-block mt-2 border border-slate-700">
              {feedback.sub}
            </div>
          )}
        </div>
      )}

      {/* Bottom Floating Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
        <div className="text-xs text-slate-300 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-lg">
          <span className="font-bold text-amber-400">Aim:</span> Track <strong className="text-sky-400">Aiming Circle</strong> with cursor & swing on time (<kbd className="bg-slate-700 px-1 py-0.5 rounded text-white font-mono">SPACE</kbd>)
        </div>

        <div>
          {pitchPrompt === 'READY' || pitchPrompt === 'RESULT' ? (
            <button
              onClick={throwPitch}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm uppercase px-6 py-2.5 rounded-xl shadow-lg border border-emerald-400 active:scale-95 transition-transform cursor-pointer"
            >
              ⚾ Next Pitch
            </button>
          ) : (
            <button
              onClick={handleSwing}
              className={`font-black text-base uppercase px-8 py-2.5 rounded-xl shadow-xl transition-transform active:scale-95 cursor-pointer ${
                isAutoHomeRunReady
                  ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-red-500 text-slate-950 animate-bounce border-2 border-yellow-200'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white border border-amber-300'
              }`}
            >
              {isAutoHomeRunReady ? '🔥 GRAND SLAM SWING! 🔥' : '⚡ SWING BAT!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
