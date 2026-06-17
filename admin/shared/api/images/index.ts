import { api } from "../axios";
import type { GetImageUrlRequest, GetImageUrlResponse } from "./types";

export function getImageUrl({ id }: GetImageUrlRequest): GetImageUrlResponse {
  return `${api.defaults.baseURL}/images/${id}`;
}

export function getCollectionImageUrl({ id }: GetImageUrlRequest): GetImageUrlResponse {
  return `${api.defaults.baseURL}/images/collection/${id}`;
}
