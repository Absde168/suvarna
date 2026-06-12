import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Center, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useAuth, useLogin } from '@/entities/auth'

export default function LoginPage() {
  const { isAuthenticated, setAuthenticated } = useAuth()
  const navigate = useNavigate()
  const login = useLogin()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/products" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          setAuthenticated(data.token)
          navigate('/products')
        },
        onError: () => {
          notifications.show({
            color: 'red',
            title: 'Ошибка',
            message: 'Неверный логин или пароль',
          })
        },
      }
    )
  }

  return (
    <Center h="100vh" bg="gray.0">
      <Paper withBorder shadow="md" p="xl" radius="md" w={360}>
        <Title order={2} mb="md" ta="center">
          SUVARNA Admin
        </Title>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Логин"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
              autoFocus
            />
            <PasswordInput
              label="Пароль"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              required
            />
            <Button type="submit" fullWidth loading={login.isPending}>
              Войти
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  )
}
