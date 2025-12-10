#!/bin/bash

# Script de setup para produção no servidor
# Uso: ./setup-server.sh

echo "🚀 Configurando ambiente de produção no servidor..."

# Verifica se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale Docker primeiro."
    exit 1
fi

# Verifica se docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose não está instalado. Por favor, instale docker-compose primeiro."
    exit 1
fi

echo "📝 Verificando arquivo .env..."
if [ ! -f .env.production ]; then
    echo "❌ Arquivo .env.production não encontrado!"
    echo "Crie um arquivo .env.production com as seguintes variáveis:"
    echo ""
    echo "POSTGRES_USER=seu_usuario"
    echo "POSTGRES_PASSWORD=sua_senha_forte"
    echo "POSTGRES_DB=adriel"
    echo "JWT_SECRET=sua_chave_secreta_forte_minimo_16_caracteres"
    echo "REFRESH_TOKEN_SECRET=sua_chave_refresh_forte_minimo_16_caracteres"
    echo "APP_URL=https://seu-dominio.com"
    echo "STORAGE_DRIVER=local"
    exit 1
fi

echo "📦 Construindo imagens Docker..."
docker-compose -f docker-compose.prod.yml build

echo "🐳 Iniciando serviços..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 10

echo "🗄️ Executando migrações do banco de dados..."
docker-compose -f docker-compose.prod.yml exec backend npm run prisma:deploy

echo "✅ Setup de produção concluído!"
echo ""
echo "Serviços rodando:"
echo "  Frontend: http://localhost:${FRONTEND_PORT:-3000}"
echo "  Backend:  http://localhost:${BACKEND_PORT:-3333}"
echo ""
echo "Para ver logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "Para parar serviços:"
echo "  docker-compose -f docker-compose.prod.yml down"

