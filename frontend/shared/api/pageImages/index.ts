import { api } from "../axios";

export function getPageImageUrl(key: string): string {
  return `${api.defaults.baseURL}/page-images/${key}?t=${Date.now()}`;
}
