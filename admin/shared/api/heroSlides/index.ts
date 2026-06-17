import { api } from "../axios";
import type { HeroSlide, CreateHeroSlideData } from "./types";

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const res = await api.get<HeroSlide[]>("/admin/hero-slides");
  return res.data;
}

export async function createHeroSlide(data: CreateHeroSlideData): Promise<HeroSlide> {
  const res = await api.post<HeroSlide>("/admin/hero-slides", data);
  return res.data;
}

export async function updateHeroSlide(id: number, data: Partial<CreateHeroSlideData>): Promise<HeroSlide> {
  const res = await api.put<HeroSlide>(`/admin/hero-slides/${id}`, data);
  return res.data;
}

export async function deleteHeroSlide(id: number): Promise<void> {
  await api.delete(`/admin/hero-slides/${id}`);
}

export async function setHeroSlideImage(id: number, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("image", file);
  await api.post(`/admin/hero-slides/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteHeroSlideImage(id: number): Promise<void> {
  await api.delete(`/admin/hero-slides/${id}/image`);
}

export function getHeroSlideImageUrl(id: number): string {
  return `${api.defaults.baseURL}/hero-slides/${id}/image?w=800&t=${Date.now()}`;
}
