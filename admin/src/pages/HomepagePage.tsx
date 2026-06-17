import { useState } from 'react'
import {
  Title, Button, Group, Stack, Card, Text, TextInput, Select,
  ActionIcon, Image, FileButton, Badge, Modal, Textarea, Divider, SimpleGrid,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IconPlus, IconTrash, IconPhoto, IconEdit, IconArrowUp, IconArrowDown, IconUpload } from '@tabler/icons-react'
import {
  getHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide,
  setHeroSlideImage, deleteHeroSlideImage, getHeroSlideImageUrl,
} from '@shared/api/heroSlides'
import { getPageImageUrl, setPageImage, listPageImages } from '@shared/api/pageImages'
import type { HeroSlide } from '@shared/api/heroSlides/types'

const EMPTY_FORM = {
  title: '',
  label: 'Коллекция',
  subtitle: '',
  cta: 'Смотреть коллекцию',
  href: '/collections',
  align: 'left',
}

const CATEGORY_SLOTS = [
  { key: 'category-platya', label: 'Платья' },
  { key: 'category-zhakety', label: 'Жакеты' },
  { key: 'category-trenchi', label: 'Тренчи' },
  { key: 'category-bluzki', label: 'Блузки' },
  { key: 'category-shtany', label: 'Штаны' },
  { key: 'category-vetrovki', label: 'Ветровки' },
  { key: 'category-kostyumy', label: 'Костюмы' },
]

const LOOKBOOK_SLOTS = [1, 2, 3, 4, 5, 6].map(n => ({ key: `lookbook-${n}`, label: `Фото ${n}` }))

