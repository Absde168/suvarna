import { api } from "../axios";
import type { Category, GetCategoriesResponse } from "./types";

export async function getCategories(): Promise<GetCategoriesResponse> {
  const res = await api.get<GetCategoriesResponse>("/categories");
  return res.data;
}

export async function createCategory(name: string): Promise<Category> {
  const res = await api.post<Category>("/admin/categories", { name });
  return res.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/admin/categories/${id}`);
}
