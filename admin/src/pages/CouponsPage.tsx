import { useState } from 'react'
import {
  Title, Button, Group, Stack, Card, Text, TextInput, NumberInput,
  Select, SegmentedControl, Switch, ActionIcon, Table, Badge,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IconTrash, IconPlus } from '@tabler/icons-react'
import {
  getAdminCoupons, createAdminCoupon, toggleAdminCoupon, deleteAdminCoupon,
} from '@shared/api/coupons'
import { getCategories } from '@shared/api/categories'
import { getProducts } from '@shared/api'

type Scope = 'category' | 'product'

export default function CouponsPage() {
  const qc = useQueryClient()
  const { data: coupons } = useQuery({ queryKey: ['admin-coupons'], queryFn: getAdminCoupons })
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => getCategories() })
  const { data: productsResp } = useQuery({ queryKey: ['products', { pageSize: 1000 }], queryFn: () => getProducts({ pageSize: 1000 }) })
  const products = productsResp?.items

  const [code, setCode] = useState('')
  const [percent, setPercent] = useState<number | ''>(10)
  const [scope, setScope] = useState<Scope>('category')
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [productId, setProductId] = useState<string | null>(null)

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-coupons'] })

  const createMut = useMutation({
    mutationFn: createAdminCoupon,
    onSuccess: () => {
      invalidate()
      setCode(''); setPercent(10); setCategoryId(null); setProductId(null)
      notifications.show({ title: 'Купон создан', message: '', color: 'green' })
    },
    onError: (err: any) => {
      notifications.show({ title: 'Ошибка', message: err?.response?.data?.error ?? 'Не удалось создать', color: 'red' })
    },
  })

  const toggleMut = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => toggleAdminCoupon(id, active),
    onSuccess: invalidate,
  })

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteAdminCoupon(id),
    onSuccess: () => { invalidate(); notifications.show({ title: 'Купон удалён', message: '', color: 'orange' }) },
  })

  const handleCreate = () => {
    if (!code.trim()) {
      notifications.show({ title: 'Введите код', message: '', color: 'red' })
      return
    }
    createMut.mutate({
      code: code.trim(),
      percent: Number(percent),
      categoryId: scope === 'category' ? Number(categoryId) : null,
      productId: scope === 'product' ? Number(productId) : null,
    })
  }

  const scopeValid = scope === 'category' ? Boolean(categoryId) : Boolean(productId)

  return (
    <Stack gap="lg">
      <Title order={2}>Купоны</Title>

      <Card withBorder padding="lg">
        <Title order={4} mb="md">Новый купон</Title>
        <Group align="flex-end" gap="md" wrap="wrap">
          <TextInput
            label="Код"
            placeholder="SUMMER20"
            value={code}
            onChange={(e) => setCode(e.currentTarget.value.toUpperCase())}
            w={160}
          />
          <NumberInput
            label="Скидка, %"
            value={percent}
            onChange={(v) => setPercent(typeof v === 'number' ? v : '')}
            min={1}
            max={99}
            w={120}
          />
          <SegmentedControl
            value={scope}
            onChange={(v) => setScope(v as Scope)}
            data={[{ label: 'Категория', value: 'category' }, { label: 'Товар', value: 'product' }]}
          />
          {scope === 'category' ? (
            <Select
              label="Категория"
              placeholder="Выберите"
              searchable
              value={categoryId}
              onChange={setCategoryId}
              data={(categories ?? []).map((c) => ({ value: String(c.id), label: c.name }))}
              w={220}
            />
          ) : (
            <Select
              label="Товар"
              placeholder="Выберите"
              searchable
              value={productId}
              onChange={setProductId}
              data={(products ?? []).map((p) => ({ value: String(p.id), label: p.name }))}
              w={280}
            />
          )}
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreate}
            loading={createMut.isPending}
            disabled={!code.trim() || !scopeValid}
          >
            Добавить
          </Button>
        </Group>
      </Card>

      <Card withBorder padding="lg">
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Код</Table.Th>
              <Table.Th>Скидка</Table.Th>
              <Table.Th>Действует на</Table.Th>
              <Table.Th>Активен</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {(coupons ?? []).map((c) => (
              <Table.Tr key={c.id}>
                <Table.Td><Text fw={600}>{c.code}</Text></Table.Td>
                <Table.Td>{c.percent}%</Table.Td>
                <Table.Td>
                  {c.category ? (
                    <Badge variant="light">Категория: {c.category.name}</Badge>
                  ) : c.product ? (
                    <Badge variant="light" color="grape">Товар: {c.product.name}</Badge>
                  ) : '—'}
                </Table.Td>
                <Table.Td>
                  <Switch
                    checked={c.active}
                    onChange={(e) => toggleMut.mutate({ id: c.id, active: e.currentTarget.checked })}
                  />
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => { if (window.confirm('Удалить купон?')) deleteMut.mutate(c.id) }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
            {coupons && coupons.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={5}><Text c="dimmed" ta="center">Купонов пока нет</Text></Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Card>
    </Stack>
  )
}
