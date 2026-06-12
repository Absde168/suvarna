import { useMutation } from "@tanstack/react-query";
import { login } from "@shared/api";

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}
