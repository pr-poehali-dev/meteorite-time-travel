import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const STEPS = [
  {
    icon: '☄️',
    title: 'Привет! Я Кнопа 🤖',
    text: 'Я твой гид по Метеоритному хроноскопу! Покажу, как здесь всё устроено. Это займёт меньше минуты!',
  },
  {
    icon: '🪨',
    title: 'Каталог метеоритов',
    text: 'Начни с вкладки «Каталог» — выбери любой из 12 реальных метеоритов. Каждый упал на Землю и изучен учёными.',
    tab: 'catalog',
  },
  {
    icon: '🚀',
    title: 'Путешествие во времени',
    text: 'Выбери метеорит и открой «Путешествие» — пройди все 4 стадии его жизни: от рождения в космосе до падения на Землю.',
    tab: 'journey',
  },
  {
    icon: '🔥',
    title: 'Симулятор атмосферы',
    text: 'В «Симуляторе» задай угол входа и скорость — посмотри физику в реальном времени. Попробуй разные параметры!',
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
    text: 'За каждое открытие ты получаешь очки и достижения. Попробуй изучить все метеориты и собрать коллекцию! Удачи 🚀',
    tab: 'achievements',
  },
];

const FIRST_VISIT_KEY = 'knopa_visited';

interface KnopaBotProps {
  onNavigate?: (tab: string) => void;
}

export default function KnopaBot({ onNavigate }: KnopaBotProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem(FIRST_VISIT_KEY);
    if (!visited) {
      setTimeout(() => {
        setVisible(true);
        setTimeout(() => {
          setIsOpen(true);
          startTyping(STEPS[0].text);
        }, 600);
      }, 1200);
    } else {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setIsBouncing(prev => !prev);
    }, 3000);
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
      setDisplayedText(STEPS[step].text);
      return;
    }
    const nextStep = step + 1;
    if (nextStep >= STEPS.length) {
      handleClose();
      return;
    }
    setStep(nextStep);
    if (onNavigate && STEPS[nextStep].tab) {
      onNavigate(STEPS[nextStep].tab!);
    }
    startTyping(STEPS[nextStep].text);
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(FIRST_VISIT_KEY, '1');
  };

  const handleToggle = () => {
    if (!isOpen) {
      setIsOpen(true);
      setStep(0);
      startTyping(STEPS[0].text);
    } else {
      handleClose();
    }
  };

  if (!visible) return null;

  const current = STEPS[step];
  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Bubble */}
      {isOpen && (
        <div
          className="relative glass-card rounded-2xl p-4 w-72 border border-cosmos-cyan/30 cyan-glow"
          style={{ animation: 'fade-in-up 0.3s ease both' }}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={14} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-2 pr-5">
            <span className="text-xl">{current.icon}</span>
            <span className="font-oswald text-sm text-cosmos-cyan">{current.title}</span>
          </div>

          {/* Text */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 min-h-[4rem]">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-1.5 h-3.5 bg-cosmos-cyan ml-0.5 align-middle animate-pulse rounded-sm" />
            )}
          </p>

          {/* Progress dots */}
          <div className="flex items-center gap-1 mb-3">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '20px' : '6px',
                  background: i <= step ? '#22d3ee' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>

          {/* Button */}
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 bg-cosmos-cyan/20 hover:bg-cosmos-cyan/30 border border-cosmos-cyan/40 text-cosmos-cyan font-oswald text-sm py-2 rounded-xl transition-all"
          >
            {isTyping ? (
              <>
                <Icon name="SkipForward" size={14} />
                Пропустить набор
              </>
            ) : step < STEPS.length - 1 ? (
              <>
                Дальше
                <Icon name="ArrowRight" size={14} />
              </>
            ) : (
              <>
                Начать исследование!
                <Icon name="Rocket" size={14} />
              </>
            )}
          </button>
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
        {/* Eyes */}
        <div className="flex flex-col items-center gap-0.5 select-none">
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-cosmos-cyan animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-2 h-2 rounded-full bg-cosmos-cyan animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
          <div className="w-5 h-0.5 rounded-full mt-0.5" style={{ background: 'rgba(34,211,238,0.7)' }} />
          <div className="text-[10px] font-oswald text-cosmos-cyan tracking-widest mt-0.5 leading-none">KNOPA</div>
        </div>

        {/* Ping indicator when not opened yet */}
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