import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const TOUR_STEPS = [
  {
    icon: '☄️',
    title: 'Привет! Я Кнопа 🤖',
    text: 'Я твой гид по Метеоритному хроноскопу! Покажу, как здесь всё устроено. Это займёт меньше минуты!',
  },
  {
    icon: '🚀',
    title: 'Хроноскоп — главный раздел',
    text: 'Здесь живут все 12 реальных метеоритов. Выбери любой и нажми «Запустить хроноскоп» — отправишься в его 4.5-миллиардную историю!',
    tab: 'journey',
  },
  {
    icon: '🔥',
    title: 'Симулятор атмосферы',
    text: 'В «Симуляции» задай угол входа и скорость — посмотри физику в реальном времени. Попробуй разные параметры!',
    tab: 'simulator',
  },
  {
    icon: '📚',
    title: 'Обучение и наука',
    text: 'Во вкладке «Обучение» — всё про хондриты, атакситы, октаэдриты и болиды. Настоящая космическая энциклопедия!',
    tab: 'learn',
  },
  {
    icon: '🏆',
    title: 'Собирай достижения',
    text: 'За каждое открытие получаешь очки и достижения. Попробуй изучить все метеориты и собрать коллекцию! Удачи 🚀',
    tab: 'achievements',
  },
];

const FAQ = [
  {
    q: 'Что такое хроноскоп?',
    a: 'Хроноскоп — это машина времени для метеоритов. Ты выбираешь реальный метеорит и проходишь 4 стадии его жизни: рождение в космосе, путешествие, вход в атмосферу и падение на Землю.',
  },
  {
    q: 'Все ли метеориты настоящие?',
    a: 'Да! Все 12 метеоритов в каталоге реальные — они найдены и изучены учёными. Данные по возрасту, массе и составу взяты из научных баз.',
  },
  {
    q: 'Что значат уровни сложности?',
    a: '«Начинающий» — знаменитые, хорошо известные метеориты. «Опытный» — нужно чуть больше знаний. «Эксперт» — редкие или сложные экземпляры с интересной историей.',
  },
  {
    q: 'Что такое углистый хондрит?',
    a: 'Один из старейших типов метеоритов — содержит органику и воду. Такие как Мёрчисон помогают учёным понять, как зародилась жизнь на Земле.',
  },
  {
    q: 'Чем атаксит отличается от октаэдрита?',
    a: 'Оба железные, но атаксит содержит много никеля (16%+) и не имеет видманштеттеновых узоров. Октаэдрит — с красивыми кристаллическими полосами, которые росли миллионы лет.',
  },
  {
    q: 'Что такое болид?',
    a: 'Болид — очень яркий метеор, ярче Венеры. Он сопровождается звуковым ударом и дымовым следом. Примеры: Челябинский 2013 года и Тунгусский 1908 года.',
  },
  {
    q: 'Как зарабатывать очки?',
    a: 'Выбирай метеориты, проходи путешествие до конца, меняй параметры в симуляторе. За каждое действие открываются достижения с очками.',
  },
  {
    q: 'Что такое реголит?',
    a: 'Реголит — поверхностная «почва» планет и астероидов. Реголитовые метеориты — это буквально кусочки Луны или Марса. Например, «Чёрная красавица» (NWA 7034) — марсианский реголит.',
  },
  {
    q: 'Почему метеориты не сгорают в атмосфере?',
    a: 'Крупные тела не успевают сгореть полностью — атмосфера тормозит их, но до поверхности долетает ядро. Самые большие, как Гоба (60 тонн), падают почти целыми.',
  },
  {
    q: 'Как поделиться сайтом?',
    a: 'Нажми кнопку «Поделиться» в шапке сайта — на телефоне откроется меню отправки, на компьютере ссылка скопируется в буфер.',
  },
];

const FIRST_VISIT_KEY = 'knopa_visited';

type Mode = 'tour' | 'faq';

interface KnopaBotProps {
  onNavigate?: (tab: string) => void;
}

