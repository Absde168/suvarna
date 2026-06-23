import { useState } from 'react'
import { ActionIcon, Badge, Button, Group, Pagination, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconAdjustments, IconSearch, IconSortAscending, IconSortDescending, IconTrash } from '@tabler/icons-react'
import type { GetOrdersRequest, Order } from '@shared/api'
import { useDeleteOrder, useOrders } from '@/entities/orders'
import { OrderFilterModal, type OrderFilters } from './orders/OrderFilterModal'
import { OrderDetailModal } from './orders/OrderDetailModal'

const PAGE_SIZE = 10

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: 'Новый', color: 'blue' },
  processing: { label: 'В обработке', color: 'yellow' },
  shipped: { label: 'Отправлен', color: 'orange' },
  completed: { label: 'Выполнен', color: 'green' },
  cancelled: { label: 'Отменён', color: 'gray' },
}

export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<NonNullable<GetOrdersRequest['sortBy']>>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<OrderFilters>({ status: '' })

  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const deleteOrder = useDeleteOrder()

  const { data, isLoading } = useOrders({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    status: filters.status || undefined,
    sortBy,
    sortDir,
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const handleSort = (field: NonNullable<GetOrdersRequest['sortBy']>) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  const handleDelete = (order: Order) => {
    modals.openConfirmModal({
      title: 'Удаление заказа',
      children: <Text size="sm">Удалить заказ №{order.id} ({order.firstName} {order.lastName})? Это действие нельзя отменить.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteOrder.mutate(
          { id: order.id },
          {
            onSuccess: () => notifications.show({ color: 'green', message: 'Заказ удалён' }),
            onError: () => notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось удалить заказ' }),
          }
        )
      },
    })
  }

  const activeFiltersCount = filters.status ? 1 : 0

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Заказы</Title>
      </Group>

      <Group>
        <TextInput
          placeholder="Поиск по имени, телефону, email"
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
            setPage(1)
          }}
          w={320}
        />
        <Button
          variant="default"
          leftSection={<IconAdjustments size={16} />}
          onClick={() => setFilterModalOpen(true)}
          rightSection={activeFiltersCount > 0 ? <Badge size="xs" circle>{activeFiltersCount}</Badge> : null}
        >
          Фильтры
        </Button>
      </Group>

      <Table striped highlightOnHover verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>№</Table.Th>
            <Table.Th>Клиент</Table.Th>
            <Table.Th>Телефон</Table.Th>
            <Table.Th onClick={() => handleSort('totalPrice')} style={{ cursor: 'pointer' }}>
              <Group gap={4}>
                Сумма
                {sortBy === 'totalPrice' && (sortDir === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />)}
              </Group>
            </Table.Th>
            <Table.Th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
              <Group gap={4}>
                Статус
                {sortBy === 'status' && (sortDir === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />)}
              </Group>
            </Table.Th>
            <Table.Th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
              <Group gap={4}>
                Дата
                {sortBy === 'createdAt' && (sortDir === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />)}
              </Group>
            </Table.Th>
            <Table.Th />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {(data?.items ?? []).map((order) => {
            const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, color: 'gray' }
            return (
              <Table.Tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>
                <Table.Td>{order.id}</Table.Td>
                <Table.Td>
                  {order.firstName} {order.lastName}
                </Table.Td>
                <Table.Td>{order.phone}</Table.Td>
                <Table.Td>{order.totalPrice.toLocaleString('ru-RU')} ₽</Table.Td>
                <Table.Td>
                  <Badge color={statusInfo.color}>{statusInfo.label}</Badge>
                </Table.Td>
                <Table.Td>{new Date(order.createdAt).toLocaleString('ru-RU')}</Table.Td>
                <Table.Td onClick={(e) => e.stopPropagation()}>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(order)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            )
          })}
          {!isLoading && (data?.items.length ?? 0) === 0 && (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text ta="center" c="dimmed" py="md">
                  Заказы не найдены
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <Group justify="center">
        <Pagination value={page} onChange={setPage} total={totalPages} />
      </Group>

      <OrderFilterModal
        opened={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onChange={(value) => {
          setFilters(value)
          setPage(1)
        }}
      />

      <OrderDetailModal opened={!!selectedOrder} onClose={() => setSelectedOrder(null)} order={selectedOrder} />
    </Stack>
  )
}
