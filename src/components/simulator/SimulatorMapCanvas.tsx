import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { SimResult, TARGETS } from './simulatorEngine';

interface Props {
  targetX: number;
  selectedTarget: string;
  impactDone: boolean;
}

export interface SimulatorMapCanvasHandle {
  drawMap: () => void;
  drawImpactMap: (res: SimResult, prog: number) => void;
}

const SimulatorMapCanvas = forwardRef<SimulatorMapCanvasHandle, Props>(
  ({ targetX, selectedTarget, impactDone }, ref) => {
    const mapCanvasRef = useRef<HTMLCanvasElement>(null);
    const target = TARGETS.find(t => t.id === selectedTarget)!;

    const drawMap = useCallback(() => {
      const canvas = mapCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const W = canvas.width;
      const H = canvas.height;

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

      ctx.fillStyle = 'rgba(200,200,255,0.15)';
      const cx = W * 0.5;
      [0, -20, 20, -10, 15, -25, 8].forEach((ox, i) => {
        const bh = 12 + i * 4;
        ctx.fillRect(cx + ox - 4, H - bh, 8, bh);
      });

      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      const tx = targetX * W;
      const ty = H / 2;

      ctx.strokeStyle = 'rgba(255,60,0,0.9)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(tx - 16, ty); ctx.lineTo(tx + 16, ty); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tx, ty - 16); ctx.lineTo(tx, ty + 16); ctx.stroke();
      ctx.beginPath(); ctx.arc(tx, ty, 10, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(tx, ty, 20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,60,0,0.4)'; ctx.stroke();
    }, [targetX]);

    const drawImpactMap = useCallback((res: SimResult, prog: number) => {
      const canvas = mapCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const W = canvas.width;
      const H = canvas.height;

      drawMap();

      const tx = targetX * W;
      const ty = H / 2;
      const scale = W / 500;

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

      if (prog > 0.05 && res.survived) {
        const fbR = Math.min(prog * 3, 1) * res.fireballRadius * scale * 8;
        const fb = ctx.createRadialGradient(tx, ty, 0, tx, ty, fbR);
        fb.addColorStop(0, `rgba(255,255,200,${0.9 * Math.min(prog * 4, 1)})`);
        fb.addColorStop(0.4, `rgba(255,180,0,${0.7 * Math.min(prog * 4, 1)})`);
        fb.addColorStop(1, 'rgba(255,80,0,0)');
        ctx.fillStyle = fb;
        ctx.beginPath(); ctx.arc(tx, ty, fbR, 0, Math.PI * 2); ctx.fill();
      }

      if (prog > 0.3 && res.survived && res.craterDiameter > 0) {
        const craterR = Math.min((prog - 0.3) / 0.7, 1) * (res.craterDiameter / 2) * scale * 10;
        ctx.beginPath();
        ctx.arc(tx, ty, craterR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(40,20,10,0.85)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(180,80,0,0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(tx, ty, craterR * 1.15, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(150,100,50,0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

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
        }
      }
    }, [targetX, drawMap]);

    useImperativeHandle(ref, () => ({ drawMap, drawImpactMap }), [drawMap, drawImpactMap]);

    useEffect(() => { drawMap(); }, [drawMap]);

    return (
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
    );
  }
);

SimulatorMapCanvas.displayName = 'SimulatorMapCanvas';

export default SimulatorMapCanvas;