export default function KnopaBot({ onNavigate }: KnopaBotProps) {
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('tour');
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isBouncing, setIsBouncing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const visited = localStorage.getItem(FIRST_VISIT_KEY);
    if (!visited) {
      setTimeout(() => {
        setVisible(true);
        setTimeout(() => {
          setIsOpen(true);
          startTyping(TOUR_STEPS[0].text);
        }, 600);
      }, 1200);
    } else {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen) return;
    const interval = setInterval(() => setIsBouncing(prev => !prev), 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const startTyping = (text: string) => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);
  };

  const handleNext = () => {
    if (isTyping) {
      setIsTyping(false);
      setDisplayedText(TOUR_STEPS[step].text);
      return;
    }
    const next = step + 1;
    if (next >= TOUR_STEPS.length) {
      handleCloseTour();
      return;
    }
    setStep(next);
    if (onNavigate && TOUR_STEPS[next].tab) onNavigate(TOUR_STEPS[next].tab!);
    startTyping(TOUR_STEPS[next].text);
  };

  const handleCloseTour = () => {
    setIsOpen(false);
    localStorage.setItem(FIRST_VISIT_KEY, '1');
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      localStorage.setItem(FIRST_VISIT_KEY, '1');
    } else {
      setIsOpen(true);
      setMode('faq');
      setExpandedFaq(null);
    }
  };

  const switchToFaq = () => {
    setIsTyping(false);
    setMode('faq');
    setExpandedFaq(null);
    localStorage.setItem(FIRST_VISIT_KEY, '1');
  };

  const switchToTour = () => {
    setMode('tour');
    setStep(0);
    startTyping(TOUR_STEPS[0].text);
  };

  if (!visible) return null;

  const current = TOUR_STEPS[step];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Bubble */}
      {isOpen && (
        <div
          className="relative glass-card rounded-2xl border border-cosmos-cyan/30 cyan-glow overflow-hidden"
          style={{ animation: 'fade-in-up 0.3s ease both', width: '300px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-white/10">
            <div className="flex gap-1">
              <button
                onClick={switchToTour}
                className={`text-xs px-2.5 py-1 rounded-lg font-oswald transition-all ${mode === 'tour' ? 'bg-cosmos-cyan/20 text-cosmos-cyan' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Тур
              </button>
              <button
                onClick={switchToFaq}
                className={`text-xs px-2.5 py-1 rounded-lg font-oswald transition-all ${mode === 'faq' ? 'bg-cosmos-cyan/20 text-cosmos-cyan' : 'text-muted-foreground hover:text-foreground'}`}
              >
                FAQ
              </button>
            </div>
            <button
              onClick={() => { setIsOpen(false); localStorage.setItem(FIRST_VISIT_KEY, '1'); }}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" size={14} />
            </button>
          </div>

          {/* Tour mode */}
          {mode === 'tour' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{current.icon}</span>
                <span className="font-oswald text-sm text-cosmos-cyan">{current.title}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3 min-h-[4rem]">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-1.5 h-3.5 bg-cosmos-cyan ml-0.5 align-middle animate-pulse rounded-sm" />
                )}
              </p>
              <div className="flex items-center gap-1 mb-3">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{ width: i === step ? '20px' : '6px', background: i <= step ? '#22d3ee' : 'rgba(255,255,255,0.15)' }}
                  />
                ))}
                <button onClick={switchToFaq} className="ml-auto text-xs text-muted-foreground hover:text-cosmos-cyan transition-colors whitespace-nowrap">
                  Перейти к FAQ →
                </button>
              </div>
              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 bg-cosmos-cyan/20 hover:bg-cosmos-cyan/30 border border-cosmos-cyan/40 text-cosmos-cyan font-oswald text-sm py-2 rounded-xl transition-all"
              >
                {isTyping ? (
                  <><Icon name="SkipForward" size={14} /> Пропустить набор</>
                ) : step < TOUR_STEPS.length - 1 ? (
                  <>Дальше <Icon name="ArrowRight" size={14} /></>
                ) : (
                  <>Начать исследование! <Icon name="Rocket" size={14} /></>
                )}
              </button>
            </div>
          )}

          {/* FAQ mode */}
          {mode === 'faq' && (
            <div className="max-h-96 overflow-y-auto">
              <div className="p-3 space-y-1">
                <p className="text-xs text-muted-foreground px-1 pb-1">Нажми на вопрос, чтобы прочитать ответ</p>
                {FAQ.map((item, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-white/5 transition-all">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-sm text-foreground leading-tight">{item.q}</span>
                      <Icon
                        name="ChevronDown"
                        size={14}
                        className={`text-cosmos-cyan shrink-0 transition-transform duration-200 ${expandedFaq === i ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {expandedFaq === i && (
                      <div className="px-3 pb-3 bg-cosmos-cyan/5 border-t border-white/5">
                        <p className="text-sm text-muted-foreground leading-relaxed pt-2">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Robot button */}
      <button
        onClick={handleToggle}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.25) 0%, rgba(34,211,238,0.1) 100%)',
          border: '1.5px solid rgba(34,211,238,0.5)',
          boxShadow: '0 0 18px rgba(34,211,238,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
          transform: isBouncing && !isOpen ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'transform 0.4s ease, box-shadow 0.3s ease',
        }}
        title="Кнопа — помощник"
      >
        <div className="flex flex-col items-center gap-0.5 select-none">
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-cosmos-cyan animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-cosmos-cyan animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <div className="w-5 h-0.5 rounded-full mt-0.5" style={{ background: 'rgba(34,211,238,0.7)' }} />
          <div className="text-[10px] font-oswald text-cosmos-cyan tracking-widest mt-0.5 leading-none">KNOPA</div>
        </div>

        {!isOpen && !localStorage.getItem(FIRST_VISIT_KEY) && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cosmos-orange opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cosmos-orange" />
          </span>
        )}
      </button>
    </div>
  );
}
