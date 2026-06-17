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
import { useProducts } from '@/entities/products';
import { useCategories } from '@/entities/categories';
import { useCollections } from '@/entities/collections';
import { X } from 'lucide-react';

export default function Catalog() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = params.get('category') || 'all';
  const initialCollection = params.get('collection') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeCollection, setActiveCollection] = useState(initialCollection);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setActiveCategory(params.get('category') || 'all');
    setActiveCollection(params.get('collection') || '');
  }, [search]);

  const { data: categoriesData } = useCategories();
  const { data: collectionsData } = useCollections();
  const { data: productsData, isLoading } = useProducts({
    ...(activeCategory !== 'all' ? { category: activeCategory } : {}),
    ...(activeCollection ? { collection: activeCollection } : {}),
  });

  const products = productsData ?? [];

  const productCategories = (categoriesData ?? []).filter(c => c.slug !== 'novinki');
  const categories = [{ id: 0, name: 'Все', slug: 'all', count: 0 }, ...productCategories];
  const collections = collectionsData ?? [];

  const categoryName = activeCategory === 'novinki' ? 'Новинки' : (categories.find(c => c.slug === activeCategory)?.name || 'Все');
  const collectionName = collections.find(c => c.slug === activeCollection)?.name;

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      {/* Page Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="font-display text-4xl lg:text-6xl font-light" style={{ color: '#FFFDF7' }}>
            {collectionName ?? categoryName}
          </h1>
          <p className="section-label">{products.length} {products.length === 1 ? 'товар' : products.length < 5 ? 'товара' : 'товаров'}</p>
        </div>
        <div className="divider" />
      </div>

      {/* Filters */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => { setActiveCategory('all'); setActiveCollection(''); }}
            style={activeCategory === 'all' && !activeCollection ? { backgroundColor: '#FFFDF7', color: '#C17A5A', border: '1px solid #FFFDF7' } : { backgroundColor: 'transparent', color: 'rgba(255,253,247,0.7)', border: '1px solid rgba(255,253,247,0.3)' }}
            className="flex-1 text-center font-body text-[10px] font-500 tracking-[0.15em] uppercase px-4 py-2 transition-all duration-200"
          >
            Все
          </button>
          <button
            onClick={() => { setActiveCategory('novinki'); setActiveCollection(''); }}
            style={activeCategory === 'novinki' && !activeCollection ? { backgroundColor: '#FFFDF7', color: '#C17A5A', border: '1px solid #FFFDF7' } : { backgroundColor: 'transparent', color: 'rgba(255,253,247,0.7)', border: '1px solid rgba(255,253,247,0.3)' }}
            className="flex-1 text-center font-body text-[10px] font-500 tracking-[0.15em] uppercase px-4 py-2 transition-all duration-200"
          >
            Новинки
          </button>
          {productCategories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => { setActiveCategory(cat.slug); setActiveCollection(''); }}
              style={activeCategory === cat.slug && !activeCollection ? { backgroundColor: '#FFFDF7', color: '#C17A5A', border: '1px solid #FFFDF7' } : { backgroundColor: 'transparent', color: 'rgba(255,253,247,0.7)', border: '1px solid rgba(255,253,247,0.3)' }}
              className="flex-1 text-center whitespace-nowrap font-body text-[10px] font-500 tracking-[0.15em] uppercase px-4 py-2 transition-all duration-200"
            >
              {cat.name}
            </button>
          ))}
          {activeCollection && (
            <button
              onClick={() => { setActiveCategory('all'); setActiveCollection(''); }}
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
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] mb-3" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                <div className="h-3 w-2/3 mb-2" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
                <div className="h-3 w-1/3" style={{ backgroundColor: 'rgba(255,253,247,0.08)' }} />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <p className="font-display text-3xl font-light mb-2" style={{ color: '#FFFDF7' }}>Товары не найдены</p>
            <p className="font-body text-sm mb-6" style={{ color: 'rgba(255,253,247,0.65)' }}>Попробуйте изменить фильтры</p>
            <button
              onClick={() => { setActiveCategory('all'); setActiveCollection(''); }}
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
