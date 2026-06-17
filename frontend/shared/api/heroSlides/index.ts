import { api } from "../axios";
import type { HeroSlide } from "./types";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const { data } = await api.get<HeroSlide[]>("/hero-slides");
  return data;
}

export function getHeroSlideImageUrl(slideId: number, w = 1600): string {
  return `${api.defaults.baseURL}/hero-slides/${slideId}/image?w=${w}`;
}
