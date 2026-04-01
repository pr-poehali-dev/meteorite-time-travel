import Icon from '@/components/ui/icon';
import { ACHIEVEMENTS } from '@/data/meteorites';

interface AchievementsTabProps {
  unlockedAchievements: string[];
  points: number;
}

export default function AchievementsTab({ unlockedAchievements, points }: AchievementsTabProps) {
  return (
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
  );
}
