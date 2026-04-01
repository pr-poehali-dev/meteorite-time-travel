import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import StarField from '@/components/StarField';
import AtmosphereSimulator from '@/components/AtmosphereSimulator';
import { METEORITES, TIMELINE_STAGES, ACHIEVEMENTS, type Meteorite } from '@/data/meteorites';

type Tab = 'catalog' | 'journey' | 'simulator' | 'stats' | 'learn' | 'achievements';

const SPACE_IMG = 'https://cdn.poehali.dev/projects/98e9b97e-d2eb-49c5-964c-d4435d389621/files/6e027fd7-7e8a-46c7-a1e9-9b8205ef1884.jpg';
const ATMO_IMG = 'https://cdn.poehali.dev/projects/98e9b97e-d2eb-49c5-964c-d4435d389621/files/c68d9a12-1e80-4674-895d-0126c1fbdb2c.jpg';
const CRATER_IMG = 'https://cdn.poehali.dev/projects/98e9b97e-d2eb-49c5-964c-d4435d389621/files/66f71feb-1c95-46db-b8d3-bc9fad8dd6aa.jpg';

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('catalog');
  const [selectedMeteorite, setSelectedMeteorite] = useState<Meteorite | null>(null);
  const [journeyStage, setJourneyStage] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [viewedMeteorites, setViewedMeteorites] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [toastAch, setToastAch] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const unlockAchievement = (id: string) => {
    if (unlockedAchievements.includes(id)) return;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;
    setUnlockedAchievements(prev => [...prev, id]);
    setPoints(p => p + ach.points);
    setToastAch(id);
    setTimeout(() => setToastAch(null), 3500);
  };

  const selectMeteorite = (m: Meteorite) => {
    setSelectedMeteorite(m);
    setActiveTab('journey');
    setJourneyStage(0);

    const newViewed = viewedMeteorites.includes(m.id)
      ? viewedMeteorites
      : [...viewedMeteorites, m.id];
    setViewedMeteorites(newViewed);

    unlockAchievement('first_meteorite');
    if (m.id === 'mars-meteorite' || m.id === 'nwa7034') unlockAchievement('mars_explorer');
    if (m.id === 'tunguska') unlockAchievement('tunguska_secret');
    if (['chelyabinsk', 'sikhote-alin', 'tunguska'].every(id => newViewed.includes(id))) {
      unlockAchievement('russia_expert');
    }
    if (['allende', 'murchison', 'tagish-lake'].every(id => newViewed.includes(id))) {
      unlockAchievement('organic_hunter');
    }
    const ironIds = METEORITES.filter(x => x.type === 'iron').map(x => x.id);
    if (ironIds.filter(id => newViewed.includes(id)).length >= 4) {
      unlockAchievement('iron_collector');
    }
    if (newViewed.length === METEORITES.length) unlockAchievement('all_meteorites');
  };

  const advanceJourney = () => {
    if (journeyStage < TIMELINE_STAGES.length - 1) {
      setJourneyStage(s => s + 1);
    } else {
      unlockAchievement('time_traveler');
    }
  };

  const filteredMeteorites = filterType === 'all'
    ? METEORITES
    : METEORITES.filter(m => m.type === filterType);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'catalog', label: 'Каталог', icon: 'BookOpen' },
    { id: 'journey', label: 'Хроноскоп', icon: 'Clock' },
    { id: 'simulator', label: 'Симуляция', icon: 'Flame' },
    { id: 'stats', label: 'Статистика', icon: 'BarChart3' },
    { id: 'learn', label: 'Обучение', icon: 'GraduationCap' },
    { id: 'achievements', label: 'Достижения', icon: 'Trophy' },
  ];

  const stageColors = ['#8B5CF6', '#06B6D4', '#F97316', '#22C55E'];
  const stageStage = TIMELINE_STAGES[journeyStage];

  return (
    <div className="min-h-screen bg-background stars-bg relative overflow-x-hidden">
      <StarField />

      {/* Achievement Toast */}
      {toastAch && (() => {
        const ach = ACHIEVEMENTS.find(a => a.id === toastAch);
        return ach ? (
          <div className="fixed top-6 right-6 z-50 glass-card rounded-xl p-4 flex items-center gap-3 orange-glow achievement-unlocked max-w-xs">
            <span className="text-3xl">{ach.icon}</span>
            <div>
              <div className="text-xs text-cosmos-orange font-bold">ДОСТИЖЕНИЕ!</div>
              <div className="font-oswald text-white">{ach.title}</div>
              <div className="text-xs text-muted-foreground">+{ach.points} очков</div>
            </div>
          </div>
        ) : null;
      })()}

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cosmos-orange/20 border border-cosmos-orange/40 flex items-center justify-center text-lg animate-pulse-glow">
              ☄️
            </div>
            <div>
              <h1 className="font-oswald text-xl text-foreground tracking-wider">
                МЕТЕОРИТНЫЙ ХРОНОСКОП
              </h1>
              <p className="text-xs text-muted-foreground">Путешествие во времени через историю метеоритов</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="text-cosmos-orange">⭐</span>
              <span className="font-oswald text-foreground">{points}</span>
              <span className="text-xs text-muted-foreground">очков</span>
            </div>
            <div className="glass-card rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span>🏆</span>
              <span className="text-sm text-muted-foreground">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/10 bg-background/80 sticky top-0 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-cosmos-orange text-black'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                <Icon name={tab.icon} size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* === CATALOG === */}
        {activeTab === 'catalog' && (
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <h2 className="font-oswald text-3xl text-foreground mb-2">Каталог метеоритов</h2>
              <p className="text-muted-foreground">Выбери метеорит, чтобы отправиться в путешествие по его истории</p>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {['all', 'iron', 'stony', 'carbonaceous', 'martian', 'lunar'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                    filterType === f
                      ? 'bg-cosmos-cyan text-black font-bold'
                      : 'glass-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f === 'all' ? 'Все'
                    : f === 'iron' ? '⚙️ Железные'
                    : f === 'stony' ? '🪨 Каменные'
                    : f === 'carbonaceous' ? '⚫ Углистые'
                    : f === 'martian' ? '🔴 Марсианские'
                    : '🌕 Лунные'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMeteorites.map((m, i) => (
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
                    Изучить историю →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === JOURNEY === */}
        {activeTab === 'journey' && (
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
                              <div className="text-sm w-24 text-muted-foreground">{c.element}</div>
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
        )}

        {/* === SIMULATOR === */}
        {activeTab === 'simulator' && (
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <h2 className="font-oswald text-3xl text-foreground mb-2">Физическая симуляция</h2>
              <p className="text-muted-foreground">Настрой параметры и посмотри, что произойдёт с метеоритом при входе в атмосферу</p>
            </div>
            <AtmosphereSimulator onAchievement={() => unlockAchievement('simulator')} />
          </div>
        )}

        {/* === STATS === */}
        {activeTab === 'stats' && (
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <h2 className="font-oswald text-3xl text-foreground mb-2">Научная статистика</h2>
              <p className="text-muted-foreground">Реальные данные о метеоритах и их падении на Землю</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Метеоритов в базах', value: '60 000+', icon: '📊', color: 'text-cosmos-orange' },
                { label: 'Падает в год', value: '48 тонн', icon: '🌧️', color: 'text-cosmos-cyan' },
                { label: 'Зарегистрировано', value: '~5 900', icon: '📝', color: 'text-cosmos-purple' },
                { label: 'Антарктических', value: '40 000+', icon: '🧊', color: 'text-cosmos-green' },
              ].map(s => (
                <div key={s.label} className="glass-card rounded-2xl p-5 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className={`font-oswald text-2xl mb-1 ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-oswald text-xl text-foreground mb-4">Типы метеоритов</h3>
                {[
                  { type: 'Каменные', pct: 86, color: '#8B7355' },
                  { type: 'Железо-каменные', pct: 8, color: '#A9A9A9' },
                  { type: 'Железные', pct: 5, color: '#8B4513' },
                  { type: 'Лунные и марсианские', pct: 1, color: '#8B5CF6' },
                ].map(t => (
                  <div key={t.type} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{t.type}</span>
                      <span className="text-foreground font-bold">{t.pct}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-oswald text-xl text-foreground mb-4">Скорость входа в атмосферу</h3>
                <div className="space-y-3">
                  {[
                    { range: '11–20 км/с', label: 'Медленные', pct: 25, color: '#22C55E' },
                    { range: '20–40 км/с', label: 'Средние', pct: 50, color: '#F97316' },
                    { range: '40–72 км/с', label: 'Быстрые', pct: 25, color: '#EF4444' },
                  ].map(s => (
                    <div key={s.range} className="flex items-center gap-3">
                      <div className="w-24 text-xs text-muted-foreground">{s.range}</div>
                      <div className="flex-1 h-5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full flex items-center pl-2 text-xs font-bold text-black"
                          style={{ width: `${s.pct * 2}%`, background: s.color }}
                        >
                          {s.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-white/5 rounded-xl text-sm text-muted-foreground">
                  Минимальная скорость входа = 2-я космическая скорость = 11.2 км/с
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 md:col-span-2">
                <h3 className="font-oswald text-xl text-foreground mb-4">Крупнейшие падения в истории</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Метеорит', 'Год', 'Страна', 'Масса', 'Тип', 'Примечание'].map(h => (
                          <th key={h} className="text-left py-2 pr-4 text-muted-foreground font-normal text-xs">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Гоба', '1920', 'Намибия', '60 т', 'Железный', 'Крупнейший на Земле'],
                        ['Кейп-Йорк', '1818', 'Гренландия', '58 т', 'Железный', 'Несколько фрагментов'],
                        ['Арманти', 'древн.', 'Китай', '28 т', 'Железный', 'Известен с 1785 г.'],
                        ['Сихотэ-Алинь', '1947', 'Россия', '23 т', 'Железный', '106 воронок'],
                        ['Гибеон', '1836', 'Намибия', '26 т', 'Железный', 'Поле рассеяния 275 км'],
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          {row.map((cell, j) => (
                            <td key={j} className={`py-2.5 pr-4 ${j === 0 ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === LEARN === */}
        {activeTab === 'learn' && (
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <h2 className="font-oswald text-3xl text-foreground mb-2">Обучающий раздел</h2>
              <p className="text-muted-foreground">Всё, что нужно знать о метеоритах — от А до Я</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Что такое метеорит?',
                  icon: '🌑',
                  color: '#8B5CF6',
                  content: 'Метеорит — небесное тело, которое упало на поверхность Земли из космоса. В космосе они называются метеороидами, а при прохождении атмосферы создают светящийся след — метеор (или болид при ярком свечении).',
                },
                {
                  title: 'Как формируются метеориты?',
                  icon: '🌌',
                  color: '#06B6D4',
                  content: 'Большинство метеоритов — фрагменты астероидов из Пояса астероидов между Марсом и Юпитером. Они образовались 4.56 млрд лет назад вместе с Солнечной системой. Некоторые прилетают с Луны или Марса после ударов крупных астероидов.',
                },
                {
                  title: 'Физика входа в атмосферу',
                  icon: '🔥',
                  color: '#F97316',
                  content: 'При входе в атмосферу метеороид сжимает воздух, который разогревается до 2000-4000°C. Поверхность тела начинает испаряться (аблация). Большинство малых тел полностью сгорает. Выживают только достаточно массивные объекты.',
                },
                {
                  title: 'Классификация метеоритов',
                  icon: '📋',
                  color: '#22C55E',
                  content: 'Каменные (86%): хондриты и ахондриты. Железные (5%): почти чистое никелистое железо. Железо-каменные (8%): смесь металла и силикатов. Лунные и марсианские (<1%): выбиты ударами астероидов с планет.',
                },
                {
                  title: 'Угол входа и траектория',
                  icon: '📐',
                  color: '#EF4444',
                  content: 'Оптимальный угол входа для выживания метеорита — 15-45°. При слишком малом угле (<10°) метеорит может срикошетить от атмосферы. При большом (>80°) — слишком быстрое торможение и полное сгорание.',
                },
                {
                  title: 'Наука и метеориты',
                  icon: '🔬',
                  color: '#A855F7',
                  content: 'Метеориты — окно в прошлое Солнечной системы. Они содержат минералы, образовавшиеся до рождения планет. Углистые хондриты несут органические молекулы и воду. Марсианские метеориты рассказывают о геологии Красной планеты.',
                },
              ].map((item) => (
                <div key={item.title} className="glass-card rounded-2xl p-5 hover:border-white/20 border border-transparent transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: item.color + '20', border: `1px solid ${item.color}40` }}
                    >
                      {item.icon}
                    </div>
                    <h3 className="font-oswald text-lg text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 glass-card rounded-2xl p-6">
              <h3 className="font-oswald text-xl text-foreground mb-4">Ключевые физические формулы</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Кинетическая энергия', formula: 'E = ½mv²', desc: 'm — масса, v — скорость входа', color: '#F97316' },
                  { name: 'Закон тяготения', formula: 'F = G·m₁m₂/r²', desc: 'G = 6.674×10⁻¹¹ Н·м²/кг²', color: '#8B5CF6' },
                  { name: 'Третий закон Кеплера', formula: 'T² = a³', desc: 'T в годах, a в а.е.', color: '#06B6D4' },
                ].map(f => (
                  <div key={f.name} className="bg-black/30 rounded-xl p-4 border" style={{ borderColor: f.color + '30' }}>
                    <div className="text-xs text-muted-foreground mb-1">{f.name}</div>
                    <div className="font-mono text-xl text-foreground mb-1" style={{ color: f.color }}>{f.formula}</div>
                    <div className="text-xs text-muted-foreground">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === ACHIEVEMENTS === */}
        {activeTab === 'achievements' && (
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <h2 className="font-oswald text-3xl text-foreground mb-2">Достижения</h2>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Разблокировано:</span>
                <span className="font-oswald text-cosmos-orange text-xl">{unlockedAchievements.length}</span>
                <span className="text-muted-foreground">из {ACHIEVEMENTS.length}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden ml-2">
                  <div
                    className="h-full progress-bar rounded-full"
                    style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map(a => {
                const unlocked = unlockedAchievements.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className={`rounded-2xl p-5 flex items-center gap-4 transition-all border ${
                      unlocked ? 'glass-card orange-glow border-cosmos-orange/30' : 'bg-white/3 border-white/5 opacity-50'
                    }`}
                  >
                    <div className={`text-4xl ${unlocked ? '' : 'grayscale'}`}>{a.icon}</div>
                    <div className="flex-1">
                      <div className="font-oswald text-lg text-foreground">{a.title}</div>
                      <div className="text-muted-foreground text-sm">{a.desc}</div>
                    </div>
                    <div className={`text-right ${unlocked ? 'text-cosmos-orange' : 'text-muted-foreground'}`}>
                      <div className="font-oswald text-xl">+{a.points}</div>
                      <div className="text-xs">очков</div>
                    </div>
                    {unlocked && (
                      <div className="w-6 h-6 rounded-full bg-cosmos-orange flex items-center justify-center flex-shrink-0">
                        <Icon name="Check" size={14} className="text-black" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 glass-card rounded-2xl p-6 text-center">
              <div className="font-oswald text-4xl text-cosmos-orange mb-1">{points}</div>
              <div className="text-muted-foreground">суммарных очков</div>
              <div className="mt-3 text-sm text-muted-foreground">
                Изучи все метеориты и пройди все разделы, чтобы получить максимум!
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Support Footer */}
      <footer className="relative z-10 mt-6 pb-6 px-4">
        <div className="max-w-2xl mx-auto glass-card rounded-2xl p-5 flex items-center gap-4 border border-white/10">
          <div className="w-10 h-10 rounded-full bg-cosmos-orange/20 flex items-center justify-center flex-shrink-0">
            <Icon name="Headphones" size={20} className="text-cosmos-orange" />
          </div>
          <div className="flex-1">
            <div className="font-oswald text-base text-foreground">Поддержка разработчика</div>
            <div className="text-sm text-muted-foreground">Есть вопросы? Пишите в Telegram</div>
          </div>
          <a
            href="https://t.me/Dashadjjjj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-cosmos-orange hover:bg-cosmos-orange/80 transition-colors text-black font-oswald text-sm px-4 py-2 rounded-xl"
          >
            <Icon name="Send" size={15} />
            @Dashadjjjj
          </a>
        </div>
      </footer>
    </div>
  );
}