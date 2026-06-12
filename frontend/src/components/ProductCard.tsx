/**
 * SUVARNA ProductCard
 * Style: Warm Botanical Terracotta
 * - Dark glass card background over Sienna
 * - Cream text, cream badges
 */
import { Link } from 'wouter';
import { Product, formatPrice } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="product-card group cursor-pointer"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Image */}
        <div className="product-card-img relative overflow-hidden aspect-[3/4]" style={{ backgroundColor: 'rgba(0,0,0,0.14)' }}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="font-body text-[9px] font-500 tracking-[0.15em] uppercase px-2 py-0.5"
                style={{ backgroundColor: '#FFFDF7', color: '#C17A5A' }}>
                Новинка
              </span>
            )}
            {product.isBestseller && !product.isNew && (
              <span className="font-body text-[9px] font-500 tracking-[0.15em] uppercase px-2 py-0.5"
                style={{ backgroundColor: 'rgba(255,253,247,0.22)', color: '#FFFDF7', border: '1px solid rgba(255,253,247,0.4)' }}>
                Хит
              </span>
            )}
          </div>
          {/* Hover second image */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              loading="lazy"
            />
          )}
        </div>

        {/* Info */}
        <div className="pt-3 pb-1">
          <p className="section-label mb-1">{product.category}</p>
          <h3 className="font-body text-sm font-400 leading-tight mb-1.5 group-hover:opacity-70 transition-opacity"
            style={{ color: '#FFFDF7' }}>
            {product.name}
          </h3>
          <p className="font-display text-lg font-light" style={{ color: '#FFFDF7' }}>
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
