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
      {/* Строка на карточке товара */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 mb-6 font-body text-sm transition-opacity hover:opacity-80"
        style={{ color: 'rgba(255,253,247,0.85)' }}
      >
        <DolyameBars />
        <span>4 платежа по {formatPrice(base)}</span>
        <span className="underline" style={{ color: 'rgba(255,253,247,0.6)' }}>Подробнее</span>
      </button>

      {/* Модалка с объяснением */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-[440px] rounded-2xl p-7"
            style={{ background: '#FFFFFF', color: '#1A1A1A' }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 text-[#999] hover:text-[#333] transition-colors"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-5" style={{ color: '#1A1A1A' }}>
              <DolyameBars />
              <span className="font-body font-600 tracking-wide">ДОЛЯМИ</span>
            </div>

            <h3 className="font-body text-lg font-600 mb-2 leading-snug">
              Оплатите 25% от стоимости покупки
            </h3>
            <p className="font-body text-sm mb-6" style={{ color: '#777' }}>
              Стоимость товара делится на 4 равные части. Первый платёж — сегодня,
              остальные три автоматически спишутся с карты с шагом в две недели. Без переплат.
            </p>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {schedule.map((s, i) => (
                <div key={i}>
                  <div className={`h-1 rounded-full mb-2 ${i === 0 ? '' : 'opacity-30'}`} style={{ background: i === 0 ? '#1A1A1A' : '#DDD' }} />
                  <p className="font-body text-xs font-600">{formatPrice(s.value)}</p>
                  <p className="font-body text-[11px] leading-tight" style={{ color: '#999' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <p className="font-body text-xs mb-5" style={{ color: '#999' }}>
              На стороне сервиса «Долями» может взиматься дополнительный сервисный сбор.
            </p>

            <a
              href="https://dolyame.ru/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm underline"
              style={{ color: '#1A1A1A' }}
            >
              Подробнее на dolyame.ru
            </a>
          </div>
        </div>
      )}
    </>
  );
}
