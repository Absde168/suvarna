import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@shared/api";
import { categoryKeys } from "./queryKeys";

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => getCategories(),
  });
}
