import { useQuery } from "@tanstack/react-query";
import { getProductById, type GetProductByIdRequest } from "@shared/api";
import { productKeys } from "./queryKeys";

export function useProduct({ id }: GetProductByIdRequest) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById({ id }),
    enabled: Number.isFinite(id),
  });
}
