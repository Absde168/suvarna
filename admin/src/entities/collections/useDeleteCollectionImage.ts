import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCollectionImage } from "@shared/api";
import { collectionKeys } from "./queryKeys";

export function useDeleteCollectionImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollectionImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    },
  });
}
