export default function Privacy() {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="font-display text-5xl font-light text-cream mb-10">Политика конфиденциальности</h1>
        <div className="divider mb-10" />
        <div className="space-y-6 font-body text-sm text-cream-muted leading-relaxed">
          <p>Настоящая политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта SUVARNA (suvarna.ru).</p>
          <h2 className="font-display text-2xl font-light text-cream">Сбор данных</h2>
          <p>Мы собираем следующие данные: имя, email, номер телефона, адрес доставки. Данные используются исключительно для обработки заказов и связи с покупателем.</p>
          <h2 className="font-display text-2xl font-light text-cream">Использование данных</h2>
          <p>Ваши данные не передаются третьим лицам, за исключением служб доставки (СДЭК, Почта России) для исполнения заказа.</p>
          <h2 className="font-display text-2xl font-light text-cream">Cookies</h2>
          <p>Сайт использует cookies для улучшения работы. Вы можете отключить cookies в настройках браузера.</p>
          <h2 className="font-display text-2xl font-light text-cream">Контакты</h2>
          <p>По вопросам обработки данных: <a href="mailto:info@suvarna.ru" className="underline hover:text-cream transition-colors">info@suvarna.ru</a></p>
        </div>
      </div>
    </main>
  );
}
