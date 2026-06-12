/**
 * SUVARNA Footer
 * Style: Warm Botanical Terracotta
 * - Dark glass background over Sienna
 * - Cream text hierarchy
 */
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="mt-24" style={{ backgroundColor: 'rgba(0,0,0,0.22)', backdropFilter: 'blur(4px)', borderTop: '1px solid rgba(255,253,247,0.15)' }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <h2 className="font-display text-3xl tracking-[0.2em] font-light mb-4" style={{ color: '#FFFDF7' }}>SUVARNA</h2>
            <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,253,247,0.7)' }}>
              Российский дизайнерский бренд женской одежды с индийским наследием. Авторские принты, натуральные ткани, ручная работа.
            </p>
            <div className="flex gap-4">
              <a href="https://t.me/i_am_suvarna" target="_blank" rel="noopener noreferrer"
                className="section-label transition-opacity hover:opacity-100" style={{ color: 'rgba(255,253,247,0.65)', opacity: 0.75 }}>
                Telegram
              </a>
              <a href="https://vk.com/oza_fashion" target="_blank" rel="noopener noreferrer"
                className="section-label transition-opacity hover:opacity-100" style={{ color: 'rgba(255,253,247,0.65)', opacity: 0.75 }}>
                ВКонтакте
              </a>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 className="section-label mb-4" style={{ color: 'rgba(255,253,247,0.5)' }}>Каталог</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Все товары', href: '/catalog' },
                { label: 'Платья', href: '/catalog?category=platya' },
                { label: 'Жакеты', href: '/catalog?category=zhakety' },
                { label: 'Тренчи', href: '/catalog?category=trenchi' },
                { label: 'Блузки', href: '/catalog?category=bluzki' },
                { label: 'Штаны', href: '/catalog?category=shtany' },
                { label: 'Ветровки', href: '/catalog?category=vetrovki' },
                { label: 'Костюмы', href: '/catalog?category=kostyumy' },
                { label: 'Новинки', href: '/catalog?filter=new' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="font-body text-sm transition-opacity hover:opacity-100" style={{ color: 'rgba(255,253,247,0.7)', display: 'block' }}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="section-label mb-4" style={{ color: 'rgba(255,253,247,0.5)' }}>Информация</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'О бренде', href: '/about' },
                { label: 'Коллекции', href: '/collections' },
                { label: 'Доставка и оплата', href: '/delivery' },
                { label: 'Возврат и обмен', href: '/returns' },
                { label: 'Таблица размеров', href: '/size-guide' },
                { label: 'Уход за вещами', href: '/care' },
                { label: 'Контакты', href: '/contacts' },
              ].map(item => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <span className="font-body text-sm transition-opacity hover:opacity-100" style={{ color: 'rgba(255,253,247,0.7)', display: 'block' }}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="section-label mb-4" style={{ color: 'rgba(255,253,247,0.5)' }}>Контакты</h3>
            <div className="space-y-3">
              <div>
                <p className="font-body text-xs mb-0.5 uppercase tracking-wider" style={{ color: 'rgba(255,253,247,0.45)' }}>Телефон</p>
                <a href="tel:+79114959475" className="font-body text-sm transition-opacity hover:opacity-100" style={{ color: 'rgba(255,253,247,0.85)' }}>
                  +7 (911) 495-94-75
                </a>
              </div>
              <div>
                <p className="font-body text-xs mb-0.5 uppercase tracking-wider" style={{ color: 'rgba(255,253,247,0.45)' }}>Email</p>
                <a href="mailto:info@suvarna.ru" className="font-body text-sm transition-opacity hover:opacity-100" style={{ color: 'rgba(255,253,247,0.85)' }}>
                  info@suvarna.ru
                </a>
              </div>
              <div>
                <p className="font-body text-xs mb-0.5 uppercase tracking-wider" style={{ color: 'rgba(255,253,247,0.45)' }}>Время работы</p>
                <p className="font-body text-sm" style={{ color: 'rgba(255,253,247,0.7)' }}>Пн–Пт: 10:00–19:00</p>
              </div>
              <div className="pt-2">
                <p className="font-body text-xs mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,253,247,0.45)' }}>Подписка на новости</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Email"
                    className="flex-1 px-3 py-2 font-body text-xs focus:outline-none"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.18)',
                      border: '1px solid rgba(255,253,247,0.22)',
                      color: '#FFFDF7',
                    }}
                  />
                  <button className="px-3 py-2 font-body text-xs font-500 transition-opacity hover:opacity-80"
                    style={{ backgroundColor: '#FFFDF7', color: '#C17A5A' }}>
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,253,247,0.15)' }}>
          <p className="font-body text-xs" style={{ color: 'rgba(255,253,247,0.45)' }}>
            © 2024 SUVARNA. Все права защищены.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy">
              <span className="font-body text-xs transition-opacity hover:opacity-100" style={{ color: 'rgba(255,253,247,0.45)' }}>
                Политика конфиденциальности
              </span>
            </Link>
            <Link href="/terms">
              <span className="font-body text-xs transition-opacity hover:opacity-100" style={{ color: 'rgba(255,253,247,0.45)' }}>
                Пользовательское соглашение
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
