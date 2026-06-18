/**
 * SUVARNA About Page
 * Style: Warm Botanical Terracotta — editorial brand story
 */
import { Link } from 'wouter';
import { Sparkles, Gem, Diamond, Flower2 } from 'lucide-react';

const VALUES = [
  {
    icon: Sparkles,
    title: 'Мастерство',
    text: 'Каждая вещь создаётся руками мастеров. Никакой массовости — только внимание к деталям, которое рождает уникальные предметы гардероба.',
  },
  {
    icon: Gem,
    title: 'Аутентичность',
    text: 'Мы не используем «индийский стиль» как декорацию. Наши ткани — это реальная Индия: фабрики, мастера, традиции, история.',
  },
  {
    icon: Diamond,
    title: 'Уникальность',
    text: 'Тиражи ограничены. Многие ткани существуют в единственном исполнении. Ваша вещь SUVARNA — это всегда нечто особенное.',
  },
  {
    icon: Flower2,
    title: 'Женственность',
    text: 'SUVARNA создан для «райских птиц» — женщин с жизненной стратегией новизны, которые притягивают приключения и живут полной жизнью.',
  },
];

export default function About() {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      {/* Hero */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label text-cream-faint mb-6">О бренде</p>
          <h1 className="font-display text-6xl lg:text-8xl font-light text-cream leading-tight">
            For Paradise
          </h1>
          <h2 className="font-display italic text-5xl lg:text-7xl font-light mb-6" style={{ color: 'rgba(255,253,247,0.55)' }}>
            Birds Only
          </h2>
          <p className="font-display text-2xl lg:text-3xl font-light text-cream mb-10">
            Роскошь, созданная вручную
          </p>
          <p className="font-body text-sm text-cream-muted leading-relaxed mb-4">
            SUVARNA — это премиальный бренд женской одежды, созданный на основе богатого индийского текстильного наследия. Каждое изделие — это произведение искусства, сочетающее традиционные техники с современным дизайном.
          </p>
          <p className="font-body text-sm text-cream-muted leading-relaxed mb-12">
            Мы верим в качество, в ручную работу и в то, что каждая женщина достойна роскоши. Наши коллекции созданы для тех, кто ценит подлинность, элегантность и уникальность.
          </p>

          <div className="text-left max-w-xl mx-auto border-l border-cream pl-6">
            <p className="section-label text-cream-faint mb-3">Наша миссия</p>
            <p className="font-display italic text-lg lg:text-xl font-light text-cream-muted leading-relaxed">
              Привнести в мир моды дух Индии, создавая одежду, которая вдохновляет и восхищает. Каждый предмет в нашей коллекции — это история, рассказанная через ткань, цвет и вышивку.
            </p>
          </div>
        </div>
      </div>

      {/* Designer */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative min-h-[320px] lg:min-h-0 bg-card-sienna">
            <img
              src="/images/about-designer.jpg"
              alt="Зора Полковникова — дизайнер SUVARNA"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
          <div>
            <p className="section-label text-cream-faint mb-3">Дизайнер</p>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-cream mb-6">
              Зора Полковникова
            </h2>
            <div className="divider mb-6 max-w-[80px]" />
            <p className="font-body text-base text-cream-muted leading-relaxed mb-5">
              Более 15 лет Зора занималась персональной стилистикой, пошивом гардероба и проведением курсов по стилю. Постепенно профессиональный интерес привёл её к тканям — сначала европейским, а затем и к совершенно особому миру.
            </p>
            <p className="font-body text-base text-cream-muted leading-relaxed mb-5">
              Вместе с партнёрами Оксаной Кривошеевой и Анной Степановой она открыла текстильный рынок Мумбаи — крупнейший в Азии — и навсегда влюбилась в индийский текстиль. Так родилась компания A+Fabrics, а затем и бренд SUVARNA.
            </p>
            <p className="font-body text-base text-cream-muted leading-relaxed mb-8">
              Название SUVARNA на санскрите означает «золото», «золотая». Золотая линия одежды для райских птиц — именно так Зора видит своих клиенток: яркими, особенными, живущими насыщенной жизнью.
            </p>
            <div className="bg-card-sienna p-6 lg:p-8">
              <p className="font-display italic text-xl font-light text-cream leading-relaxed mb-4">
                «Fashion — это мост между культурами. Каждое платье SUVARNA — это путешествие, которое начинается в Индии и завершается в вашей жизни.»
              </p>
              <p className="section-label text-cream-faint">— Зора Полковникова</p>
            </div>
          </div>
        </div>
      </div>

      {/* Путь к Индии */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label text-cream-faint mb-3">Путь к Индии</p>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-cream mb-6">
            Как всё началось
          </h2>
          <div className="divider mb-10 max-w-[80px] mx-auto" />
          <p className="font-body text-sm text-cream-muted leading-relaxed mb-4">
            Путь в Индию безуспешно искал Христофор Колумб, а нашли его — почти случайно — три российских предпринимательницы. Зора, Оксана и Анна отправились туда обычными туристами, а профессиональное любопытство привело их на текстильный рынок в Мумбаи.
          </p>
          <p className="font-body text-sm text-cream-muted leading-relaxed mb-4">
            То, что они увидели, перевернуло все представления. Не кустарные лавочки, а оснащённый современнейшей техникой мир промышленного текстиля, вобравшего богатейшие традиции и английскую техническую культуру. Уникальные специалисты, работающие на фабриках, которые поставляют ткани Hugo Boss, Lacoste, Ralph Lauren, Tommy Hilfiger.
          </p>
          <p className="font-body text-sm font-500 text-cream leading-relaxed">
            Так родилась A+Fabrics — компания по импорту индийских тканей в Россию. А из неё — SUVARNA: бренд, в котором каждая вещь несёт в себе частицу Индии.
          </p>
        </div>
      </div>

      {/* Ценности */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <p className="section-label text-cream-faint mb-3">Ценности</p>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-cream mb-6">
            Что для нас важно
          </h2>
          <div className="divider max-w-[80px] mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {VALUES.map((item) => (
            <div key={item.title} className="border-cream border p-6 lg:p-8">
              <item.icon size={22} className="text-cream mb-4" strokeWidth={1.25} />
              <h3 className="font-display text-xl font-light text-cream mb-3">{item.title}</h3>
              <p className="font-body text-sm text-cream-muted leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Слово клиентки */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label text-cream-faint mb-8">Слово клиентки</p>
          <p className="font-display italic text-2xl lg:text-3xl font-light text-cream leading-relaxed mb-6">
            «Я живу обычной жизнью, но... Я покупаю особые платья, чтобы в них со мной произошло нечто особенное. Какой-то невероятный случай или приключение. И так всегда и происходит.»
          </p>
          <p className="section-label text-cream-faint">— Покупательница двух платьев SUVARNA</p>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <h2 className="font-display text-4xl lg:text-5xl font-light text-cream mb-4">
          Стать частью мира SUVARNA
        </h2>
        <p className="font-body text-sm text-cream-muted leading-relaxed mb-8">
          Откройте для себя коллекции, созданные для тех, кто ценит подлинность и красоту.
        </p>
        <Link href="/catalog">
          <span className="btn-outline">Смотреть каталог</span>
        </Link>
      </div>
    </main>
  );
}
