/**
 * SUVARNA Size Guide Page
 */
export default function SizeGuide() {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <p className="section-label text-cream-faint mb-2">Информация</p>
        <h1 className="font-display text-5xl font-light text-cream mb-10">Таблица размеров</h1>
        <div className="divider mb-10" />

        <p className="font-body text-sm text-cream-muted leading-relaxed mb-8">
          Все изделия SUVARNA пошиты в свободном крое. Рекомендуем ориентироваться на обхват груди и бёдер при выборе размера. Если вы сомневаетесь между двумя размерами — выбирайте меньший: ткани имеют небольшую усадку после стирки.
        </p>

        {/* Size table */}
        <div className="overflow-x-auto mb-10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-cream">
                <th className="text-left py-3 pr-6 section-label text-cream-faint">Размер</th>
                <th className="text-left py-3 pr-6 section-label text-cream-faint">Грудь (см)</th>
                <th className="text-left py-3 pr-6 section-label text-cream-faint">Талия (см)</th>
                <th className="text-left py-3 section-label text-cream-faint">Бёдра (см)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: 'XS', chest: '80–84', waist: '62–66', hips: '88–92' },
                { size: 'S', chest: '84–88', waist: '66–70', hips: '92–96' },
                { size: 'M', chest: '88–92', waist: '70–74', hips: '96–100' },
                { size: 'L', chest: '92–96', waist: '74–78', hips: '100–104' },
                { size: 'XL', chest: '96–100', waist: '78–82', hips: '104–108' },
              ].map(row => (
                <tr key={row.size} className="border-b border-cream hover:bg-card-sienna transition-colors">
                  <td className="py-3 pr-6 font-body text-sm font-500 text-cream">{row.size}</td>
                  <td className="py-3 pr-6 font-body text-sm text-cream-muted">{row.chest}</td>
                  <td className="py-3 pr-6 font-body text-sm text-cream-muted">{row.waist}</td>
                  <td className="py-3 font-body text-sm text-cream-muted">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-card-sienna p-6">
          <h3 className="font-display text-xl font-light text-cream mb-2">Как снять мерки</h3>
          <ul className="space-y-2">
            {[
              'Грудь: измерьте по самой выступающей части груди, лента должна быть параллельна полу.',
              'Талия: измерьте по самому узкому месту талии.',
              'Бёдра: измерьте по самой выступающей части ягодиц.',
            ].map((text, i) => (
              <li key={i} className="flex gap-3 font-body text-xs text-cream-muted">
                <span className="text-[#C8B89A] font-500 flex-shrink-0">{i + 1}.</span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
