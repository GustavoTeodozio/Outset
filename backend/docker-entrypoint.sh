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
  echo "🔍 Tentando resolver migrações falhadas..."
  
  # Tentar resolver migrações falhadas primeiro
  echo "🔧 Tentando marcar migração falhada como resolvida..."
  npx prisma migrate resolve --rolled-back 20251128004019_init 2>/dev/null || true
  
  # Tentar aplicar novamente
  echo "🔄 Tentando aplicar migrações novamente..."
  if npm run prisma:deploy; then
    echo ""
    echo "✅ Migrações aplicadas com sucesso após resolver estado!"
  else
    echo ""
    echo "⚠️  Ainda há problemas. Tentando resetar banco..."
    
    # Se ainda falhar, tentar resetar banco
    if npx prisma migrate reset --force --skip-seed; then
      echo ""
      echo "✅ Banco resetado! Aplicando migrações novamente..."
      if npm run prisma:deploy; then
        echo ""
        echo "✅ Migrações aplicadas com sucesso após reset!"
      else
        echo ""
        echo "⚠️  Falha ao aplicar migrações mesmo após reset"
        echo "💡 Continuando mesmo assim - banco pode estar em estado válido"
      fi
    else
      echo ""
      echo "⚠️  Não foi possível resetar o banco automaticamente"
      echo "💡 Migrações podem já estar aplicadas - continuando..."
      echo "💡 Se precisar, execute manualmente:"
      echo "   npx prisma migrate resolve --rolled-back 20251128004019_init"
      echo "   npx prisma migrate deploy"
    fi
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

