# 🔧 Limpar Banco Sem psql (Usando Prisma)

## ⚠️ Problema

O container do backend não tem `psql` instalado (é uma imagem Node.js Alpine que não vem com cliente PostgreSQL).

## ✅ Solução: Usar Prisma para Executar SQL

Como o Prisma está instalado, podemos usar ele para executar o SQL diretamente.

### Opção 1: Marcar Migração como Resolvida (Mais Simples)

```bash
cd /app
npx prisma migrate resolve --rolled-back 20251128004019_init
npx prisma migrate deploy
```

Se ainda der erro, use a Opção 2.

### Opção 2: Criar Script SQL e Executar

1. **Criar arquivo SQL temporário:**

```bash
cd /app
cat > /tmp/cleanup.sql << 'EOF'
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
```

2. **Executar usando Prisma:**

O Prisma não tem um comando direto para executar SQL, então vamos usar uma abordagem diferente.

### Opção 3: Instalar psql Temporariamente (Mais Rápido)

No container Alpine, instale o cliente PostgreSQL:

```bash
apk add --no-cache postgresql-client
```

Depois execute o comando de limpeza:

```bash
psql "postgresql://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable" -c "SET session_replication_role = 'replica'; DO \$\$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END \$\$; DROP TABLE IF EXISTS \"_prisma_migrations\" CASCADE; SET session_replication_role = 'origin';"
```

E depois as migrações:

```bash
cd /app
npx prisma migrate deploy
```

## 🎯 Recomendação

**Use a Opção 3** - é a mais rápida e direta. O `psql` será instalado apenas no container atual (não afeta o Dockerfile).

