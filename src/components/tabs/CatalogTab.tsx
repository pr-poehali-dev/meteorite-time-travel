import { METEORITES, type Meteorite } from '@/data/meteorites';

interface CatalogTabProps {
  filterType: string;
  setFilterType: (f: string) => void;
  viewedMeteorites: string[];
  selectMeteorite: (m: Meteorite) => void;
}

export default function CatalogTab({ filterType, setFilterType, viewedMeteorites, selectMeteorite }: CatalogTabProps) {
  const filteredMeteorites = filterType === 'all'
    ? METEORITES
    : METEORITES.filter(m => m.type === filterType);

  return (
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
        {filteredMeteorites.map((m) => (
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
  );
}
