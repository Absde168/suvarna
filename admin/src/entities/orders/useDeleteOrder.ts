import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrder } from "@shared/api";
import { orderKeys } from "./queryKeys";

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
