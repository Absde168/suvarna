import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@shared/api";
import { productKeys } from "./queryKeys";

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data.id) });
    },
  });
}
