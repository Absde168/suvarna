import { useEffect, useState } from 'react'
import { ActionIcon, Button, FileButton, Group, Image, Modal, Stack, Table, Text, Textarea, TextInput, Title } from '@mantine/core'
import { IconEdit, IconPlus, IconTrash, IconUpload } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import type { Collection, CollectionInput } from '@shared/api'
import { getCollectionImageUrl } from '@shared/api'
import {
  useCollections,
  useCreateCollection,
  useUpdateCollection,
  useDeleteCollection,
  useSetCollectionImage,
  useDeleteCollectionImage,
} from '@/entities/collections'

const EMPTY_FORM: CollectionInput = { name: '', slug: '', description: '' }

export default function CollectionsPage() {
  const { data: collections, isLoading } = useCollections()
  const createCollection = useCreateCollection()
  const updateCollection = useUpdateCollection()
  const deleteCollection = useDeleteCollection()
  const setCollectionImage = useSetCollectionImage()
  const deleteCollectionImage = useDeleteCollectionImage()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Collection | null>(null)
  const [form, setForm] = useState<CollectionInput>(EMPTY_FORM)
  const [imageTs, setImageTs] = useState(Date.now())

  useEffect(() => {
    if (!editing) return
    const updated = collections?.find((c) => c.id === editing.id)
    if (updated && updated.hasImage !== editing.hasImage) {
      setEditing(updated)
    }
  }, [collections, editing])

  useEffect(() => {
    if (!modalOpen) return
    if (editing) {
      setForm({ name: editing.name, slug: editing.slug, description: editing.description ?? '' })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [editing, modalOpen])

  const isSaving = createCollection.isPending || updateCollection.isPending

  const handleAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (collection: Collection) => {
    setEditing(collection)
    setModalOpen(true)
  }

  const handleDelete = (collection: Collection) => {
    modals.openConfirmModal({
      title: 'Удаление коллекции',
      children: <Text size="sm">Удалить коллекцию «{collection.name}»? Это действие нельзя отменить.</Text>,
      labels: { confirm: 'Удалить', cancel: 'Отмена' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteCollection.mutate(
          { id: collection.id },
          {
            onSuccess: () => notifications.show({ color: 'green', message: 'Коллекция удалена' }),
            onError: () => notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось удалить коллекцию' }),
          }
        )
      },
    })
  }

  const handleSubmit = () => {
    if (!form.name.trim()) {
      notifications.show({ color: 'red', title: 'Ошибка', message: 'Укажите название коллекции' })
      return
    }

    const data: CollectionInput = {
      name: form.name.trim(),
      slug: form.slug?.trim() || undefined,
      description: form.description?.trim() || undefined,
    }

    if (editing) {
      updateCollection.mutate(
        { id: editing.id, data },
        {
          onSuccess: () => {
            notifications.show({ color: 'green', message: 'Коллекция обновлена' })
            setModalOpen(false)
          },
          onError: () => notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось сохранить коллекцию' }),
        }
      )
    } else {
      createCollection.mutate(
        { data },
        {
          onSuccess: () => {
            notifications.show({ color: 'green', message: 'Коллекция создана' })
            setModalOpen(false)
          },
          onError: () => notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось создать коллекцию' }),
        }
      )
    }
  }

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Коллекции</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleAdd}>
          Добавить коллекцию
        </Button>
      </Group>

      <Table striped highlightOnHover verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Название</Table.Th>
            <Table.Th>Slug</Table.Th>
            <Table.Th>Товаров</Table.Th>
            <Table.Th style={{ width: 100 }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {(collections ?? []).map((collection) => (
            <Table.Tr key={collection.id}>
              <Table.Td>{collection.name}</Table.Td>
              <Table.Td>{collection.slug}</Table.Td>
              <Table.Td>{collection.count}</Table.Td>
              <Table.Td>
                <Group gap={4}>
                  <ActionIcon variant="subtle" onClick={() => handleEdit(collection)}>
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(collection)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
          {!isLoading && (collections?.length ?? 0) === 0 && (
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text ta="center" c="dimmed" py="md">
                  Коллекции не найдены
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Редактирование коллекции' : 'Новая коллекция'} centered>
        <Stack>
          <TextInput
            label="Название"
            value={form.name}
            onChange={(e) => {
              const value = e.currentTarget.value
              setForm((f) => ({ ...f, name: value }))
            }}
            required
          />
          <TextInput
            label="Slug (необязательно)"
            placeholder="формируется автоматически из названия"
            value={form.slug ?? ''}
            onChange={(e) => {
              const value = e.currentTarget.value
              setForm((f) => ({ ...f, slug: value }))
            }}
          />
          <Textarea
            label="Описание"
            placeholder="Описание коллекции"
            minRows={6}
            autosize
            value={form.description ?? ''}
            onChange={(e) => {
              const value = e.currentTarget.value
              setForm((f) => ({ ...f, description: value }))
            }}
          />
          {editing && (
            <Stack gap="xs">
              <Group justify="space-between">
                <span>Изображение</span>
                <FileButton
                  onChange={(file) => {
                    if (!file) return
                    setCollectionImage.mutate(
                      { id: editing.id, file },
                      {
                        onSuccess: () => { setImageTs(Date.now()); notifications.show({ color: 'green', message: 'Изображение обновлено' }) },
                        onError: () => notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось загрузить изображение' }),
                      }
                    )
                  }}
                  accept="image/*"
                >
                  {(props) => (
                    <Button leftSection={<IconUpload size={16} />} variant="light" size="xs" loading={setCollectionImage.isPending} {...props}>
                      Загрузить
                    </Button>
                  )}
                </FileButton>
              </Group>
              {editing.hasImage && (
                <Stack gap={4} align="flex-start">
                  <Image src={getCollectionImageUrl({ id: editing.id, t: imageTs })} h={160} w="auto" fit="cover" radius="sm" />
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    loading={deleteCollectionImage.isPending}
                    onClick={() => {
                      deleteCollectionImage.mutate(
                        { id: editing.id },
                        {
                          onSuccess: () => notifications.show({ color: 'green', message: 'Изображение удалено' }),
                          onError: () => notifications.show({ color: 'red', title: 'Ошибка', message: 'Не удалось удалить изображение' }),
                        }
                      )
                    }}
                  >
                    <IconTrash size={14} />
                  </ActionIcon>
                </Stack>
              )}
            </Stack>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmit} loading={isSaving}>
              Сохранить
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
