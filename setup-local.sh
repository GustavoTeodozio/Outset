#!/bin/bash

# Script de setup para desenvolvimento local
# Uso: ./setup-local.sh

echo "🚀 Configurando ambiente de desenvolvimento local..."

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale Node.js 20+ primeiro."
    exit 1
fi

# Verifica se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale Docker primeiro."
    exit 1
fi

echo "📦 Instalando dependências..."
npm install

echo "📦 Instalando dependências do backend..."
cd backend
npm install
cd ..

echo "📦 Instalando dependências do frontend..."
cd frontend
npm install
cd ..

echo "🐳 Iniciando PostgreSQL e Redis com Docker..."
docker-compose -f docker-compose.dev.yml up -d

echo "⏳ Aguardando serviços iniciarem..."
sleep 5

echo "🗄️ Configurando banco de dados..."
cd backend

# Copia .env.example se .env não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env a partir do exemplo..."
    cp env.example .env
    echo "⚠️  IMPORTANTE: Edite backend/.env com suas configurações!"
fi

echo "🔧 Gerando cliente Prisma..."
npm run prisma:generate

echo "📊 Executando migrações..."
npm run prisma:migrate

cd ..

echo "✅ Setup concluído!"
echo ""
echo "Para iniciar o desenvolvimento:"
echo "  npm run dev"
echo ""
echo "Ou inicie separadamente:"
echo "  Backend:  npm run dev:backend"
echo "  Frontend: npm run dev:frontend"
echo ""
echo "Acesse:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:3333"
echo "  Prisma Studio: npm run db:studio"

