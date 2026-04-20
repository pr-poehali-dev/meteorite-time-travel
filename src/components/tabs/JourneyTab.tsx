import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { METEORITES, TIMELINE_STAGES, type Meteorite } from '@/data/meteorites';

const SPACE_IMG = 'https://cdn.poehali.dev/projects/98e9b97e-d2eb-49c5-964c-d4435d389621/files/6e027fd7-7e8a-46c7-a1e9-9b8205ef1884.jpg';
const ATMO_IMG = 'https://cdn.poehali.dev/projects/98e9b97e-d2eb-49c5-964c-d4435d389621/files/c68d9a12-1e80-4674-895d-0126c1fbdb2c.jpg';
const CRATER_IMG = 'https://cdn.poehali.dev/projects/98e9b97e-d2eb-49c5-964c-d4435d389621/files/66f71feb-1c95-46db-b8d3-bc9fad8dd6aa.jpg';

const stageColors = ['#8B5CF6', '#06B6D4', '#F97316', '#22C55E'];

const FILTER_LABELS: Record<string, string> = {
  all: 'Все',
  iron: '⚙️ Железные',
  stony: '🪨 Каменные',
  carbonaceous: '⚫ Углистые',
  martian: '🔴 Марсианские',
  lunar: '🌕 Лунные',
};

interface JourneyTabProps {
  selectedMeteorite: Meteorite | null;
  journeyStage: number;
  setJourneyStage: (s: number | ((prev: number) => number)) => void;
  setSelectedMeteorite: (m: Meteorite | null) => void;
  setActiveTab: (tab: string) => void;
  advanceJourney: () => void;
  viewedMeteorites: string[];
  selectMeteorite: (m: Meteorite) => void;
}

