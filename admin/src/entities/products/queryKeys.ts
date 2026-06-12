import type { GetProductsRequest } from "@shared/api";

export const productKeys = {
  all: ["admin", "products"] as const,
  list: (params: GetProductsRequest) => [...productKeys.all, "list", params] as const,
  detail: (id: number) => [...productKeys.all, "detail", id] as const,
};
