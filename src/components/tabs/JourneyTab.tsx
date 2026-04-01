import Icon from '@/components/ui/icon';
import { TIMELINE_STAGES, type Meteorite } from '@/data/meteorites';

const SPACE_IMG = 'https://cdn.poehali.dev/projects/98e9b97e-d2eb-49c5-964c-d4435d389621/files/6e027fd7-7e8a-46c7-a1e9-9b8205ef1884.jpg';
const ATMO_IMG = 'https://cdn.poehali.dev/projects/98e9b97e-d2eb-49c5-964c-d4435d389621/files/c68d9a12-1e80-4674-895d-0126c1fbdb2c.jpg';
const CRATER_IMG = 'https://cdn.poehali.dev/projects/98e9b97e-d2eb-49c5-964c-d4435d389621/files/66f71feb-1c95-46db-b8d3-bc9fad8dd6aa.jpg';

const stageColors = ['#8B5CF6', '#06B6D4', '#F97316', '#22C55E'];

interface JourneyTabProps {
  selectedMeteorite: Meteorite | null;
  journeyStage: number;
  setJourneyStage: (s: number | ((prev: number) => number)) => void;
  setSelectedMeteorite: (m: Meteorite | null) => void;
  setActiveTab: (tab: string) => void;
  advanceJourney: () => void;
}

export default function JourneyTab({
  selectedMeteorite,
  journeyStage,
  setJourneyStage,
  setSelectedMeteorite,
  setActiveTab,
  advanceJourney,
}: JourneyTabProps) {
  const stageStage = TIMELINE_STAGES[journeyStage];

  return (
    <div className="animate-fade-in-up">
      {!selectedMeteorite ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 animate-float">☄️</div>
          <h2 className="font-oswald text-2xl text-foreground mb-2">Выбери метеорит</h2>
          <p className="text-muted-foreground mb-6">Перейди в каталог и выбери метеорит для путешествия</p>
          <button
            onClick={() => setActiveTab('catalog')}
            className="px-6 py-3 rounded-xl bg-cosmos-orange text-black font-bold"
          >
            Открыть каталог
          </button>
        </div>
      ) : (
        <div>
          <div className="glass-card rounded-2xl p-6 mb-6 flex items-center gap-5">
            <div className="text-6xl animate-float">{selectedMeteorite.emoji}</div>
            <div className="flex-1">
              <div className="text-cosmos-orange text-sm font-bold mb-1">ХРОНОСКОП АКТИВЕН</div>
              <h2 className="font-oswald text-3xl text-foreground">{selectedMeteorite.name}</h2>
              <p className="text-muted-foreground">{selectedMeteorite.typeLabel} · {selectedMeteorite.country} · {selectedMeteorite.found}</p>
            </div>
            <button
              onClick={() => { setSelectedMeteorite(null); setActiveTab('catalog'); }}
              className="glass-card rounded-lg p-2 hover:bg-white/10 transition-colors"
            >
              <Icon name="X" size={18} className="text-muted-foreground" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Путешествие во времени</span>
              <span>{journeyStage + 1} / {TIMELINE_STAGES.length}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full progress-bar rounded-full"
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
                alt={stageStage.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              <div
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold font-oswald"
                style={{ background: stageColors[journeyStage] + '30', color: stageColors[journeyStage], border: `1px solid ${stageColors[journeyStage]}60` }}
              >
                {stageStage.subtitle}
              </div>
              <div className="absolute bottom-4 left-5">
                <h3 className="font-oswald text-2xl text-white">{stageStage.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-foreground leading-relaxed">{stageStage.description}</p>

              <div className="bg-black/30 border border-cosmos-cyan/20 rounded-xl p-4">
                <div className="text-cosmos-cyan text-xs font-bold mb-1">⚛️ ФИЗИКА</div>
                <div className="font-mono text-sm text-foreground">{stageStage.physics}</div>
                <div className="text-muted-foreground text-xs mt-1">{stageStage.detail}</div>
              </div>

              <div className="bg-cosmos-orange/10 border border-cosmos-orange/20 rounded-xl p-4">
                <div className="text-cosmos-orange text-xs font-bold mb-1">☄️ ДЛЯ {selectedMeteorite.name.toUpperCase()}</div>
                <div className="text-sm text-foreground">
                  {journeyStage === 0 && `Формировался ${selectedMeteorite.age} назад в протопланетном диске молодого Солнца`}
                  {journeyStage === 1 && `После отрыва от родительского тела путешествовал миллионы лет по орбите`}
                  {journeyStage === 2 && `Вошёл в атмосферу Земли со скоростью от 11 до 72 км/с, раскалившись до 2000°C`}
                  {journeyStage === 3 && `Найден в ${selectedMeteorite.country} в ${selectedMeteorite.found} году. Масса: ${selectedMeteorite.mass}`}
                </div>
              </div>

              {journeyStage === 3 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2 font-bold">Состав метеорита:</div>
                  <div className="space-y-2">
                    {selectedMeteorite.composition.map(c => (
                      <div key={c.element} className="flex items-center gap-3">
                        <div className="text-sm text-muted-foreground w-24">{c.element}</div>
                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${c.percent}%`, background: c.color }} />
                        </div>
                        <div className="text-sm font-bold text-foreground w-10 text-right">{c.percent}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <button
              onClick={() => setJourneyStage(s => Math.max(0, s - 1))}
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
