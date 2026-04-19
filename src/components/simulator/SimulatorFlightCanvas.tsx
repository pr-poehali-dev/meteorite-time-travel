import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import Icon from '@/components/ui/icon';
import { SimParams, SimResult, Particle, seededRand, simulate } from './simulatorEngine';

interface Props {
  params: SimParams;
  targetX: number;
  running: boolean;
  onSimulationStart: (res: SimResult) => void;
  onSimulationEnd: () => void;
  onImpactProgress: (res: SimResult, prog: number) => void;
}

export interface SimulatorFlightCanvasHandle {
  runSimulation: () => void;
}

const SimulatorFlightCanvas = forwardRef<SimulatorFlightCanvasHandle, Props>(
  ({ params, targetX, running, onSimulationStart, onSimulationEnd, onImpactProgress }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const phaseRef = useRef<'flight' | 'impact' | 'done'>('done');
    const progressRef = useRef(0);
    const impactProgressRef = useRef(0);
    const particlesRef = useRef<Particle[]>([]);
    const smokeRef = useRef<Particle[]>([]);
    const debrisRef = useRef<Particle[]>([]);

    const runSimulation = () => {
      const canvas = canvasRef.current;
      if (!canvas || running) return;

      cancelAnimationFrame(animRef.current);

      const res: SimResult = simulate(params);
      onSimulationStart(res);

      const ctx = canvas.getContext('2d')!;
      const W = canvas.width;
      const H = canvas.height;

      const GROUND_Y = H * 0.72;
      const impactCanvasX = targetX * W;

      const startX = W * 0.05;
      const startY = H * 0.02;

      const endX = res.survived ? impactCanvasX : impactCanvasX * 0.8 + W * 0.1;
      const endY = res.survived ? GROUND_Y : H * (res.burnHeight / 130);

      phaseRef.current = 'flight';
      progressRef.current = 0;
      impactProgressRef.current = 0;
      particlesRef.current = [];
      smokeRef.current = [];
      debrisRef.current = [];

      const stars: { x: number; y: number; b: number; s: number }[] = [];
      for (let i = 0; i < 120; i++) {
        stars.push({
          x: (i * 137.508 + 17) % W,
          y: (i * 89.3 + 43) % (H * 0.42),
          b: 0.2 + seededRand(i) * 0.8,
          s: seededRand(i + 200) > 0.85 ? 1.5 : 1,
        });
      }

      const spawnEjecta = (ix: number, ip: number) => {
        if (particlesRef.current.length > 120) return;
        for (let e = 0; e < 6; e++) {
          const spAngle = -Math.PI + seededRand(ip * 1000 + e) * Math.PI;
          const spd = 40 + seededRand(ip * 500 + e + 100) * 120;
          const r = 1.5 + seededRand(ip * 300 + e) * 3;
          const rr = Math.floor(120 + seededRand(ip * 100 + e) * 80);
          const gg = Math.floor(60 + seededRand(ip * 200 + e) * 60);
          particlesRef.current.push({
            x: ix, y: GROUND_Y,
            vx: Math.cos(spAngle) * spd,
            vy: Math.sin(spAngle) * spd - 60,
            life: 1, maxLife: 1,
            r,
            color: `rgb(${rr},${gg},20)`,
          });
        }
      };

      const spawnSmoke = (x: number, y: number, ip: number) => {
        if (smokeRef.current.length > 80) return;
        for (let s = 0; s < 3; s++) {
          smokeRef.current.push({
            x: x + (seededRand(ip * 777 + s) - 0.5) * 14,
            y: y + (seededRand(ip * 888 + s) - 0.5) * 8,
            vx: (seededRand(ip * 999 + s) - 0.5) * 12,
            vy: -(8 + seededRand(ip * 111 + s) * 14),
            life: 1, maxLife: 1,
            r: 6 + seededRand(ip * 222 + s) * 12,
            color: `rgba(180,140,90,`,
          });
        }
      };

      const spawnDebris = (ix: number) => {
        debrisRef.current = [];
        for (let d = 0; d < 22; d++) {
          const ang = -Math.PI * 1.1 + seededRand(d * 13) * Math.PI * 1.2;
          const spd = 60 + seededRand(d * 17) * 200;
          debrisRef.current.push({
            x: ix, y: GROUND_Y,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd - 100,
            life: 1, maxLife: 1,
            r: 2 + seededRand(d * 7) * 4,
            color: `hsl(${20 + seededRand(d * 11) * 30},60%,${25 + seededRand(d * 19) * 25}%)`,
          });
        }
      };

      const drawScene = (dt: number) => {
        ctx.clearRect(0, 0, W, H);

        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#010608');
        bg.addColorStop(0.18, '#040a12');
        bg.addColorStop(0.42, '#070d18');
        bg.addColorStop(0.62, '#100806');
        bg.addColorStop(0.72, '#0c1508');
        bg.addColorStop(1, '#07110a');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const t = performance.now() / 1000;
        stars.forEach(s => {
          const twinkle = s.b * (0.7 + 0.3 * Math.sin(t * 1.2 + s.x));
          ctx.globalAlpha = twinkle;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(s.x, s.y, s.s, s.s);
        });
        ctx.globalAlpha = 1;

        const atmoLayers = [
          { y: 0.02, h: 0.08, label: 'Термосфера  80–700 км', color: 'rgba(80,120,255,0.04)' },
          { y: 0.10, h: 0.12, label: 'Мезосфера  50–80 км', color: 'rgba(60,100,220,0.07)' },
          { y: 0.22, h: 0.18, label: 'Стратосфера  12–50 км', color: 'rgba(40,80,180,0.10)' },
          { y: 0.40, h: 0.30, label: 'Тропосфера  0–12 км', color: 'rgba(30,60,140,0.13)' },
        ];
        atmoLayers.forEach(l => {
          ctx.fillStyle = l.color;
          ctx.fillRect(0, l.y * H, W, l.h * H);
          ctx.strokeStyle = 'rgba(80,120,255,0.12)';
          ctx.lineWidth = 1;
          ctx.setLineDash([6, 6]);
          ctx.beginPath(); ctx.moveTo(0, l.y * H); ctx.lineTo(W, l.y * H); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(130,170,255,0.30)';
          ctx.font = '9px Golos Text';
          ctx.fillText(l.label, 6, (l.y + 0.022) * H);
        });

        const horizonGlow = ctx.createLinearGradient(0, GROUND_Y - 40, 0, GROUND_Y + 10);
        horizonGlow.addColorStop(0, 'rgba(30,80,20,0)');
        horizonGlow.addColorStop(1, 'rgba(20,50,10,0.6)');
        ctx.fillStyle = horizonGlow;
        ctx.fillRect(0, GROUND_Y - 40, W, 50);

        const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, H);
        groundGrad.addColorStop(0, '#1e3a10');
        groundGrad.addColorStop(0.3, '#162e0c');
        groundGrad.addColorStop(1, '#0a1a06');
        ctx.fillStyle = groundGrad;
        ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y);
        for (let x = 0; x <= W; x += 20) {
          const bump = Math.sin(x * 0.04) * 4 + Math.sin(x * 0.11) * 2 + Math.sin(x * 0.027) * 6;
          ctx.lineTo(x, GROUND_Y + bump);
        }
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
        ctx.fillStyle = '#1a3208';
        ctx.fill();

        const tx = impactCanvasX;
        ctx.strokeStyle = 'rgba(255,60,0,0.55)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(tx, GROUND_Y - 20); ctx.lineTo(tx, GROUND_Y + 12); ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(tx, GROUND_Y, 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,60,0,0.45)'; ctx.lineWidth = 1.5; ctx.stroke();

        const p = progressRef.current;
        const ip = impactProgressRef.current;
        const phase = phaseRef.current;

        if (phase === 'flight' || (phase === 'impact' && p >= 1)) {
          const fp = Math.min(p, 1);
          const curX = startX + (endX - startX) * fp;
          const curY = startY + (endY - startY) * fp;

          const speedFactor = fp < 0.6 ? 1 : 1 - (fp - 0.6) * 0.6;

          if (fp > 0.04 && fp < 0.25) {
            const entryFlash = (fp - 0.04) / 0.21;
            const flashAlpha = Math.sin(entryFlash * Math.PI) * 0.25;
            const flashGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, 60);
            flashGrad.addColorStop(0, `rgba(160,200,255,${flashAlpha})`);
            flashGrad.addColorStop(1, 'rgba(80,120,255,0)');
            ctx.fillStyle = flashGrad;
            ctx.beginPath(); ctx.arc(curX, curY, 60, 0, Math.PI * 2); ctx.fill();
          }

          if (fp > 0.05) {
            const coneLen = 80 + fp * 50;
            const dx = endX - startX;
            const dy = endY - startY;
            const len = Math.sqrt(dx * dx + dy * dy);
            const nx = -dy / len;
            const ny = dx / len;
            const tipX = curX - (dx / len) * coneLen;
            const tipY = curY - (dy / len) * coneLen;
            const coneW = (6 + fp * 18) * speedFactor;
            const intensity = Math.min(fp * 2.5, 1);

            const coneGrad = ctx.createLinearGradient(tipX, tipY, curX, curY);
            coneGrad.addColorStop(0, 'rgba(255,180,50,0)');
            coneGrad.addColorStop(0.5, `rgba(255,140,20,${0.18 * intensity})`);
            coneGrad.addColorStop(1, `rgba(255,80,0,${0.5 * intensity})`);

            ctx.beginPath();
            ctx.moveTo(tipX, tipY);
            ctx.lineTo(curX + nx * coneW, curY + ny * coneW);
            ctx.lineTo(curX - nx * coneW, curY - ny * coneW);
            ctx.closePath();
            ctx.fillStyle = coneGrad;
            ctx.fill();
          }

          const trailSegments = 36;
          for (let seg = trailSegments; seg >= 1; seg--) {
            const t0 = Math.max(0, fp - seg * 0.028);
            const t1 = Math.max(0, fp - (seg - 1) * 0.028);
            const x0 = startX + (endX - startX) * t0;
            const y0 = startY + (endY - startY) * t0;
            const x1 = startX + (endX - startX) * t1;
            const y1 = startY + (endY - startY) * t1;
            const frac = 1 - seg / trailSegments;
            const alpha = frac * 0.85;
            const width = 1 + frac * 4;
            const g = Math.floor(50 + frac * 100);
            ctx.beginPath();
            ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
            ctx.strokeStyle = `rgba(255,${g},0,${alpha})`;
            ctx.lineWidth = width;
            ctx.lineCap = 'round';
            ctx.stroke();
            if (seg < trailSegments * 0.7) {
              ctx.beginPath();
              ctx.moveTo(x0, y0); ctx.lineTo(x1, y1);
              ctx.strokeStyle = `rgba(255,120,0,${frac * 0.2})`;
              ctx.lineWidth = width * 3;
              ctx.stroke();
            }
          }

          if (fp < 1) {
            const intensity = Math.min(fp * 3, 1);

            const haloR = 30 + intensity * 50;
            const halo = ctx.createRadialGradient(curX, curY, 0, curX, curY, haloR);
            halo.addColorStop(0, `rgba(255,160,30,${0.12 * intensity})`);
            halo.addColorStop(1, 'rgba(255,60,0,0)');
            ctx.fillStyle = halo;
            ctx.beginPath(); ctx.arc(curX, curY, haloR, 0, Math.PI * 2); ctx.fill();

            const glowR = 10 + intensity * 30;
            const glow = ctx.createRadialGradient(curX, curY, 0, curX, curY, glowR);
            glow.addColorStop(0, `rgba(255,240,180,${0.98 * intensity})`);
            glow.addColorStop(0.2, `rgba(255,180,40,${0.9 * intensity})`);
            glow.addColorStop(0.6, `rgba(255,80,0,${0.55 * intensity})`);
            glow.addColorStop(1, 'rgba(200,30,0,0)');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(curX, curY, glowR, 0, Math.PI * 2); ctx.fill();

            if (fp > 0.15) {
              for (let sp = 0; sp < 5; sp++) {
                const sparkAngle = seededRand(Math.floor(fp * 200) + sp) * Math.PI * 2;
                const sparkDist = 5 + seededRand(Math.floor(fp * 300) + sp + 10) * (8 + intensity * 12);
                const sx = curX + Math.cos(sparkAngle) * sparkDist;
                const sy = curY + Math.sin(sparkAngle) * sparkDist;
                const sparkA = seededRand(Math.floor(fp * 400) + sp + 20) * 0.8 * intensity;
                ctx.fillStyle = `rgba(255,220,80,${sparkA})`;
                ctx.beginPath(); ctx.arc(sx, sy, 1 + seededRand(sp * 7) * 1.5, 0, Math.PI * 2); ctx.fill();
              }
            }

            const rockR = 5 + Math.min(params.mass / 8000, 7);
            ctx.beginPath();
            ctx.arc(curX, curY, rockR, 0, Math.PI * 2);
            const rockGrad = ctx.createRadialGradient(curX - rockR * 0.4, curY - rockR * 0.4, 0, curX, curY, rockR);
            rockGrad.addColorStop(0, '#FFD080');
            rockGrad.addColorStop(0.35, '#E07830');
            rockGrad.addColorStop(0.7, '#8B4A1B');
            rockGrad.addColorStop(1, '#1A0A04');
            ctx.fillStyle = rockGrad;
            ctx.fill();
            ctx.strokeStyle = `rgba(255,200,80,${0.6 * intensity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            const kmAlt = Math.round((1 - fp) * 110);
            ctx.fillStyle = 'rgba(200,220,255,0.75)';
            ctx.font = '10px Golos Text';
            ctx.fillText(`▲ ${kmAlt} км`, curX + rockR + 4, curY - 6);

            const curSpeed = params.velocity * (1 - fp * 0.3);
            ctx.fillStyle = 'rgba(255,180,80,0.6)';
            ctx.font = '9px Golos Text';
            ctx.fillText(`${curSpeed.toFixed(0)} км/с`, curX + rockR + 4, curY + 8);
          }

          if (fp > 0.1 && fp < 0.99 && phase === 'flight') {
            spawnSmoke(curX, curY, fp);
          }
        }

        smokeRef.current = smokeRef.current.filter(s => s.life > 0);
        smokeRef.current.forEach(s => {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.vy += 5 * dt;
          s.life -= dt * 0.9;
          s.r += dt * 8;
          const a = Math.max(0, s.life * 0.18);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color}${a})`;
          ctx.fill();
        });

        if (phase === 'impact' || phase === 'done') {
          const ix = endX;
          const iy = endY;

          if (!res.survived) {
            if (ip < 0.7) {
              const ringR = Math.min(ip / 0.7, 1) * 160;
              ctx.beginPath(); ctx.arc(ix, iy, ringR, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255,220,100,${Math.max(0, 0.5 - ip * 0.7)})`;
              ctx.lineWidth = 2;
              ctx.stroke();

              if (ip > 0.05) {
                const ring2R = ringR * 0.65;
                ctx.beginPath(); ctx.arc(ix, iy, ring2R, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,140,0,${Math.max(0, 0.4 - ip * 0.6)})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
              }
            }

            const expMaxR = 130;
            const expR = Math.min(ip * 1.6, 1) * expMaxR;

            const exp3 = ctx.createRadialGradient(ix, iy, 0, ix, iy, expR * 1.5);
            exp3.addColorStop(0, `rgba(255,180,50,${0.15 * Math.max(0, 1 - ip)})`);
            exp3.addColorStop(0.6, `rgba(200,80,0,${0.2 * Math.max(0, 1 - ip * 0.8)})`);
            exp3.addColorStop(1, 'rgba(100,30,0,0)');
            ctx.fillStyle = exp3;
            ctx.fillRect(ix - expR * 1.5, iy - expR * 1.5, expR * 3, expR * 3);

            const exp = ctx.createRadialGradient(ix, iy, 0, ix, iy, expR);
            exp.addColorStop(0, `rgba(255,255,220,${Math.max(0, 1 - ip * 1.2)})`);
            exp.addColorStop(0.25, `rgba(255,220,80,${Math.max(0, 0.9 - ip)})`);
            exp.addColorStop(0.6, `rgba(255,100,0,${Math.max(0, 0.7 - ip * 0.8)})`);
            exp.addColorStop(1, 'rgba(180,40,0,0)');
            ctx.fillStyle = exp;
            ctx.fillRect(ix - expR, iy - expR, expR * 2, expR * 2);

            if (ip > 0.2) {
              const stemH = Math.min((ip - 0.2) / 0.8, 1) * 80;
              const stemW = 12 * Math.max(0, 1 - ip * 0.5);
              const stemAlpha = Math.max(0, 0.4 - (ip - 0.2) * 0.3);
              const stemGrad = ctx.createLinearGradient(ix, iy, ix, iy - stemH);
              stemGrad.addColorStop(0, `rgba(220,160,60,${stemAlpha})`);
              stemGrad.addColorStop(1, `rgba(160,100,40,0)`);
              ctx.fillStyle = stemGrad;
              ctx.beginPath();
              ctx.ellipse(ix, iy - stemH / 2, stemW, stemH / 2, 0, 0, Math.PI * 2);
              ctx.fill();

              if (ip > 0.35) {
                const capProg = Math.min((ip - 0.35) / 0.65, 1);
                const capR = 20 + capProg * 30;
                const capAlpha = Math.max(0, 0.5 - capProg * 0.4);
                const capGrad = ctx.createRadialGradient(ix, iy - stemH, 0, ix, iy - stemH, capR);
                capGrad.addColorStop(0, `rgba(240,180,80,${capAlpha})`);
                capGrad.addColorStop(0.7, `rgba(180,100,40,${capAlpha * 0.6})`);
                capGrad.addColorStop(1, 'rgba(120,60,20,0)');
                ctx.fillStyle = capGrad;
                ctx.beginPath(); ctx.arc(ix, iy - stemH, capR, 0, Math.PI * 2); ctx.fill();
              }
            }

            if (ip > 0.05 && ip < 0.6) {
              for (let d = 0; d < 14; d++) {
                const dAngle = seededRand(d * 31 + Math.floor(ip * 10)) * Math.PI * 2;
                const dDist = (seededRand(d * 17 + 5) * 80) * Math.min(ip * 3, 1);
                const dx2 = ix + Math.cos(dAngle) * dDist;
                const dy2 = iy + Math.sin(dAngle) * dDist;
                const da = Math.max(0, 0.7 - ip);
                ctx.fillStyle = `rgba(255,${100 + d * 8},0,${da})`;
                ctx.beginPath(); ctx.arc(dx2, dy2, 1.5 + seededRand(d * 23) * 2, 0, Math.PI * 2); ctx.fill();
              }
            }

            if (ip > 0.3) {
              ctx.fillStyle = `rgba(255,210,80,${Math.max(0, 1.5 - ip)})`;
              ctx.font = 'bold 15px Oswald';
              ctx.textAlign = 'center';
              ctx.fillText('ВЗРЫВ В АТМОСФЕРЕ', ix, iy - 65);
              ctx.font = '11px Golos Text';
              ctx.fillStyle = `rgba(255,160,60,${Math.max(0, 1.3 - ip)})`;
              ctx.fillText(`Высота: ${res.burnHeight} км · ${res.energyReleased}`, ix, iy - 48);
              ctx.textAlign = 'left';
            }

          } else {
            const embedDepth = Math.min(ip * 2, 1) * 18;
            const craterR = Math.min(ip * 1.8, 1) * (12 + Math.min(params.mass / 1800, 24));

            if (ip < 0.15) {
              const flashAlpha = Math.sin((ip / 0.15) * Math.PI) * 0.7;
              const flashR = ip * 200;
              const flash = ctx.createRadialGradient(ix, GROUND_Y, 0, ix, GROUND_Y, flashR);
              flash.addColorStop(0, `rgba(255,255,220,${flashAlpha})`);
              flash.addColorStop(0.3, `rgba(255,200,80,${flashAlpha * 0.6})`);
              flash.addColorStop(1, 'rgba(255,100,0,0)');
              ctx.fillStyle = flash;
              ctx.beginPath(); ctx.arc(ix, GROUND_Y, flashR, 0, Math.PI * 2); ctx.fill();
            }

            if (ip < 0.9) {
              for (let wave = 0; wave < 3; wave++) {
                const waveDelay = wave * 0.08;
                if (ip > waveDelay) {
                  const waveProgress = Math.min((ip - waveDelay) / 0.9, 1);
                  const waveR = waveProgress * (180 + wave * 40);
                  const waveAlpha = Math.max(0, 0.55 - waveProgress * 0.65) / (wave + 1);
                  ctx.beginPath();
                  ctx.arc(ix, GROUND_Y, waveR, Math.PI, 0);
                  ctx.strokeStyle = `rgba(255,${140 - wave * 20},0,${waveAlpha})`;
                  ctx.lineWidth = 2 - wave * 0.4;
                  ctx.stroke();
                }
              }
            }

            if (ip > 0.08) {
              const crackAlpha = Math.min((ip - 0.08) / 0.3, 1) * 0.6;
              for (let cr = 0; cr < 8; cr++) {
                const crAngle = (cr / 8) * Math.PI;
                const crLen = (20 + seededRand(cr * 13) * 50) * Math.min(ip * 2, 1);
                ctx.beginPath();
                ctx.moveTo(ix, GROUND_Y);
                const cx2 = ix + Math.cos(crAngle) * crLen;
                const cy2 = GROUND_Y + Math.abs(Math.sin(crAngle)) * crLen * 0.3;
                const midX = ix + Math.cos(crAngle) * crLen * 0.5 + (seededRand(cr * 7) - 0.5) * 12;
                const midY = GROUND_Y + (seededRand(cr * 9) - 0.5) * 8;
                ctx.quadraticCurveTo(midX, midY, cx2, cy2);
                ctx.strokeStyle = `rgba(60,30,10,${crackAlpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }

            if (ip > 0.01 && ip < 0.4) {
              spawnEjecta(ix, ip);
            }
            if (ip > 0.01 && debrisRef.current.length === 0) {
              spawnDebris(ix);
            }

            particlesRef.current = particlesRef.current.filter(ep => ep.life > 0);
            particlesRef.current.forEach(ep => {
              ep.x += ep.vx * dt;
              ep.y += ep.vy * dt;
              ep.vy += 200 * dt;
              ep.life -= dt * 1.5;
              if (ep.y > GROUND_Y + ep.r) {
                ep.y = GROUND_Y + ep.r;
                ep.vy *= -0.25;
                ep.vx *= 0.7;
              }
              const a = Math.max(0, ep.life * 0.9);
              ctx.fillStyle = ep.color.replace(')', `,${a})`).replace('rgb', 'rgba');
              ctx.beginPath(); ctx.arc(ep.x, ep.y, ep.r, 0, Math.PI * 2); ctx.fill();
            });

            debrisRef.current = debrisRef.current.filter(d => d.life > 0);
            debrisRef.current.forEach(d => {
              d.x += d.vx * dt;
              d.y += d.vy * dt;
              d.vy += 280 * dt;
              d.life -= dt * 0.7;
              if (d.y > GROUND_Y) {
                d.y = GROUND_Y;
                d.vy *= -0.2;
                d.vx *= 0.6;
              }
              const a = Math.max(0, d.life * 0.85);
              ctx.globalAlpha = a;
              ctx.fillStyle = d.color;
              ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
              ctx.globalAlpha = 1;
            });

            if (ip > 0.08) {
              const dustProg = Math.min((ip - 0.08) / 0.92, 1);
              const dustR = dustProg * (50 + Math.min(params.mass / 5000, 40));
              const dustH = dustR * 1.6;
              const dustAlpha = dustProg * 0.45 * Math.max(0, 1.6 - dustProg);
              const dust = ctx.createRadialGradient(ix, GROUND_Y - dustH * 0.4, 0, ix, GROUND_Y - dustH * 0.4, dustR * 1.2);
              dust.addColorStop(0, `rgba(200,160,100,${dustAlpha})`);
              dust.addColorStop(0.5, `rgba(160,120,70,${dustAlpha * 0.6})`);
              dust.addColorStop(1, 'rgba(120,90,50,0)');
              ctx.fillStyle = dust;
              ctx.save();
              ctx.scale(1, 0.65);
              ctx.beginPath();
              ctx.arc(ix, (GROUND_Y - dustH * 0.4) / 0.65, dustR * 1.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }

            ctx.beginPath();
            ctx.ellipse(ix, GROUND_Y, craterR, craterR * 0.42, 0, 0, Math.PI * 2);
            const craterGrad = ctx.createRadialGradient(ix, GROUND_Y, 0, ix, GROUND_Y, craterR);
            craterGrad.addColorStop(0, 'rgba(15,6,2,1)');
            craterGrad.addColorStop(0.6, 'rgba(30,12,4,0.95)');
            craterGrad.addColorStop(1, 'rgba(50,25,8,0.8)');
            ctx.fillStyle = craterGrad;
            ctx.fill();

            ctx.beginPath();
            ctx.ellipse(ix, GROUND_Y, craterR, craterR * 0.42, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(200,100,20,${0.7 * Math.min(ip, 1)})`;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(ix, GROUND_Y - 2, craterR * 1.12, craterR * 0.5, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(140,90,40,${0.4 * Math.min(ip, 1)})`;
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.ellipse(ix, GROUND_Y + 2, craterR * 0.65, craterR * 0.27, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(8,3,1,0.85)';
            ctx.fill();

            if (ip > 0.2) {
              const moltR = craterR * 0.35 * Math.min((ip - 0.2) / 0.8, 1);
              const molt = ctx.createRadialGradient(ix, GROUND_Y, 0, ix, GROUND_Y, moltR);
              molt.addColorStop(0, `rgba(255,200,50,${0.7 * Math.min((ip - 0.2) * 2, 1)})`);
              molt.addColorStop(0.5, `rgba(255,100,0,${0.4 * Math.min((ip - 0.2) * 2, 1)})`);
              molt.addColorStop(1, 'rgba(180,40,0,0)');
              ctx.fillStyle = molt;
              ctx.beginPath();
              ctx.ellipse(ix, GROUND_Y, moltR, moltR * 0.4, 0, 0, Math.PI * 2);
              ctx.fill();
            }

            if (ip > 0.4) {
              const fragY = GROUND_Y + Math.min((ip - 0.4) * 2, 1) * embedDepth;
              const fragR = 4 + Math.min(params.mass / 6000, 7);
              const fGrad = ctx.createRadialGradient(ix - 2, fragY - 2, 0, ix, fragY, fragR);
              fGrad.addColorStop(0, '#C09060');
              fGrad.addColorStop(0.5, '#8B5A2B');
              fGrad.addColorStop(1, '#2A1A08');
              ctx.beginPath(); ctx.arc(ix, fragY, fragR, 0, Math.PI * 2);
              ctx.fillStyle = fGrad; ctx.fill();
              ctx.strokeStyle = `rgba(255,160,40,${Math.max(0, 0.8 - ip)})`;
              ctx.lineWidth = 1.5;
              ctx.stroke();
            }

            if (ip > 0.5) {
              const blastProg = Math.min((ip - 0.5) * 2, 1);
              const blastPx = blastProg * res.blastRadius * 3.5;
              ctx.beginPath(); ctx.arc(ix, GROUND_Y, blastPx, 0, Math.PI * 2);
              ctx.setLineDash([5, 5]);
              ctx.strokeStyle = `rgba(255,100,0,${0.35 * blastProg})`;
              ctx.lineWidth = 1.5;
              ctx.stroke();
              ctx.setLineDash([]);

              if (ip > 0.75) {
                ctx.fillStyle = 'rgba(255,180,80,0.92)';
                ctx.font = 'bold 11px Oswald';
                ctx.textAlign = 'center';
                ctx.fillText(`💥 ${res.energyReleased}`, ix, GROUND_Y - 38);
                ctx.font = '10px Golos Text';
                ctx.fillStyle = 'rgba(200,220,255,0.8)';
                ctx.fillText(`Зона поражения: ${res.blastRadius} км`, ix, GROUND_Y - 24);
                if (res.craterDiameter > 0) {
                  ctx.fillStyle = 'rgba(255,140,60,0.8)';
                  ctx.fillText(`Кратер: ⌀ ${res.craterDiameter} км`, ix, GROUND_Y - 10);
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
          progressRef.current += dt * 0.5;
          if (progressRef.current >= 1) {
            progressRef.current = 1;
            phaseRef.current = 'impact';
            impactProgressRef.current = 0;
          }
        } else if (phaseRef.current === 'impact') {
          impactProgressRef.current += dt * 0.65;
          if (impactProgressRef.current >= 1) {
            impactProgressRef.current = 1;
            phaseRef.current = 'done';
            onImpactProgress(res, 1);
            onSimulationEnd();
            return;
          }
          onImpactProgress(res, impactProgressRef.current);
        }

        drawScene(dt);
        animRef.current = requestAnimationFrame(animate);
      };

      animRef.current = requestAnimationFrame(animate);
    };

    useImperativeHandle(ref, () => ({ runSimulation }));

    useEffect(() => {
      return () => cancelAnimationFrame(animRef.current);
    }, []);

    return (
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
        <canvas ref={canvasRef} width={760} height={340} className="w-full" style={{ background: '#010608' }} />
      </div>
    );
  }
);

SimulatorFlightCanvas.displayName = 'SimulatorFlightCanvas';

export default SimulatorFlightCanvas;