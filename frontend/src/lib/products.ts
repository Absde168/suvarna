// SUVARNA — Product Catalog Data
// Source of truth: suvarna.uds.app/c/goods
// Categories: Платья, Жакеты, Тренчи, Блузки, Штаны, Ветровки, Костюмы

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  sizes: string[];
  images: string[];
  description: string;
  fabric: string;
  care?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  colors?: string[];
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

export const CATEGORIES: Category[] = [
  { name: 'Все', slug: 'all', count: 0 },
  { name: 'Платья', slug: 'platya', count: 5 },
  { name: 'Жакеты', slug: 'zhakety', count: 2 },
  { name: 'Тренчи', slug: 'trenchi', count: 7 },
  { name: 'Блузки', slug: 'bluzki', count: 6 },
  { name: 'Штаны', slug: 'shtany', count: 2 },
  { name: 'Ветровки', slug: 'vetrovki', count: 3 },
  { name: 'Костюмы', slug: 'kostyumy', count: 3 },
];

export const PRODUCTS: Product[] = [
  // === ПЛАТЬЯ (Dresses) — 5 items, 19 000₽ each per UDS ===
  {
    id: 'dress-01',
    name: 'Платье «Секрет пятого ветра»',
    category: 'Платья',
    categorySlug: 'platya',
    price: 19000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/dress_1_87f2438c.jpg',
      '/manus-storage/dress_2_4f15cc8e.jpg',
    ],
    description: 'Лёгкое платье-кимоно из ткани Bemberg с авторским акварельным принтом. Свободный крой, пояс-завязка, длина макси. Идеально для особых случаев и летних вечеров.',
    fabric: 'Bemberg (100% купро)',
    care: 'Деликатная стирка 30°C, не отжимать',
    isNew: true,
    isBestseller: true,
  },
  {
    id: 'dress-02',
    name: 'Платье «Бархатный шёпот»',
    category: 'Платья',
    categorySlug: 'platya',
    price: 19000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/dress_5_f2819b26.jpg',
      '/manus-storage/dress_4_cb92d523.jpg',
    ],
    description: 'Романтичное платье с крупным цветочным принтом на нежном фоне. Свободный крой, рукав 3/4. Ткань Bemberg создаёт красивую драпировку.',
    fabric: 'Bemberg (100% купро)',
    care: 'Деликатная стирка 30°C',
    isBestseller: true,
  },
  {
    id: 'dress-03',
    name: 'Платье «Листья Эхо»',
    category: 'Платья',
    categorySlug: 'platya',
    price: 19000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/dress_10_b9724543.jpg',
      '/manus-storage/dress_9_0c89e843.jpg',
    ],
    description: 'Изысканное платье-халат с принтом «листья» на серо-голубом фоне. Глубокий V-образный вырез, пояс-завязка, длина макси. Ткань Bemberg — мягкая и воздушная.',
    fabric: 'Bemberg (100% купро)',
    care: 'Деликатная стирка 30°C',
    isNew: true,
  },
  {
    id: 'dress-04',
    name: 'Платье «Пионовый мист»',
    category: 'Платья',
    categorySlug: 'platya',
    price: 19000,
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/dress_3_24b6c869.jpg',
      '/manus-storage/dress_6_aaca77bf.jpg',
    ],
    description: 'Платье свободного кроя из ткани Bemberg с нежным принтом «пионовый туман». Лёгкое, воздушное, идеально для тёплого сезона.',
    fabric: 'Bemberg (100% купро)',
    care: 'Деликатная стирка 30°C',
    isBestseller: true,
  },
  {
    id: 'dress-05',
    name: 'Платье «Путь к себе»',
    category: 'Платья',
    categorySlug: 'platya',
    price: 19000,
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      '/manus-storage/dress_7_d1b93009.jpg',
      '/manus-storage/dress_8_cf352aaa.jpg',
    ],
    description: 'Длинное платье с ботаническим принтом из коллекции Bemberg. Элегантный силуэт, натуральная ткань, ручная отделка.',
    fabric: 'Bemberg (100% купро)',
    care: 'Деликатная стирка 30°C',
    isNew: true,
  },

  // === ЖАКЕТЫ (Jackets) ===
  {
    id: 'jacket-01',
    name: 'Жакет «Канта» бежевый',
    category: 'Жакеты',
    categorySlug: 'zhakety',
    price: 22500,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/jacket_1_d889054d.jpg',
      '/manus-storage/jacket_2_35db4598.jpg',
    ],
    description: 'Жакет в технике «канта» — индийская ручная стёжка на натуральном хлопке. Принт с красными пионами на бежевом фоне. Пояс-завязка, свободный крой.',
    fabric: 'Хлопок 100%, ручная стёжка канта',
    care: 'Деликатная стирка 30°C, не отжимать',
    isNew: true,
    isBestseller: true,
  },
  {
    id: 'jacket-02',
    name: 'Жакет «Цветочный» с вышивкой',
    category: 'Жакеты',
    categorySlug: 'zhakety',
    price: 24900,
    sizes: ['XS', 'S', 'M', 'L'],
    images: [
      '/manus-storage/jacket_2_35db4598.jpg',
      '/manus-storage/jacket_1_d889054d.jpg',
    ],
    description: 'Жакет с авторской вышивкой цветочного мотива. Натуральная ткань, ручная работа индийских мастеров.',
    fabric: 'Хлопок/шёлк, ручная вышивка',
    care: 'Только химчистка',
    isNew: true,
  },

  // === ТРЕНЧИ (Trench Coats) — prices per UDS ===
  {
    id: 'trench-su020',
    name: 'Тренч «Тигры» чёрно-белый',
    category: 'Тренчи',
    categorySlug: 'trenchi',
    price: 30000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/trench_01_28d6f0ee.jpg',
      '/manus-storage/trench_02_4f2416c5.jpg',
    ],
    description: 'Тренч из тафты с авторским принтом «Тигры» в чёрно-белой гамме. Приталенный силуэт, пояс, длина миди. Ткань тафта создаёт лёгкий блеск.',
    fabric: 'Тафта (100% полиэстер), подкладка — вискоза',
    care: 'Только химчистка',
    isBestseller: true,
    colors: ['Чёрно-белый', 'Оранжевый'],
  },
  {
    id: 'trench-su021',
    name: 'Тренч «Тигры» оранжевый',
    category: 'Тренчи',
    categorySlug: 'trenchi',
    price: 30000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/trench_03_03208356.jpg',
      '/manus-storage/trench_04_97bf3854.jpg',
    ],
    description: 'Тренч из тафты с авторским принтом «Тигры» в ярком оранжевом цвете. Приталенный силуэт, пояс, длина миди.',
    fabric: 'Тафта (100% полиэстер), подкладка — вискоза',
    care: 'Только химчистка',
    colors: ['Чёрно-белый', 'Оранжевый'],
  },
  {
    id: 'trench-su022',
    name: 'Тренч «Цветочная фантазия»',
    category: 'Тренчи',
    categorySlug: 'trenchi',
    price: 35000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/trench_05_0698a37d.jpg',
      '/manus-storage/trench_06_9c9b9021.jpg',
    ],
    description: 'Тренч из тафты с авторским принтом «Цветочная фантазия». Нежный цветочный рисунок, приталенный крой, пояс.',
    fabric: 'Тафта (100% полиэстер), подкладка — вискоза',
    care: 'Только химчистка',
    isNew: true,
    isBestseller: true,
  },
  {
    id: 'trench-su023',
    name: 'Тренч из тафты зелёный',
    category: 'Тренчи',
    categorySlug: 'trenchi',
    price: 25000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/trench_07_dd4e4d68.jpg',
      '/manus-storage/trench_08_40eb51b8.jpg',
    ],
    description: 'Тренч из тафты в насыщенном зелёном цвете с вышивкой. Приталенный силуэт, пояс, длина миди.',
    fabric: 'Тафта (100% полиэстер), подкладка — вискоза',
    care: 'Только химчистка',
    colors: ['Зелёный', 'Розовый', 'Чёрный', 'Хаки'],
  },
  {
    id: 'trench-su024',
    name: 'Тренч из тафты розовый',
    category: 'Тренчи',
    categorySlug: 'trenchi',
    price: 25000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/trench_10_8a1e2d9a.jpg',
      '/manus-storage/trench_11_bbddfa9b.jpg',
    ],
    description: 'Тренч из тафты в нежном розовом цвете с вышивкой. Приталенный силуэт, пояс, длина миди.',
    fabric: 'Тафта (100% полиэстер), подкладка — вискоза',
    care: 'Только химчистка',
    colors: ['Зелёный', 'Розовый', 'Чёрный', 'Хаки'],
  },
  {
    id: 'trench-su025',
    name: 'Тренч из тафты чёрный',
    category: 'Тренчи',
    categorySlug: 'trenchi',
    price: 25000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/trench_12_26d2c882.jpg',
      '/manus-storage/trench_13_63093dd4.jpg',
    ],
    description: 'Классический тренч из тафты в чёрном цвете с вышивкой. Универсальная модель для любого случая.',
    fabric: 'Тафта (100% полиэстер), подкладка — вискоза',
    care: 'Только химчистка',
    colors: ['Зелёный', 'Розовый', 'Чёрный', 'Хаки'],
  },
  {
    id: 'trench-su026',
    name: 'Тренч из тафты хаки',
    category: 'Тренчи',
    categorySlug: 'trenchi',
    price: 25000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/trench_14_78b3aba1.jpg',
      '/manus-storage/trench_15_1851b4d6.jpg',
    ],
    description: 'Тренч из тафты в цвете хаки с вышивкой цветочных мотивов. Приталенный силуэт, пояс, длина миди.',
    fabric: 'Тафта (100% полиэстер), подкладка — вискоза',
    care: 'Только химчистка',
    colors: ['Зелёный', 'Розовый', 'Чёрный', 'Хаки'],
  },

  // === БЛУЗКИ (Blouses) ===
  {
    id: 'blouse-01',
    name: 'Блузка «Тропики» зелёная',
    category: 'Блузки',
    categorySlug: 'bluzki',
    price: 9900,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/blouse_1_cca9e890.jpg',
      '/manus-storage/blouse_2_afc7bed5.jpg',
    ],
    description: 'Блузка из натуральной ткани с ярким тропическим принтом в зелёных тонах. Свободный крой, манжеты на пуговицах.',
    fabric: 'Вискоза 100%',
    care: 'Машинная стирка 30°C',
    isBestseller: true,
  },
  {
    id: 'blouse-02',
    name: 'Блузка с авторским принтом',
    category: 'Блузки',
    categorySlug: 'bluzki',
    price: 8900,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/blouse_2_afc7bed5.jpg',
      '/manus-storage/blouse_3_71c16023.jpg',
    ],
    description: 'Блузка с уникальным авторским принтом. Лёгкая ткань, свободный крой, длина до бедра.',
    fabric: 'Вискоза 100%',
    care: 'Машинная стирка 30°C',
  },
  {
    id: 'blouse-03',
    name: 'Блузка «Ботаника»',
    category: 'Блузки',
    categorySlug: 'bluzki',
    price: 9500,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/blouse_3_71c16023.jpg',
      '/manus-storage/blouse_5_5953a73d.jpg',
    ],
    description: 'Блузка с ботаническим принтом из натуральной ткани. Воротник-стойка, рукав с манжетом.',
    fabric: 'Вискоза 100%',
    care: 'Машинная стирка 30°C',
    isNew: true,
  },
  {
    id: 'blouse-04',
    name: 'Блузка «Цветы» нежная',
    category: 'Блузки',
    categorySlug: 'bluzki',
    price: 9200,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/blouse_5_5953a73d.jpg',
      '/manus-storage/blouse_6_1_790054de.jpg',
    ],
    description: 'Нежная блузка с цветочным принтом. Свободный крой, лёгкая ткань.',
    fabric: 'Вискоза 100%',
    care: 'Машинная стирка 30°C',
  },
  {
    id: 'blouse-05',
    name: 'Блузка «Восток» с принтом',
    category: 'Блузки',
    categorySlug: 'bluzki',
    price: 10500,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/blouse_6_1_790054de.jpg',
      '/manus-storage/blouse_7_1_4ad6e52d.jpg',
    ],
    description: 'Блузка с восточным принтом, вдохновлённым индийскими мотивами. Свободный крой, длинный рукав.',
    fabric: 'Вискоза 100%',
    care: 'Машинная стирка 30°C',
    isNew: true,
  },
  {
    id: 'blouse-06',
    name: 'Блузка «Сад» с вышивкой',
    category: 'Блузки',
    categorySlug: 'bluzki',
    price: 11900,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/blouse_7_1_4ad6e52d.jpg',
      '/manus-storage/blouse_1_cca9e890.jpg',
    ],
    description: 'Блузка с авторской вышивкой «сад». Ручная работа, натуральная ткань.',
    fabric: 'Вискоза 100%, ручная вышивка',
    care: 'Деликатная стирка 30°C',
    isNew: true,
  },

  // === ШТАНЫ (Pants) — 2 items per UDS, 15 000₽ each ===
  {
    id: 'pants-01',
    name: 'Штаны вискозный бархат белые',
    category: 'Штаны',
    categorySlug: 'shtany',
    price: 15000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/pants_4_003d7df1.jpg',
      '/manus-storage/pants_1_849eb7f2.jpg',
    ],
    description: 'Широкие брюки из вискозного бархата белого цвета. Эластичный пояс, свободный крой. Идеально сочетаются с жакетами и блузками SUVARNA.',
    fabric: 'Вискоза-бархат 100%',
    care: 'Деликатная стирка 30°C',
    isBestseller: true,
    colors: ['Белый', 'Чёрный'],
  },
  {
    id: 'pants-02',
    name: 'Штаны вискозный бархат чёрные',
    category: 'Штаны',
    categorySlug: 'shtany',
    price: 15000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/pants_2_9afcb7e1.jpg',
      '/manus-storage/pants_3_fe03ce6b.jpg',
    ],
    description: 'Широкие брюки из вискозного бархата чёрного цвета. Эластичный пояс, свободный крой. Универсальная модель для любого образа.',
    fabric: 'Вискоза-бархат 100%',
    care: 'Деликатная стирка 30°C',
    colors: ['Белый', 'Чёрный'],
  },

  // === ВЕТРОВКИ (Windbreakers) — 3 items per UDS, 25 000₽ each ===
  {
    id: 'wind-01',
    name: 'Ветровка клетка',
    category: 'Ветровки',
    categorySlug: 'vetrovki',
    price: 25000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/wind_2_8c777b6d.jpg',
      '/manus-storage/wind_1_1e3fbbc0.jpg',
    ],
    description: 'Ветровка в клетку с пышными рукавами и декоративной отделкой. Замок-молния, кулиска на талии. Сочетание клетчатой ткани и контрастного низа.',
    fabric: 'Хлопок/полиэстер, отделка — тафта',
    care: 'Деликатная стирка 30°C',
    isNew: true,
    isBestseller: true,
  },
  {
    id: 'wind-02',
    name: 'Ветровка розовая',
    category: 'Ветровки',
    categorySlug: 'vetrovki',
    price: 25000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/wind_3_469998e3.jpg',
      '/manus-storage/wind_4_352ad3bc.jpg',
    ],
    description: 'Ветровка из велюра нежного розового цвета с пайетками на воротнике и манжетах. Кулиска на талии, замок-молния.',
    fabric: 'Велюр (хлопок/полиэстер), пайетки',
    care: 'Деликатная стирка 30°C, без отжима',
    isNew: true,
    colors: ['Розовый', 'Голубой'],
  },
  {
    id: 'wind-03',
    name: 'Ветровка голубая',
    category: 'Ветровки',
    categorySlug: 'vetrovki',
    price: 25000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/wind_5_8336cc99.jpg',
      '/manus-storage/wind_6_0e5b6955.jpg',
    ],
    description: 'Ветровка из велюра нежного голубого цвета с пайетками. Кулиска на талии, замок-молния. Лёгкая и элегантная.',
    fabric: 'Велюр (хлопок/полиэстер), пайетки',
    care: 'Деликатная стирка 30°C, без отжима',
    isNew: true,
    colors: ['Розовый', 'Голубой'],
  },

  // === КОСТЮМЫ (Suits) — 3 items per UDS, 25 000₽ each ===
  {
    id: 'suit-01',
    name: 'Костюм брючный «Секрет пятого ветра»',
    category: 'Костюмы',
    categorySlug: 'kostyumy',
    price: 25000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/suit_1_f9b7b581.jpg',
      '/manus-storage/suit_2_16c270d4.jpg',
    ],
    description: 'Брючный костюм с авторским принтом «Секрет пятого ветра». Рубашка свободного кроя и широкие брюки из натуральной ткани. Авторский принт в зелёных тонах.',
    fabric: 'Хлопок/вискоза, авторский принт',
    care: 'Деликатная стирка 30°C',
    isNew: true,
    isBestseller: true,
  },
  {
    id: 'suit-02',
    name: 'Костюм брючный «Присутствие»',
    category: 'Костюмы',
    categorySlug: 'kostyumy',
    price: 25000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/suit_3_750a7acd.jpg',
      '/manus-storage/suit_4_03a0455e.jpg',
    ],
    description: 'Брючный костюм «Присутствие» из натуральной ткани с авторским принтом. Рубашка и широкие брюки — идеальный ансамбль для особых случаев.',
    fabric: 'Хлопок/вискоза, авторский принт',
    care: 'Деликатная стирка 30°C',
    isNew: true,
  },
  {
    id: 'suit-03',
    name: 'Костюм брючный «Сумеречные джунгли»',
    category: 'Костюмы',
    categorySlug: 'kostyumy',
    price: 25000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: [
      '/manus-storage/suit_5_d3bfa17c.jpg',
      '/manus-storage/suit_6_97d0a823.jpg',
    ],
    description: 'Брючный костюм «Сумеречные джунгли» с насыщенным тёмным принтом. Рубашка и широкие брюки из натуральной ткани с экзотическим рисунком.',
    fabric: 'Хлопок/вискоза, авторский принт',
    care: 'Деликатная стирка 30°C',
    isNew: true,
  },
];

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === 'all') return PRODUCTS;
  return PRODUCTS.filter(p => p.categorySlug === categorySlug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return PRODUCTS
    .filter(p => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, count);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
