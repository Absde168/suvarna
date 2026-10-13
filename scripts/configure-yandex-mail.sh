#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "Не найден /root/suvarna/.env"
  exit 1
fi

read -r -s -p "Введите пароль приложения Яндекса: " smtp_password
printf '\n'
if [[ -z "$smtp_password" ]]; then
  echo "Пароль не введён"
  exit 1
fi

smtp_password_b64=$(printf '%s' "$smtp_password" | base64 | tr -d '\n')
unset smtp_password

tmp_env=$(mktemp .env.smtp.XXXXXX)
trap 'rm -f "$tmp_env"' EXIT
sed -E '/^(SMTP_HOST|SMTP_PORT|SMTP_USER|SMTP_PASSWORD|SMTP_PASSWORD_B64|ORDER_NOTIFICATION_EMAIL)=/d' .env > "$tmp_env"
printf '\nSMTP_HOST=smtp.yandex.ru\nSMTP_PORT=465\nSMTP_USER=info@iamsuvarna.ru\nSMTP_PASSWORD_B64=%s\nORDER_NOTIFICATION_EMAIL=info@iamsuvarna.ru\n' "$smtp_password_b64" >> "$tmp_env"
unset smtp_password_b64
chmod 600 "$tmp_env"
mv "$tmp_env" .env
trap - EXIT

docker compose up -d --build backend web
