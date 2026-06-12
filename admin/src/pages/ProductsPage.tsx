import { useState } from 'react'
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Image,
  Pagination,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  rem,
} from '@mantine/core'
import { IconAdjustments, IconEdit, IconPlus, IconSearch, IconSortAscending, IconSortDescending, IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import { getImageUrl } from '@shared/api'
import type { GetProductsRequest, Product } from '@shared/api'
import { useDeleteProduct, useProducts } from '@/entities/products'
import { ProductFormModal } from './products/ProductFormModal'
import { ProductFilterModal, type ProductFilters } from './products/ProductFilterModal'

const PAGE_SIZE = 10

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<NonNullable<GetProductsRequest['sortBy']>>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filters, setFilters] = useState<ProductFilters>({ category: null, inStock: null, isNew: null, isBestseller: null })

  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const deleteProduct = useDeleteProduct()

  const { data, isLoading } = useProducts({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    category: filters.category ?? undefined,
    inStock: filters.inStock ?? undefined,
    isNew: filters.isNew ?? undefined,
    isBestseller: filters.isBestseller ?? undefined,
    sortBy,
    sortDir,
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  const handleSort = (field: NonNullable<GetProductsRequest['sortBy']>) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setFormModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormModalOpen(true)
  }

  const handleDelete = (product: Product) => {
    modals.openConfirmModal({
      title: 'Удаление товара',
      children: <Text size="sm">Удалить товар «{product.name}»? Это действие нельзя отменить.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteProduct.mutate(
          { id: product.id },
          {
            onSuccess: () => notifications.show({ color: 'green', message: 'Товар удалён' }),
            onError: () => notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось удалить товар' }),
          }
        )
      },
    })
  }

  const activeFiltersCount = Object.values(filters).filter((v) => v !== null).length

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Товары</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleAdd}>
          Добавить товар
        </Button>
      </Group>

      <Group>
        <TextInput
          placeholder="Поиск по названию или артикулу"
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
            <Table.Th style={{ width: rem(60) }}>Фото</Table.Th>
            <Table.Th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              <Group gap={4}>
                Название
                {sortBy === 'name' && (sortDir === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />)}
              </Group>
            </Table.Th>
            <Table.Th onClick={() => handleSort('article')} style={{ cursor: 'pointer' }}>
              <Group gap={4}>
                Артикул
                {sortBy === 'article' && (sortDir === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />)}
              </Group>
            </Table.Th>
            <Table.Th>Категория</Table.Th>
            <Table.Th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
              <Group gap={4}>
                Цена
                {sortBy === 'price' && (sortDir === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />)}
              </Group>
            </Table.Th>
            <Table.Th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
              <Group gap={4}>
                Кол-во
                {sortBy === 'quantity' && (sortDir === 'asc' ? <IconSortAscending size={14} /> : <IconSortDescending size={14} />)}
              </Group>
            </Table.Th>
            <Table.Th>Статус</Table.Th>
            <Table.Th style={{ width: rem(100) }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {(data?.items ?? []).map((product) => (
            <Table.Tr key={product.id}>
              <Table.Td>
                {product.images[0] ? (
                  <Image src={getImageUrl({ id: product.images[0].id })} h={40} w={40} fit="cover" radius="sm" />
                ) : (
                  <div style={{ width: 40, height: 40, background: 'var(--mantine-color-gray-2)', borderRadius: 4 }} />
                )}
              </Table.Td>
              <Table.Td>{product.name}</Table.Td>
              <Table.Td>{product.article}</Table.Td>
              <Table.Td>{product.category?.name ?? '—'}</Table.Td>
              <Table.Td>{product.price.toLocaleString('ru-RU')} ₽</Table.Td>
              <Table.Td>{product.quantity}</Table.Td>
              <Table.Td>
                <Group gap={4}>
                  {product.inStock ? <Badge color="green" size="sm">В наличии</Badge> : <Badge color="gray" size="sm">Нет в наличии</Badge>}
                  {product.isNew && <Badge color="blue" size="sm">Новинка</Badge>}
                  {product.isBestseller && <Badge color="yellow" size="sm">Хит</Badge>}
                </Group>
              </Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <ActionIcon variant="subtle" onClick={() => handleEdit(product)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(product)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
          {!isLoading && (data?.items.length ?? 0) === 0 && (
            <Table.Tr>
              <Table.Td colSpan={8}>
                <Text ta="center" c="dimmed" py="md">
                  Товары не найдены
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <Group justify="center">
        <Pagination value={page} onChange={setPage} total={totalPages} />
      </Group>

      <ProductFilterModal
        opened={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onChange={(value) => {
          setFilters(value)
          setPage(1)
        }}
      />

      <ProductFormModal
        opened={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        product={editingProduct}
      />
    </Stack>
  )
}
