import { api } from "../axios";
import type { GetImageUrlRequest, GetImageUrlResponse } from "./types";

export function getImageUrl({ id }: GetImageUrlRequest): GetImageUrlResponse {
  return `${api.defaults.baseURL}/images/${id}`;
}

export function getCollectionImageUrl({ id, t }: GetImageUrlRequest & { t?: number }): GetImageUrlResponse {
  const ts = t ?? Math.floor(Date.now() / 5000);
  return `${api.defaults.baseURL}/images/collection/${id}?t=${ts}`;
}
