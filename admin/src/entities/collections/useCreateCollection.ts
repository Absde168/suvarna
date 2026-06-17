import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCollection } from "@shared/api";
import { collectionKeys } from "./queryKeys";

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    },
  });
}
