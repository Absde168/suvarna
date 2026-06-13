# Деплой на VPS

Всё (frontend, admin, backend, Postgres) запускается через Docker Compose.
Caddy сам выпускает SSL-сертификаты (Let's Encrypt), нужно только указать домены.

## 0. Перед началом

- VPS с Ubuntu (любой современный)
- Два DNS A-записи, указывающие на IP сервера:
  - `example.com` (или поддомен) → основной сайт
  - `admin.example.com` → админка
- Открытые порты 80 и 443

## 1. Установка Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# перелогиниться или: newgrp docker
```

## 2. Клонирование проекта

```bash
git clone <repo-url> suvarna
cd suvarna
```

## 3. Настройка .env

```bash
cp .env.example .env
nano .env
```

Заполни:
- `DOMAIN` / `ADMIN_DOMAIN` — реальные домены
- `VITE_API_URL` — `https://<DOMAIN>/api`
- `POSTGRES_PASSWORD`, `ADMIN_PASSWORD`, `JWT_SECRET` — придумай надёжные значения

## 4. Запуск

```bash
docker compose up -d --build
```

Первый запуск:
- поднимет Postgres
- соберёт backend, применит миграции Prisma (`prisma migrate deploy`)
- соберёт frontend и admin (Vite), отдаст их через Caddy
- Caddy сам получит SSL-сертификаты для обоих доменов (DNS должен уже указывать на сервер)

## 5. Проверка

```bash
docker compose ps
docker compose logs -f backend
```

- `https://<DOMAIN>` — публичный сайт
- `https://<DOMAIN>/api/health` — health-check бэкенда
- `https://<ADMIN_DOMAIN>` — админка (логин/пароль из `ADMIN_USERNAME` / `ADMIN_PASSWORD`)

## 6. Перенос текущих данных (товары, картинки)

Так как локальная база уже заполнена, проще всего перенести её дампом, а не пересобирать.

**На локальной машине:**

```bash
docker exec -t <local-postgres> pg_dump -U postgres -d suvarna --no-owner --clean --if-exists > suvarna.sql
# или если Postgres не в Docker:
pg_dump -U postgres -d suvarna --no-owner --clean --if-exists > suvarna.sql
```

`--clean --if-exists` добавляет `DROP ... IF EXISTS` перед каждой таблицей — это нужно, т.к. на сервере `prisma migrate deploy` уже создаст пустые таблицы при первом запуске.

**Скопировать на сервер и восстановить:**

```bash
scp suvarna.sql user@server:~/suvarna/
cd ~/suvarna
cat suvarna.sql | docker compose exec -T db psql -U $POSTGRES_USER -d $POSTGRES_DB
```

Картинки хранятся прямо в БД (bytea), поэтому отдельно переносить папку `images/` не нужно.

## Обновление после изменений в коде

```bash
git pull
docker compose up -d --build
```

## Полезные команды

```bash
# логи
docker compose logs -f

# зайти в БД
docker compose exec db psql -U $POSTGRES_USER -d $POSTGRES_DB

# перезапустить только backend
docker compose up -d --build backend
```
