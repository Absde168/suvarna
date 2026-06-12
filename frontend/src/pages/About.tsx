/**
 * SUVARNA About Page
 * Style: Fashion Editorial Minimal
 */
import { Link } from 'wouter';

export default function About() {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden bg-card-sienna">
        <img
          src="/manus-storage/dress_10_b9724543.jpg"
          alt="О бренде SUVARNA"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-10 left-10">
          <p className="font-body text-xs font-500 tracking-[0.2em] uppercase text-white/70 mb-2">О бренде</p>
          <h1 className="font-display text-5xl lg:text-7xl font-light text-white">SUVARNA</h1>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-16 lg:mb-24">
          <div>
            <p className="section-label text-cream-faint mb-4">Наша история</p>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-cream mb-6 leading-tight">
              Красота двух культур
            </h2>
            <p className="font-body text-sm text-cream-muted leading-relaxed mb-4">
              SUVARNA — это встреча российского дизайна и индийского текстильного наследия. Название бренда происходит от санскритского слова «сувáрна» — «золото», «красота», «совершенство».
            </p>
            <p className="font-body text-sm text-cream-muted leading-relaxed mb-4">
              Бренд основан дизайнером, влюблённым в индийские ткани и традиции ручного производства. Каждая коллекция создаётся в диалоге двух культур: российской эстетики и индийского мастерства.
            </p>
            <p className="font-body text-sm text-cream-muted leading-relaxed">
              Мы работаем с лучшими индийскими ткачами и вышивальщиками, создавая изделия, в которых каждая деталь несёт смысл и красоту.
            </p>
          </div>
          <div className="aspect-[4/5] overflow-hidden bg-card-sienna">
            <img
              src="/manus-storage/jacket_1_d889054d.jpg"
              alt="Жакет SUVARNA"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="border-t border-cream pt-16">
          <p className="section-label text-cream-faint mb-8">Наши ценности</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: 'Натуральные ткани',
                text: 'Мы используем только натуральные ткани: купро Bemberg, хлопок, вискозу, тафту. Каждая ткань выбирается за её качество, тактильность и способность красиво драпироваться.',
              },
              {
                title: 'Авторские принты',
                text: 'Все принты создаются нашим дизайнером — вдохновлённые природой, ботаникой, восточными мотивами. Каждый принт — это маленькое произведение искусства.',
              },
              {
                title: 'Ручная работа',
                text: 'Вышивка, стёжка канта, ручная отделка — мы сотрудничаем с индийскими мастерами, сохраняющими традиционные техники текстильного производства.',
              },
            ].map((item, i) => (
              <div key={i}>
                <h3 className="font-display text-2xl font-light text-cream mb-3">{item.title}</h3>
                <p className="font-body text-sm text-cream-muted leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/catalog">
            <span className="btn-primary">Смотреть коллекцию</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
