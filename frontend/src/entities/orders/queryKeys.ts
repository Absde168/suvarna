export const orderKeys = {
  all: ["orders"] as const,
  detail: (id: number) => [...orderKeys.all, "detail", id] as const,
};
