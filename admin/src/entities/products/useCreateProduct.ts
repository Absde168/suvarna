import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@shared/api";
import { productKeys } from "./queryKeys";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
