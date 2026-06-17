import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCollection } from "@shared/api";
import { collectionKeys } from "./queryKeys";

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    },
  });
}
