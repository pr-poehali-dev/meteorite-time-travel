export default function StatsTab() {
  return (
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
  );
}
