# 🧹 Limpar Banco - Comando Direto

## ⚡ Execute Este Comando

No terminal do backend no EasyPanel, execute **TUDO DE UMA VEZ**:

```bash
psql $DATABASE_URL -c "SET session_replication_role = 'replica'; DO \$\$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END \$\$; DROP TABLE IF EXISTS \"_prisma_migrations\" CASCADE; SET session_replication_role = 'origin';" && npx prisma migrate deploy
```

## 📋 Ou Passo a Passo

Se preferir fazer em duas etapas:

### 1. Limpar Banco:
```bash
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
```

### 2. Aplicar Migrações:
```bash
npx prisma migrate deploy
```

## ✅ O Que Vai Acontecer

1. ✅ Todas as tabelas serão deletadas
2. ✅ Histórico de migrações será limpo
3. ✅ Migrações serão aplicadas do zero (com TIMESTAMP correto)
4. ✅ Sem erros!

## 🎯 Depois

Após executar, você verá:
```
✅ Applied migration `20251128004019_init`
✅ Applied migration `20251202170331_add_media_approval_fields`
✅ Applied migration `20251202171240_add_kanban_system`
...
✅ All migrations have been applied successfully!
```

E o servidor deve funcionar normalmente! 🚀

