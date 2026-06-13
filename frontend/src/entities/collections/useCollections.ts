import { useQuery } from "@tanstack/react-query";
import { getCollections } from "@shared/api";
import { collectionKeys } from "./queryKeys";

export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.all,
    queryFn: () => getCollections(),
  });
}
