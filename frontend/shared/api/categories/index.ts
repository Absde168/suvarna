import { api } from "../axios";
import type { GetCategoriesResponse } from "./types";

export async function getCategories(): Promise<GetCategoriesResponse> {
  const { data } = await api.get<GetCategoriesResponse>("/categories");
  return data;
}
