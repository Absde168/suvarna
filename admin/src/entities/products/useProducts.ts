import { useQuery } from "@tanstack/react-query";
import { getProducts, type GetProductsRequest } from "@shared/api";
import { productKeys } from "./queryKeys";

export function useProducts(params: GetProductsRequest = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
    placeholderData: (prev) => prev,
  });
}
