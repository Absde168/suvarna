import { useEffect, useState } from 'react'
import {
  ActionIcon,
  Button,
  Checkbox,
  FileButton,
  Grid,
  Group,
  Image,
  Modal,
  MultiSelect,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core'
import { IconArrowLeft, IconArrowRight, IconPlus, IconTrash, IconUpload } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { getImageUrl } from '@shared/api'
import type { Product, ProductInput } from '@shared/api'
import { useCategories, useCreateCategory } from '@/entities/categories'
import { useCollections } from '@/entities/collections'
import {
  useAddProductImage,
  useCreateProduct,
  useDeleteProductImage,
  useProduct,
  useReorderProductImages,
  useUpdateProduct,
} from '@/entities/products'

const SIZE_OPTIONS = ['One Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL']

const EMPTY_FORM: ProductInput = {
  name: '',
  article: '',
  price: 0,
  quantity: 0,
  sizes: [],
  colors: [],
  description: '',
  fabric: '',
  care: '',
  isNew: false,
  isBestseller: false,
  inStock: true,
  categoryIds: [],
  collectionId: null,
}

interface ProductFormModalProps {
  opened: boolean
  onClose: () => void
  product: Product | null
}

export function ProductFormModal({ opened, onClose, product: initialProduct }: ProductFormModalProps) {
  const { data: categories } = useCategories()
  const { data: collections } = useCollections()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const addImage = useAddProductImage()
  const deleteImage = useDeleteProductImage()
  const reorderImages = useReorderProductImages()

  const { data: freshProduct } = useProduct({ id: initialProduct?.id ?? NaN })
  const product = initialProduct ? freshProduct ?? initialProduct : null

  const createCategory = useCreateCategory()
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM)
  const [colorsInput, setColorsInput] = useState('')
  const [newCatInput, setNewCatInput] = useState('')
  const [addingCat, setAddingCat] = useState(false)

  const cats = categories ?? []
  const nameToId = Object.fromEntries(cats.map((c) => [c.name, c.id]))
  const selectedCategoryNames = (form.categoryIds ?? [])
    .map((id) => cats.find((c) => c.id === id)?.name)
    .filter((n): n is string => Boolean(n))

  useEffect(() => {
    if (!opened) return

    if (initialProduct) {
      setForm({
        name: initialProduct.name,
        article: initialProduct.article,
        price: initialProduct.price,
        quantity: initialProduct.quantity,
        sizes: initialProduct.sizes,
        colors: initialProduct.colors,
        description: initialProduct.description ?? '',
        fabric: initialProduct.fabric ?? '',
        care: initialProduct.care ?? '',
        isNew: initialProduct.isNew,
        isBestseller: initialProduct.isBestseller,
        inStock: initialProduct.inStock,
        categoryIds: initialProduct.categories?.map((c) => c.id) ?? [],
        collectionId: initialProduct.collection?.id ?? null,
      })
      setColorsInput(initialProduct.colors.join(', '))
    } else {
      setForm(EMPTY_FORM)
      setColorsInput('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProduct?.id, opened])

  const isSaving = createProduct.isPending || updateProduct.isPending

  const handleSubmit = () => {
    if (!form.name.trim() || !form.article.trim()) {
      notifications.show({ color: 'red', title: 'Ошибка', message: 'Заполните название и артикул' })
      return
    }

    const data: ProductInput = {
      ...form,
      colors: colorsInput
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
    }

    if (product) {
      updateProduct.mutate(
        { id: product.id, data },
        {
          onSuccess: () => {
            notifications.show({ color: 'green', message: 'Товар обновлён' })
            onClose()
          },
          onError: () => notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось сохранить товар' }),
        }
      )
    } else {
      createProduct.mutate(
        { data },
        {
          onSuccess: () => {
            notifications.show({ color: 'green', message: 'Товар создан' })
            onClose()
          },
          onError: () => notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось создать товар' }),
        }
      )
    }
  }

  const handleUpload = (file: File | null) => {
    if (!file || !product) return
    addImage.mutate(
      { productId: product.id, file },
      {
        onError: () => notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось загрузить изображение' }),
      }
    )
  }

  const handleDeleteImage = (imageId: number) => {
    if (!product) return
    deleteImage.mutate({ productId: product.id, imageId })
  }

  const moveImage = (index: number, direction: -1 | 1) => {
    if (!product) return
    const order = product.images.map((img) => img.id)
    const target = index + direction
    if (target < 0 || target >= order.length) return
    const tmp = order[index]
    order[index] = order[target]
    order[target] = tmp
    reorderImages.mutate({ productId: product.id, order })
  }

  return (
    <Modal opened={opened} onClose={onClose} title={product ? 'Редактирование товара' : 'Новый товар'} size="lg" centered>
      <Stack>
        <Grid>
          <Grid.Col span={6}>
            <TextInput
              label="Название"
              value={form.name}
              onChange={(e) => {
                const value = e.currentTarget.value
                setForm((f) => ({ ...f, name: value }))
              }}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Артикул"
              value={form.article}
              onChange={(e) => {
                const value = e.currentTarget.value
                setForm((f) => ({ ...f, article: value }))
              }}
              required
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="Цена"
              value={form.price}
              onChange={(value) => setForm((f) => ({ ...f, price: Number(value) || 0 }))}
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <NumberInput
              label="Количество"
              value={form.quantity}
              onChange={(value) => setForm((f) => ({ ...f, quantity: Number(value) || 0 }))}
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <MultiSelect
              label={
                <Group gap={4}>
                  Категория
                  <ActionIcon size="xs" variant="subtle" onClick={() => setAddingCat((v) => !v)}>
                    <IconPlus size={12} />
                  </ActionIcon>
                </Group>
              }
              data={cats.map((c) => c.name)}
              value={selectedCategoryNames}
              onChange={(names) =>
                setForm((f) => ({ ...f, categoryIds: names.map((n) => nameToId[n]).filter(Boolean) }))
              }
            />
            {addingCat && (
              <Group gap={4} mt={4}>
                <TextInput
                  size="xs"
                  placeholder="Новая категория"
                  value={newCatInput}
                  onChange={(e) => setNewCatInput(e.currentTarget.value)}
                  style={{ flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const name = newCatInput.trim()
                      if (!name) return
                      createCategory.mutate(name, {
                        onSuccess: () => { setNewCatInput(''); setAddingCat(false) },
                      })
                    }
                  }}
                />
                <Button
                  size="xs"
                  loading={createCategory.isPending}
                  onClick={() => {
                    const name = newCatInput.trim()
                    if (!name) return
                    createCategory.mutate(name, {
                      onSuccess: () => { setNewCatInput(''); setAddingCat(false) },
                    })
                  }}
                >
                  Добавить
                </Button>
              </Group>
            )}
          </Grid.Col>
          <Grid.Col span={3}>
            <Select
              label="Коллекция"
              data={(collections ?? []).map((c) => ({ value: String(c.id), label: c.name }))}
              value={form.collectionId != null ? String(form.collectionId) : null}
              onChange={(value) => setForm((f) => ({ ...f, collectionId: value ? Number(value) : null }))}
              clearable
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <MultiSelect
              label="Размеры"
              data={SIZE_OPTIONS}
              value={form.sizes}
              onChange={(value) => setForm((f) => ({ ...f, sizes: value }))}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Цвета (через запятую)"
              value={colorsInput}
              onChange={(e) => {
                const value = e.currentTarget.value
                setColorsInput(value)
              }}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Описание"
              value={form.description ?? ''}
              onChange={(e) => {
                const value = e.currentTarget.value
                setForm((f) => ({ ...f, description: value }))
              }}
              minRows={2}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Textarea
              label="Состав/материал"
              value={form.fabric ?? ''}
              onChange={(e) => {
                const value = e.currentTarget.value
                setForm((f) => ({ ...f, fabric: value }))
              }}
              minRows={2}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Textarea
              label="Уход"
              value={form.care ?? ''}
              onChange={(e) => {
                const value = e.currentTarget.value
                setForm((f) => ({ ...f, care: value }))
              }}
              minRows={2}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group>
              <Checkbox
                label="Новинка"
                checked={!!form.isNew}
                onChange={(e) => {
                  const checked = e.currentTarget.checked
                  setForm((f) => ({ ...f, isNew: checked }))
                }}
              />
              <Checkbox
                label="Бестселлер"
                checked={!!form.isBestseller}
                onChange={(e) => {
                  const checked = e.currentTarget.checked
                  setForm((f) => ({ ...f, isBestseller: checked }))
                }}
              />
              <Checkbox
                label="В наличии"
                checked={!!form.inStock}
                onChange={(e) => {
                  const checked = e.currentTarget.checked
                  setForm((f) => ({ ...f, inStock: checked }))
                }}
              />
            </Group>
          </Grid.Col>
        </Grid>

        {product && (
          <Stack gap="xs">
            <Group justify="space-between">
              <span>Изображения</span>
              <FileButton onChange={handleUpload} accept="image/*">
                {(props) => (
                  <Button leftSection={<IconUpload size={16} />} variant="light" size="xs" loading={addImage.isPending} {...props}>
                    Загрузить
                  </Button>
                )}
              </FileButton>
            </Group>
            <SimpleGrid cols={4}>
              {product.images.map((img, index) => (
                <Stack key={img.id} gap={4} align="center">
                  <Image src={getImageUrl({ id: img.id })} h={100} w="100%" fit="cover" radius="sm" />
                  <Group gap={4}>
                    <ActionIcon size="sm" variant="subtle" disabled={index === 0} onClick={() => moveImage(index, -1)}>
                      <IconArrowLeft size={14} />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      disabled={index === product.images.length - 1}
                      onClick={() => moveImage(index, 1)}
                    >
                      <IconArrowRight size={14} />
                    </ActionIcon>
                    <ActionIcon size="sm" variant="subtle" color="red" onClick={() => handleDeleteImage(img.id)}>
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Stack>
              ))}
            </SimpleGrid>
          </Stack>
        )}

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} loading={isSaving}>
            Сохранить
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
