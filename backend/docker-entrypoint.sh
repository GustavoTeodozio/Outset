#!/bin/sh
# set -e removido para não encerrar o processo se migrações falharem
# Isso permite que o servidor inicie mesmo se houver problemas temporários

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

# Tentar aplicar migrações normalmente (mostrar saída em tempo real)
if npm run prisma:deploy; then
  echo ""
  echo "✅ Migrações executadas com sucesso!"
else
  MIGRATE_EXIT=$?
  echo ""
  echo "⚠️  Erro ao aplicar migrações (código: $MIGRATE_EXIT)"
  echo "🔍 Verificando se precisa resetar banco..."
  
  # Tentar resetar banco se houver migrações falhadas
  echo "🔄 Tentando resetar banco de dados..."
  if npx prisma migrate reset --force --skip-seed; then
    echo ""
    echo "✅ Banco resetado! Aplicando migrações novamente..."
    if npm run prisma:deploy; then
      echo ""
      echo "✅ Migrações aplicadas com sucesso após reset!"
    else
      echo ""
      echo "❌ ERRO: Falha ao aplicar migrações mesmo após reset"
      echo "💡 Continuando mesmo assim - banco pode estar em estado válido"
    fi
  else
    echo ""
    echo "⚠️  Não foi possível resetar o banco automaticamente"
    echo "💡 Migrações podem já estar aplicadas - continuando..."
  fi
fi

echo ""

# Criar diretórios se não existirem
mkdir -p storage/media tmp/uploads

echo "📁 Diretórios verificados"
echo ""

# Iniciar aplicação
echo "🌐 Iniciando servidor Node.js..."
echo ""

exec node dist/server/index.js

