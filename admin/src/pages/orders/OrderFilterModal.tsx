import { Button, Group, Modal, Select, Stack } from '@mantine/core'
import type { OrderStatus } from '@shared/api'

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'new', label: 'Новый' },
  { value: 'processing', label: 'В обработке' },
  { value: 'shipped', label: 'Отправлен' },
  { value: 'completed', label: 'Выполнен' },
  { value: 'cancelled', label: 'Отменён' },
]

export interface OrderFilters {
  status: OrderStatus | ''
}

interface OrderFilterModalProps {
  opened: boolean
  onClose: () => void
  filters: OrderFilters
  onChange: (filters: OrderFilters) => void
}

export function OrderFilterModal({ opened, onClose, filters, onChange }: OrderFilterModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Фильтры" centered>
      <Stack>
        <Select
          label="Статус"
          placeholder="Все статусы"
          data={STATUS_OPTIONS}
          value={filters.status || null}
          onChange={(value) => onChange({ status: (value as OrderStatus) ?? '' })}
          clearable
        />
        <Group justify="space-between">
          <Button variant="default" onClick={() => onChange({ status: '' })}>
            Сбросить
          </Button>
          <Button onClick={onClose}>Применить</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export { STATUS_OPTIONS }
