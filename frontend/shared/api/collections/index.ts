import { api } from "../axios";
import type { GetCollectionsResponse, GetCollectionBySlugRequest, GetCollectionBySlugResponse } from "./types";

export async function getCollections(): Promise<GetCollectionsResponse> {
  const { data } = await api.get<GetCollectionsResponse>("/collections");
  return data;
}

export async function getCollectionBySlug({ slug }: GetCollectionBySlugRequest): Promise<GetCollectionBySlugResponse> {
  const { data } = await api.get<GetCollectionBySlugResponse>(`/collections/${slug}`);
  return data;
}
