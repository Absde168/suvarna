export interface HeroSlide {
  id: number;
  title: string;
  label: string;
  subtitle: string;
  cta: string;
  href: string;
  align: string;
  position: number;
  image: { id: number } | null;
}

export interface CreateHeroSlideData {
  title: string;
  label?: string;
  subtitle?: string;
  cta?: string;
  href?: string;
  align?: string;
  position?: number;
}
