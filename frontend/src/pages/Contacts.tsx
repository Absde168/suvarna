/**
 * SUVARNA Contacts Page
 */
import { useState } from 'react';
import { toast } from 'sonner';

export default function Contacts() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Сообщение отправлено! Мы ответим в течение часа.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <main className="pt-20 lg:pt-24 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <p className="section-label text-cream-faint mb-2">Свяжитесь с нами</p>
        <h1 className="font-display text-5xl lg:text-6xl font-light text-cream mb-10">Контакты</h1>
        <div className="divider mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Info */}
          <div>
            <div className="space-y-8">
              <div>
                <p className="section-label text-cream-faint mb-2">Телефон</p>
                <a href="tel:+79114959475" className="font-display text-3xl font-light text-cream hover:opacity-70 transition-opacity">
                  +7 (911) 495-94-75
                </a>
                <p className="font-body text-xs text-cream-faint mt-1">Пн–Пт: 10:00–19:00</p>
              </div>
              <div>
                <p className="section-label text-cream-faint mb-2">Email</p>
                <a href="mailto:info@suvarna.ru" className="font-display text-2xl font-light text-cream hover:opacity-70 transition-opacity">
                  info@suvarna.ru
                </a>
              </div>
              <div>
                <p className="section-label text-cream-faint mb-2">Адрес шоурума</p>
                <p className="font-body text-sm text-cream">г. Москва, 2-й Павелецкий проезд, д. 5с1, БЦ RiverDale</p>
                <p className="font-body text-xs text-cream-faint mt-1">Посещение по предварительной записи</p>
              </div>
              <div>
                <p className="section-label text-cream-faint mb-3">Социальные сети</p>
                <div className="flex gap-4">
                  {[
                    { label: 'Telegram', href: 'https://t.me/i_am_suvarna' },
                    { label: 'ВКонтакте', href: 'https://vk.com/oza_fashion' },
                  ].map(s => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-cream border-b border-cream hover:border-[#111111] transition-colors pb-0.5">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-display text-3xl font-light text-cream mb-6">Написать нам</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="section-label text-cream-faint block mb-1.5">Имя *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-cream px-4 py-3 font-body text-sm text-cream bg-white focus:outline-none focus:border-[#111111] transition-colors"
                  placeholder="Ваше имя"
                />
              </div>
              <div>
                <label className="section-label text-cream-faint block mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full border border-cream px-4 py-3 font-body text-sm text-cream bg-white focus:outline-none focus:border-[#111111] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="section-label text-cream-faint block mb-1.5">Сообщение *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full border border-cream px-4 py-3 font-body text-sm text-cream bg-white focus:outline-none focus:border-[#111111] transition-colors resize-none"
                  placeholder="Ваш вопрос или пожелание..."
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Отправить сообщение
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
