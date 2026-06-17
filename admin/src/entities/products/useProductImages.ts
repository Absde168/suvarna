import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProductImage, deleteProductImage, reorderProductImages } from "@shared/api";
import { productKeys } from "./queryKeys";

export function useAddProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProductImage,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductImage,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useReorderProductImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderProductImages,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
