import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderCollections } from "@shared/api";
import { collectionKeys } from "./queryKeys";

export function useReorderCollections() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderCollections,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    },
  });
}
