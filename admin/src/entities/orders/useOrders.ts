import { useQuery } from "@tanstack/react-query";
import { getOrders, type GetOrdersRequest } from "@shared/api";
import { orderKeys } from "./queryKeys";

export function useOrders(params: GetOrdersRequest = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => getOrders(params),
    placeholderData: (prev) => prev,
  });
}
