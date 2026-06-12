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
import { IconArrowLeft, IconArrowRight, IconTrash, IconUpload } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { getImageUrl } from '@shared/api'
import type { Product, ProductInput } from '@shared/api'
import { useCategories } from '@/entities/categories'
import {
  useAddProductImage,
  useCreateProduct,
  useDeleteProductImage,
  useProduct,
  useReorderProductImages,
  useUpdateProduct,
} from '@/entities/products'

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

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
  categoryId: null,
}

interface ProductFormModalProps {
  opened: boolean
  onClose: () => void
  product: Product | null
}

export function ProductFormModal({ opened, onClose, product: initialProduct }: ProductFormModalProps) {
  const { data: categories } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const addImage = useAddProductImage()
  const deleteImage = useDeleteProductImage()
  const reorderImages = useReorderProductImages()

  const { data: freshProduct } = useProduct({ id: initialProduct?.id ?? NaN })
  const product = initialProduct ? freshProduct ?? initialProduct : null

  const [form, setForm] = useState<ProductInput>(EMPTY_FORM)
  const [colorsInput, setColorsInput] = useState('')

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        article: product.article,
        price: product.price,
        quantity: product.quantity,
        sizes: product.sizes,
        colors: product.colors,
        description: product.description ?? '',
        fabric: product.fabric ?? '',
        care: product.care ?? '',
        isNew: product.isNew,
        isBestseller: product.isBestseller,
        inStock: product.inStock,
        categoryId: product.category?.id ?? null,
      })
      setColorsInput(product.colors.join(', '))
    } else {
      setForm(EMPTY_FORM)
      setColorsInput('')
    }
  }, [product, opened])

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
              onChange={(e) => setForm((f) => ({ ...f, name: e.currentTarget.value }))}
              required
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              label="Артикул"
              value={form.article}
              onChange={(e) => setForm((f) => ({ ...f, article: e.currentTarget.value }))}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Цена"
              value={form.price}
              onChange={(value) => setForm((f) => ({ ...f, price: Number(value) || 0 }))}
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Количество"
              value={form.quantity}
              onChange={(value) => setForm((f) => ({ ...f, quantity: Number(value) || 0 }))}
              min={0}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <Select
              label="Категория"
              data={(categories ?? []).map((c) => ({ value: String(c.id), label: c.name }))}
              value={form.categoryId != null ? String(form.categoryId) : null}
              onChange={(value) => setForm((f) => ({ ...f, categoryId: value ? Number(value) : null }))}
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
              onChange={(e) => setColorsInput(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Textarea
              label="Описание"
              value={form.description ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, description: e.currentTarget.value }))}
              minRows={2}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Textarea
              label="Состав/материал"
              value={form.fabric ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, fabric: e.currentTarget.value }))}
              minRows={2}
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <Textarea
              label="Уход"
              value={form.care ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, care: e.currentTarget.value }))}
              minRows={2}
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Group>
              <Checkbox
                label="Новинка"
                checked={!!form.isNew}
                onChange={(e) => setForm((f) => ({ ...f, isNew: e.currentTarget.checked }))}
              />
              <Checkbox
                label="Бестселлер"
                checked={!!form.isBestseller}
                onChange={(e) => setForm((f) => ({ ...f, isBestseller: e.currentTarget.checked }))}
              />
              <Checkbox
                label="В наличии"
                checked={!!form.inStock}
                onChange={(e) => setForm((f) => ({ ...f, inStock: e.currentTarget.checked }))}
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
