import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderProducts } from "@shared/api";
import { productKeys } from "./queryKeys";

export function useReorderProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
