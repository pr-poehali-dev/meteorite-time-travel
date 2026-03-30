export interface Meteorite {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  age: string;
  ageYears: number;
  mass: string;
  massKg: number;
  found: string;
  country: string;
  emoji: string;
  color: string;
  description: string;
  composition: { element: string; percent: number; color: string }[];
  facts: string[];
  difficulty: 'beginner' | 'intermediate' | 'expert';
}

export const METEORITES: Meteorite[] = [
  {
    id: 'allende',
    name: 'Альенде',
    type: 'carbonaceous',
    typeLabel: 'Углистый хондрит',
    age: '4.56 млрд лет',
    ageYears: 4560000000,
    mass: '2 тонны',
    massKg: 2000,
    found: '1969',
    country: 'Мексика',
    emoji: '🌑',
    color: '#4a3728',
    description: 'Один из самых изученных метеоритов в мире. Содержит первичное вещество Солнечной системы — кальций-алюминиевые включения, старше самого Солнца.',
    composition: [
      { element: 'Силикаты', percent: 72, color: '#8B7355' },
      { element: 'Углерод', percent: 3, color: '#333' },
      { element: 'Железо', percent: 20, color: '#8B4513' },
      { element: 'Прочее', percent: 5, color: '#9B8B6B' },
    ],
    facts: [
      'Содержит вещество старше Солнца',
      'Упал 8 февраля 1969 года',
      'Матрица метеорита содержит аминокислоты',
    ],
    difficulty: 'beginner',
  },
  {
    id: 'hoba',
    name: 'Гоба',
    type: 'iron',
    typeLabel: 'Железный',
    age: '4.5 млрд лет',
    ageYears: 4500000000,
    mass: '60 тонн',
    massKg: 60000,
    found: '1920',
    country: 'Намибия',
    emoji: '⬛',
    color: '#5a5a5a',
    description: 'Крупнейший целый метеорит на Земле. Настолько массивный, что никогда не перемещался с места падения — стал природным памятником.',
    composition: [
      { element: 'Железо', percent: 82, color: '#8B4513' },
      { element: 'Никель', percent: 16, color: '#A9A9A9' },
      { element: 'Кобальт', percent: 1, color: '#4169E1' },
      { element: 'Прочее', percent: 1, color: '#9B8B6B' },
    ],
    facts: [
      '60 тонн — самый тяжёлый метеорит Земли',
      'Площадь поверхности 2.7 × 2.7 метра',
      'Никогда не перемещался с места падения',
    ],
    difficulty: 'beginner',
  },
  {
    id: 'mars-meteorite',
    name: 'ALH84001',
    type: 'martian',
    typeLabel: 'Марсианский',
    age: '4.1 млрд лет',
    ageYears: 4100000000,
    mass: '1.93 кг',
    massKg: 1.93,
    found: '1984',
    country: 'Антарктида',
    emoji: '🔴',
    color: '#8B3A2F',
    description: 'Фрагмент Марса, выбитый ударом астероида. В 1996 году NASA объявило о возможных следах древней жизни, вызвав мировую сенсацию.',
    composition: [
      { element: 'Ортопироксен', percent: 60, color: '#6B5B3E' },
      { element: 'Плагиоклаз', percent: 25, color: '#C8B89A' },
      { element: 'Карбонаты', percent: 10, color: '#D4A78B' },
      { element: 'Прочее', percent: 5, color: '#8B7355' },
    ],
    facts: [
      'Прилетел с Марса 13 000 лет назад',
      'Возможные следы древних микробов',
      'Хранится в Хьюстоне в азотной среде',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'chelyabinsk',
    name: 'Челябинский',
    type: 'stony',
    typeLabel: 'Каменный хондрит',
    age: '4.56 млрд лет',
    ageYears: 4560000000,
    mass: '654 кг',
    massKg: 654,
    found: '2013',
    country: 'Россия',
    emoji: '💥',
    color: '#8B6914',
    description: 'Суперболид 2013 года над Уралом. Взрыв был в 30 раз мощнее Хиросимы, ударная волна выбила стёкла в тысячах зданий.',
    composition: [
      { element: 'Оливин', percent: 38, color: '#8DB600' },
      { element: 'Пироксен', percent: 30, color: '#556B2F' },
      { element: 'Железо', percent: 25, color: '#8B4513' },
      { element: 'Прочее', percent: 7, color: '#9B8B6B' },
    ],
    facts: [
      'Взрыв на высоте 30 км над землёй',
      'Около 1600 человек получили травмы',
      'Самый мощный болид с 1908 года',
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'sikhote-alin',
    name: 'Сихотэ-Алинь',
    type: 'iron',
    typeLabel: 'Железный',
    age: '4.5 млрд лет',
    ageYears: 4500000000,
    mass: '23 тонны',
    massKg: 23000,
    found: '1947',
    country: 'Россия',
    emoji: '⚡',
    color: '#696969',
    description: 'Крупнейший наблюдаемый железный метеоритный дождь в истории. Пал над горами Сихотэ-Алинь, оставив 106 воронок.',
    composition: [
      { element: 'Железо', percent: 94, color: '#8B4513' },
      { element: 'Никель', percent: 5.9, color: '#A9A9A9' },
      { element: 'Прочее', percent: 0.1, color: '#9B8B6B' },
    ],
    facts: [
      '106 воронок на месте падения',
      'Видели за 400 км от эпицентра',
      'Самый большой iron shower в истории',
    ],
    difficulty: 'expert',
  },
  {
    id: 'moon-meteorite',
    name: 'NWA 11119',
    type: 'lunar',
    typeLabel: 'Лунный',
    age: '4.01 млрд лет',
    ageYears: 4010000000,
    mass: '450 г',
    massKg: 0.45,
    found: '2016',
    country: 'Мавритания',
    emoji: '🌕',
    color: '#A8A8A8',
    description: 'Один из старейших лунных метеоритов, найденных на Земле. Был выбит с лунной поверхности мощным ударом и прилетел к нам через космос.',
    composition: [
      { element: 'Плагиоклаз', percent: 55, color: '#C8C8C8' },
      { element: 'Пироксен', percent: 30, color: '#8B7355' },
      { element: 'Оливин', percent: 10, color: '#8DB600' },
      { element: 'Прочее', percent: 5, color: '#9B8B6B' },
    ],
    facts: [
      'Старейший известный лунный метеорит',
      'Выбит с лунных гор Аппалачи',
      'Путешествовал миллионы лет в космосе',
    ],
    difficulty: 'expert',
  },
];

export const TIMELINE_STAGES = [
  {
    id: 'formation',
    title: 'Рождение в протопланетном диске',
    subtitle: '~4.5 млрд лет назад',
    icon: '🌌',
    color: '#8B5CF6',
    description: 'Солнечная туманность сжимается под действием гравитации. Газ и пыль образуют вращающийся диск. Первичные твёрдые частицы слипаются, образуя планетезимали — предшественников планет и астероидов.',
    physics: 'Закон всемирного тяготения Ньютона: F = G·m₁·m₂/r²',
    detail: 'Процесс формирования занял ~50 млн лет',
  },
  {
    id: 'space',
    title: 'Путешествие сквозь космос',
    subtitle: 'Миллионы лет',
    icon: '🚀',
    color: '#06B6D4',
    description: 'Столкновение с другим телом выбивает фрагмент на новую орбиту. Гравитационные возмущения от Юпитера постепенно меняют траекторию. Вековая эволюция орбиты ведёт к сближению с Землёй.',
    physics: 'Законы Кеплера: T² = a³ (в астрономических единицах)',
    detail: 'Средний путь до встречи с Землёй — 1-100 млн лет',
  },
  {
    id: 'atmosphere',
    title: 'Вход в атмосферу',
    subtitle: 'Секунды',
    icon: '🔥',
    color: '#F97316',
    description: 'Метеорит врезается в атмосферу со скоростью 11–72 км/с. Молекулы воздуха сжимаются перед ним, температура поверхности достигает 2000°C. Внешний слой испаряется, образуя светящийся болид.',
    physics: 'Кинетическая энергия: E = ½mv² · cos²(α)',
    detail: 'Атмосфера поглощает 90% кинетической энергии',
  },
  {
    id: 'impact',
    title: 'Падение и жизнь на Земле',
    subtitle: 'Наши дни',
    icon: '🌍',
    color: '#22C55E',
    description: 'Метеорит остывает и приземляется. Место падения становится объектом науки. Учёные берут образцы, проводят анализы. Метеорит хранит информацию о рождении Солнечной системы миллиарды лет.',
    physics: 'Термическое торможение: Q = Cd·ρ·v²·A/2',
    detail: 'На Землю ежегодно падает ~48 тонн метеоритного вещества',
  },
];

export const ACHIEVEMENTS = [
  { id: 'first_meteorite', title: 'Первое открытие', desc: 'Выбрал первый метеорит', icon: '🌑', points: 10 },
  { id: 'time_traveler', title: 'Путешественник во времени', desc: 'Прошёл всю хронологию', icon: '⏱️', points: 25 },
  { id: 'simulator', title: 'Физик-теоретик', desc: 'Изменил параметры симуляции', icon: '⚗️', points: 20 },
  { id: 'all_meteorites', title: 'Коллекционер', desc: 'Изучил все метеориты', icon: '🏆', points: 50 },
  { id: 'mars_explorer', title: 'Исследователь Марса', desc: 'Изучил марсианский метеорит', icon: '🔴', points: 30 },
  { id: 'russia_expert', title: 'Эксперт по России', desc: 'Изучил все российские метеориты', icon: '🇷🇺', points: 35 },
];
