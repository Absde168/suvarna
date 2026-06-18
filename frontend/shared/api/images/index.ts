import { api } from "../axios";
import type { GetImageUrlRequest, GetImageUrlResponse } from "./types";

export function getImageUrl({ id, width }: GetImageUrlRequest): GetImageUrlResponse {
  return width
    ? `${api.defaults.baseURL}/images/${id}?w=${width}`
    : `${api.defaults.baseURL}/images/${id}`;
}

export function getCollectionImageUrl({ id, width }: GetImageUrlRequest): GetImageUrlResponse {
  const t = Math.floor(Date.now() / 60000); // меняется каждую минуту
  return width
    ? `${api.defaults.baseURL}/images/collection/${id}?w=${width}&t=${t}`
    : `${api.defaults.baseURL}/images/collection/${id}?t=${t}`;
}
