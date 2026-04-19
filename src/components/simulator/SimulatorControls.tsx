import { SimParams, SimResult, TARGETS } from './simulatorEngine';

interface Props {
  params: SimParams;
  result: SimResult | null;
  selectedTarget: string;
  onParamChange: (key: keyof SimParams, val: number | string) => void;
  onSelectTarget: (t: typeof TARGETS[0]) => void;
}

export default function SimulatorControls({ params, result, selectedTarget, onParamChange, onSelectTarget }: Props) {
  const target = TARGETS.find(t => t.id === selectedTarget)!;

  return (
    <>
      {/* Target selector */}
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-oswald text-base text-muted-foreground mb-3">🎯 ВЫБЕРИ ТОЧКУ ПАДЕНИЯ</h3>
        <div className="grid grid-cols-5 gap-2">
          {TARGETS.map(t => (
            <button
              key={t.id}
              onClick={() => onSelectTarget(t)}
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
              onChange={e => onParamChange('angle', +e.target.value)}
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
              onChange={e => onParamChange('velocity', +e.target.value)}
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
              onChange={e => onParamChange('mass', +e.target.value)}
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
                <button key={c} onClick={() => onParamChange('composition', c)}
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
    </>
  );
}
