#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env ]]; then
  echo "Не найден .env в корне проекта"
  exit 1
fi
if [[ ! -d secrets ]]; then
  echo "Не найдена папка secrets с сертификатами «Долями»"
  exit 1
fi
command -v curl >/dev/null || { echo "Не найдена команда curl"; exit 1; }
command -v openssl >/dev/null || { echo "Не найдена команда openssl"; exit 1; }

work_dir=$(mktemp -d)
env_tmp=$(mktemp .env.dolyame-ca.XXXXXX)
trap 'rm -rf "$work_dir"; rm -f "$env_tmp"' EXIT

download_cert() {
  local name="$1"
  local url="$2"
  local source="$work_dir/$name.cer"
  local target="$work_dir/$name.pem"
  curl --fail --silent --show-error --location "$url" --output "$source"
  if openssl x509 -inform PEM -in "$source" -noout >/dev/null 2>&1; then
    openssl x509 -inform PEM -in "$source" -out "$target"
  elif openssl x509 -inform DER -in "$source" -noout >/dev/null 2>&1; then
    openssl x509 -inform DER -in "$source" -out "$target"
  else
    echo "Скачанный сертификат $name не распознан как PEM или DER"
    return 1
  fi
  openssl x509 -in "$target" -checkend 0 -noout
}

download_cert russian_trusted_root_ca \
  https://gu-st.ru/content/Other/doc/russian_trusted_root_ca.cer
download_cert russian_trusted_sub_ca \
  https://gu-st.ru/content/Other/doc/russian_trusted_sub_ca.cer

bundle_tmp="$work_dir/russian-trusted-ca-bundle.pem"
cat "$work_dir/russian_trusted_root_ca.pem" "$work_dir/russian_trusted_sub_ca.pem" > "$bundle_tmp"
openssl crl2pkcs7 -nocrl -certfile "$bundle_tmp" | openssl pkcs7 -print_certs -noout >/dev/null

bundle_path=secrets/russian-trusted-ca-bundle.pem
if [[ -f "$bundle_path" ]]; then
  cp -p "$bundle_path" "$bundle_path.backup.$(date +%Y%m%d%H%M%S)"
fi
install -m 0644 "$bundle_tmp" "$bundle_path"

sed '/^NODE_EXTRA_CA_CERTS=/d' .env > "$env_tmp"
printf '\nNODE_EXTRA_CA_CERTS=/app/secrets/russian-trusted-ca-bundle.pem\n' >> "$env_tmp"
chmod 600 "$env_tmp"
mv "$env_tmp" .env
trap 'rm -rf "$work_dir"' EXIT

docker compose up -d --force-recreate backend
echo "Готово. Последние сообщения backend:
"
docker compose logs --since=2m backend
