import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "@shared/api";
import { orderKeys } from "./queryKeys";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.id) });
    },
  });
}
