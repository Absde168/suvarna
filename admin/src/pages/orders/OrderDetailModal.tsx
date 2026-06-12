import { useEffect, useState } from 'react'
import { Badge, Divider, Group, Modal, Select, Stack, Table, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import type { Order, OrderStatus } from '@shared/api'
import { useUpdateOrderStatus } from '@/entities/orders'
import { STATUS_OPTIONS } from './OrderFilterModal'

interface OrderDetailModalProps {
  opened: boolean
  onClose: () => void
  order: Order | null
}

export function OrderDetailModal({ opened, onClose, order }: OrderDetailModalProps) {
  const updateStatus = useUpdateOrderStatus()
  const [status, setStatus] = useState<OrderStatus | null>(null)

  useEffect(() => {
    setStatus(order?.status ?? null)
  }, [order])

  if (!order) return null

  const handleStatusChange = (value: string | null) => {
    if (!value) return
    const newStatus = value as OrderStatus
    setStatus(newStatus)
    updateStatus.mutate(
      { id: order.id, status: newStatus },
      {
        onSuccess: () => notifications.show({ color: 'green', message: 'Статус заказа обновлён' }),
        onError: () => {
          notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось обновить статус' })
          setStatus(order.status)
        },
      }
    )
  }

  return (
    <Modal opened={opened} onClose={onClose} title={`Заказ №${order.id}`} size="lg" centered>
      <Stack>
        <Group justify="space-between">
          <div>
            <Text fw={600}>
              {order.firstName} {order.lastName}
            </Text>
            <Text size="sm" c="dimmed">
              {order.phone} · {order.email}
            </Text>
          </div>
          <Select
            data={STATUS_OPTIONS}
            value={status}
            onChange={handleStatusChange}
            w={180}
            disabled={updateStatus.isPending}
          />
        </Group>

        <Divider />

        <div>
          <Title order={5} mb={4}>
            Доставка
          </Title>
          <Text size="sm">Способ: {order.deliveryMethod}</Text>
          {order.city && <Text size="sm">Город: {order.city}</Text>}
          {order.address && <Text size="sm">Адрес: {order.address}</Text>}
          {order.apartment && <Text size="sm">Кв./офис: {order.apartment}</Text>}
          {order.comment && <Text size="sm">Комментарий: {order.comment}</Text>}
        </div>

        <Divider />

        <div>
          <Title order={5} mb={4}>
            Товары
          </Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Товар</Table.Th>
                <Table.Th>Артикул</Table.Th>
                <Table.Th>Размер</Table.Th>
                <Table.Th>Кол-во</Table.Th>
                <Table.Th>Цена</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {order.items.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{item.product.name}</Table.Td>
                  <Table.Td>{item.product.article}</Table.Td>
                  <Table.Td>{item.size}</Table.Td>
                  <Table.Td>{item.quantity}</Table.Td>
                  <Table.Td>{item.price.toLocaleString('ru-RU')} ₽</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>

        <Divider />

        <Group justify="space-between">
          <div>
            <Title order={5} mb={4}>
              Оплата
            </Title>
            {order.payment ? (
              <>
                <Text size="sm">Способ: {order.payment.method}</Text>
                <Text size="sm">
                  Статус: <Badge size="sm">{order.payment.status}</Badge>
                </Text>
              </>
            ) : (
              <Text size="sm" c="dimmed">
                Нет данных об оплате
              </Text>
            )}
          </div>
          <Title order={4}>Итого: {order.totalPrice.toLocaleString('ru-RU')} ₽</Title>
        </Group>
      </Stack>
    </Modal>
  )
}
