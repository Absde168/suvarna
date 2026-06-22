import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/entities/products';
import { getHeroSlides, getHeroSlideImageUrl } from '@shared/api/heroSlides';
import { getPageImageUrl } from '@shared/api/pageImages';
import { getCollections } from '@shared/api';
import { getCollectionImageUrl } from '@shared/api';

const DEFAULT_HERO_SLIDES = [
  { id: 0, image: '/images/collections/barbeque.jpg', label: 'Коллекция', title: 'BAROQUE GARDEN', subtitle: '', cta: 'Смотреть коллекцию', href: '/collections/baroque-garden', align: 'left' },
  { id: 0, image: '/images/collections/nisha.jpg', label: 'Коллекция', title: 'Nisha', subtitle: '', cta: 'Смотреть коллекцию', href: '/collections/nisha', align: 'right' },
  { id: 0, image: '/images/collections/tara.jpg', label: 'Коллекция', title: 'Tara', subtitle: '', cta: 'Смотреть коллекцию', href: '/collections/tara', align: 'left' },
  { id: 0, image: '/images/collections/tej.jpg', label: 'Коллекция', title: 'Tej', subtitle: '', cta: 'Смотреть коллекцию', href: '/collections/tej', align: 'right' },
];

const CATEGORY_CARDS = [
  { label: 'Жакеты', slug: 'zhakety', key: 'category-zhakety' },
  { label: 'Брюки', slug: 'bryuki', key: 'category-bryuki' },
  { label: 'Костюмы', slug: 'kostyumy', key: 'category-kostyumy' },
  { label: 'Тренчи', slug: 'trenchi', key: 'category-trenchi' },
  { label: 'Платья', slug: 'platya', key: 'category-platya' },
  { label: 'Блузы', slug: 'bluzy', key: 'category-bluzy' },
];

