/**
 * SUVARNA Product Detail Page
 * Style: Fashion Editorial Minimal
 * - Large image gallery
 * - Size selector
 * - Add to cart
 * - Product details accordion
 * - Related products
 */
import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getImageUrl } from '@shared/api';
import { formatPrice } from '@/lib/utils';
import { useProduct, useProducts } from '@/entities/products';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isLoading } = useProduct({ id: productId });
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');

  const { data: categoryProducts } = useProducts(
    product?.category?.slug ? { category: product.category.slug } : {}
  );

  if (isLoading) {
    return <main className="pt-24 min-h-screen" />;
  }

  if (!product) {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-light mb-4">Товар не найден</h1>
          <Link href="/catalog">
            <span className="btn-outline">Вернуться в каталог</span>
          </Link>
        </div>
      </main>
    );
  }

  const related = (categoryProducts ?? []).filter(p => p.id !== product.id).slice(0, 4);

  // Размеры: только у брючных костюмов (категория «Костюмы») есть сетка XS–XL,
  // все остальные модели — единый размер One Size.
  const displaySizes = product.category?.slug === 'kostyumy'
    ? product.sizes.filter(s => s !== 'One Size')
    : ['One Size'];
  const singleSize = displaySizes.length === 1;
  const effectiveSize = singleSize ? displaySizes[0] : selectedSize;

  const handleAddToCart = () => {
    if (!effectiveSize) {
      toast.error('Пожалуйста, выберите размер');
      return;
    }
    addItem(product, effectiveSize);
    toast.success(`${product.name} добавлен в корзину`);
  };

  const accordionItems = [
    {
      key: 'description',
      label: 'Описание',
      content: product.description,
    },
    {
      key: 'fabric',
      label: 'Состав и материал',
      content: product.fabric,
    },
    {
      key: 'care',
      label: 'Уход',
      content: product.care || 'Деликатная стирка 30°C, не отжимать, гладить при низкой температуре.',
    },
    {
      key: 'delivery',
      label: 'Доставка и возврат',
      content: 'Доставка по всей России: СДЭК, Почта России, курьер (Москва и СПб). Срок доставки: 2–7 рабочих дней. Возврат в течение 14 дней с момента получения при сохранении товарного вида.',
    },
  ];

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 font-body text-xs" style={{ color: 'rgba(255,253,247,0.55)' }}>
          <Link href="/"><span className="hover:opacity-100 transition-opacity">Главная</span></Link>
          <span>/</span>
          <Link href="/catalog"><span className="hover:opacity-100 transition-opacity">Каталог</span></Link>
          <span>/</span>
          <Link href={`/catalog?category=${product.category?.slug ?? ''}`}>
            <span className="hover:opacity-100 transition-opacity">{product.category?.name}</span>
          </Link>
          <span>/</span>
          <span style={{ color: '#FFFDF7' }}>{product.name}</span>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 w-16 flex-shrink-0">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-[3/4] overflow-hidden border transition-all duration-200 ${
                    selectedImage === i ? 'border-[#111111]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={getImageUrl({ id: img.id, width: 400 })} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="flex-1 aspect-[3/4] overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
              {product.images[selectedImage] && (
                <img
                  src={getImageUrl({ id: product.images[selectedImage].id, width: 1200 })}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  decoding="async"
                />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:pt-4">
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              {product.isNew && (
                <span className="font-body text-[9px] font-500 tracking-[0.15em] uppercase px-2 py-0.5" style={{ backgroundColor: '#FFFDF7', color: '#C17A5A' }}>
                  Новинка
                </span>
              )}
              {product.isBestseller && (
                <span className="font-body text-[9px] font-500 tracking-[0.15em] uppercase px-2 py-0.5" style={{ backgroundColor: 'rgba(255,253,247,0.22)', color: '#FFFDF7', border: '1px solid rgba(255,253,247,0.4)' }}>
                  Хит продаж
                </span>
              )}
            </div>

            <p className="section-label mb-2">{product.category?.name}</p>
            <h1 className="font-display text-3xl lg:text-4xl font-light mb-3 leading-tight" style={{ color: '#FFFDF7' }}>
              {product.name}
            </h1>
            <p className="font-display text-3xl font-light mb-6" style={{ color: '#FFFDF7' }}>
              {formatPrice(product.price)}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 1 && (
              <div className="mb-6">
                <p className="section-label mb-2">Цвет: <span style={{ color: '#FFFDF7' }}>{product.colors[0]}</span></p>
                <div className="flex gap-2">
                  {product.colors.map(color => (
                    <span key={color} className="font-body text-xs px-2.5 py-1 cursor-pointer transition-colors" style={{ color: 'rgba(255,253,247,0.8)', border: '1px solid rgba(255,253,247,0.3)' }}>
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <p className="section-label">Размер</p>
                  <Link href="/size-guide">
                  <span className="font-body text-xs underline transition-opacity hover:opacity-100" style={{ color: 'rgba(255,253,247,0.65)' }}>
                    Таблица размеров
                  </span>
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {displaySizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={effectiveSize === size ? { backgroundColor: '#FFFDF7', color: '#C17A5A', border: '1px solid #FFFDF7' } : { backgroundColor: 'transparent', color: '#FFFDF7', border: '1px solid rgba(255,253,247,0.35)' }}
                    className="min-w-12 h-10 px-3 font-body text-sm transition-all duration-200"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              className="btn-primary w-full mb-3"
            >
              {effectiveSize ? `Добавить в корзину — ${formatPrice(product.price)}` : 'Выберите размер'}
            </button>
            <button className="btn-outline w-full mb-6">
              Заказать примерку
            </button>

            {/* Accordion */}
            <div style={{ borderTop: '1px solid rgba(255,253,247,0.2)' }}>
              {accordionItems.map(item => (
                <div key={item.key} style={{ borderBottom: '1px solid rgba(255,253,247,0.2)' }}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === item.key ? null : item.key)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="font-body text-sm font-500 tracking-wide" style={{ color: '#FFFDF7' }}>
                      {item.label}
                    </span>
                    {openAccordion === item.key
                      ? <ChevronUp size={14} style={{ color: 'rgba(255,253,247,0.6)' }} />
                      : <ChevronDown size={14} style={{ color: 'rgba(255,253,247,0.6)' }} />
                    }
                  </button>
                  {openAccordion === item.key && (
                    <div className="pb-4">
                      <p className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,253,247,0.8)' }}>
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-12 lg:py-16" style={{ backgroundColor: 'rgba(0,0,0,0.12)' }}>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl lg:text-4xl font-light mb-8" style={{ color: '#FFFDF7' }}>
              Вам также может понравиться
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
