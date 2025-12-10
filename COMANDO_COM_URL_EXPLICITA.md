# 🔧 Comando com URL de Conexão Explícita

## ⚠️ Problema

O `$DATABASE_URL` não está sendo reconhecido, então o `psql` tenta usar o usuário `root` (que não existe no PostgreSQL).

## ✅ Solução: Usar URL Completa

Execute este comando com a URL completa do banco:

```bash
psql "postgresql://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable" -c "SET session_replication_role = 'replica'; DO \$\$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END \$\$; DROP TABLE IF EXISTS \"_prisma_migrations\" CASCADE; SET session_replication_role = 'origin';" && npx prisma migrate deploy
```

## 📋 Ou em duas etapas:

### 1. Limpar banco:
```bash
psql "postgresql://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable" -c "SET session_replication_role = 'replica'; DO \$\$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END \$\$; DROP TABLE IF EXISTS \"_prisma_migrations\" CASCADE; SET session_replication_role = 'origin';"
```

### 2. Aplicar migrações:
```bash
npx prisma migrate deploy
```

## 🔍 Verificar se $DATABASE_URL existe

Se quiser verificar se a variável está definida:
```bash
echo $DATABASE_URL
```

Se não aparecer nada, significa que a variável não está definida no container.

## ✅ Solução Alternativa: Definir variável primeiro

Se preferir, pode definir a variável primeiro:

```bash
export DATABASE_URL="postgresql://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable"
```

Depois execute:
```bash
psql $DATABASE_URL -c "SET session_replication_role = 'replica'; DO \$\$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END \$\$; DROP TABLE IF EXISTS \"_prisma_migrations\" CASCADE; SET session_replication_role = 'origin';" && npx prisma migrate deploy
```

