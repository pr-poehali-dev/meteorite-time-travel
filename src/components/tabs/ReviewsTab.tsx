import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  tag: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Алексей Громов',
    avatar: '👨‍🚀',
    rating: 5,
    text: 'Невероятно! Провёл 2 часа в хроноскопе, изучая Челябинский метеорит. Никогда не думал, что астрономия может быть настолько затягивающей. Симулятор — отдельный восторг.',
    date: '12 апр 2025',
    tag: 'Хроноскоп',
  },
  {
    id: 2,
    name: 'Мария Звездина',
    avatar: '👩‍🔬',
    rating: 5,
    text: 'Показала детям вкладку «Обучение» и симулятор падения — они не могли оторваться. Теперь сын хочет стать астрономом. Спасибо за такой образовательный проект!',
    date: '3 апр 2025',
    tag: 'Для детей',
  },
  {
    id: 3,
    name: 'Дмитрий Н.',
    avatar: '🧑‍💻',
    rating: 5,
    text: 'Очень грамотно написаны тексты по каждому метеориту. Видно, что авторы вникали в настоящую науку. ALH84001 с историей о возможной жизни на Марсе — просто шедевр подачи.',
    date: '28 мар 2025',
    tag: 'Контент',
  },
  {
    id: 4,
    name: 'Ольга Терескова',
    avatar: '👩‍🏫',
    rating: 4,
    text: 'Использую как дополнение к урокам физики и астрономии. Формулы реальные, объяснения понятные. Хотелось бы ещё больше метеоритов в коллекции!',
    date: '20 мар 2025',
    tag: 'Образование',
  },
  {
    id: 5,
    name: 'Игорь Кулик',
    avatar: '👨‍🎓',
    rating: 5,
    text: 'Симулятор атмосферы — это что-то особенное. Меняешь угол входа, массу, состав — и видишь разные сценарии. Потратил вечер на эксперименты. Рекомендую всем любителям физики.',
    date: '15 мар 2025',
    tag: 'Симулятор',
  },
  {
    id: 6,
    name: 'Анна К.',
    avatar: '👩‍🚀',
    rating: 5,
    text: 'Тунгусский метеорит и его хроноскоп — мурашки по коже. Никогда не понимала, насколько мощным был тот взрыв, пока не прочитала сравнение с мегатоннами. Потрясающий проект.',
    date: '8 мар 2025',
    tag: 'Хроноскоп',
  },
];

const TAG_COLORS: Record<string, string> = {
  'Хроноскоп': 'bg-cosmos-purple/20 text-purple-300 border-cosmos-purple/30',
  'Симулятор': 'bg-orange-900/30 text-orange-300 border-orange-700/30',
  'Контент': 'bg-cosmos-cyan/10 text-cosmos-cyan border-cosmos-cyan/20',
  'Образование': 'bg-green-900/30 text-green-300 border-green-700/30',
  'Для детей': 'bg-pink-900/30 text-pink-300 border-pink-700/30',
};

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange?.(s)}
          onMouseEnter={() => onChange && setHovered(s)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`text-xl transition-transform ${onChange ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
        >
          <span className={(hovered || value) >= s ? 'text-cosmos-orange' : 'text-white/20'}>★</span>
        </button>
      ))}
    </div>
  );
}

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [form, setForm] = useState({ name: '', text: '', rating: 0, tag: 'Хроноскоп' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map(s => ({
    star: s,
    count: reviews.filter(r => r.rating === s).length,
    pct: Math.round((reviews.filter(r => r.rating === s).length / reviews.length) * 100),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Введите ваше имя'); return; }
    if (form.rating === 0) { setError('Поставьте оценку'); return; }
    if (form.text.trim().length < 20) { setError('Напишите отзыв (минимум 20 символов)'); return; }
    setError('');

    const avatars = ['🧑‍🚀', '👩‍🔬', '👨‍🎓', '🧑‍💻', '👩‍🏫', '👨‍🚀', '🪐', '☄️'];
    const newReview: Review = {
      id: Date.now(),
      name: form.name.trim(),
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      rating: form.rating,
      text: form.text.trim(),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
      tag: form.tag,
    };

    setReviews(prev => [newReview, ...prev]);
    setForm({ name: '', text: '', rating: 0, tag: 'Хроноскоп' });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="animate-fade-in-up space-y-8">

      {/* Header */}
      <div>
        <h2 className="font-oswald text-3xl text-foreground mb-2">Отзывы</h2>
        <p className="text-muted-foreground">Что говорят путешественники во времени</p>
      </div>

      {/* Summary */}
      <div className="glass-card rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="text-center">
            <div className="font-oswald text-7xl text-cosmos-orange mb-2">{avgRating}</div>
            <StarRating value={Math.round(Number(avgRating))} />
            <div className="text-muted-foreground text-sm mt-2">{reviews.length} отзывов</div>
          </div>
          <div className="space-y-2">
            {dist.map(d => (
              <div key={d.star} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-4">{d.star}</span>
                <span className="text-cosmos-orange text-sm">★</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cosmos-orange rounded-full transition-all duration-700"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-oswald text-xl text-foreground mb-5 flex items-center gap-2">
          <Icon name="MessageSquarePlus" size={20} className="text-cosmos-cyan" />
          Оставить отзыв
        </h3>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <div className="text-5xl animate-float">🚀</div>
            <div className="font-oswald text-xl text-cosmos-orange">Отзыв отправлен!</div>
            <p className="text-muted-foreground text-sm">Спасибо, что поделились впечатлениями</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Ваше имя</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Имя или псевдоним"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cosmos-cyan/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1.5">Тема</label>
                <select
                  value={form.tag}
                  onChange={e => setForm(p => ({ ...p, tag: e.target.value }))}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-cosmos-cyan/50 transition-colors"
                >
                  {Object.keys(TAG_COLORS).map(t => (
                    <option key={t} value={t} className="bg-background">{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Оценка</label>
              <StarRating value={form.rating} onChange={v => setForm(p => ({ ...p, rating: v }))} />
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-1.5">Ваш отзыв</label>
              <textarea
                value={form.text}
                onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
                placeholder="Поделитесь впечатлениями о проекте…"
                rows={4}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cosmos-cyan/50 transition-colors resize-none"
              />
              <div className="text-right text-xs text-muted-foreground mt-1">{form.text.length} / 500</div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-2.5">
                <Icon name="AlertCircle" size={15} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-cosmos-orange text-black font-oswald text-base rounded-xl hover:opacity-90 transition-opacity"
            >
              <Icon name="Send" size={16} />
              Опубликовать
            </button>
          </form>
        )}
      </div>

      {/* Reviews grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((r, idx) => (
          <div
            key={r.id}
            className="glass-card rounded-2xl p-5 flex flex-col gap-3 animate-fade-in-up"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/8 flex items-center justify-center text-2xl flex-shrink-0">
                  {r.avatar}
                </div>
                <div>
                  <div className="font-oswald text-base text-foreground leading-tight">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.date}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${TAG_COLORS[r.tag] ?? 'bg-white/10 text-muted-foreground border-white/15'}`}>
                {r.tag}
              </span>
            </div>

            <StarRating value={r.rating} />

            <p className="text-muted-foreground text-sm leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
