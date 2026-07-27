/**
 * SUVARNA Checkout Page
 * Style: Fashion Editorial Minimal
 * Steps: 1. Contacts → 2. Delivery → 3. Payment → 4. Confirmation
 */
import { useState } from 'react';
import { Link } from 'wouter';
import { Check, ChevronRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import { getImageUrl } from '@shared/api';
import { useCreateOrder } from '@/entities/orders';
import { validateCoupon } from '@shared/api/coupons';
import { toast } from 'sonner';

type Step = 'contacts' | 'delivery' | 'payment' | 'success';

interface FormData {
  // Contacts
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  // Delivery
  deliveryMethod: 'courier' | 'pickup' | 'cdek' | 'post';
  city: string;
  address: string;
  comment: string;
  // Payment
  paymentMethod: 'card' | 'sbp' | 'dolyame';
  // Agreement
  agree: boolean;
}

const STEPS: { key: Step; label: string }[] = [
  { key: 'contacts', label: 'Контакты' },
  { key: 'delivery', label: 'Доставка' },
  { key: 'payment', label: 'Оплата' },
];

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const [step, setStep] = useState<Step>('contacts');
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', phone: '', email: '',
    deliveryMethod: 'courier', city: '', address: '', comment: '',
    paymentMethod: 'card', agree: false,
  });

  // Купон
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number; discount: number; itemsTotal: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const applyCouponCode = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await validateCoupon({
        code,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      });
      if (res.valid) {
        setAppliedCoupon({ code: res.code!, percent: res.percent!, discount: res.discount!, itemsTotal: res.itemsTotal! });
      } else {
        setAppliedCoupon(null);
        setCouponError(res.error ?? 'Купон недействителен');
      }
    } catch {
      setCouponError('Не удалось проверить купон');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  // Итоги с учётом скидки
  const effectiveItemsTotal = appliedCoupon ? appliedCoupon.itemsTotal : totalPrice;

  const stepIndex = STEPS.findIndex(s => s.key === step);

  const update = (field: keyof FormData, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 'contacts') {
      if (!form.firstName || !form.phone || !form.email) {
        toast.error('Заполните все обязательные поля');
        return;
      }
      setStep('delivery');
    } else if (step === 'delivery') {
      if (form.deliveryMethod !== 'pickup' && !form.city) {
        toast.error('Укажите город доставки');
        return;
      }
      setStep('payment');
    } else if (step === 'payment') {
      if (!form.agree) {
        toast.error('Необходимо согласиться с условиями');
        return;
      }
      createOrder.mutate(
        {
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email,
          deliveryMethod: form.deliveryMethod,
          city: form.city || undefined,
          address: form.address || undefined,
          comment: form.comment || undefined,
          paymentMethod: form.paymentMethod,
          couponCode: appliedCoupon?.code,
          items: items.map(item => ({
            productId: item.product.id,
            size: item.size,
            quantity: item.quantity,
          })),
        },
        {
          onSuccess: (order) => {
            clearCart();
            if (order.confirmationUrl) {
              // Онлайн-оплата — редирект на ЮKассу
              window.location.href = order.confirmationUrl;
            } else {
              setStep('success');
            }
          },
          onError: () => {
            toast.error('Не удалось оформить заказ. Попробуйте ещё раз.');
          },
        }
      );
    }
  };

  const deliveryPrice =
    form.deliveryMethod === 'pickup'
      ? 0
      : form.deliveryMethod === 'courier'
        ? 600
        : form.deliveryMethod === 'cdek'
          ? 700
          : 500;

  if (items.length === 0 && step !== 'success') {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-light mb-4">Корзина пуста</h1>
          <Link href="/catalog">
            <span className="btn-primary">Перейти в каталог</span>
          </Link>
        </div>
      </main>
    );
  }

  if (step === 'success') {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-glass rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-light text-cream mb-3">
            Заказ оформлен!
          </h1>
          <p className="font-body text-sm text-cream-muted mb-2">
            Спасибо за покупку, {form.firstName}!
          </p>
          <p className="font-body text-sm text-cream-muted mb-6">
            Подтверждение заказа отправлено на {form.email}. Мы свяжемся с вами в течение 1 часа.
          </p>
          <Link href="/">
            <span className="btn-primary">Вернуться на главную</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 lg:pt-24 min-h-screen bg-glass">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="font-display text-4xl lg:text-5xl font-light text-cream mb-8">
          Оформление заказа
        </h1>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex items-center gap-2 ${i <= stepIndex ? 'text-cream' : 'text-[#BBBBBB]'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-500 border transition-colors ${
                  i < stepIndex ? 'bg-glass border-cream text-white' :
                  i === stepIndex ? 'border-cream text-cream' :
                  'border-[#DDDDDD] text-[#BBBBBB]'
                }`}>
                  {i < stepIndex ? <Check size={10} /> : i + 1}
                </div>
                <span className="font-body text-xs font-500 tracking-wider uppercase hidden sm:block">
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-px mx-3 transition-colors ${i < stepIndex ? 'bg-glass' : 'bg-[#DDDDDD]'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12">
          {/* Form */}
          <div>
            {/* Step 1: Contacts */}
            {step === 'contacts' && (
              <div>
                <h2 className="font-display text-2xl font-light text-cream mb-6">
                  Контактные данные
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="section-label text-cream-faint block mb-1.5">Имя *</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={e => update('firstName', e.target.value)}
                      className="w-full border border-cream px-4 py-3 font-body text-sm text-cream bg-card-sienna focus:outline-none focus:border-cream transition-colors"
                      placeholder="Анна"
                    />
                  </div>
                  <div>
                    <label className="section-label text-cream-faint block mb-1.5">Фамилия</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={e => update('lastName', e.target.value)}
                      className="w-full border border-cream px-4 py-3 font-body text-sm text-cream bg-card-sienna focus:outline-none focus:border-cream transition-colors"
                      placeholder="Иванова"
                    />
                  </div>
                  <div>
                    <label className="section-label text-cream-faint block mb-1.5">Телефон *</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                      className="w-full border border-cream px-4 py-3 font-body text-sm text-cream bg-card-sienna focus:outline-none focus:border-cream transition-colors"
                      placeholder="+7 (999) 999-99-99"
                    />
                  </div>
                  <div>
                    <label className="section-label text-cream-faint block mb-1.5">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                      className="w-full border border-cream px-4 py-3 font-body text-sm text-cream bg-card-sienna focus:outline-none focus:border-cream transition-colors"
                      placeholder="anna@email.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Delivery */}
            {step === 'delivery' && (
              <div>
                <h2 className="font-display text-2xl font-light text-cream mb-6">
                  Способ доставки
                </h2>
                <div className="space-y-3 mb-6">
                  {[
                    { key: 'courier', label: 'Курьер (Москва)', price: 600, desc: '1–2 рабочих дня' },
                    { key: 'cdek', label: 'СДЭК', price: 700, desc: '2–5 рабочих дней' },
                    { key: 'post', label: 'Почта России', price: 500, desc: '5–10 рабочих дней' },
                    { key: 'pickup', label: 'Самовывоз', price: 0, desc: 'г. Москва, 2-й Павелецкий проезд, д. 5с1, БЦ RiverDale' },
                  ].map(opt => (
                    <label key={opt.key} className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      form.deliveryMethod === opt.key ? 'border-cream' : 'border-cream hover:border-cream'
                    }`}>
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.key}
                        checked={form.deliveryMethod === opt.key as any}
                        onChange={() => update('deliveryMethod', opt.key)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <span className="font-body text-sm font-500 text-cream">{opt.label}</span>
                          <span className="font-body text-sm text-cream">
                            {opt.price === 0 ? 'Бесплатно' : formatPrice(opt.price)}
                          </span>
                        </div>
                        <p className="font-body text-xs text-cream-faint mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {form.deliveryMethod !== 'pickup' && (
                  <div className="space-y-4">
                    <div>
                      <label className="section-label text-cream-faint block mb-1.5">Город *</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={e => update('city', e.target.value)}
                        className="w-full border border-cream px-4 py-3 font-body text-sm text-cream bg-card-sienna focus:outline-none focus:border-cream transition-colors"
                        placeholder="Москва"
                      />
                    </div>
                    <div>
                      <label className="section-label text-cream-faint block mb-1.5">Адрес</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={e => update('address', e.target.value)}
                        className="w-full border border-cream px-4 py-3 font-body text-sm text-cream bg-card-sienna focus:outline-none focus:border-cream transition-colors"
                        placeholder="Улица, дом, квартира"
                      />
                    </div>
                    <div>
                      <label className="section-label text-cream-faint block mb-1.5">Комментарий к заказу</label>
                      <textarea
                        value={form.comment}
                        onChange={e => update('comment', e.target.value)}
                        rows={3}
                        className="w-full border border-cream px-4 py-3 font-body text-sm text-cream bg-card-sienna focus:outline-none focus:border-cream transition-colors resize-none"
                        placeholder="Пожелания к доставке..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 'payment' && (
              <div>
                <h2 className="font-display text-2xl font-light text-cream mb-6">
                  Способ оплаты
                </h2>
                <div className="space-y-3 mb-8">
                  {[
                    { key: 'card', label: 'Банковская карта', desc: 'Visa, Mastercard, МИР — онлайн' },
                    { key: 'sbp', label: 'СБП (Система быстрых платежей)', desc: 'Оплата по QR-коду' },
                    { key: 'dolyame', label: 'Долями', desc: 'Оплата частями на 6 недель, без переплат' },
                  ].map(opt => (
                    <label key={opt.key} className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                      form.paymentMethod === opt.key ? 'border-cream' : 'border-cream hover:border-cream'
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value={opt.key}
                        checked={form.paymentMethod === opt.key as any}
                        onChange={() => update('paymentMethod', opt.key)}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-body text-sm font-500 text-cream block">{opt.label}</span>
                        <p className="font-body text-xs text-cream-faint mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Купон */}
                <div className="mb-6">
                  <label className="section-label text-cream-faint block mb-1.5">Промокод</label>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between border border-cream px-4 py-3">
                      <span className="font-body text-sm text-cream">
                        {appliedCoupon.code} — скидка {appliedCoupon.percent}% (−{formatPrice(appliedCoupon.discount)})
                      </span>
                      <button onClick={removeCoupon} className="font-body text-xs text-cream-faint underline hover:text-cream">
                        Убрать
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => { setCouponInput(e.target.value); setCouponError(''); }}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCouponCode(); } }}
                          className="flex-1 border border-cream px-4 py-3 font-body text-sm text-cream bg-card-sienna focus:outline-none focus:border-cream transition-colors"
                          placeholder="Введите промокод"
                        />
                        <button onClick={applyCouponCode} disabled={couponLoading} className="btn-outline whitespace-nowrap">
                          {couponLoading ? '...' : 'Применить'}
                        </button>
                      </div>
                      {couponError && <p className="font-body text-xs text-red-300 mt-1.5">{couponError}</p>}
                    </>
                  )}
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={e => update('agree', e.target.checked)}
                    className="mt-0.5"
                  />
                  <span className="font-body text-xs text-cream-muted leading-relaxed">
                    Я согласен(а) с{' '}
                    <Link href="/terms">
                      <span className="underline hover:text-cream transition-colors">условиями использования</span>
                    </Link>{' '}
                    и{' '}
                    <Link href="/privacy">
                      <span className="underline hover:text-cream transition-colors">политикой конфиденциальности</span>
                    </Link>
                  </span>
                </label>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream">
              {stepIndex > 0 ? (
                <button
                  onClick={() => setStep(STEPS[stepIndex - 1].key)}
                  className="btn-outline"
                >
                  Назад
                </button>
              ) : (
                <Link href="/catalog">
                  <span className="btn-outline">Продолжить покупки</span>
                </Link>
              )}
              <button onClick={handleNext} disabled={createOrder.isPending} className="btn-primary flex items-center gap-2">
                {step === 'payment' ? (createOrder.isPending ? 'Оформляем...' : 'Оформить заказ') : 'Далее'}
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card-sienna p-6 sticky top-24">
              <h3 className="font-display text-xl font-light text-cream mb-4">
                Ваш заказ
              </h3>
              <div className="space-y-4 mb-4">
                {items.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                    <div className="w-14 h-18 flex-shrink-0 overflow-hidden bg-card-sienna">
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
                      <p className="font-body text-xs font-500 text-cream leading-tight mb-0.5">
                        {item.product.name}
                      </p>
                      <p className="section-label text-cream-faint mb-1">Размер: {item.size} · {item.quantity} шт.</p>
                      <p className="font-body text-sm text-cream">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="divider mb-4" />
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="font-body text-sm text-cream-muted">Товары</span>
                  <span className="font-body text-sm text-cream">{formatPrice(totalPrice)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-cream-muted">Скидка ({appliedCoupon.code})</span>
                    <span className="font-body text-sm text-cream">−{formatPrice(appliedCoupon.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-body text-sm text-cream-muted">Доставка</span>
                  <span className="font-body text-sm text-cream">
                    {deliveryPrice === 0 ? 'Бесплатно' : formatPrice(deliveryPrice)}
                  </span>
                </div>
              </div>
              <div className="divider mb-4" />
              <div className="flex justify-between">
                <span className="font-body text-sm font-500 text-cream">Итого</span>
                <span className="font-display text-xl font-light text-cream">
                  {formatPrice(effectiveItemsTotal + deliveryPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
