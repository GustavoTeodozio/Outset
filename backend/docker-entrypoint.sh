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

# Tentar aplicar migrações normalmente
if npm run prisma:deploy 2>&1; then
  echo ""
  echo "✅ Migrações executadas com sucesso!"
else
  MIGRATION_ERROR=$?
  echo ""
  echo "⚠️  Erro ao aplicar migrações. Tentando resolver..."
  
  # Verificar se é erro de migração falhada
  if npm run prisma:deploy 2>&1 | grep -q "failed migrations\|P3009\|P3018"; then
    echo "🔧 Detectado: Migrações falhadas ou banco em estado inconsistente"
    echo "🔄 Tentando resetar o banco de dados..."
    
    # Resetar banco (apaga todos os dados e recria)
    if npx prisma migrate reset --force --skip-seed 2>&1; then
      echo ""
      echo "✅ Banco resetado! Aplicando migrações novamente..."
      if npm run prisma:deploy; then
        echo ""
        echo "✅ Migrações aplicadas com sucesso após reset!"
      else
        echo ""
        echo "❌ ERRO: Falha ao aplicar migrações mesmo após reset"
        echo "💡 Verifique os logs acima para mais detalhes"
        exit 1
      fi
    else
      echo ""
      echo "❌ ERRO: Não foi possível resetar o banco"
      echo "💡 Execute manualmente no terminal do EasyPanel:"
      echo "   npx prisma migrate reset --force --skip-seed"
      echo "   npm run prisma:deploy"
      exit 1
    fi
  else
    echo ""
    echo "❌ ERRO: Falha ao executar migrações"
    echo "💡 Verifique se o PostgreSQL está acessível e a DATABASE_URL está correta"
    exit 1
  fi
fi

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

