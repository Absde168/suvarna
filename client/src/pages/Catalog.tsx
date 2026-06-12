/**
 * SUVARNA Catalog Page
 * Style: Fashion Editorial Minimal
 * - Category filter tabs
 * - 3-column grid (2 on mobile)
 * - Filter by new/bestseller
 */
import { useState, useEffect } from 'react';
import { useSearch } from 'wouter';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS, CATEGORIES, getProductsByCategory } from '@/lib/products';
import { SlidersHorizontal, X } from 'lucide-react';

export default function Catalog() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = params.get('category') || 'all';
  const initialFilter = params.get('filter') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setActiveCategory(params.get('category') || 'all');
    setActiveFilter(params.get('filter') || '');
  }, [search]);

  let products = getProductsByCategory(activeCategory);

  if (activeFilter === 'new') {
    products = products.filter(p => p.isNew);
  } else if (activeFilter === 'bestseller') {
    products = products.filter(p => p.isBestseller);
  }

  const categoryName = CATEGORIES.find(c => c.slug === activeCategory)?.name || 'Все';

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      {/* Page Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="font-display text-4xl lg:text-6xl font-light" style={{ color: '#FFFDF7' }}>
            {activeFilter === 'new' ? 'Новинки' : activeFilter === 'bestseller' ? 'Хиты продаж' : categoryName}
          </h1>
          <p className="section-label">{products.length} {products.length === 1 ? 'товар' : products.length < 5 ? 'товара' : 'товаров'}</p>
        </div>
        <div className="divider" />
      </div>

      {/* Filters */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => { setActiveCategory(cat.slug); setActiveFilter(''); }}
              style={activeCategory === cat.slug && !activeFilter ? { backgroundColor: '#FFFDF7', color: '#C17A5A', border: '1px solid #FFFDF7' } : { backgroundColor: 'transparent', color: 'rgba(255,253,247,0.7)', border: '1px solid rgba(255,253,247,0.3)' }}
              className="flex-shrink-0 font-body text-[10px] font-500 tracking-[0.15em] uppercase px-4 py-2 transition-all duration-200"
            >
              {cat.name}
            </button>
          ))}
          <div className="w-px h-5 mx-2 flex-shrink-0" style={{ backgroundColor: 'rgba(255,253,247,0.2)' }} />
          <button
            onClick={() => { setActiveFilter('new'); setActiveCategory('all'); }}
            style={activeFilter === 'new' ? { backgroundColor: '#FFFDF7', color: '#C17A5A', border: '1px solid #FFFDF7' } : { backgroundColor: 'transparent', color: 'rgba(255,253,247,0.7)', border: '1px solid rgba(255,253,247,0.3)' }}
            className="flex-shrink-0 font-body text-[10px] font-500 tracking-[0.15em] uppercase px-4 py-2 transition-all duration-200"
          >
            Новинки
          </button>
          <button
            onClick={() => { setActiveFilter('bestseller'); setActiveCategory('all'); }}
            style={activeFilter === 'bestseller' ? { backgroundColor: '#FFFDF7', color: '#C17A5A', border: '1px solid #FFFDF7' } : { backgroundColor: 'transparent', color: 'rgba(255,253,247,0.7)', border: '1px solid rgba(255,253,247,0.3)' }}
            className="flex-shrink-0 font-body text-[10px] font-500 tracking-[0.15em] uppercase px-4 py-2 transition-all duration-200"
          >
            Хиты
          </button>
          {(activeFilter) && (
            <button
              onClick={() => { setActiveFilter(''); setActiveCategory('all'); }}
              className="flex-shrink-0 flex items-center gap-1 font-body text-[10px] font-500 tracking-[0.15em] uppercase px-3 py-2 transition-opacity hover:opacity-100"
              style={{ color: 'rgba(255,253,247,0.55)' }}
            >
              <X size={10} /> Сбросить
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="font-display text-3xl font-light mb-2" style={{ color: '#FFFDF7' }}>Товары не найдены</p>
            <p className="font-body text-sm mb-6" style={{ color: 'rgba(255,253,247,0.65)' }}>Попробуйте изменить фильтры</p>
            <button
              onClick={() => { setActiveCategory('all'); setActiveFilter(''); }}
              className="btn-outline"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
