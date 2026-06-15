/**
 * SUVARNA Collections Page
 * Style: Warm Botanical Terracotta
 * Lists real collections from the backend and shows their products
 */
import { Link, useParams } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { useCollections, useCollection } from '@/entities/collections';
import { getCollectionImageUrl } from '@shared/api';
import ProductCard from '@/components/ProductCard';

// Individual collection page
function CollectionDetail({ slug }: { slug: string }) {
  const { data: collection, isLoading } = useCollection(slug);

  if (isLoading) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen flex items-center justify-center">
        <p className="font-display text-2xl font-light" style={{ color: '#FFFDF7' }}>Загрузка…</p>
      </main>
    );
  }

  if (!collection) {
    return (
      <main className="pt-20 lg:pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl font-light mb-4" style={{ color: '#FFFDF7' }}>Коллекция не найдена</p>
          <Link href="/collections">
            <span className="btn-outline">← Все коллекции</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <Link href="/collections">
          <span className="inline-flex items-center gap-2 section-label mb-6 hover:opacity-70 transition-opacity cursor-pointer" style={{ color: 'rgba(255,253,247,0.65)' }}>
            <ArrowLeft size={14} />
            Все коллекции
          </span>
        </Link>

        <div className="flex items-baseline justify-between mb-2">
          <h1 className="font-display text-4xl lg:text-6xl font-light" style={{ color: '#FFFDF7' }}>
            {collection.name}
          </h1>
          <p className="section-label">
            {collection.products.length} {collection.products.length === 1 ? 'товар' : collection.products.length < 5 ? 'товара' : 'товаров'}
          </p>
        </div>
        <div className="divider mb-8" />

        {collection.products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="font-display text-3xl font-light mb-2" style={{ color: '#FFFDF7' }}>В этой коллекции пока нет товаров</p>
            <Link href="/catalog">
              <span className="btn-outline mt-4">Перейти в каталог</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 pb-20">
            {collection.products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

// Collections list page
function CollectionsList() {
  const { data: collections, isLoading } = useCollections();

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

        {isLoading ? (
          <div className="space-y-16">
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center animate-pulse">
                <div className="aspect-[4/5]" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                <div className="space-y-4">
                  <div className="h-3 w-24" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                  <div className="h-10 w-2/3" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                  <div className="h-24 w-full" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                </div>
              </div>
            ))}
          </div>
        ) : !collections || collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="font-display text-3xl font-light" style={{ color: '#FFFDF7' }}>Коллекции скоро появятся</p>
          </div>
        ) : (
          <div className="space-y-20 lg:space-y-32 pb-20">
            {collections.map((col, index) => {
              const paragraphs = (col.description ?? '').split('\n').filter((p) => p.trim().length > 0);
              const imageFirst = index % 2 === 0;

              const image = (
                <div className="group h-[600px] md:h-full md:min-h-[640px] overflow-hidden relative flex items-center justify-center"
                  style={{ background: 'rgba(0,0,0,0.14)' }}>
                  {col.hasImage ? (
                    <img
                      src={getCollectionImageUrl({ id: col.id, width: 1200 })}
                      alt={col.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <p className="font-display text-3xl font-light text-cream/30">
                      {col.name}
                    </p>
                  )}
                </div>
              );

              const text = (
                <div className="flex flex-col items-start">
                  <p className="section-label text-cream-faint mb-3">Коллекция</p>
                  <h2 className="font-display text-6xl lg:text-8xl font-light text-cream mb-6 uppercase tracking-wide">
                    {col.name}
                  </h2>
                  <div className="space-y-4 mb-8">
                    {paragraphs.map((p, i) => (
                      <p key={i} className="font-body text-base lg:text-lg text-cream-muted leading-relaxed whitespace-pre-line">
                        {p}
                      </p>
                    ))}
                  </div>
                  <Link href={`/collections/${col.slug}`}>
                    <span className="section-label inline-flex items-center gap-2 text-cream hover:opacity-70 transition-opacity cursor-pointer">
                      Смотреть коллекцию →
                    </span>
                  </Link>
                </div>
              );

              return (
                <div key={col.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-stretch">
                  {imageFirst ? (
                    <>
                      {image}
                      {text}
                    </>
                  ) : (
                    <>
                      <div className="md:order-2">{image}</div>
                      <div className="md:order-1">{text}</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default function Collections() {
  const params = useParams<{ id?: string }>();
  if (params.id) {
    return <CollectionDetail slug={params.id} />;
  }
  return <CollectionsList />;
}
