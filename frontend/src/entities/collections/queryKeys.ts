export const collectionKeys = {
  all: ["collections"] as const,
  detail: (slug: string) => [...collectionKeys.all, "detail", slug] as const,
};
