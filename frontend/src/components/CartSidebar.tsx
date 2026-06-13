/**
 * SUVARNA Cart Sidebar
 * Style: Warm Botanical Terracotta
 * - Dark glass panel over Sienna background
 * - Cream text
 */
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@shared/api';
import { Link } from 'wouter';

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#A8623F', backdropFilter: 'blur(12px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(255,253,247,0.2)' }}>
          <div>
            <h2 className="font-display text-2xl font-light" style={{ color: '#FFFDF7' }}>Корзина</h2>
            {totalItems > 0 && (
              <p className="section-label mt-0.5">{totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}</p>
            )}
          </div>
          <button onClick={closeCart} className="p-1 hover:opacity-60 transition-opacity" style={{ color: '#FFFDF7' }}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="font-display text-2xl font-light mb-2" style={{ color: '#FFFDF7' }}>Корзина пуста</p>
              <p className="font-body text-sm mb-6" style={{ color: 'rgba(255,253,247,0.7)' }}>Добавьте товары из каталога</p>
              <button onClick={closeCart} className="btn-outline">
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                  <div className="w-20 h-24 flex-shrink-0 overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.15)' }}>
                    {item.product.images[0] && (
                      <img
                        src={getImageUrl({ id: item.product.images[0].id, width: 400 })}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body text-sm font-500 leading-tight mb-1" style={{ color: '#FFFDF7' }}>
                      {item.product.name}
                    </h3>
                    <p className="section-label mb-2">Размер: {item.size}</p>
                    <p className="font-body text-sm font-500 mb-3" style={{ color: '#FFFDF7' }}>
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2" style={{ border: '1px solid rgba(255,253,247,0.3)' }}>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center transition-colors"
                          style={{ color: '#FFFDF7' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,253,247,0.1)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-body text-sm w-6 text-center" style={{ color: '#FFFDF7' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center transition-colors"
                          style={{ color: '#FFFDF7' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,253,247,0.1)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="p-1 hover:opacity-60 transition-opacity"
                        style={{ color: 'rgba(255,253,247,0.6)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(255,253,247,0.2)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-body text-sm" style={{ color: 'rgba(255,253,247,0.7)' }}>Итого</span>
              <span className="font-display text-xl font-light" style={{ color: '#FFFDF7' }}>{formatPrice(totalPrice)}</span>
            </div>
            <p className="font-body text-xs mb-4" style={{ color: 'rgba(255,253,247,0.55)' }}>
              Доставка рассчитывается при оформлении заказа
            </p>
            <Link href="/checkout" onClick={closeCart}>
              <button className="btn-primary w-full text-center">
                Оформить заказ
              </button>
            </Link>
            <button
              onClick={closeCart}
              className="w-full mt-3 font-body text-xs tracking-wider uppercase transition-opacity hover:opacity-100"
              style={{ color: 'rgba(255,253,247,0.55)' }}
            >
              Продолжить покупки
            </button>
          </div>
        )}
      </div>
    </>
  );
}
