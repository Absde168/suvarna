import { useState } from 'react'
import {
  Title, Button, Group, Stack, Card, Text, TextInput, Select,
  ActionIcon, Image, FileButton, Badge, Modal, Textarea,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IconPlus, IconTrash, IconPhoto, IconEdit, IconArrowUp, IconArrowDown } from '@tabler/icons-react'
import {
  getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide,
  setHeroSlideImage, deleteHeroSlideImage, getHeroSlideImageUrl,
} from '@shared/api/heroSlides'
import type { HeroSlide } from '@shared/api/heroSlides/types'

const EMPTY_FORM = {
  title: '',
  label: 'Коллекция',
  subtitle: '',
  cta: 'Смотреть коллекцию',
  href: '/collections',
  align: 'left',
}

export default function HomepagePage() {
  const qc = useQueryClient()
  const { data: slides = [], isLoading } = useQuery({ queryKey: ['admin-hero-slides'], queryFn: getHeroSlides })

  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
  const [editSlide, setEditSlide] = useState<HeroSlide | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-hero-slides'] })

  const createMut = useMutation({
    mutationFn: createHeroSlide,
    onSuccess: () => { invalidate(); closeModal(); notifications.show({ title: 'Слайд создан', message: '', color: 'green' }) },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof EMPTY_FORM }) => updateHeroSlide(id, data),
    onSuccess: () => { invalidate(); closeModal(); notifications.show({ title: 'Сохранено', message: '', color: 'green' }) },
  })

  const deleteMut = useMutation({
    mutationFn: deleteHeroSlide,
    onSuccess: () => { invalidate(); notifications.show({ title: 'Слайд удалён', message: '', color: 'red' }) },
  })

  const setImageMut = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => setHeroSlideImage(id, file),
    onSuccess: () => { invalidate(); notifications.show({ title: 'Фото обновлено', message: '', color: 'green' }) },
  })

  const deleteImageMut = useMutation({
    mutationFn: deleteHeroSlideImage,
    onSuccess: () => { invalidate(); notifications.show({ title: 'Фото удалено', message: '', color: 'orange' }) },
  })

  const moveMut = useMutation({
    mutationFn: ({ id, position }: { id: number; position: number }) => updateHeroSlide(id, { position }),
    onSuccess: invalidate,
  })

  const openCreate = () => {
    setEditSlide(null)
    setForm({ ...EMPTY_FORM, position: slides.length } as any)
    openModal()
  }

  const openEdit = (slide: HeroSlide) => {
    setEditSlide(slide)
    setForm({
      title: slide.title,
      label: slide.label,
      subtitle: slide.subtitle,
      cta: slide.cta,
      href: slide.href,
      align: slide.align,
    })
    openModal()
  }

  const handleSave = () => {
    if (!form.title.trim()) return
    if (editSlide) {
      updateMut.mutate({ id: editSlide.id, data: form })
    } else {
      createMut.mutate({ ...form, position: slides.length })
    }
  }

  const handleMove = (slide: HeroSlide, dir: -1 | 1) => {
    const sorted = [...slides].sort((a, b) => a.position - b.position)
    const idx = sorted.findIndex(s => s.id === slide.id)
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const swapSlide = sorted[swapIdx]
    moveMut.mutate({ id: slide.id, position: swapSlide.position })
    moveMut.mutate({ id: swapSlide.id, position: slide.position })
  }

  const sorted = [...slides].sort((a, b) => a.position - b.position)

  return (
    <>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Главная страница — Слайдер</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Добавить слайд
        </Button>
      </Group>

      {isLoading && <Text c="dimmed">Загрузка...</Text>}

      <Stack gap="md">
        {sorted.map((slide, idx) => (
          <Card key={slide.id} withBorder padding="md" radius="md">
            <Group align="flex-start" gap="md">
              {/* Фото */}
              <div style={{ width: 120, flexShrink: 0 }}>
                {slide.image ? (
                  <div style={{ position: 'relative' }}>
                    <Image
                      src={getHeroSlideImageUrl(slide.id)}
                      height={80}
                      radius="sm"
                      fit="cover"
                      style={{ width: 120 }}
                    />
                    <ActionIcon
                      color="red"
                      variant="filled"
                      size="xs"
                      style={{ position: 'absolute', top: 4, right: 4 }}
                      onClick={() => deleteImageMut.mutate(slide.id)}
                    >
                      <IconTrash size={10} />
                    </ActionIcon>
                  </div>
                ) : (
                  <div style={{ width: 120, height: 80, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconPhoto size={24} color="#aaa" />
                  </div>
                )}
                <FileButton
                  onChange={(file) => file && setImageMut.mutate({ id: slide.id, file })}
                  accept="image/*"
                >
                  {(props) => (
                    <Button {...props} variant="light" size="xs" fullWidth mt={4}>
                      {slide.image ? 'Заменить' : 'Загрузить'}
                    </Button>
                  )}
                </FileButton>
              </div>

              {/* Инфо */}
              <div style={{ flex: 1 }}>
                <Group mb={4}>
                  <Text fw={600}>{slide.title}</Text>
                  <Badge variant="light">{slide.label}</Badge>
                  <Badge variant="outline" color="gray">{slide.align === 'right' ? 'Справа' : 'Слева'}</Badge>
                </Group>
                {slide.subtitle && <Text size="sm" c="dimmed" mb={4}>{slide.subtitle}</Text>}
                <Text size="xs" c="dimmed">{slide.href} · {slide.cta}</Text>
              </div>

              {/* Кнопки */}
              <Group gap={4}>
                <ActionIcon variant="subtle" onClick={() => handleMove(slide, -1)} disabled={idx === 0}>
                  <IconArrowUp size={16} />
                </ActionIcon>
                <ActionIcon variant="subtle" onClick={() => handleMove(slide, 1)} disabled={idx === sorted.length - 1}>
                  <IconArrowDown size={16} />
                </ActionIcon>
                <ActionIcon variant="light" onClick={() => openEdit(slide)}>
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon color="red" variant="light" onClick={() => deleteMut.mutate(slide.id)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Group>
          </Card>
        ))}

        {sorted.length === 0 && !isLoading && (
          <Text c="dimmed" ta="center" py="xl">
            Слайдов нет. Нажмите «Добавить слайд» чтобы создать первый.
          </Text>
        )}
      </Stack>

      {/* Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={editSlide ? 'Редактировать слайд' : 'Новый слайд'}
        size="md"
      >
        <Stack>
          <TextInput
            label="Заголовок *"
            placeholder="Barbeque"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <TextInput
            label="Метка (над заголовком)"
            placeholder="Коллекция"
            value={form.label}
            onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
          />
          <Textarea
            label="Подзаголовок"
            placeholder="Описание коллекции..."
            value={form.subtitle}
            onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
            rows={2}
          />
          <TextInput
            label="Текст кнопки"
            placeholder="Смотреть коллекцию"
            value={form.cta}
            onChange={e => setForm(f => ({ ...f, cta: e.target.value }))}
          />
          <TextInput
            label="Ссылка кнопки"
            placeholder="/collections"
            value={form.href}
            onChange={e => setForm(f => ({ ...f, href: e.target.value }))}
          />
          <Select
            label="Расположение текста"
            data={[{ value: 'left', label: 'Слева' }, { value: 'right', label: 'Справа' }]}
            value={form.align}
            onChange={v => setForm(f => ({ ...f, align: v ?? 'left' }))}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" onClick={closeModal}>Отмена</Button>
            <Button onClick={handleSave} loading={createMut.isPending || updateMut.isPending}>
              {editSlide ? 'Сохранить' : 'Создать'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
