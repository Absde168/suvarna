import type { GetOrdersRequest } from "@shared/api";

export const orderKeys = {
  all: ["admin", "orders"] as const,
  list: (params: GetOrdersRequest) => [...orderKeys.all, "list", params] as const,
  detail: (id: number) => [...orderKeys.all, "detail", id] as const,
};
