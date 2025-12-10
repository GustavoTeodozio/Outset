#!/bin/sh
# Script para limpar completamente o banco e permitir reaplicar migrações
# Execute: sh scripts/reset-db.sh

echo "🗑️  Limpando banco de dados..."
echo ""

# Verificar se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERRO: DATABASE_URL não definida!"
  exit 1
fi

# Executar SQL para limpar banco
psql "$DATABASE_URL" << 'EOF'
SET session_replication_role = 'replica';
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;
SET session_replication_role = 'origin';
EOF

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Banco limpo com sucesso!"
  echo ""
  echo "🔄 Aplicando migrações..."
  npx prisma migrate deploy
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migrações aplicadas com sucesso!"
  else
    echo ""
    echo "❌ Erro ao aplicar migrações"
    exit 1
  fi
else
  echo ""
  echo "❌ Erro ao limpar banco"
  exit 1
fi

