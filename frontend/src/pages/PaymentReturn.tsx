import { useEffect, useState } from 'react';
import { Link, useSearch } from 'wouter';
import { Check, XCircle, Loader2 } from 'lucide-react';
import { getOrderById } from '@shared/api';

type Status = 'loading' | 'paid' | 'pending' | 'failed';

export default function PaymentReturn() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = Number(params.get('orderId'));

  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!orderId) {
      setStatus('failed');
      return;
    }

    // Даём ЮKассе секунду прислать вебхук, потом проверяем статус
    const timer = setTimeout(async () => {
      try {
        const order = await getOrderById({ id: orderId });
        const paymentStatus = order.payment?.status;
        if (paymentStatus === 'paid') {
          setStatus('paid');
        } else if (paymentStatus === 'failed') {
          setStatus('failed');
        } else {
          setStatus('pending');
        }
      } catch {
        setStatus('pending');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [orderId]);

  if (status === 'loading') {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 size={40} className="text-cream animate-spin mx-auto mb-4" />
          <p className="font-body text-sm text-cream-muted">Проверяем статус оплаты...</p>
        </div>
      </main>
    );
  }

  if (status === 'paid') {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-glass rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-light text-cream mb-3">Оплата прошла!</h1>
          <p className="font-body text-sm text-cream-muted mb-6">
            Заказ №{orderId} успешно оплачен. Мы свяжемся с вами в течение 1 часа.
          </p>
          <Link href="/">
            <span className="btn-primary">Вернуться на главную</span>
          </Link>
        </div>
      </main>
    );
  }

  if (status === 'failed') {
    return (
      <main className="pt-24 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-glass rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle size={28} className="text-white" />
          </div>
          <h1 className="font-display text-4xl font-light text-cream mb-3">Оплата отменена</h1>
          <p className="font-body text-sm text-cream-muted mb-6">
            Что-то пошло не так. Попробуйте оформить заказ ещё раз.
          </p>
          <Link href="/checkout">
            <span className="btn-primary">Попробовать снова</span>
          </Link>
        </div>
      </main>
    );
  }

  // pending
  return (
    <main className="pt-24 min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-glass rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 size={28} className="text-white animate-spin" />
        </div>
        <h1 className="font-display text-4xl font-light text-cream mb-3">Платёж обрабатывается</h1>
        <p className="font-body text-sm text-cream-muted mb-6">
          Заказ №{orderId} создан. Как только оплата подтвердится — мы свяжемся с вами.
        </p>
        <Link href="/">
          <span className="btn-primary">Вернуться на главную</span>
        </Link>
      </div>
    </main>
  );
}
