#!/bin/bash

if [ -f .env ]; then
    echo "o arquivo .env já existe. Por favor, remova-o se quiser recriar."
    exit 1
fi

echo "Bem-vindo ao instalador do Dori Monitori"
echo "Este script irá gerar um arquivo .env seguro para sua implantação."
echo ""

read -p "Email do administrador: " ADMIN_EMAIL
read -s -p "Senha do administrador: " ADMIN_PASSWORD
echo ""

DB_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
REDIS_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
APP_KEY=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)

cat <<EOF > .env
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
DB_PASSWORD=${DB_PASSWORD}
REDIS_PASSWORD=${REDIS_PASSWORD}
APP_KEY=${APP_KEY}
EOF

echo ""
echo "Arquivo .env criado com sucesso com credenciais seguras."
echo "Você pode agora rodar 'docker-compose up -d' para iniciar os serviços."
