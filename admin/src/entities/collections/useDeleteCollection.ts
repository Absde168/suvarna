import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCollection } from "@shared/api";
import { collectionKeys } from "./queryKeys";

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    },
  });
}
