/**
 * SUVARNA Delivery & Payment Page
 */
export default function Delivery() {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <p className="section-label text-cream-faint mb-2">Информация</p>
        <h1 className="font-display text-5xl font-light text-cream mb-10">Доставка и оплата</h1>
        <div className="divider mb-10" />

        <div className="space-y-10">
          <section>
            <h2 className="font-display text-3xl font-light text-cream mb-4">Доставка</h2>
            <div className="space-y-4">
              {[
                { title: 'Курьер (Москва и Санкт-Петербург)', price: '500 ₽', time: '1–2 рабочих дня', desc: 'Доставка курьером по Москве и Санкт-Петербургу. Время доставки согласовывается по телефону.' },
                { title: 'СДЭК', price: '350 ₽', time: '2–5 рабочих дней', desc: 'Доставка в пункты выдачи СДЭК по всей России. Трек-номер предоставляется после отправки.' },
                { title: 'Почта России', price: '350 ₽', time: '5–10 рабочих дней', desc: 'Доставка Почтой России. Подходит для отдалённых регионов.' },
                { title: 'Самовывоз', price: 'Бесплатно', time: 'По договорённости', desc: 'г. Москва, 2-й Павелецкий проезд, д. 5с1, БЦ RiverDale. Время работы: Пн–Пт 10:00–19:00.' },
              ].map((item, i) => (
                <div key={i} className="border border-cream p-5">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-body text-sm font-500 text-cream">{item.title}</h3>
                    <span className="font-body text-sm text-cream">{item.price}</span>
                  </div>
                  <p className="section-label text-cream-faint mb-2">{item.time}</p>
                  <p className="font-body text-xs text-cream-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl font-light text-cream mb-4">Оплата</h2>
            <div className="space-y-3">
              {[
                { title: 'Банковская карта', desc: 'Visa, Mastercard, МИР — безопасная онлайн-оплата через защищённый шлюз.' },
                { title: 'СБП (Система быстрых платежей)', desc: 'Оплата по QR-коду через мобильное приложение банка.' },
                { title: 'Наложенный платёж', desc: 'Оплата при получении заказа. Доступно только при доставке Почтой России и СДЭК.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 py-3 border-b border-cream last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C8B89A] mt-1.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-body text-sm font-500 text-cream mb-0.5">{item.title}</h3>
                    <p className="font-body text-xs text-cream-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl font-light text-cream mb-4">Важно знать</h2>
            <ul className="space-y-2">
              {[
                'Заказы обрабатываются в рабочие дни с 10:00 до 18:00.',
                'После оформления заказа мы свяжемся с вами для подтверждения в течение 1 часа.',
                'Срок изготовления изделий под заказ — 14–21 рабочий день.',
                'При наличии товара на складе — отправка в течение 1–2 рабочих дней.',
              ].map((text, i) => (
                <li key={i} className="flex gap-3 font-body text-sm text-cream-muted">
                  <span className="text-[#C8B89A] font-500">—</span>
                  {text}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
