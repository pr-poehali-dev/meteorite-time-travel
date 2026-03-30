import { useRef, useEffect, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';

interface SimParams {
  angle: number;
  velocity: number;
  mass: number;
  composition: string;
}

interface SimResult {
  survived: boolean;
  energyReleased: string;
  energyMt: number;
  finalVelocity: number;
  burnHeight: number;
  craterDiameter: number;
  blastRadius: number;
  fireballRadius: number;
  fragments: number;
}

function simulate(params: SimParams): SimResult {
  const { angle, velocity, mass, composition } = params;
  const angleRad = (angle * Math.PI) / 180;
  const densityFactor = composition === 'iron' ? 1.4 : composition === 'stony' ? 1.0 : 0.7;
  const kineticEnergy = 0.5 * mass * densityFactor * velocity * velocity * 1000;
  const energyMt = kineticEnergy / 4.184e15;

  const survived = mass * densityFactor > 80 && velocity < 45 && angle < 80;
  const burnHeight = Math.max(5, 85 - angle * 0.6 - (mass / 800) * 4);
  const finalVelocity = survived ? velocity * (0.15 + 0.2 * Math.cos(angleRad)) : velocity * 0.05;

  // Crater & blast based on energy
  const craterDiameter = survived ? Math.pow(energyMt * 1000, 0.294) * 0.8 : 0;
  const blastRadius = Math.pow(energyMt, 0.333) * 4.5;
  const fireballRadius = Math.pow(energyMt, 0.333) * 1.8;

  return {
    survived,
    energyReleased: energyMt < 0.001
      ? `${(energyMt * 1000).toFixed(2)} кт`
      : energyMt < 1
      ? `${(energyMt * 1000).toFixed(0)} кт`
      : `${energyMt.toFixed(2)} Мт`,
    energyMt,
    finalVelocity: Math.round(finalVelocity * 10) / 10,
    burnHeight: Math.round(burnHeight),
    craterDiameter: Math.max(0, Math.round(craterDiameter * 10) / 10),
    blastRadius: Math.max(0.1, Math.round(blastRadius * 10) / 10),
    fireballRadius: Math.max(0.05, Math.round(fireballRadius * 10) / 10),
    fragments: survived ? Math.max(1, Math.floor(mass / 600) + (angle > 45 ? 4 : 1)) : 0,
  };
}

// Map target cities
const TARGETS = [
  { id: 'city', label: '🏙️ Мегаполис', x: 0.5, emoji: '🏙️' },
  { id: 'forest', label: '🌲 Тайга', x: 0.25, emoji: '🌲' },
  { id: 'ocean', label: '🌊 Океан', x: 0.75, emoji: '🌊' },
  { id: 'desert', label: '🏜️ Пустыня', x: 0.38, emoji: '🏜️' },
  { id: 'mountain', label: '⛰️ Горы', x: 0.62, emoji: '⛰️' },
];

export default function AtmosphereSimulator({ onAchievement }: { onAchievement: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapCanvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef<'flight' | 'impact' | 'done'>('done');
  const progressRef = useRef(0);
  const impactProgressRef = useRef(0);

  const [params, setParams] = useState<SimParams>({
    angle: 35,
    velocity: 22,
    mass: 5000,
    composition: 'stony',
  });
  const [result, setResult] = useState<SimResult | null>(null);
  const [running, setRunning] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [targetX, setTargetX] = useState(0.5); // 0..1 on canvas
  const [selectedTarget, setSelectedTarget] = useState('city');
  const [impactDone, setImpactDone] = useState(false);

  const handleChange = (key: keyof SimParams, val: number | string) => {
    setParams(p => ({ ...p, [key]: val }));
    if (!hasChanged) { setHasChanged(true); onAchievement(); }
    setResult(null);
    setImpactDone(false);
  };

  const selectTarget = (t: typeof TARGETS[0]) => {
    setSelectedTarget(t.id);
    setTargetX(t.x);
    setResult(null);
    setImpactDone(false);
  };

  // Draw static map
  const drawMap = useCallback(() => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;

    // Base terrain
    const terrain = ctx.createLinearGradient(0, 0, W, 0);
    terrain.addColorStop(0, '#1a3a0a');
    terrain.addColorStop(0.2, '#2a5a18');
    terrain.addColorStop(0.35, '#3a6a25');
    terrain.addColorStop(0.45, '#1a5080');
    terrain.addColorStop(0.55, '#1a6090');
    terrain.addColorStop(0.6, '#3a6a25');
    terrain.addColorStop(0.75, '#c8a830');
    terrain.addColorStop(0.85, '#8a6020');
    terrain.addColorStop(1, '#4a7a2a');
    ctx.fillStyle = terrain;
    ctx.fillRect(0, 0, W, H);

    // City silhouette
    ctx.fillStyle = 'rgba(200,200,255,0.15)';
    const cx = W * 0.5;
    [0, -20, 20, -10, 15, -25, 8].forEach((ox, i) => {
      const bh = 12 + i * 4;
      ctx.fillRect(cx + ox - 4, H - bh, 8, bh);
    });

    // Grid overlay
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Target marker
    const tx = targetX * W;
    const ty = H / 2;

    // Crosshair
    ctx.strokeStyle = 'rgba(255,60,0,0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(tx - 16, ty); ctx.lineTo(tx + 16, ty); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tx, ty - 16); ctx.lineTo(tx, ty + 16); ctx.stroke();
    ctx.beginPath(); ctx.arc(tx, ty, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(tx, ty, 20, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,60,0,0.4)'; ctx.stroke();
  }, [targetX]);

  useEffect(() => { drawMap(); }, [drawMap]);

  const drawImpactMap = useCallback((res: SimResult, prog: number) => {
    const canvas = mapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;

    drawMap();

    const tx = targetX * W;
    const ty = H / 2;
    const scale = W / 500; // 500km viewport

    // Ejecta / shockwave ring expanding
    if (prog > 0.1) {
      const waveR = Math.min(prog * 2, 1) * res.blastRadius * scale * 8;
      const wave = ctx.createRadialGradient(tx, ty, 0, tx, ty, waveR);
      wave.addColorStop(0, 'rgba(255,150,0,0)');
      wave.addColorStop(0.7, 'rgba(255,100,0,0.15)');
      wave.addColorStop(0.9, 'rgba(255,60,0,0.3)');
      wave.addColorStop(1, 'rgba(255,30,0,0)');
      ctx.fillStyle = wave;
      ctx.beginPath(); ctx.arc(tx, ty, waveR, 0, Math.PI * 2); ctx.fill();
    }

    // Fireball
    if (prog > 0.05 && res.survived) {
      const fbR = Math.min(prog * 3, 1) * res.fireballRadius * scale * 8;
      const fb = ctx.createRadialGradient(tx, ty, 0, tx, ty, fbR);
      fb.addColorStop(0, `rgba(255,255,200,${0.9 * Math.min(prog * 4, 1)})`);
      fb.addColorStop(0.4, `rgba(255,180,0,${0.7 * Math.min(prog * 4, 1)})`);
      fb.addColorStop(1, 'rgba(255,80,0,0)');
      ctx.fillStyle = fb;
      ctx.beginPath(); ctx.arc(tx, ty, fbR, 0, Math.PI * 2); ctx.fill();
    }

    // Crater (ground impact)
    if (prog > 0.3 && res.survived && res.craterDiameter > 0) {
      const craterR = Math.min((prog - 0.3) / 0.7, 1) * (res.craterDiameter / 2) * scale * 10;
      ctx.beginPath();
      ctx.arc(tx, ty, craterR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40,20,10,0.85)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(180,80,0,0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rim
      ctx.beginPath();
      ctx.arc(tx, ty, craterR * 1.15, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(150,100,50,0.5)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Blast radius label
    if (prog > 0.6) {
      const labelR = res.blastRadius * scale * 8;
      ctx.strokeStyle = 'rgba(255,100,0,0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.arc(tx, ty, labelR, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(255,180,80,0.9)';
      ctx.font = `bold ${10 * scale + 8}px Oswald`;
      ctx.fillText(`⚡ ${res.blastRadius} км`, tx + labelR + 4, ty - 4);
    }

    // Fragments scatter
    if (prog > 0.5 && res.fragments > 1) {
      for (let f = 0; f < Math.min(res.fragments, 8); f++) {
        const angle = (f / res.fragments) * Math.PI * 2;
        const dist = (20 + f * 8) * scale * Math.min((prog - 0.5) * 2, 1);
        const fx = tx + Math.cos(angle) * dist;
        const fy = ty + Math.sin(angle) * dist * 0.6;
        ctx.beginPath();
        ctx.arc(fx, fy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#8B6914';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,140,0,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }, [targetX, drawMap]);

  const runSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas || running) return;

    cancelAnimationFrame(animRef.current);
    setRunning(true);
    setImpactDone(false);

    const res = simulate(params);
    setResult(res);

    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;

    const GROUND_Y = H * 0.72;
    const impactCanvasX = targetX * W;

    // Flight phase: from top-left → impact point on ground
    const startX = W * 0.05;
    const startY = H * 0.02;

    // If survived → goes into ground, else explodes mid-air
    const endX = res.survived ? impactCanvasX : impactCanvasX * 0.8 + W * 0.1;
    const endY = res.survived ? GROUND_Y : H * (res.burnHeight / 130);

    phaseRef.current = 'flight';
    progressRef.current = 0;
    impactProgressRef.current = 0;

    const drawScene = () => {
      ctx.clearRect(0, 0, W, H);

      // === BACKGROUND ===
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#020810');
      bg.addColorStop(0.25, '#060d1a');
      bg.addColorStop(0.5, '#0a1020');
      bg.addColorStop(0.65, '#1a0c05');
      bg.addColorStop(0.72, '#0d1608');
      bg.addColorStop(1, '#071208');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (let i = 0; i < 80; i++) {
        const sx = (i * 137 + 17) % W;
        const sy = (i * 89 + 43) % (H * 0.45);
        const brightness = 0.3 + ((i * 31) % 7) * 0.1;
        ctx.fillStyle = `rgba(255,255,255,${brightness})`;
        ctx.fillRect(sx, sy, 1, 1);
      }

      // === ATMOSPHERE LAYERS ===
      const atmoLayers = [
        { y: 0.02, h: 0.08, label: 'Термосфера  80–700 км', color: 'rgba(80,120,255,0.06)' },
        { y: 0.10, h: 0.12, label: 'Мезосфера  50–80 км', color: 'rgba(60,100,220,0.09)' },
        { y: 0.22, h: 0.18, label: 'Стратосфера  12–50 км', color: 'rgba(40,80,180,0.12)' },
        { y: 0.40, h: 0.30, label: 'Тропосфера  0–12 км', color: 'rgba(30,60,140,0.16)' },
      ];
      atmoLayers.forEach(l => {
        ctx.fillStyle = l.color;
        ctx.fillRect(0, l.y * H, W, l.h * H);
        ctx.fillStyle = 'rgba(130,170,255,0.35)';
        ctx.font = '9px Golos Text';
        ctx.fillText(l.label, 6, (l.y + 0.022) * H);
      });

      // === TERRAIN ===
      // Sky glow at horizon
      const horizonGlow = ctx.createLinearGradient(0, GROUND_Y - 30, 0, GROUND_Y + 10);
      horizonGlow.addColorStop(0, 'rgba(30,80,20,0)');
      horizonGlow.addColorStop(1, 'rgba(20,50,10,0.8)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, GROUND_Y - 30, W, 40);

      // Ground base
      const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, H);
      groundGrad.addColorStop(0, '#1e3a10');
      groundGrad.addColorStop(0.3, '#162e0c');
      groundGrad.addColorStop(1, '#0a1a06');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

      // Terrain bumps
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y);
      for (let x = 0; x <= W; x += 30) {
        const bump = Math.sin(x * 0.04) * 4 + Math.sin(x * 0.11) * 2;
        ctx.lineTo(x, GROUND_Y + bump);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = '#1a3208';
      ctx.fill();

      // Target marker on ground
      const tx = impactCanvasX;
      ctx.strokeStyle = 'rgba(255,60,0,0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(tx, GROUND_Y - 20); ctx.lineTo(tx, GROUND_Y + 12); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(tx, GROUND_Y, 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,60,0,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();

      const p = progressRef.current;
      const ip = impactProgressRef.current;
      const phase = phaseRef.current;

      // === FLIGHT PHASE ===
      if (phase === 'flight' || (phase === 'impact' && p >= 1)) {
        const fp = Math.min(p, 1);
        const curX = startX + (endX - startX) * fp;
        const curY = startY + (endY - startY) * fp;

        // Trail with fading opacity
        const trailSegments = 25;
        for (let seg = trailSegments; seg >= 1; seg--) {
          const t0 = Math.max(0, fp - seg * 0.035);
          const t1 = Math.max(0, fp - (seg - 1) * 0.035);
          const x0 = startX + (endX - startX) * t0;
          const y0 = startY + (endY - startY) * t0;
          const x1 = startX + (endX - startX) * t1;
          const y1 = startY + (endY - startY) * t1;
          const alpha = (1 - seg / trailSegments) * 0.7;
          const width = 1 + (1 - seg / trailSegments) * 3;
          ctx.beginPath();
          ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
          ctx.strokeStyle = `rgba(255,${80 + seg * 4},0,${alpha})`;
          ctx.lineWidth = width;
          ctx.stroke();
        }

        // Hot glow around meteorite
        if (fp < 1) {
          const intensity = Math.min(fp * 3, 1);
          const glowR = 8 + intensity * 25;
          const glow = ctx.createRadialGradient(curX, curY, 0, curX, curY, glowR);
          glow.addColorStop(0, `rgba(255,220,100,${0.95 * intensity})`);
          glow.addColorStop(0.3, `rgba(255,120,0,${0.6 * intensity})`);
          glow.addColorStop(1, 'rgba(255,40,0,0)');
          ctx.fillStyle = glow;
          ctx.fillRect(curX - glowR, curY - glowR, glowR * 2, glowR * 2);

          // Rock body
          const rockR = 5 + Math.min(params.mass / 8000, 6);
          ctx.beginPath();
          ctx.arc(curX, curY, rockR, 0, Math.PI * 2);
          const rockGrad = ctx.createRadialGradient(curX - 2, curY - 2, 0, curX, curY, rockR);
          rockGrad.addColorStop(0, '#FFA050');
          rockGrad.addColorStop(0.5, '#8B5A2B');
          rockGrad.addColorStop(1, '#3A2010');
          ctx.fillStyle = rockGrad;
          ctx.fill();

          // Altitude label
          const kmAlt = Math.round((1 - fp) * 110);
          ctx.fillStyle = 'rgba(255,210,100,0.85)';
          ctx.font = '10px Golos Text';
          ctx.fillText(`▲ ${kmAlt} км`, curX + 10, curY - 8);
        }
      }

      // === IMPACT PHASE ===
      if (phase === 'impact' || phase === 'done') {
        const ix = endX;
        const iy = endY;

        if (!res.survived) {
          // Airblast
          const expR = Math.min(ip * 1.5, 1) * 70;
          const exp2R = Math.min(ip * 1.2, 1) * 120;
          const exp2 = ctx.createRadialGradient(ix, iy, 0, ix, iy, exp2R);
          exp2.addColorStop(0, `rgba(255,255,180,${0.3 * (1 - ip)})`);
          exp2.addColorStop(0.5, `rgba(255,120,0,${0.4 * (1 - ip * 0.7)})`);
          exp2.addColorStop(1, 'rgba(200,50,0,0)');
          ctx.fillStyle = exp2;
          ctx.fillRect(ix - exp2R, iy - exp2R, exp2R * 2, exp2R * 2);

          const exp = ctx.createRadialGradient(ix, iy, 0, ix, iy, expR);
          exp.addColorStop(0, `rgba(255,255,220,${Math.max(0, 1 - ip * 1.5)})`);
          exp.addColorStop(0.3, `rgba(255,180,0,${0.9 * (1 - ip)})`);
          exp.addColorStop(1, 'rgba(255,50,0,0)');
          ctx.fillStyle = exp;
          ctx.fillRect(ix - expR, iy - expR, expR * 2, expR * 2);

          if (ip > 0.3) {
            ctx.fillStyle = `rgba(255,200,80,${Math.max(0, 1.5 - ip)})`;
            ctx.font = 'bold 15px Oswald';
            ctx.textAlign = 'center';
            ctx.fillText('ВЗРЫВ В АТМОСФЕРЕ', ix, iy - 55);
            ctx.font = '11px Golos Text';
            ctx.fillStyle = `rgba(255,160,60,${Math.max(0, 1.3 - ip)})`;
            ctx.fillText(`Высота: ${res.burnHeight} км · ${res.energyReleased}`, ix, iy - 38);
            ctx.textAlign = 'left';
          }
        } else {
          // Ground impact — meteorite buries into ground
          const embedDepth = Math.min(ip * 2, 1) * 18;
          const craterR = Math.min(ip * 1.5, 1) * (10 + Math.min(params.mass / 2000, 20));

          // Shockwave ring
          if (ip < 0.8) {
            const waveR = ip * 180;
            ctx.beginPath(); ctx.arc(ix, GROUND_Y, waveR, Math.PI, 0);
            ctx.strokeStyle = `rgba(255,140,0,${Math.max(0, 0.7 - ip)})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Ejecta spray upward
          if (ip > 0.05 && ip < 0.7) {
            for (let e = 0; e < 16; e++) {
              const eAngle = (-Math.PI * 0.9) + (e / 15) * Math.PI * 0.9;
              const eDist = (30 + e * 5) * Math.min(ip * 3, 1);
              const ex = ix + Math.cos(eAngle) * eDist;
              const ey = GROUND_Y + Math.sin(eAngle) * eDist * 0.8;
              ctx.beginPath(); ctx.arc(ex, ey, 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${120 + e * 5},${80 + e * 3},30,${0.8 - ip})`;
              ctx.fill();
            }
          }

          // Dust cloud
          if (ip > 0.1) {
            const dustR = Math.min(ip * 2, 1) * 50;
            const dust = ctx.createRadialGradient(ix, GROUND_Y, 0, ix, GROUND_Y - 10, dustR);
            dust.addColorStop(0, `rgba(180,140,80,${0.5 * Math.min(ip * 2, 1) * Math.max(0, 1.5 - ip)})`);
            dust.addColorStop(1, 'rgba(140,100,60,0)');
            ctx.fillStyle = dust;
            ctx.fillRect(ix - dustR, GROUND_Y - dustR, dustR * 2, dustR);
          }

          // Crater
          ctx.beginPath();
          ctx.ellipse(ix, GROUND_Y, craterR, craterR * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(30,15,5,0.9)';
          ctx.fill();
          ctx.strokeStyle = `rgba(180,90,20,${0.7})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Crater inner shadow
          ctx.beginPath();
          ctx.ellipse(ix, GROUND_Y + 1, craterR * 0.7, craterR * 0.3, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(15,8,2,0.7)';
          ctx.fill();

          // Meteorite fragment embedded
          if (ip > 0.4) {
            const fragY = GROUND_Y + Math.min((ip - 0.4) * 2, 1) * embedDepth;
            const fragR = 4 + Math.min(params.mass / 6000, 7);
            const fGrad = ctx.createRadialGradient(ix - 2, fragY - 2, 0, ix, fragY, fragR);
            fGrad.addColorStop(0, '#8B7355');
            fGrad.addColorStop(1, '#2A1A08');
            ctx.beginPath(); ctx.arc(ix, fragY, fragR, 0, Math.PI * 2);
            ctx.fillStyle = fGrad; ctx.fill();
          }

          // Blast radius dashed circle
          if (ip > 0.5) {
            const blastPx = Math.min((ip - 0.5) * 2, 1) * res.blastRadius * 3.5;
            ctx.beginPath(); ctx.arc(ix, GROUND_Y, blastPx, 0, Math.PI * 2);
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = `rgba(255,100,0,${0.4 * Math.min((ip - 0.5) * 2, 1)})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.setLineDash([]);

            if (ip > 0.75) {
              ctx.fillStyle = 'rgba(255,180,80,0.9)';
              ctx.font = 'bold 11px Oswald';
              ctx.textAlign = 'center';
              ctx.fillText(`💥 ${res.energyReleased}`, ix, GROUND_Y - 30);
              ctx.font = '10px Golos Text';
              ctx.fillStyle = 'rgba(200,200,255,0.8)';
              ctx.fillText(`Зона поражения: ${res.blastRadius} км`, ix, GROUND_Y - 16);
              if (res.craterDiameter > 0) {
                ctx.fillStyle = 'rgba(255,140,60,0.8)';
                ctx.fillText(`Кратер: ⌀ ${res.craterDiameter} км`, ix, GROUND_Y - 2);
              }
              ctx.textAlign = 'left';
            }
          }
        }
      }
    };

    let lastTs = 0;
    const animate = (ts: number) => {
      const dt = Math.min(ts - lastTs, 50) / 1000;
      lastTs = ts;

      if (phaseRef.current === 'flight') {
        progressRef.current += dt * 0.55;
        if (progressRef.current >= 1) {
          progressRef.current = 1;
          phaseRef.current = 'impact';
          impactProgressRef.current = 0;
        }
      } else if (phaseRef.current === 'impact') {
        impactProgressRef.current += dt * 0.7;
        if (impactProgressRef.current >= 1) {
          impactProgressRef.current = 1;
          phaseRef.current = 'done';
          // Draw impact map
          drawImpactMap(res, 1);
          setRunning(false);
          setImpactDone(true);
          return;
        }
        drawImpactMap(res, impactProgressRef.current);
      }

      drawScene();
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const target = TARGETS.find(t => t.id === selectedTarget)!;

  return (
    <div className="space-y-5">
      {/* Target selector */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-oswald text-base text-muted-foreground mb-3">🎯 ВЫБЕРИ ТОЧКУ ПАДЕНИЯ</h3>
        <div className="grid grid-cols-5 gap-2">
          {TARGETS.map(t => (
            <button
              key={t.id}
              onClick={() => selectTarget(t)}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-xs font-medium transition-all border ${
                selectedTarget === t.id
                  ? 'bg-red-900/40 border-red-500/60 text-red-300 scale-105'
                  : 'glass-card border-transparent text-muted-foreground hover:text-foreground hover:border-white/20'
              }`}
            >
              <span className="text-2xl">{t.emoji}</span>
              <span>{t.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="font-oswald text-lg text-cosmos-orange">Параметры полёта</h3>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Угол входа</span>
              <span className="text-cosmos-orange font-bold">{params.angle}°</span>
            </div>
            <input type="range" min={5} max={90} value={params.angle}
              onChange={e => handleChange('angle', +e.target.value)}
              className="w-full h-2 rounded-full slider-thumb cursor-pointer"
              style={{ background: `linear-gradient(to right, hsl(28,95%,55%) ${params.angle / 90 * 100}%, rgba(255,255,255,0.1) 0%)` }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Скользящий 5°</span><span>Отвесный 90°</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Скорость входа</span>
              <span className="text-cosmos-cyan font-bold">{params.velocity} км/с</span>
            </div>
            <input type="range" min={11} max={72} value={params.velocity}
              onChange={e => handleChange('velocity', +e.target.value)}
              className="w-full h-2 rounded-full slider-thumb cursor-pointer"
              style={{ background: `linear-gradient(to right, hsl(190,90%,55%) ${(params.velocity - 11) / 61 * 100}%, rgba(255,255,255,0.1) 0%)` }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>11 км/с</span><span>72 км/с</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Масса</span>
              <span className="text-cosmos-purple font-bold">
                {params.mass >= 1000000 ? `${(params.mass / 1000000).toFixed(1)} Мт` : params.mass >= 1000 ? `${params.mass / 1000} т` : `${params.mass} кг`}
              </span>
            </div>
            <input type="range" min={100} max={500000} step={100} value={params.mass}
              onChange={e => handleChange('mass', +e.target.value)}
              className="w-full h-2 rounded-full slider-thumb cursor-pointer"
              style={{ background: `linear-gradient(to right, hsl(265,70%,65%) ${params.mass / 500000 * 100}%, rgba(255,255,255,0.1) 0%)` }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>100 кг</span><span>500 тонн</span>
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground block mb-2">Состав</span>
            <div className="grid grid-cols-3 gap-2">
              {(['iron', 'stony', 'carbonaceous'] as const).map(c => (
                <button key={c} onClick={() => handleChange('composition', c)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    params.composition === c ? 'bg-cosmos-orange text-black' : 'glass-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c === 'iron' ? '⚙️ Железный' : c === 'stony' ? '🪨 Каменный' : '⚫ Углистый'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="glass-card rounded-xl p-5 space-y-3">
          <h3 className="font-oswald text-lg text-cosmos-cyan">Результат</h3>
          {result ? (
            <div className="space-y-3 animate-fade-in-up">
              <div className={`rounded-xl p-3 text-center font-oswald text-lg ${
                result.survived
                  ? 'bg-green-900/30 text-green-400 border border-green-800'
                  : 'bg-red-900/30 text-red-400 border border-red-800'
              }`}>
                {result.survived ? `✅ Удар по ${target.label}!` : '💥 Сгорел в атмосфере'}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: 'Энергия', value: result.energyReleased, icon: '⚡' },
                  { label: 'Зона поражения', value: `${result.blastRadius} км`, icon: '💥' },
                  { label: 'Кратер', value: result.craterDiameter > 0 ? `⌀ ${result.craterDiameter} км` : 'нет', icon: '🕳️' },
                  { label: 'Огненный шар', value: `${result.fireballRadius} км`, icon: '🔥' },
                  { label: 'Фрагменты', value: result.fragments > 0 ? `${result.fragments} шт.` : 'нет', icon: '🪨' },
                  { label: 'Конечная скорость', value: `${result.finalVelocity} км/с`, icon: '🚀' },
                ].map(item => (
                  <div key={item.label} className="bg-white/5 rounded-lg p-2">
                    <div className="text-base">{item.icon}</div>
                    <div className="text-muted-foreground text-xs">{item.label}</div>
                    <div className="text-foreground font-bold text-sm mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>
              {result.survived && (
                <div className="bg-blue-900/20 border border-blue-800/40 rounded-lg p-3 text-xs text-blue-300">
                  <span className="font-bold">Для сравнения:</span>{' '}
                  {result.energyMt < 0.02 ? 'Как несколько тонн тротила — локальный ущерб'
                    : result.energyMt < 0.5 ? `Как ${(result.energyMt * 1000 / 15).toFixed(0)} ядерных бомб Хиросимы`
                    : result.energyMt < 10 ? `Как ${result.energyMt.toFixed(1)} Мт — сопоставимо с мощнейшими ядерными бомбами`
                    : `Как ${result.energyMt.toFixed(0)} Мт — региональная катастрофа`}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-44 text-center">
              <div className="text-5xl mb-3 animate-float">🎯</div>
              <p className="text-muted-foreground text-sm">Выбери цель и запусти симуляцию</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Цель: <span className="text-cosmos-orange">{target.label}</span></p>
            </div>
          )}
        </div>
      </div>

      {/* Flight canvas */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-3 flex items-center justify-between border-b border-white/10">
          <span className="font-oswald text-sm text-muted-foreground">ТРАЕКТОРИЯ ПОЛЁТА</span>
          <button onClick={runSimulation} disabled={running}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cosmos-orange text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Icon name={running ? 'Loader' : 'Play'} size={16} className={running ? 'animate-spin' : ''} />
            {running ? 'Симуляция...' : 'Запустить'}
          </button>
        </div>
        <canvas ref={canvasRef} width={760} height={340} className="w-full" style={{ background: '#020810' }} />
      </div>

      {/* Impact map canvas */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <span className="font-oswald text-sm text-muted-foreground">КАРТА ПОРАЖЕНИЯ — {target.label}</span>
          {impactDone && (
            <span className="text-xs text-cosmos-orange animate-pulse-glow px-2 py-1 rounded bg-orange-900/20 border border-orange-700/30">
              ● Удар зафиксирован
            </span>
          )}
        </div>
        <canvas ref={mapCanvasRef} width={760} height={180} className="w-full" style={{ background: '#070f05' }} />
        <div className="px-4 py-2 flex gap-4 text-xs text-muted-foreground border-t border-white/5">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block" /> Кратер</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-orange-400 border-dashed border-t inline-block" /> Зона взрыва</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-yellow-400 inline-block" /> Огненный шар</span>
        </div>
      </div>
    </div>
  );
}
