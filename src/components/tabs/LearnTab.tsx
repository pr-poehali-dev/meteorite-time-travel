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
            content: 'Метеорит — небесное тело, которое упало на поверхность Земли из космоса. В космосе они называются метеороидами, а при прохождении атмосферы создают светящийся след — метеор. Особо яркий метеор называется болидом — его блеск превышает –4 звёздной величины. Болиды часто сопровождаются звуковым ударом и дымовым следом, а иногда достигают поверхности Земли.',
          },
          {
            title: 'Как формируются метеориты?',
            icon: '🌌',
            color: '#06B6D4',
            content: 'Большинство метеоритов — фрагменты астероидов из Пояса астероидов между Марсом и Юпитером. Они образовались 4.56 млрд лет назад вместе с Солнечной системой. Некоторые прилетают с Луны или Марса после ударов крупных астероидов. Исходное тело метеорита называют «родительским телом» — именно там происходили первичные процессы: плавление, дифференциация и кристаллизация.',
          },
          {
            title: 'Физика входа в атмосферу',
            icon: '🔥',
            color: '#F97316',
            content: 'При входе в атмосферу метеороид сжимает воздух, который разогревается до 2000–4000°C. Поверхность тела начинает испаряться — этот процесс называется аблацией. Большинство малых тел полностью сгорает, оставляя лишь метеорный след. Выживают только достаточно массивные объекты, успевающие пройти сквозь атмосферу. Самые крупные тела взрываются в воздухе — воздушный взрыв болида.',
          },
          {
            title: 'Классификация метеоритов',
            icon: '📋',
            color: '#22C55E',
            content: 'Каменные (86%): хондриты и ахондриты. Железные (5%): почти чистое никелистое железо. Железо-каменные (8%): смесь металла и силикатов. Лунные и марсианские (<1%): выбиты ударами астероидов с планет. Среди железных особо выделяют атакситы (высокое содержание никеля, без видманштеттенов), гексаэдриты и октаэдриты (с характерными кристаллическими узорами).',
          },
          {
            title: 'Угол входа и траектория',
            icon: '📐',
            color: '#EF4444',
            content: 'Оптимальный угол входа для выживания метеорита — 15–45°. При слишком малом угле (<10°) метеорит может срикошетить от атмосферы. При большом (>80°) — слишком быстрое торможение и полное сгорание.',
          },
          {
            title: 'Наука и метеориты',
            icon: '🔬',
            color: '#A855F7',
            content: 'Метеориты — окно в прошлое Солнечной системы. Они содержат минералы, образовавшиеся до рождения планет. Углистые хондриты несут органические молекулы и воду. Марсианские метеориты рассказывают о геологии Красной планеты. По изотопному составу учёные восстанавливают историю отдельных атомов, родившихся в звёздах до образования нашей системы.',
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

      {/* Болиды */}
      <div className="mt-8 glass-card rounded-2xl p-6 border border-orange-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#F9731620', border: '1px solid #F9731640' }}>💥</div>
          <h3 className="font-oswald text-xl text-foreground">Болиды — огненные гости</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          <span className="text-orange-400 font-semibold">Болид</span> (от греч. βολίς — «метательный снаряд») — чрезвычайно яркий метеор с блеском ярче –4 звёздной величины, сопоставимый с Венерой или ярче. Болиды видны днём, оставляют долго сохраняющийся дымовой след и нередко сопровождаются мощным звуковым ударом — результатом сверхзвукового полёта тела в атмосфере.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: 'Размер тела',
              value: 'от 1 м до км',
              icon: '📏',
              desc: 'Болиды порождаются метеороидами диаметром от ~1 метра. При диаметре >25 м возникает суперболид с ядерно-эквивалентным взрывом.',
            },
            {
              label: 'Звуковой удар',
              value: 'до 100 дБ',
              icon: '💨',
              desc: 'Ударная волна от болида распространяется на сотни километров. Взрыв Челябинского болида в 2013 г. выбил стёкла в радиусе 80 км.',
            },
            {
              label: 'Температура плазмы',
              value: '8 000–30 000°C',
              icon: '🌡️',
              desc: 'Перед телом болида формируется плазменный шар из ионизированного воздуха, температура которого в несколько раз превышает поверхность Солнца.',
            },
          ].map(b => (
            <div key={b.label} className="bg-orange-950/30 rounded-xl p-4 border border-orange-500/20">
              <div className="text-2xl mb-1">{b.icon}</div>
              <div className="text-xs text-orange-400 mb-0.5 uppercase tracking-wide">{b.label}</div>
              <div className="font-mono text-sm text-orange-300 font-bold mb-1">{b.value}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Хондриты */}
      <div className="mt-6 glass-card rounded-2xl p-6 border border-green-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#22C55E20', border: '1px solid #22C55E40' }}>🪨</div>
          <h3 className="font-oswald text-xl text-foreground">Хондриты — первородное вещество</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          <span className="text-green-400 font-semibold">Хондриты</span> — самый распространённый тип метеоритов (≈86% всех находок). Своё название они получили от <em>хондр</em> — крошечных сферических силикатных капель диаметром 0.1–3 мм, которые образовались в ранней Солнечной системе при быстром охлаждении расплавленного вещества. Хондры — древнейшие объекты Солнечной системы, возраст некоторых превышает 4.567 млрд лет.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[
            {
              title: 'Обыкновенные хондриты (H, L, LL)',
              desc: 'Наиболее частый подтип. Различаются содержанием железа: H (high) — 25–31%, L (low) — 20–25%, LL — 19–22%. Примеры: Челябинский (LL5), большинство «обычных» находок.',
              color: '#86EFAC',
            },
            {
              title: 'Углистые хондриты (C-группа)',
              desc: 'Содержат углерод, органику и гидратированные минералы. Делятся на CI, CM, CO, CV, CK, CR и другие классы. Пример: Мёрчисон (CM2), Альенде (CV3), Озеро Тагиш (C2-ung). Наиболее примитивны.',
              color: '#6B7280',
            },
            {
              title: 'Энстатитовые хондриты (E)',
              desc: 'Образовались в восстановительной среде. Содержат почти исключительно безжелезистый пироксен — энстатит. Редки: <2% всех метеоритов. Схожи по химии с мантией Земли.',
              color: '#FCD34D',
            },
            {
              title: 'Рудиты и реликтовые хондры',
              desc: 'В некоторых хондритах хондры размыты или уничтожены последующим нагревом и метаморфизмом. Шкала петрологических типов 1–7: тип 1–2 — почти не изменены, тип 6–7 — сильно переработаны.',
              color: '#C084FC',
            },
          ].map(c => (
            <div key={c.title} className="bg-green-950/30 rounded-xl p-4 border border-green-500/20">
              <div className="text-sm font-semibold mb-1" style={{ color: c.color }}>{c.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-green-950/20 rounded-xl p-3 border border-green-500/10">
          <p className="text-xs text-muted-foreground">
            💡 <span className="text-green-400">Интересный факт:</span> Хондры не встречаются ни в одном веществе на Земле — они уникальный продукт ранней Солнечной системы. Именно их изучение позволяет понять условия формирования планет 4.56 млрд лет назад.
          </p>
        </div>
      </div>

      {/* Атакситы */}
      <div className="mt-6 glass-card rounded-2xl p-6 border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#A855F720', border: '1px solid #A855F740' }}>⬛</div>
          <h3 className="font-oswald text-xl text-foreground">Атакситы — никелевые монолиты</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          <span className="text-purple-400 font-semibold">Атаксит</span> (от греч. ἄτακτος — «беспорядочный») — структурный класс железных метеоритов с содержанием никеля более 16%. Из-за высокого никеля камасит (α-Fe) в них не образует видимых кристаллов, а микроструктура состоит из тончайших вростков тэнита и плессита. На полированном срезе не видно видманштеттеновых узоров — отсюда и название «беспорядочный».
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[
            {
              label: 'Содержание Ni',
              value: '16–60% Ni',
              icon: '🔬',
              desc: 'Самый никеленосный класс железных метеоритов. Обычные октаэдриты содержат 6–13% Ni, атакситы — значительно больше.',
            },
            {
              label: 'Структура',
              value: 'Плессит',
              icon: '🔩',
              desc: 'Ультратонкая смесь камасита и тэнита (плессит) без макроструктуры. Видна только под электронным микроскопом.',
            },
            {
              label: 'Примеры',
              value: 'Гоба, Уилламет',
              icon: '🌍',
              desc: 'Гоба (IVB, 60 т, Намибия) — крупнейший метеорит Земли. Уилламет (IIIAB) — крупнейший в США. Оба относятся к атакситам по структуре.',
            },
          ].map(a => (
            <div key={a.label} className="bg-purple-950/30 rounded-xl p-4 border border-purple-500/20">
              <div className="text-2xl mb-1">{a.icon}</div>
              <div className="text-xs text-purple-400 mb-0.5 uppercase tracking-wide">{a.label}</div>
              <div className="font-mono text-sm text-purple-300 font-bold mb-1">{a.value}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{a.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-purple-950/20 rounded-xl p-3 border border-purple-500/10">
          <p className="text-xs text-muted-foreground">
            💡 <span className="text-purple-400">Химические группы атакситов:</span> IVB (самые никелевые, до 60% Ni — Гоба), IVA, IIIAB и ряд аномальных. Никель замедляет диффузию, поэтому кристаллы камасита просто не успевают вырасти при остывании родительского тела.
          </p>
        </div>
      </div>

      {/* Октаэдриты */}
      <div className="mt-6 glass-card rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#06B6D420', border: '1px solid #06B6D440' }}>🔩</div>
          <h3 className="font-oswald text-xl text-foreground">Октаэдриты и видманштеттены</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          <span className="text-cyan-400 font-semibold">Октаэдрит</span> — самый распространённый класс железных метеоритов (~75% всех железных). Содержит 6–13% никеля. При разрезании и травлении кислотой на поверхности появляются <em>видманштеттеновы фигуры</em> — перекрещивающиеся полосы камасита (α-Fe), ориентированные по граням октаэдра. Это уникальная структура, которую невозможно воспроизвести в лаборатории за разумное время: она формировалась при охлаждении ~1°C за миллион лет.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[
            {
              title: 'Структурные подклассы',
              items: [
                'Off (наикрупнейший, >3.3 мм) — полосы камасита очень широкие',
                'Of (крупный, 1.3–3.3 мм) — хорошо видимые полосы',
                'Om (средний, 0.5–1.3 мм) — классический тип, пример: Гибеон',
                'Of (мелкий, 0.2–0.5 мм) — тонкие полосы',
                'Ogg (наимельчайший) — структура едва различима',
              ],
              color: '#67E8F9',
            },
            {
              title: 'Как образуются видманштеттены?',
              items: [
                'При T >900°C — однородный расплав γ-железа (тэнит)',
                'При охлаждении ниже 700°C — кристаллы камасита растут вдоль граней октаэдра',
                'Скорость роста: ~1 мм за 1 млрд лет',
                'Итог: пластины камасита в матрице тэнита',
                'Травление 5% HNO₃ делает структуру видимой',
              ],
              color: '#A5B4FC',
            },
          ].map(o => (
            <div key={o.title} className="bg-cyan-950/30 rounded-xl p-4 border border-cyan-500/20">
              <div className="text-sm font-semibold mb-2" style={{ color: o.color }}>{o.title}</div>
              <ul className="space-y-1">
                {o.items.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-cyan-500 shrink-0">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-cyan-950/20 rounded-xl p-3 border border-cyan-500/10">
          <p className="text-xs text-muted-foreground">
            💡 <span className="text-cyan-400">Химические группы:</span> IAB, IIIAB, IVA — крупнейшие группы октаэдритов. Гибеон (IVA) — эталонный средний октаэдрит (Om). Сихотэ-Алинь (IIB) — крупный октаэдрит (Of). Видманштеттены — самое медленно растущее «произведение искусства» природы.
          </p>
        </div>
      </div>

      {/* Реголит */}
      <div className="mt-6 glass-card rounded-2xl p-6 border border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#EF444420', border: '1px solid #EF444440' }}>🪐</div>
          <h3 className="font-oswald text-xl text-foreground">Реголитовые метеориты</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          <span className="text-red-400 font-semibold">Реголит</span> — слой рыхлого обломочного материала, покрывающего поверхности Луны, Марса, астероидов и других тел. Реголитовые метеориты (реголитовые брекчии) — это куски «почвы» другой планеты, сцементированные после ударных событий. Они содержат следы солнечного ветра, имплантированные атомы газов и записи древних ударных событий.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[
            {
              label: 'Лунный реголит',
              icon: '🌕',
              desc: 'Лунные реголитовые брекчии содержат вкрапления стекла, образованного при ударах. В них обнаружены атомы гелия-3, водорода и азота из солнечного ветра — фактически запись о Солнце за миллиарды лет.',
              color: '#D1D5DB',
            },
            {
              label: 'Марсианский реголит',
              icon: '🔴',
              desc: 'NWA 7034 «Чёрная красавица» — брекчия из марсианской поверхности возрастом 4.4 млрд лет. Содержит в 10 раз больше воды, чем другие марсианские метеориты, что указывает на водную историю Марса.',
              color: '#FCA5A5',
            },
            {
              label: 'Астероидный реголит',
              icon: '🪨',
              desc: 'Часть хондритов — фрагменты поверхности астероидов, бомбардировавшихся миллиарды лет. Японский зонд Хаябуса-2 доставил с астероида Рюгу образцы реголита класса Cg — аналог углистых хондритов.',
              color: '#FDE68A',
            },
          ].map(r => (
            <div key={r.label} className="bg-red-950/30 rounded-xl p-4 border border-red-500/20">
              <div className="text-2xl mb-1">{r.icon}</div>
              <div className="text-xs mb-1 uppercase tracking-wide font-semibold" style={{ color: r.color }}>{r.label}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{r.desc}</div>
            </div>
          ))}
        </div>
        <div className="bg-red-950/20 rounded-xl p-3 border border-red-500/10">
          <p className="text-xs text-muted-foreground">
            💡 <span className="text-red-400">Солнечный ветер в реголите:</span> Реголитовые метеориты буквально хранят «архив» солнечной активности за миллиарды лет. Изучая изотопные соотношения имплантированных газов, учёные восстанавливают историю нашей звезды задолго до появления любых наблюдений.
          </p>
        </div>
      </div>

      {/* Ахондриты */}
      <div className="mt-6 glass-card rounded-2xl p-6 border border-yellow-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#EAB30820', border: '1px solid #EAB30840' }}>🌋</div>
          <h3 className="font-oswald text-xl text-foreground">Ахондриты — продукты дифференциации</h3>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          <span className="text-yellow-400 font-semibold">Ахондриты</span> — каменные метеориты <em>без хондр</em>, то есть их родительские тела прошли плавление и дифференциацию. Это значит, что в их «предке» существовало горячее ядро, мантия и кора — как на Земле. Ахондриты составляют ~8% каменных метеоритов и делятся на примитивные (акапулькоиты, вилданиты) и дифференцированные (HED — хауриты, эвкриты, диогениты; SNC — марсианские; лунные).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Эвкриты и HED-группа',
              desc: 'Эвкриты — базальтовые лавы из коры астероида Веста. Хауриты — породы мантии, диогениты — нижней коры. Вместе они составляют HED-группу, связанную с одним родительским телом. 5–6% всех находок.',
              color: '#FDE68A',
            },
            {
              title: 'SNC — марсианские ахондриты',
              desc: 'Шерготиты, Накхлиты, Шасиньиты — типы марсианских метеоритов. Их молодой возраст (0.15–1.4 млрд лет) указывает на вулканически активный Марс. Газы в некоторых совпадают с анализом атмосферы Viking-зонда.',
              color: '#FCA5A5',
            },
          ].map(a => (
            <div key={a.title} className="bg-yellow-950/30 rounded-xl p-4 border border-yellow-500/20">
              <div className="text-sm font-semibold mb-1" style={{ color: a.color }}>{a.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{a.desc}</div>
            </div>
          ))}
        </div>
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