import { Button, Checkbox, Group, Modal, Select, Stack } from '@mantine/core'
import { useCategories } from '@/entities/categories'

export interface ProductFilters {
  category: string | null
  inStock: boolean | null
  isNew: boolean | null
  isBestseller: boolean | null
}

interface ProductFilterModalProps {
  opened: boolean
  onClose: () => void
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
}

export function ProductFilterModal({ opened, onClose, filters, onChange }: ProductFilterModalProps) {
  const { data: categories } = useCategories()

  const handleReset = () => {
    onChange({ category: null, inStock: null, isNew: null, isBestseller: null })
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Фильтры" centered>
      <Stack>
        <Select
          label="Категория"
          placeholder="Все категории"
          data={(categories ?? []).map((c) => ({ value: c.slug, label: c.name }))}
          value={filters.category}
          onChange={(value) => onChange({ ...filters, category: value })}
          clearable
        />
        <Checkbox
          label="Только в наличии"
          checked={!!filters.inStock}
          onChange={(e) => onChange({ ...filters, inStock: e.currentTarget.checked ? true : null })}
        />
        <Checkbox
          label="Только новинки"
          checked={!!filters.isNew}
          onChange={(e) => onChange({ ...filters, isNew: e.currentTarget.checked ? true : null })}
        />
        <Checkbox
          label="Только бестселлеры"
          checked={!!filters.isBestseller}
          onChange={(e) => onChange({ ...filters, isBestseller: e.currentTarget.checked ? true : null })}
        />
        <Group justify="space-between">
          <Button variant="default" onClick={handleReset}>
            Сбросить
          </Button>
          <Button onClick={onClose}>Применить</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
