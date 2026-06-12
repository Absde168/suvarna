import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@shared/api";
import { productKeys } from "./queryKeys";

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
