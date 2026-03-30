import { useRef, useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface SimParams {
  angle: number;
  velocity: number;
  mass: number;
  composition: string;
}

interface SimResult {
  survived: boolean;
  impact: boolean;
  fragments: number;
  energyReleased: string;
  finalVelocity: number;
  burnHeight: number;
}

function simulate(params: SimParams): SimResult {
  const { angle, velocity, mass, composition } = params;
  const angleRad = (angle * Math.PI) / 180;
  const kineticEnergy = 0.5 * mass * velocity * velocity * 1000;
  const energyMt = kineticEnergy / 4.184e15;

  const densityFactor = composition === 'iron' ? 1.4 : composition === 'stony' ? 1.0 : 0.7;
  const ablationRate = (1 - densityFactor * 0.2) * (velocity / 20) * Math.sin(angleRad);

  const survived = mass * densityFactor > 100 && velocity < 40 && angle < 75;
  const impact = survived && angle > 10;
  const burnHeight = Math.max(5, 80 - angle * 0.5 - (mass / 1000) * 5);
  const finalVelocity = survived ? velocity * 0.3 : velocity * ablationRate;
  const fragments = impact
    ? Math.max(1, Math.floor(mass / 500) + (angle > 45 ? 3 : 1))
    : 0;

  return {
    survived,
    impact,
    fragments,
    energyReleased: energyMt < 0.001 ? `${(energyMt * 1000).toFixed(3)} кт` : `${energyMt.toFixed(2)} Мт`,
    finalVelocity: Math.round(finalVelocity * 10) / 10,
    burnHeight: Math.round(burnHeight),
  };
}

export default function AtmosphereSimulator({ onAchievement }: { onAchievement: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [params, setParams] = useState<SimParams>({
    angle: 30,
    velocity: 20,
    mass: 1000,
    composition: 'stony',
  });
  const [result, setResult] = useState<SimResult | null>(null);
  const [running, setRunning] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const handleChange = (key: keyof SimParams, val: number | string) => {
    setParams(p => ({ ...p, [key]: val }));
    if (!hasChanged) {
      setHasChanged(true);
      onAchievement();
    }
    setResult(null);
  };

  const runSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas || running) return;
    setRunning(true);
    const res = simulate(params);
    setResult(res);

    const ctx = canvas.getContext('2d')!;
    const W = canvas.width;
    const H = canvas.height;

    let progress = 0;
    const angleRad = (params.angle * Math.PI) / 180;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Space gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#060d1a');
      bg.addColorStop(0.35, '#0a1628');
      bg.addColorStop(0.6, '#1a0a05');
      bg.addColorStop(0.75, '#0d1a08');
      bg.addColorStop(1, '#0a1a05');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137 + 17) % W);
        const sy = ((i * 89 + 43) % (H * 0.5));
        ctx.fillRect(sx, sy, 1, 1);
      }

      // Atmosphere layers
      const layers = [
        { y: 0.05, h: 0.1, label: 'Термосфера 100+ км', color: 'rgba(100,150,255,0.07)' },
        { y: 0.15, h: 0.1, label: 'Мезосфера 50-80 км', color: 'rgba(80,120,220,0.1)' },
        { y: 0.25, h: 0.15, label: 'Стратосфера 12-50 км', color: 'rgba(60,100,180,0.13)' },
        { y: 0.4, h: 0.2, label: 'Тропосфера 0-12 км', color: 'rgba(40,80,150,0.18)' },
      ];

      layers.forEach(l => {
        ctx.fillStyle = l.color;
        ctx.fillRect(0, l.y * H, W, l.h * H);
        ctx.fillStyle = 'rgba(150,180,255,0.4)';
        ctx.font = '10px Golos Text';
        ctx.fillText(l.label, 6, (l.y + 0.02) * H);
      });

      // Ground
      const ground = ctx.createLinearGradient(0, H * 0.6, 0, H);
      ground.addColorStop(0, '#1a2a0a');
      ground.addColorStop(1, '#0d1a05');
      ctx.fillStyle = ground;
      ctx.fillRect(0, H * 0.6, W, H * 0.4);

      // Meteorite trajectory
      const startX = W * 0.1;
      const startY = H * 0.02;
      const endX = W * 0.8;
      const endY = res.survived ? H * 0.62 : H * (res.burnHeight / 100);

      const curX = startX + (endX - startX) * progress;
      const curY = startY + (endY - startY) * progress;

      // Trail
      const trailLen = Math.min(progress, 0.3);
      const trailStart = Math.max(0, progress - trailLen);
      const tGrad = ctx.createLinearGradient(
        startX + (endX - startX) * trailStart,
        startY + (endY - startY) * trailStart,
        curX, curY
      );
      tGrad.addColorStop(0, 'rgba(255,140,0,0)');
      tGrad.addColorStop(0.5, 'rgba(255,100,0,0.4)');
      tGrad.addColorStop(1, 'rgba(255,60,0,0.8)');
      ctx.beginPath();
      ctx.moveTo(startX + (endX - startX) * trailStart, startY + (endY - startY) * trailStart);
      ctx.lineTo(curX, curY);
      ctx.strokeStyle = tGrad;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Glow halo
      if (progress < 1) {
        const intensity = Math.sin(progress * Math.PI) * 0.9;
        const glow = ctx.createRadialGradient(curX, curY, 0, curX, curY, 30);
        glow.addColorStop(0, `rgba(255,180,0,${intensity})`);
        glow.addColorStop(0.4, `rgba(255,80,0,${intensity * 0.5})`);
        glow.addColorStop(1, 'rgba(255,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(curX - 30, curY - 30, 60, 60);

        // Meteorite rock
        ctx.beginPath();
        ctx.arc(curX, curY, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#6B5B3E';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(curX - 2, curY - 2, 7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,200,50,${intensity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Explosion / crater on finish
      if (progress >= 1) {
        if (!res.survived) {
          // Airblast explosion
          const expR = 40 * Math.min(1, (progress - 1) * 3 + 0.5);
          const exp = ctx.createRadialGradient(endX, endY, 0, endX, endY, expR);
          exp.addColorStop(0, 'rgba(255,255,200,0.9)');
          exp.addColorStop(0.2, 'rgba(255,180,0,0.7)');
          exp.addColorStop(0.6, 'rgba(255,60,0,0.3)');
          exp.addColorStop(1, 'rgba(200,0,0,0)');
          ctx.fillStyle = exp;
          ctx.fillRect(endX - expR, endY - expR, expR * 2, expR * 2);

          ctx.fillStyle = 'rgba(255,220,100,0.9)';
          ctx.font = 'bold 14px Oswald';
          ctx.fillText('ВЗРЫВ В АТМОСФЕРЕ', endX - 90, endY - 50);
        } else {
          // Ground impact
          ctx.beginPath();
          ctx.ellipse(endX, H * 0.62, 25, 8, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(80,50,10,0.8)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(200,100,0,0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Fragments
          if (res.fragments > 1) {
            for (let f = 0; f < Math.min(res.fragments, 5); f++) {
              const fx = endX + (f - 2) * 18;
              const fy = H * 0.615;
              ctx.beginPath();
              ctx.arc(fx, fy, 3, 0, Math.PI * 2);
              ctx.fillStyle = '#8B6914';
              ctx.fill();
            }
          }

          ctx.fillStyle = 'rgba(100,220,100,0.9)';
          ctx.font = 'bold 14px Oswald';
          ctx.fillText('ПРИЗЕМЛЕНИЕ!', endX - 60, H * 0.59);
        }
      }

      // Progress label
      if (progress < 1) {
        const kmAlt = Math.round((1 - progress) * 120);
        ctx.fillStyle = 'rgba(255,200,100,0.8)';
        ctx.font = '11px Golos Text';
        ctx.fillText(`Высота: ${kmAlt} км`, curX + 12, curY - 8);
      }

      if (progress < 1) {
        progress = Math.min(1, progress + 0.012);
        animRef.current = requestAnimationFrame(draw);
      } else {
        setRunning(false);
      }
    };

    animRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="font-oswald text-lg text-cosmos-orange">Параметры полёта</h3>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Угол входа</span>
              <span className="text-cosmos-orange font-bold">{params.angle}°</span>
            </div>
            <input
              type="range" min={5} max={90} value={params.angle}
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
            <input
              type="range" min={11} max={72} value={params.velocity}
              onChange={e => handleChange('velocity', +e.target.value)}
              className="w-full h-2 rounded-full slider-thumb cursor-pointer"
              style={{ background: `linear-gradient(to right, hsl(190,90%,55%) ${(params.velocity - 11) / 61 * 100}%, rgba(255,255,255,0.1) 0%)` }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>11 км/с (мин)</span><span>72 км/с (макс)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Масса</span>
              <span className="text-cosmos-purple font-bold">{params.mass >= 1000 ? `${params.mass / 1000} т` : `${params.mass} кг`}</span>
            </div>
            <input
              type="range" min={10} max={100000} step={10} value={params.mass}
              onChange={e => handleChange('mass', +e.target.value)}
              className="w-full h-2 rounded-full slider-thumb cursor-pointer"
              style={{ background: `linear-gradient(to right, hsl(265,70%,65%) ${params.mass / 100000 * 100}%, rgba(255,255,255,0.1) 0%)` }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>10 кг</span><span>100 тонн</span>
            </div>
          </div>

          <div>
            <span className="text-sm text-muted-foreground block mb-2">Состав</span>
            <div className="grid grid-cols-3 gap-2">
              {(['iron', 'stony', 'carbonaceous'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => handleChange('composition', c)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    params.composition === c
                      ? 'bg-cosmos-orange text-black'
                      : 'glass-card text-muted-foreground hover:text-foreground'
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
          <h3 className="font-oswald text-lg text-cosmos-cyan">Результат симуляции</h3>
          {result ? (
            <div className="space-y-3 animate-fade-in-up">
              <div className={`rounded-xl p-3 text-center font-oswald text-xl ${
                result.survived
                  ? 'bg-green-900/30 text-green-400 border border-green-800'
                  : 'bg-red-900/30 text-red-400 border border-red-800'
              }`}>
                {result.survived ? '✅ Метеорит выжил!' : '💥 Сгорел в атмосфере'}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: 'Выделено энергии', value: result.energyReleased, icon: '⚡' },
                  { label: 'Конечная скорость', value: `${result.finalVelocity} км/с`, icon: '🚀' },
                  { label: 'Высота разрушения', value: `${result.burnHeight} км`, icon: '📏' },
                  { label: 'Фрагменты', value: result.fragments > 0 ? `${result.fragments} шт.` : 'нет', icon: '🪨' },
                ].map(item => (
                  <div key={item.label} className="bg-white/5 rounded-lg p-2.5">
                    <div className="text-lg">{item.icon}</div>
                    <div className="text-muted-foreground text-xs">{item.label}</div>
                    <div className="text-foreground font-bold mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-900/20 border border-blue-800/40 rounded-lg p-3 text-xs text-blue-300">
                <span className="font-bold">Физика:</span>{' '}
                {params.angle < 15
                  ? 'Скользящий вход — метеорит теряет скорость медленно, но рискует рикошетом от атмосферы'
                  : params.angle > 70
                  ? 'Отвесное падение — максимальное давление, быстрый нагрев и фрагментация'
                  : 'Оптимальный угол — классическое прохождение атмосферы с аблацией'}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <div className="text-4xl mb-3">🌠</div>
              <p className="text-muted-foreground text-sm">Настрой параметры и запусти симуляцию</p>
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-3 flex items-center justify-between border-b border-white/10">
          <span className="font-oswald text-sm text-muted-foreground">ВИЗУАЛИЗАЦИЯ ТРАЕКТОРИИ</span>
          <button
            onClick={runSimulation}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cosmos-orange text-black font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Icon name={running ? 'Loader' : 'Play'} size={16} className={running ? 'animate-spin' : ''} />
            {running ? 'Симуляция...' : 'Запустить'}
          </button>
        </div>
        <canvas
          ref={canvasRef}
          width={760}
          height={300}
          className="w-full"
          style={{ background: '#060d1a' }}
        />
      </div>
    </div>
  );
}
