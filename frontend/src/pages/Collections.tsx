/**
 * SUVARNA Collections Page
 * Style: Warm Botanical Terracotta
 * Shows 3 collections with hero banner images and placeholder text
 * Individual collection pages accessible via /collections/1, /collections/2, /collections/3
 */
import { Link, useParams } from 'wouter';
import { ArrowLeft } from 'lucide-react';

const COLLECTIONS = [
  {
    id: '1',
    name: 'Коллекция 1',
    label: 'Коллекция',
    description: 'Скоро здесь появится описание коллекции',
    image: '/manus-storage/hero_collection_1_3fcb03ab.jpg',
    href: '/collections/1',
  },
  {
    id: '2',
    name: 'Коллекция 2',
    label: 'Коллекция',
    description: 'Скоро здесь появится описание коллекции',
    image: '/manus-storage/hero_collection_2_2c6fdd53.jpg',
    href: '/collections/2',
  },
  {
    id: '3',
    name: 'Коллекция 3',
    label: 'Коллекция',
    description: 'Скоро здесь появится описание коллекции',
    image: '/manus-storage/hero_collection_3_eb610a33.jpg',
    href: '/collections/3',
  },
];

// Individual collection page
function CollectionDetail({ id }: { id: string }) {
  const col = COLLECTIONS.find(c => c.id === id);
  if (!col) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl text-cream mb-4">Коллекция не найдена</p>
          <Link href="/collections">
            <span className="btn-outline">← Все коллекции</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      {/* Hero banner */}
      <div className="relative w-full aspect-[16/7] overflow-hidden">
        <img
          src={col.image}
          alt={col.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-8 left-8 lg:bottom-14 lg:left-16">
          <p className="section-label text-cream-faint mb-2">{col.label}</p>
          <h1 className="font-display text-5xl lg:text-7xl font-light text-cream leading-none">
            {col.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <Link href="/collections">
          <span className="inline-flex items-center gap-2 section-label text-cream-faint hover:text-cream transition-colors cursor-pointer mb-10 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Все коллекции
          </span>
        </Link>

        <div className="max-w-2xl">
          <p className="font-body text-xl text-cream-muted leading-relaxed">
            {col.description}
          </p>
        </div>

        {/* Placeholder for future collection content */}
        <div className="mt-16 py-20 border border-cream/10 flex items-center justify-center rounded-none"
          style={{ background: 'rgba(0,0,0,0.10)' }}>
          <p className="font-display text-2xl text-cream/40 font-light">
            Скоро здесь появится описание коллекции
          </p>
        </div>

        <div className="mt-12">
          <Link href="/catalog">
            <span className="btn-primary">Перейти в каталог</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

// Collections list page
function CollectionsList() {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-10">
          <p className="section-label text-cream-faint mb-2">Все коллекции</p>
          <h1 className="font-display text-5xl lg:text-6xl font-light text-cream">
            Коллекции
          </h1>
        </div>
        <div className="divider mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {COLLECTIONS.map((col) => (
            <Link key={col.id} href={col.href}>
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-4 relative"
                  style={{ background: 'rgba(0,0,0,0.14)' }}>
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="btn-outline text-sm">Смотреть коллекцию</span>
                  </div>
                </div>
                <p className="section-label text-cream-faint mb-1">{col.label}</p>
                <h2 className="font-display text-2xl font-light text-cream group-hover:opacity-70 transition-opacity">
                  {col.name}
                </h2>
                <p className="font-body text-sm text-cream-muted mt-1 leading-relaxed">
                  {col.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function Collections() {
  const params = useParams<{ id?: string }>();
  if (params.id) {
    return <CollectionDetail id={params.id} />;
  }
  return <CollectionsList />;
}
