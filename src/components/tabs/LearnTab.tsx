export default function LearnTab() {
  return (
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
  );
}
