import { api } from "../axios";
import type { GetImageUrlRequest, GetImageUrlResponse } from "./types";

export function getImageUrl({ id, width }: GetImageUrlRequest): GetImageUrlResponse {
  return width
    ? `${api.defaults.baseURL}/images/${id}?w=${width}`
    : `${api.defaults.baseURL}/images/${id}`;
}

export function getCollectionImageUrl({ id, width }: GetImageUrlRequest): GetImageUrlResponse {
  return width
    ? `${api.defaults.baseURL}/images/collection/${id}?w=${width}`
    : `${api.defaults.baseURL}/images/collection/${id}`;
}
