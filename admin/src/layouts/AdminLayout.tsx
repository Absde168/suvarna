import { AppShell, Group, NavLink, Text, Burger, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconShirt, IconShoppingCart, IconLogout, IconStack2 } from '@tabler/icons-react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/entities/auth'

export function AdminLayout() {
  const [opened, { toggle }] = useDisclosure()
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <img src="/images/logo-icon.png" alt="" style={{ height: 28, width: 'auto' }} />
            <Text fw={700} size="lg">
              SUVARNA Admin
            </Text>
          </Group>
          <Button variant="subtle" color="gray" leftSection={<IconLogout size={16} />} onClick={handleLogout}>
            Выйти
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          component={Link}
          to="/products"
          label="Товары"
          leftSection={<IconShirt size={18} />}
          active={location.pathname.startsWith('/products')}
        />
        <NavLink
          component={Link}
          to="/collections"
          label="Коллекции"
          leftSection={<IconStack2 size={18} />}
          active={location.pathname.startsWith('/collections')}
        />
        <NavLink
          component={Link}
          to="/orders"
          label="Заказы"
          leftSection={<IconShoppingCart size={18} />}
          active={location.pathname.startsWith('/orders')}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
