import { useQuery } from "@tanstack/react-query";
import { getCollectionBySlug } from "@shared/api";
import { collectionKeys } from "./queryKeys";

export function useCollection(slug: string) {
  return useQuery({
    queryKey: collectionKeys.detail(slug),
    queryFn: () => getCollectionBySlug({ slug }),
    enabled: !!slug,
  });
}