export default function JourneyTab({
  selectedMeteorite,
  journeyStage,
  setJourneyStage,
  setSelectedMeteorite,
  advanceJourney,
  viewedMeteorites,
  selectMeteorite,
}: JourneyTabProps) {
  const [filterType, setFilterType] = useState('all');
  const stageData = TIMELINE_STAGES[journeyStage];

  const filtered = filterType === 'all'
    ? METEORITES
    : METEORITES.filter(m => m.type === filterType);

  return (
    <div className="animate-fade-in-up">
      {!selectedMeteorite ? (
        /* ── Экран выбора метеорита ── */
        <div>
          <div className="mb-6">
            <h2 className="font-oswald text-3xl text-foreground mb-2">Хроноскоп</h2>
            <p className="text-muted-foreground">Выбери метеорит, чтобы отправиться в путешествие по его 4.5-миллиардной истории</p>
          </div>

          {/* Фильтры */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {Object.entries(FILTER_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilterType(key)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  filterType === key
                    ? 'bg-cosmos-cyan text-black font-bold'
                    : 'glass-card text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Сетка метеоритов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <div
                key={m.id}
                onClick={() => selectMeteorite(m)}
                className="glass-card rounded-2xl p-5 cursor-pointer hover:border-cosmos-orange/40 border border-transparent transition-all hover:scale-[1.02] hover:-translate-y-1 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl group-hover:animate-float">{m.emoji}</div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      m.difficulty === 'beginner' ? 'bg-green-900/40 text-green-400'
                        : m.difficulty === 'intermediate' ? 'bg-yellow-900/40 text-yellow-400'
                        : 'bg-red-900/40 text-red-400'
                    }`}>
                      {m.difficulty === 'beginner' ? 'Начинающий'
                        : m.difficulty === 'intermediate' ? 'Опытный'
                        : 'Эксперт'}
                    </span>
                    {viewedMeteorites.includes(m.id) && (
                      <span className="text-xs text-cosmos-orange">✓ Изучен</span>
                    )}
                  </div>
                </div>
                <h3 className="font-oswald text-xl text-foreground mb-0.5">{m.name}</h3>
                <p className="text-cosmos-cyan text-sm mb-3">{m.typeLabel}</p>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{m.description}</p>
                <div className="grid grid-cols-3 gap-2 text-center border-t border-white/10 pt-3">
                  {[
                    { label: 'Возраст', value: m.age },
                    { label: 'Масса', value: m.mass },
                    { label: 'Найден', value: m.found },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-xs font-bold text-foreground">{item.value}</div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2 rounded-lg border border-cosmos-orange/30 text-cosmos-orange text-sm font-medium group-hover:bg-cosmos-orange group-hover:text-black transition-all">
                  Запустить хроноскоп →
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ── Путешествие ── */
        <div>
          <div className="glass-card rounded-2xl p-6 mb-6 flex items-center gap-5">
            <div className="text-6xl animate-float">{selectedMeteorite.emoji}</div>
            <div className="flex-1">
              <div className="text-cosmos-orange text-sm font-bold mb-1">ХРОНОСКОП АКТИВЕН</div>
              <h2 className="font-oswald text-3xl text-foreground">{selectedMeteorite.name}</h2>
              <p className="text-muted-foreground">{selectedMeteorite.typeLabel} · {selectedMeteorite.country} · {selectedMeteorite.found}</p>
            </div>
            <button
              onClick={() => { setSelectedMeteorite(null); setJourneyStage(0); }}
              className="glass-card rounded-lg p-2 hover:bg-white/10 transition-colors"
              title="Выбрать другой метеорит"
            >
              <Icon name="ArrowLeft" size={18} className="text-muted-foreground" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Путешествие во времени</span>
              <span>{journeyStage + 1} / {TIMELINE_STAGES.length}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full progress-bar rounded-full transition-all duration-500"
                style={{ width: `${((journeyStage + 1) / TIMELINE_STAGES.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-0 mb-8">
            {TIMELINE_STAGES.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <button
                  onClick={() => setJourneyStage(i)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg transition-all ${
                    i <= journeyStage ? 'border-transparent scale-110' : 'border-white/20 scale-100 opacity-40'
                  }`}
                  style={i <= journeyStage ? { background: stageColors[i], boxShadow: `0 0 20px ${stageColors[i]}60` } : {}}
                >
                  <span className="text-sm">{s.icon}</span>
                </button>
                {i < TIMELINE_STAGES.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mx-1 transition-all"
                    style={{ background: i < journeyStage ? stageColors[i] : 'rgba(255,255,255,0.1)' }}
                  />
                )}
              </div>
            ))}
          </div>

          <div key={journeyStage} className="glass-card rounded-2xl overflow-hidden mb-6 animate-slide-in">
            <div className="relative h-52 overflow-hidden">
              <img
                src={journeyStage === 0 ? SPACE_IMG : journeyStage === 1 ? SPACE_IMG : journeyStage === 2 ? ATMO_IMG : CRATER_IMG}
                alt={stageData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              <div
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold font-oswald"
                style={{ background: stageColors[journeyStage] + '30', color: stageColors[journeyStage], border: `1px solid ${stageColors[journeyStage]}60` }}
              >
                {stageData.subtitle}
              </div>
              <div className="absolute bottom-4 left-5">
                <h3 className="font-oswald text-2xl text-white">{stageData.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-foreground leading-relaxed">{selectedMeteorite.stages[journeyStage].description}</p>

              <div className="bg-black/30 border border-cosmos-cyan/20 rounded-xl p-4">
                <div className="text-cosmos-cyan text-xs font-bold mb-1">⚛️ ФИЗИКА</div>
                <div className="font-mono text-sm text-foreground">{selectedMeteorite.stages[journeyStage].physics}</div>
                <div className="text-muted-foreground text-xs mt-1">{selectedMeteorite.stages[journeyStage].detail}</div>
              </div>

              {journeyStage === 3 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-3 font-bold">Состав метеорита:</div>
                  <div className="space-y-2 mb-4">
                    {selectedMeteorite.composition.map(c => (
                      <div key={c.element} className="flex items-center gap-3">
                        <div className="text-sm text-muted-foreground w-28 shrink-0">{c.element}</div>
                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.percent}%`, background: c.color }} />
                        </div>
                        <div className="text-sm font-bold text-foreground w-10 text-right">{c.percent}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-sm text-muted-foreground mb-2 font-bold">Факты:</div>
                    <ul className="space-y-1.5">
                      {selectedMeteorite.facts.map((f, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="text-cosmos-orange shrink-0 mt-0.5">▸</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 bg-gradient-to-r from-cosmos-purple/20 to-cosmos-cyan/10 border border-cosmos-purple/30 rounded-xl p-4">
                    <div className="text-cosmos-purple text-xs font-bold mb-2 flex items-center gap-1.5">
                      <span>✨</span> ИНТЕРЕСНЫЙ ФАКТ
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{selectedMeteorite.funFact}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={() => setJourneyStage(s => Math.max(0, (typeof s === 'function' ? s(journeyStage) : s) - 1))}
              disabled={journeyStage === 0}
              className="flex items-center gap-2 px-5 py-3 glass-card rounded-xl text-muted-foreground hover:text-foreground transition-all disabled:opacity-30"
            >
              <Icon name="ChevronLeft" size={18} /> Назад
            </button>

            <button
              onClick={advanceJourney}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all animate-pulse-glow text-black"
              style={{ background: stageColors[Math.min(journeyStage + 1, 3)] }}
            >
              {journeyStage < TIMELINE_STAGES.length - 1 ? (
                <><Icon name="ChevronRight" size={18} /> Следующая эпоха</>
              ) : (
                <><Icon name="Star" size={18} /> Завершить путешествие</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}