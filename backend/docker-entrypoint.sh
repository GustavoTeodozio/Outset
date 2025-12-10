#!/bin/sh
set -e

echo "🚀 Iniciando aplicação Adriel Backend..."
echo ""

# Verificar variáveis obrigatórias
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERRO: DATABASE_URL não definida!"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "❌ ERRO: JWT_SECRET não definida!"
  exit 1
fi

echo "✅ Variáveis de ambiente verificadas"
echo ""

# Gerar Prisma Client (caso não tenha sido gerado)
echo "📦 Gerando Prisma Client..."
npm run prisma:generate || {
  echo "⚠️  Aviso: Falha ao gerar Prisma Client (pode estar ok se já foi gerado no build)"
}

echo ""

# Executar migrações
echo "🗄️  Executando migrações do banco de dados..."
# Tentar resolver migrações falhadas primeiro (ignora erro se não houver migrações falhadas)
npx prisma migrate resolve --rolled-back 20251128004019_init 2>/dev/null || true
npm run prisma:deploy || {
  echo "❌ ERRO: Falha ao executar migrações!"
  echo "💡 Tentando resolver migrações falhadas..."
  # Tentar resolver migrações falhadas
  npx prisma migrate resolve --rolled-back 20251128004019_init 2>/dev/null || true
  # Tentar novamente
  npm run prisma:deploy || {
    echo "❌ ERRO: Falha persistente ao executar migrações!"
    echo "💡 Verifique se o PostgreSQL está acessível e a DATABASE_URL está correta"
    echo "💡 Você pode precisar marcar migrações manualmente como resolvidas"
    exit 1
  }
}

echo ""
echo "✅ Migrações executadas com sucesso!"
echo ""

# Criar diretórios se não existirem
mkdir -p storage/media tmp/uploads

echo "📁 Diretórios verificados"
echo ""

# Iniciar aplicação
echo "🌐 Iniciando servidor Node.js..."
echo ""

exec node dist/server/index.js

