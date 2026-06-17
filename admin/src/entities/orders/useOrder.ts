import { useQuery } from "@tanstack/react-query";
import { getOrderById, type GetOrderByIdRequest } from "@shared/api";
import { orderKeys } from "./queryKeys";

export function useOrder({ id }: GetOrderByIdRequest) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => getOrderById({ id }),
    enabled: Number.isFinite(id),
  });
}
