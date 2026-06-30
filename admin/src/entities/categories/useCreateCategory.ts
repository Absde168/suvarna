import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '@shared/api/categories'
import { categoryKeys } from './queryKeys'

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}
