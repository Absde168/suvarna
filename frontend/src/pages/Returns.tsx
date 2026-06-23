/**
 * SUVARNA Returns & Exchange Page
 */
export default function Returns() {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <p className="section-label text-cream-faint mb-2">Информация</p>
        <h1 className="font-display text-5xl font-light text-cream mb-10">Возврат и обмен</h1>
        <div className="divider mb-10" />

        <div className="space-y-10">
          <section>
            <h2 className="font-display text-3xl font-light text-cream mb-4">Условия возврата</h2>
            <p className="font-body text-sm text-cream-muted leading-relaxed mb-4">
              Вы можете вернуть товар в течение 14 дней с момента получения, если он не подошёл по размеру или по другим причинам. Товар должен быть в первоначальном виде: с бирками, без следов носки, чистый.
            </p>
            <ul className="space-y-2">
              {[
                'Срок возврата: 14 дней с момента получения',
                'Товар должен быть с оригинальными бирками',
                'Без следов носки, стирки, химчистки',
                'Изделия, пошитые на заказ, возврату не подлежат',
              ].map((text, i) => (
                <li key={i} className="flex gap-3 font-body text-sm text-cream-muted">
                  <span className="text-[#C8B89A]">—</span>
                  {text}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl font-light text-cream mb-4">Как оформить возврат</h2>
            <div className="space-y-4">
              {[
                { step: '01', title: 'Свяжитесь с нами', text: 'Напишите на info@iamsuvarna.ru или позвоните по телефону. Укажите номер заказа и причину возврата.' },
                { step: '02', title: 'Получите инструкции', text: 'Мы пришлём адрес для возврата и форму заявления в течение 1 рабочего дня.' },
                { step: '03', title: 'Отправьте товар', text: 'Упакуйте товар и отправьте по указанному адресу. Стоимость обратной доставки оплачивает покупатель.' },
                { step: '04', title: 'Получите деньги', text: 'После получения и проверки товара мы вернём деньги в течение 5–7 рабочих дней.' },
              ].map(item => (
                <div key={item.step} className="flex gap-6 py-4 border-b border-cream last:border-0">
                  <span className="font-display text-3xl font-light text-[#C8B89A] flex-shrink-0 w-10">{item.step}</span>
                  <div>
                    <h3 className="font-body text-sm font-500 text-cream mb-1">{item.title}</h3>
                    <p className="font-body text-xs text-cream-muted">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
