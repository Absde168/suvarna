import { useState } from 'react';
import { X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Логотип «Долями» — четыре вертикальные полосы
function DolyameBars({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-end gap-[3px] ${className}`} aria-hidden>
      <span className="w-[3px] h-[14px] bg-current rounded-[1px]" />
      <span className="w-[3px] h-[14px] bg-current rounded-[1px]" />
      <span className="w-[3px] h-[14px] bg-current rounded-[1px]" />
      <span className="w-[3px] h-[14px] bg-current rounded-[1px]" />
    </span>
  );
}

export default function DolyameWidget({ price }: { price: number }) {
  const [open, setOpen] = useState(false);

  // Точный расчёт: первый платёж забирает остаток от деления,
  // чтобы сумма 4 платежей точно равнялась цене товара.
  const base = Math.floor(price / 4);
  const firstPayment = price - base * 3;

  const schedule = [
    { label: 'Сегодня', value: firstPayment },
    { label: 'Через 2 недели', value: base },
    { label: 'Через 4 недели', value: base },
    { label: 'Через 6 недель', value: base },
  ];

  return (
    <>
      {/* Триггер-чип на карточке товара — стеклянная плашка */}
      <button
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-2 mb-6 px-3.5 py-2 rounded-full font-body text-sm transition-all hover:-translate-y-[1px]"
        style={{
          color: '#FFFDF7',
          background: 'rgba(255,253,247,0.08)',
          border: '1px solid rgba(255,253,247,0.22)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      >
        <DolyameBars />
        <span>4 платежа по {formatPrice(base)}</span>
        <span className="underline underline-offset-2" style={{ color: 'rgba(255,253,247,0.7)' }}>Подробнее</span>
      </button>

      {/* Модалка — liquid glass */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(40,20,12,0.55)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-[440px] rounded-[28px] p-7 overflow-hidden"
            style={{
              background: 'linear-gradient(155deg, rgba(255,253,247,0.18), rgba(255,253,247,0.06))',
              backdropFilter: 'blur(32px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(32px) saturate(1.4)',
              border: '1px solid rgba(255,253,247,0.28)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,253,247,0.4)',
              color: '#FFFDF7',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Мягкий блик сверху для «жидкого стекла» */}
            <div
              className="pointer-events-none absolute -top-24 -right-16 w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,253,247,0.22), transparent 70%)' }}
            />

            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 transition-opacity hover:opacity-70"
              style={{ color: 'rgba(255,253,247,0.7)' }}
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>

            <div className="relative flex items-center gap-2 mb-5">
              <DolyameBars />
              <span className="font-body font-600 tracking-[0.08em]">ДОЛЯМИ</span>
            </div>

            <h3 className="relative font-display text-2xl font-light mb-2 leading-snug">
              Оплатите 25% от стоимости покупки
            </h3>
            <p className="relative font-body text-sm mb-6" style={{ color: 'rgba(255,253,247,0.7)' }}>
              Стоимость товара делится на 4 равные части. Первый платёж — сегодня,
              остальные три автоматически спишутся с карты с шагом в две недели. Без переплат.
            </p>

            {/* Разбивка платежей — вложенная стеклянная панель */}
            <div
              className="relative grid grid-cols-4 gap-3 mb-6 p-4 rounded-2xl"
              style={{ background: 'rgba(255,253,247,0.07)', border: '1px solid rgba(255,253,247,0.15)' }}
            >
              {schedule.map((s, i) => (
                <div key={i}>
                  <div
                    className="h-1 rounded-full mb-2.5"
                    style={{ background: i === 0 ? '#FFFDF7' : 'rgba(255,253,247,0.22)' }}
                  />
                  <p className="font-body text-xs font-600" style={{ color: '#FFFDF7' }}>{formatPrice(s.value)}</p>
                  <p className="font-body text-[11px] leading-tight mt-0.5" style={{ color: 'rgba(255,253,247,0.5)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <p className="relative font-body text-xs mb-6" style={{ color: 'rgba(255,253,247,0.5)' }}>
              На стороне сервиса «Долями» может взиматься дополнительный сервисный сбор.
            </p>

            <a
              href="https://dolyame.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative block w-full text-center font-body text-sm font-500 tracking-[0.08em] uppercase py-3.5 rounded-2xl transition-all hover:opacity-90"
              style={{
                background: 'rgba(26,16,11,0.55)',
                border: '1px solid rgba(255,253,247,0.35)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#FFFDF7',
              }}
            >
              Подробнее на dolyame.ru
            </a>
          </div>
        </div>
      )}
    </>
  );
}
