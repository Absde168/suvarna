import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setCollectionImage } from "@shared/api";
import { collectionKeys } from "./queryKeys";

export function useSetCollectionImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setCollectionImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.all });
    },
  });
}
