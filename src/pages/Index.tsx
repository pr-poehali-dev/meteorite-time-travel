import { useState, useCallback } from 'react';
import KnopaBot from '@/components/KnopaBot';
import Icon from '@/components/ui/icon';
import StarField from '@/components/StarField';
import AtmosphereSimulator from '@/components/AtmosphereSimulator';
import { METEORITES, ACHIEVEMENTS, type Meteorite } from '@/data/meteorites';
import JourneyTab from '@/components/tabs/JourneyTab';
import StatsTab from '@/components/tabs/StatsTab';
import LearnTab from '@/components/tabs/LearnTab';
import AchievementsTab from '@/components/tabs/AchievementsTab';
import ReviewsTab from '@/components/tabs/ReviewsTab';

type Tab = 'journey' | 'simulator' | 'stats' | 'learn' | 'achievements' | 'reviews';

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>('journey');
  const [selectedMeteorite, setSelectedMeteorite] = useState<Meteorite | null>(null);
  const [journeyStage, setJourneyStage] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [viewedMeteorites, setViewedMeteorites] = useState<string[]>([]);
  const [points, setPoints] = useState(0);
  const [toastAch, setToastAch] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = 'Метеоритный хроноскоп — путешествие во времени';
    const text = 'Изучай реальные метеориты и симулируй их падение на Землю!';

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

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
    if (journeyStage < 3) {
      setJourneyStage(s => s + 1);
    } else {
      unlockAchievement('time_traveler');
      setTimeout(() => {
        setSelectedMeteorite(null);
        setJourneyStage(0);
      }, 500);
    }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'journey', label: 'Хроноскоп', icon: 'Clock' },
    { id: 'simulator', label: 'Симуляция', icon: 'Flame' },
    { id: 'stats', label: 'Статистика', icon: 'BarChart3' },
    { id: 'learn', label: 'Обучение', icon: 'GraduationCap' },
    { id: 'achievements', label: 'Достижения', icon: 'Trophy' },
    { id: 'reviews', label: 'Отзывы', icon: 'Star' },
  ];

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
          <div className="flex items-center gap-2">
            <div className="glass-card rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="text-cosmos-orange">⭐</span>
              <span className="font-oswald text-foreground">{points}</span>
              <span className="text-xs text-muted-foreground">очков</span>
            </div>
            <div className="glass-card rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span>🏆</span>
              <span className="text-sm text-muted-foreground">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
            </div>
            <button
              onClick={handleShare}
              className="glass-card rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-white/10 transition-all group"
              title="Поделиться сайтом"
            >
              <Icon
                name={copied ? 'Check' : 'Share2'}
                size={15}
                className={copied ? 'text-green-400' : 'text-muted-foreground group-hover:text-cosmos-cyan transition-colors'}
              />
              <span className={`text-sm transition-colors ${copied ? 'text-green-400' : 'text-muted-foreground group-hover:text-cosmos-cyan'}`}>
                {copied ? 'Скопировано!' : 'Поделиться'}
              </span>
            </button>
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

        {activeTab === 'journey' && (
          <JourneyTab
            selectedMeteorite={selectedMeteorite}
            journeyStage={journeyStage}
            setJourneyStage={setJourneyStage}
            setSelectedMeteorite={setSelectedMeteorite}
            setActiveTab={setActiveTab}
            advanceJourney={advanceJourney}
            viewedMeteorites={viewedMeteorites}
            selectMeteorite={selectMeteorite}
          />
        )}

        {activeTab === 'simulator' && (
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <h2 className="font-oswald text-3xl text-foreground mb-2">Физическая симуляция</h2>
              <p className="text-muted-foreground">Настрой параметры и посмотри, что произойдёт с метеоритом при входе в атмосферу</p>
            </div>
            <AtmosphereSimulator onAchievement={() => unlockAchievement('simulator')} />
          </div>
        )}

        {activeTab === 'stats' && <StatsTab />}

        {activeTab === 'learn' && <LearnTab />}

        {activeTab === 'reviews' && <ReviewsTab />}

        {activeTab === 'achievements' && (
          <AchievementsTab
            unlockedAchievements={unlockedAchievements}
            points={points}
          />
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

      <KnopaBot onNavigate={(tab) => setActiveTab(tab as Tab)} />
    </div>
  );
}