function ImageSlot({ slot, uploadedKeys }: { slot: { key: string; label: string }; uploadedKeys: string[] }) {
  const qc = useQueryClient()
  const hasImage = uploadedKeys.includes(slot.key)

  const uploadMut = useMutation({
    mutationFn: (file: File) => setPageImage(slot.key, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['page-images-list'] })
      notifications.show({ title: `${slot.label} обновлено`, message: '', color: 'green' })
    },
  })

  return (
    <Card withBorder padding="sm" radius="md">
      <Text size="xs" fw={600} mb={6}>{slot.label}</Text>
      {hasImage ? (
        <Image
          src={getPageImageUrl(slot.key)}
          height={120}
          radius="sm"
          fit="cover"
          mb={6}
        />
      ) : (
        <div style={{ height: 120, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
          <IconPhoto size={28} color="#aaa" />
        </div>
      )}
      <FileButton onChange={(file) => file && uploadMut.mutate(file)} accept="image/*">
        {(props) => (
          <Button {...props} variant="light" size="xs" fullWidth leftSection={<IconUpload size={12} />} loading={uploadMut.isPending}>
            {hasImage ? 'Заменить' : 'Загрузить'}
          </Button>
        )}
      </FileButton>
    </Card>
  )
}

export default function HomepagePage() {
  const qc = useQueryClient()
  const { data: slides = [], isLoading } = useQuery({ queryKey: ['admin-hero-slides'], queryFn: getHeroSlides })
  const { data: uploadedKeys = [] } = useQuery({ queryKey: ['page-images-list'], queryFn: listPageImages })

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
    setForm({ ...EMPTY_FORM } as any)
    openModal()
  }

  const openEdit = (slide: HeroSlide) => {
    setEditSlide(slide)
    setForm({ title: slide.title, label: slide.label, subtitle: slide.subtitle, cta: slide.cta, href: slide.href, align: slide.align })
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

  // Brand story upload
  const brandUploadMut = useMutation({
    mutationFn: (file: File) => setPageImage('brand-story', file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['page-images-list'] })
      notifications.show({ title: 'Фото бренда обновлено', message: '', color: 'green' })
    },
  })

  return (
    <>
      <Title order={2} mb="xl">Главная страница</Title>

      {/* ===== HERO SLIDER ===== */}
      <Title order={3} mb="md">Слайдер</Title>
      <Group justify="flex-end" mb="md">
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Добавить слайд
        </Button>
      </Group>

      {isLoading && <Text c="dimmed">Загрузка...</Text>}

      <Stack gap="md" mb="xl">
        {sorted.map((slide, idx) => (
          <Card key={slide.id} withBorder padding="md" radius="md">
            <Group align="flex-start" gap="md">
              <div style={{ width: 120, flexShrink: 0 }}>
                {slide.image ? (
                  <div style={{ position: 'relative' }}>
                    <Image src={getHeroSlideImageUrl(slide.id)} height={80} radius="sm" fit="cover" style={{ width: 120 }} />
                    <ActionIcon color="red" variant="filled" size="xs" style={{ position: 'absolute', top: 4, right: 4 }} onClick={() => deleteImageMut.mutate(slide.id)}>
                      <IconTrash size={10} />
                    </ActionIcon>
                  </div>
                ) : (
                  <div style={{ width: 120, height: 80, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconPhoto size={24} color="#aaa" />
                  </div>
                )}
                <FileButton onChange={(file) => file && setImageMut.mutate({ id: slide.id, file })} accept="image/*">
                  {(props) => (
                    <Button {...props} variant="light" size="xs" fullWidth mt={4}>
                      {slide.image ? 'Заменить' : 'Загрузить'}
                    </Button>
                  )}
                </FileButton>
              </div>

              <div style={{ flex: 1 }}>
                <Group mb={4}>
                  <Text fw={600}>{slide.title}</Text>
                  <Badge variant="light">{slide.label}</Badge>
                  <Badge variant="outline" color="gray">{slide.align === 'right' ? 'Справа' : 'Слева'}</Badge>
                </Group>
                {slide.subtitle && <Text size="sm" c="dimmed" mb={4}>{slide.subtitle}</Text>}
                <Text size="xs" c="dimmed">{slide.href} · {slide.cta}</Text>
              </div>

              <Group gap={4}>
                <ActionIcon variant="subtle" onClick={() => handleMove(slide, -1)} disabled={idx === 0}><IconArrowUp size={16} /></ActionIcon>
                <ActionIcon variant="subtle" onClick={() => handleMove(slide, 1)} disabled={idx === sorted.length - 1}><IconArrowDown size={16} /></ActionIcon>
                <ActionIcon variant="light" onClick={() => openEdit(slide)}><IconEdit size={16} /></ActionIcon>
                <ActionIcon color="red" variant="light" onClick={() => deleteMut.mutate(slide.id)}><IconTrash size={16} /></ActionIcon>
              </Group>
            </Group>
          </Card>
        ))}
        {sorted.length === 0 && !isLoading && <Text c="dimmed" ta="center" py="xl">Слайдов нет. Нажмите «Добавить слайд».</Text>}
      </Stack>

      <Divider mb="xl" />

      {/* ===== CATEGORIES ===== */}
      <Title order={3} mb="md">Каталог — фото категорий</Title>
      <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 7 }} mb="xl">
        {CATEGORY_SLOTS.map(slot => (
          <ImageSlot key={slot.key} slot={slot} uploadedKeys={uploadedKeys} />
        ))}
      </SimpleGrid>

      <Divider mb="xl" />

      {/* ===== BRAND STORY ===== */}
      <Title order={3} mb="md">О бренде — фото</Title>
      <Group mb="xl" align="flex-start">
        <div style={{ width: 200 }}>
          {uploadedKeys.includes('brand-story') ? (
            <Image src={getPageImageUrl('brand-story')} height={160} radius="sm" fit="cover" mb={8} />
          ) : (
            <div style={{ height: 160, background: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <IconPhoto size={32} color="#aaa" />
            </div>
          )}
          <FileButton onChange={(file) => file && brandUploadMut.mutate(file)} accept="image/*">
            {(props) => (
              <Button {...props} variant="light" size="sm" fullWidth leftSection={<IconUpload size={14} />} loading={brandUploadMut.isPending}>
                {uploadedKeys.includes('brand-story') ? 'Заменить' : 'Загрузить'}
              </Button>
            )}
          </FileButton>
        </div>
      </Group>

      <Divider mb="xl" />

      {/* ===== LOOKBOOK ===== */}
      <Title order={3} mb="md">Лукбук — 6 фото</Title>
      <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} mb="xl">
        {LOOKBOOK_SLOTS.map(slot => (
          <ImageSlot key={slot.key} slot={slot} uploadedKeys={uploadedKeys} />
        ))}
      </SimpleGrid>

      {/* ===== MODAL ===== */}
      <Modal opened={modalOpened} onClose={closeModal} title={editSlide ? 'Редактировать слайд' : 'Новый слайд'} size="md">
        <Stack>
          <TextInput label="Заголовок *" placeholder="Barbeque" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <TextInput label="Метка (над заголовком)" placeholder="Коллекция" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
          <Textarea label="Подзаголовок" placeholder="Описание..." value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} rows={2} />
          <TextInput label="Текст кнопки" placeholder="Смотреть коллекцию" value={form.cta} onChange={e => setForm(f => ({ ...f, cta: e.target.value }))} />
          <TextInput label="Ссылка кнопки" placeholder="/collections" value={form.href} onChange={e => setForm(f => ({ ...f, href: e.target.value }))} />
          <Select label="Расположение текста" data={[{ value: 'left', label: 'Слева' }, { value: 'right', label: 'Справа' }]} value={form.align} onChange={v => setForm(f => ({ ...f, align: v ?? 'left' }))} />
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
