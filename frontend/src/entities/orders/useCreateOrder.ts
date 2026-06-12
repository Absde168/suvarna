import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@shared/api";

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  });
}
