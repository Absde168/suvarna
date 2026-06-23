/**
 * SUVARNA Header Component
 * Style: Warm Botanical Terracotta
 * - Logo top-left (non-clickable for now), SUVARNA text centered
 * - Nav left/right split (like Adinari)
 * - Glass background over Sienna, cream text
 */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLeft = [
    { label: 'Каталог', href: '/catalog' },
    { label: 'Коллекции', href: '/collections' },
    { label: 'Новинки', href: '/catalog?filter=new' },
  ];

  const navRight = [
    { label: 'О бренде', href: '/about' },
    { label: 'Доставка', href: '/delivery' },
    { label: 'Контакты', href: '/contacts' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-[rgba(255,253,247,0.18)]' : ''
        }`}
        style={{ backgroundColor: 'rgba(0,0,0,0.12)', backdropFilter: 'blur(8px)' }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main nav row */}
          <div className="flex items-center h-16 lg:h-20 relative">

            {/* Logo icon — top-left */}
            <Link href="/" className="mr-8 lg:mr-12 select-none flex items-center h-full py-2">
              <img
                src="/images/logo-icon-white.png"
                alt=""
                className="select-none h-full w-auto"
                style={{ opacity: 0.92 }}
              />
            </Link>

            {/* Left Nav — Desktop */}
            <nav className="hidden lg:flex items-center gap-8 flex-1">
              {navLeft.map(item => (
                <Link key={item.href} href={item.href}>
                  <span className="nav-link" style={{ color: '#FFFDF7' }}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* SUVARNA — Centered absolutely */}
            <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none">
              <Link href="/" className="pointer-events-auto">
                <span
                  className="font-display tracking-[0.25em] font-semibold text-xl lg:text-[2rem]"
                  style={{ color: '#FFFDF7', letterSpacing: '0.28em' }}
                >
                  SUVARNA
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-1 ml-auto"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
              style={{ color: '#FFFDF7' }}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Right Nav — Desktop + Icons */}
            <div className="hidden lg:flex items-center gap-6 lg:gap-8 flex-1 justify-end">
              <nav className="flex items-center gap-8">
                {navRight.map(item => (
                  <Link key={item.href} href={item.href}>
                    <span className="nav-link" style={{ color: '#FFFDF7' }}>
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Icons */}
              <div className="flex items-center gap-4">
                <Link href="/search">
                  <button className="p-1 hover:opacity-60 transition-opacity" aria-label="Поиск" style={{ color: '#FFFDF7' }}>
                    <Search size={18} strokeWidth={1.5} />
                  </button>
                </Link>
                <button
                  className="p-1 hover:opacity-60 transition-opacity relative"
                  onClick={openCart}
                  aria-label="Корзина"
                  style={{ color: '#FFFDF7' }}
                >
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-body flex items-center justify-center rounded-full"
                      style={{ backgroundColor: '#FFFDF7', color: '#C17A5A' }}>
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile icons */}
            <div className="flex lg:hidden items-center gap-3 ml-3">
              <Link href="/search">
                <button className="p-1 hover:opacity-60 transition-opacity" aria-label="Поиск" style={{ color: '#FFFDF7' }}>
                  <Search size={18} strokeWidth={1.5} />
                </button>
              </Link>
              <button
                className="p-1 hover:opacity-60 transition-opacity relative"
                onClick={openCart}
                aria-label="Корзина"
                style={{ color: '#FFFDF7' }}
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-body flex items-center justify-center rounded-full"
                    style={{ backgroundColor: '#FFFDF7', color: '#C17A5A' }}>
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '64px', backgroundColor: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)' }}
      >
        <nav className="flex flex-col px-6 py-8 gap-6">
          {[...navLeft, ...navRight].map(item => (
            <Link key={item.href} href={item.href}>
              <span className="font-display text-3xl font-light block" style={{ color: '#FFFDF7' }}>
                {item.label}
              </span>
            </Link>
          ))}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,253,247,0.22)' }}>
            <p className="section-label mb-2">Контакты</p>
            <a href="tel:+79114959475" className="font-body text-sm block mb-1" style={{ color: '#FFFDF7' }}>
              +7 (911) 495-94-75
            </a>
            <a href="mailto:info@iamsuvarna.ru" className="font-body text-sm block" style={{ color: '#FFFDF7' }}>
              info@iamsuvarna.ru
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
