#!/usr/bin/env bash
# Тестовый прогон API «Долями» по сценарию команды T-Банка.
# Использует mTLS-сертификат + Basic auth (логин/пароль).
#
# Подготовка на сервере:
#   1. Положить сертификат и ключ:
#        /root/suvarna/secrets/dolyame-cert.pem
#        /root/suvarna/secrets/dolyame-key.pem
#   2. Создать файл с доступами (логин/пароль из ссылки T-Банка):
#        /root/suvarna/secrets/dolyame-creds.env
#      с содержимым:
#        LOGIN=ваш_логин
#        PASSWORD=ваш_пароль
#
# Использование:
#   bash scripts/dolyame-test.sh create          # создать заказ (2 позиции) -> вернёт id + ссылку
#   bash scripts/dolyame-test.sh info   <id>      # статус заявки
#   bash scripts/dolyame-test.sh commit <id>      # подтвердить заказ (после одобрения по ссылке)
#   bash scripts/dolyame-test.sh refund <id>      # вернуть одну позицию (3000 ₽)

set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
CERT="${DOLYAME_CERT:-$DIR/../secrets/dolyame-cert.pem}"
KEY="${DOLYAME_KEY:-$DIR/../secrets/dolyame-key.pem}"
CREDS="${DOLYAME_CREDS:-$DIR/../secrets/dolyame-creds.env}"
BASE="${DOLYAME_BASE_URL:-https://partner.dolyame.ru/v1}"
APP_URL="${APP_URL:-https://iamsuvarna.ru}"

# shellcheck disable=SC1090
source "$CREDS"

call() {
  local method="$1" path="$2" data="${3:-}"
  local cid; cid="$(cat /proc/sys/kernel/random/uuid)"
  if [ -n "$data" ]; then
    curl -sS --cert "$CERT" --key "$KEY" -u "$LOGIN:$PASSWORD" \
      -H "Content-Type: application/json" -H "X-Correlation-ID: $cid" \
      -X "$method" --data "$data" "$BASE$path"
  else
    curl -sS --cert "$CERT" --key "$KEY" -u "$LOGIN:$PASSWORD" \
      -H "X-Correlation-ID: $cid" -X "$method" "$BASE$path"
  fi
  echo
}

ITEMS='[{"name":"Тестовый товар 1","quantity":1,"price":"5000.00","receipt":{"tax":"none","payment_method":"full_prepayment","payment_object":"commodity","measurement_unit":"шт"}},{"name":"Тестовый товар 2","quantity":1,"price":"3000.00","receipt":{"tax":"none","payment_method":"full_prepayment","payment_object":"commodity","measurement_unit":"шт"}}]'

case "${1:-}" in
  create)
    ORDER_ID="suvarna_test_$(date +%s)"
    BODY="{\"order\":{\"id\":\"$ORDER_ID\",\"amount\":\"8000.00\",\"prepaid_amount\":\"0.00\",\"items\":$ITEMS},\"client_info\":{\"first_name\":\"Иван\",\"last_name\":\"Иванов\",\"middle_name\":\"Иванович\",\"phone\":\"+79991112233\",\"email\":\"test@iamsuvarna.ru\",\"birthdate\":\"1990-01-01\"},\"notification_url\":\"$APP_URL/api/dolyame/notify\",\"fail_url\":\"$APP_URL/payment/dolyame/fail?orderId=$ORDER_ID\",\"success_url\":\"$APP_URL/payment/dolyame/success?orderId=$ORDER_ID\"}"
    echo ">>> ORDER_ID = $ORDER_ID"
    echo ">>> Ответ Долями:"
    call POST "/orders/create" "$BODY"
    ;;
  info)    call GET  "/orders/$2" ;;
  commit)  call POST "/orders/$2/commit" "{\"amount\":\"8000.00\",\"prepaid_amount\":\"0.00\",\"items\":$ITEMS}" ;;
  refund)  call POST "/orders/$2/refund" '{"amount":"3000.00","returned_items":[{"name":"Тестовый товар 2","quantity":1,"price":"3000.00","receipt":{"tax":"none","payment_method":"full_prepayment","payment_object":"commodity","measurement_unit":"шт"}}]}' ;;
  *) echo "Usage: $0 {create|info <id>|commit <id>|refund <id>}" ;;
esac
