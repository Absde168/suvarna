import { api } from "../axios";

export function getPageImageUrl(key: string): string {
  return `${api.defaults.baseURL}/page-images/${key}?t=${Date.now()}`;
}

export async function setPageImage(key: string, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("image", file);
  await api.post(`/admin/page-images/${key}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deletePageImage(key: string): Promise<void> {
  await api.delete(`/admin/page-images/${key}`);
}

export async function listPageImages(): Promise<string[]> {
  const res = await api.get<string[]>("/admin/page-images");
  return res.data;
}
