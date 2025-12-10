# 🔧 Solução Rápida: Erro "type datetime does not exist"

## ❌ Problema

O PostgreSQL está recebendo SQL com `DATETIME` (tipo do SQLite), mas PostgreSQL usa `TIMESTAMP`.

**Erro nos logs:**
```
ERROR: type "datetime" does not exist at character 190
```

## 🔍 Causa

O banco está tentando executar uma migração antiga que foi parcialmente aplicada antes das correções. Os arquivos locais já estão corretos (usando `TIMESTAMP`), mas o banco tem estado inconsistente.

## ✅ Solução

### Opção 1: Limpar Banco Completamente (Recomendado)

No terminal do container backend no EasyPanel:

```bash
# Limpar todas as tabelas e migrações
psql $DATABASE_URL << 'EOF'
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

# Aplicar migrações corretas (com TIMESTAMP)
npx prisma migrate deploy
```

### Opção 2: Usar Script Automático

```bash
chmod +x scripts/reset-db.sh
sh scripts/reset-db.sh
```

### Opção 3: Via Terminal PostgreSQL Direto

Se você tem acesso direto ao terminal do PostgreSQL no EasyPanel:

```sql
-- Conectar ao banco
\c outset

-- Limpar tudo
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
```

Depois, no terminal do backend:
```bash
npx prisma migrate deploy
```

## ✅ O Que Acontecerá

Após limpar o banco:
1. ✅ Todas as tabelas antigas serão deletadas
2. ✅ Histórico de migrações será limpo
3. ✅ Prisma aplicará as migrações corretas (com `TIMESTAMP`)
4. ✅ Tudo funcionará normalmente

## ⚠️ Importante

**Isso apaga todos os dados!** Mas como você está na primeira implantação e o banco já está em estado inconsistente, não tem problema.

## 🎯 Resultado Esperado

Após executar, você verá nos logs:
```
✅ Migrações executadas com sucesso!
🌐 Iniciando servidor Node.js...
API ouvindo na porta 3333
```

E os logs do PostgreSQL não mostrarão mais erros de `DATETIME`.

---

**💡 Dica:** Os arquivos de migração locais já estão corretos (usam TIMESTAMP). O problema é apenas o estado inconsistente do banco que precisa ser limpo.

