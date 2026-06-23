/**
 * SUVARNA Search Page
 */
import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useProducts } from '@/entities/products';
import ProductCard from '@/components/ProductCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const { data: products } = useProducts();

  const results = query.length >= 2
    ? (products ?? []).filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.categories?.some(c => c.name.toLowerCase().includes(query.toLowerCase())) ||
        (p.description ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="font-display text-5xl font-light text-cream mb-8">Поиск</h1>

        {/* Search input */}
        <div className="relative max-w-2xl mb-10">
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-faint" strokeWidth={1.5} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full border-b-2 border-[#111111] pl-10 pr-4 py-3 font-body text-lg text-cream bg-transparent focus:outline-none placeholder-[#BBBBBB]"
            placeholder="Введите название товара или категорию..."
          />
        </div>

        {/* Results */}
        {query.length >= 2 && (
          <div>
            <p className="section-label text-cream-faint mb-6">
              {results.length > 0
                ? `Найдено: ${results.length} ${results.length === 1 ? 'товар' : results.length < 5 ? 'товара' : 'товаров'}`
                : 'Ничего не найдено'
              }
            </p>
            {results.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {results.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div>
            <p className="section-label text-cream-faint mb-4">Популярные запросы</p>
            <div className="flex flex-wrap gap-2">
              {['Платья', 'Тренчи', 'Жакеты', 'Блузки', 'Штаны', 'Новинки', 'Bemberg', 'Тафта'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="font-body text-xs font-500 tracking-wider uppercase px-4 py-2 border border-cream text-cream-muted hover:border-[#111111] hover:text-cream transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