const LOOKBOOK_KEYS = ['lookbook-1', 'lookbook-2', 'lookbook-3', 'lookbook-4', 'lookbook-5', 'lookbook-6'];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: apiSlides } = useQuery({ queryKey: ['hero-slides'], queryFn: getHeroSlides });
  const { data: collections } = useQuery({ queryKey: ['collections'], queryFn: getCollections });

  const collectionBySlug = Object.fromEntries((collections ?? []).map(c => [c.slug, c]));

  const baseSlides = apiSlides && apiSlides.length > 0
    ? apiSlides.map(s => ({
        id: s.id,
        image: s.image ? getHeroSlideImageUrl(s.id, 1600) : '/images/collections/barbeque.jpg',
        label: s.label ?? 'Коллекция',
        title: s.title,
        subtitle: s.subtitle ?? '',
        cta: s.cta ?? 'Смотреть коллекцию',
        href: s.href ?? '/',
        align: s.align ?? 'left',
      }))
    : DEFAULT_HERO_SLIDES;

  const heroSlides = baseSlides.map(s => {
    const slug = s.href?.match(/^\/collections\/(.+)$/)?.[1];
    const col = slug ? collectionBySlug[slug] : null;
    const image = col?.hasImage
      ? getCollectionImageUrl({ id: col.id, width: 1600 })
      : s.image;
    return { ...s, image };
  });

  const goToSlide = useCallback((idx: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  }, [currentSlide, goToSlide, heroSlides.length]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  }, [currentSlide, goToSlide, heroSlides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const { data: products, isLoading: productsLoading } = useProducts();

  const bestsellers = (products ?? []).filter(p => p.isBestseller).slice(0, 4);
  const newArrivals = (products ?? []).filter(p => p.isNew).slice(0, 4);

  const slide = heroSlides[currentSlide] ?? heroSlides[0];

  return (
    <main>
      {/* === HERO === */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        ))}

        {/* Text overlay */}
        <div
          className={`absolute bottom-12 ${slide.align === 'right' ? 'right-10 text-right' : 'left-10'} max-w-sm transition-all duration-500 ${
            isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <p className="font-body text-[10px] font-500 tracking-[0.2em] uppercase text-white/80 mb-2">
            {slide.label}
          </p>
          <h1 className="font-display text-5xl lg:text-6xl font-light text-white leading-none mb-3">
            {slide.title}
          </h1>
          {slide.subtitle && (
            <p className="font-body text-sm text-white/80 mb-5 font-300">
              {slide.subtitle}
            </p>
          )}
          <Link href={slide.href}>
            <span className="inline-flex items-center gap-2 font-body text-[10px] font-500 tracking-[0.15em] uppercase text-white border-b border-white/60 pb-0.5 hover:border-white transition-colors">
              {slide.cta}
              <ArrowRight size={12} />
            </span>
          </Link>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`transition-all duration-300 ${
                i === currentSlide
                  ? 'w-8 h-0.5 bg-white'
                  : 'w-2 h-0.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Arrow controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* === MARQUEE STRIP === */}
      <div className="py-3 overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,253,247,0.15)', borderBottom: '1px solid rgba(255,253,247,0.15)' }}>
        <div className="flex w-max gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {Array(2).fill(null).map((_, i) => (
            <span key={i} className="flex flex-shrink-0 items-center gap-12 font-body text-[10px] font-500 tracking-[0.2em] uppercase" style={{ color: 'rgba(255,253,247,0.65)' }}>
              <span>Натуральные ткани</span>
              <span style={{ color: 'rgba(255,253,247,0.4)' }}>✦</span>
              <span>Авторские принты</span>
              <span style={{ color: 'rgba(255,253,247,0.4)' }}>✦</span>
              <span>Ручная работа</span>
              <span style={{ color: 'rgba(255,253,247,0.4)' }}>✦</span>
              <span>Индийское наследие</span>
              <span style={{ color: 'rgba(255,253,247,0.4)' }}>✦</span>
              <span>Российский дизайн</span>
              <span style={{ color: 'rgba(255,253,247,0.4)' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* === CATEGORIES === */}
      <section className="py-16 lg:py-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8" style={{ color: '#FFFDF7' }}>
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-4xl lg:text-5xl font-light" style={{ color: '#FFFDF7' }}>
            Каталог
          </h2>
          <Link href="/catalog">
            <span className="nav-link flex items-center gap-1.5" style={{ color: 'rgba(255,253,247,0.7)' }}>
              Все товары <ArrowRight size={12} />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORY_CARDS.map((cat, i) => (
            <Link key={cat.slug} href={`/catalog?category=${cat.slug}`}>
              <div className="group cursor-pointer" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="relative overflow-hidden aspect-[3/4] mb-3" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                  <img
                    src={getPageImageUrl(cat.key)}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-body text-sm font-500 tracking-wide" style={{ color: '#FFFDF7' }}>
                    {cat.label}
                  </h3>
                  
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* === BESTSELLERS === */}
      <section className="py-12 lg:py-16" style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="section-label mb-1">Популярное</p>
              <h2 className="font-display text-4xl lg:text-5xl font-light" style={{ color: '#FFFDF7' }}>
                Хиты продаж
              </h2>
            </div>
            <Link href="/catalog?filter=bestseller">
              <span className="nav-link flex items-center gap-1.5" style={{ color: 'rgba(255,253,247,0.7)' }}>
                Смотреть все <ArrowRight size={12} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {productsLoading ? (
              Array(4).fill(null).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] mb-3" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                  <div className="h-3 w-2/3 mb-2" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                  <div className="h-3 w-1/3" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                </div>
              ))
            ) : (
              bestsellers.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* === BRAND STORY === */}
      <section className="py-16 lg:py-24 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8" style={{ color: '#FFFDF7' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={getPageImageUrl("brand-story")}
                alt="О бренде SUVARNA"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 -z-10" style={{ border: '1px solid rgba(255,253,247,0.3)' }} />
          </div>
          <div>
            <p className="section-label mb-4">О бренде</p>
            <h2 className="font-display text-4xl lg:text-5xl font-light mb-6 leading-tight" style={{ color: '#FFFDF7' }}>
              Красота двух культур
            </h2>
            <p className="font-body text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,253,247,0.8)' }}>
              SUVARNA — это встреча российского дизайна и индийского текстильного наследия. Название бренда происходит от санскритского слова «сувáрна» — «золото», «красота», «совершенство».
            </p>
            <p className="font-body text-sm leading-relaxed mb-8" style={{ color: 'rgba(255,253,247,0.8)' }}>
              Каждое изделие создаётся из натуральных тканей — купро Bemberg, тафты, хлопка — с авторскими принтами и элементами ручной работы индийских мастеров. Мы верим, что одежда должна рассказывать историю.
            </p>
            <Link href="/about">
              <span className="btn-outline">Узнать больше</span>
            </Link>
          </div>
        </div>
      </section>

      {/* === NEW ARRIVALS === */}
      <section className="py-12 lg:py-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8" style={{ color: '#FFFDF7' }}>
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="section-label mb-1">Только что добавлено</p>
            <h2 className="font-display text-4xl lg:text-5xl font-light" style={{ color: '#FFFDF7' }}>
              Новинки
            </h2>
          </div>
          <Link href="/catalog?filter=new">
            <span className="nav-link flex items-center gap-1.5" style={{ color: 'rgba(255,253,247,0.7)' }}>
              Все новинки <ArrowRight size={12} />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {productsLoading ? (
            Array(4).fill(null).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] mb-3" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                <div className="h-3 w-2/3 mb-2" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                <div className="h-3 w-1/3" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
              </div>
            ))
          ) : (
            newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))
          )}
        </div>
      </section>

      {/* === LOOKBOOK STRIP — скрыт === */}

      {/* === DELIVERY STRIP === */}
      <section className="py-12" style={{ borderTop: '1px solid rgba(255,253,247,0.18)' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: '🚚', title: 'Доставка по России', text: 'СДЭК, Почта России, курьер' },
              { icon: '↩️', title: 'Возврат 14 дней', text: 'Без лишних вопросов' },
              { icon: '💳', title: 'Безопасная оплата', text: 'Карты, СБП, наложенный платёж' },
              { icon: '✉️', title: 'Поддержка', text: 'Ответим в течение часа' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-body text-sm font-500 mb-1" style={{ color: '#FFFDF7' }}>{item.title}</h3>
                <p className="font-body text-xs" style={{ color: 'rgba(255,253,247,0.65)' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
