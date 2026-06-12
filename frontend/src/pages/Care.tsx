/**
 * SUVARNA Care Instructions Page
 */
export default function Care() {
  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <p className="section-label text-cream-faint mb-2">Информация</p>
        <h1 className="font-display text-5xl font-light text-cream mb-10">Уход за вещами</h1>
        <div className="divider mb-10" />

        <div className="space-y-10">
          {[
            {
              fabric: 'Bemberg (купро)',
              icon: '🌿',
              instructions: [
                'Деликатная стирка при 30°C',
                'Не отжимать и не выкручивать',
                'Сушить в расправленном виде на горизонтальной поверхности',
                'Гладить при низкой температуре через влажную ткань',
                'Не использовать отбеливатели',
              ],
              note: 'Ткань Bemberg (купро) — это натуральное волокно, получаемое из хлопкового пуха. Она очень нежная и требует бережного обращения.',
            },
            {
              fabric: 'Тафта',
              icon: '✨',
              instructions: [
                'Только химчистка',
                'Не стирать в воде',
                'Хранить на вешалке, не складывать',
                'Не подвергать воздействию влаги',
              ],
              note: 'Тафта — плотная ткань с характерным блеском. Требует профессиональной чистки для сохранения формы и блеска.',
            },
            {
              fabric: 'Хлопок (жакеты канта)',
              icon: '🌸',
              instructions: [
                'Деликатная стирка при 30°C',
                'Не отжимать',
                'Сушить в расправленном виде',
                'Гладить при средней температуре',
                'Ручная вышивка — только деликатная стирка',
              ],
              note: 'Жакеты в технике канта содержат ручную стёжку. Особое внимание уделяйте бережному обращению с вышитыми элементами.',
            },
            {
              fabric: 'Вискоза (блузки, штаны)',
              icon: '🍃',
              instructions: [
                'Машинная стирка при 30°C, деликатный режим',
                'Не отжимать на высоких оборотах',
                'Сушить в расправленном виде',
                'Гладить при низкой температуре',
              ],
              note: 'Вискоза — мягкая натуральная ткань. При правильном уходе сохраняет форму и цвет на долгие годы.',
            },
          ].map(item => (
            <div key={item.fabric} className="border border-cream p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{item.icon}</span>
                <h2 className="font-display text-2xl font-light text-cream">{item.fabric}</h2>
              </div>
              <ul className="space-y-2 mb-4">
                {item.instructions.map((inst, i) => (
                  <li key={i} className="flex gap-3 font-body text-sm text-cream-muted">
                    <span className="text-[#C8B89A] flex-shrink-0">—</span>
                    {inst}
                  </li>
                ))}
              </ul>
              <p className="font-body text-xs text-cream-faint italic border-t border-cream pt-3">
                {item.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
