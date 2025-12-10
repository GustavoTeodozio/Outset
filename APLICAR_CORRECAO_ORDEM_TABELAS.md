# ✅ Correção: Ordem das Tabelas

## ✅ Problema Corrigido

A tabela `DownloadToken` agora é criada **ANTES** de `MediaDownloadLog`, resolvendo o erro de foreign key.

## 🚀 Próximos Passos

### 1. Fazer Push da Correção

No seu computador:

```bash
git push
```

### 2. No EasyPanel - Limpar Banco Novamente

Como a migração falhou parcialmente, precisamos limpar o banco novamente.

**Instalar psql primeiro (se ainda não instalou):**

```bash
apk add --no-cache postgresql-client
```

**Limpar banco:**

```bash
psql "postgresql://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable" -c "SET session_replication_role = 'replica'; DO \$\$ DECLARE r RECORD; BEGIN FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE'; END LOOP; END \$\$; DROP TABLE IF EXISTS \"_prisma_migrations\" CASCADE; SET session_replication_role = 'origin';"
```

### 3. Fazer Redeploy do Backend

No EasyPanel:
- Vá no serviço `outset` (backend)
- Clique em **"Redeploy"** ou **"Rebuild & Deploy"**
- Isso vai baixar o código atualizado com a correção

### 4. Aplicar Migrações

Após o redeploy, as migrações serão aplicadas automaticamente pelo script `docker-entrypoint.sh`.

Se não aplicar automaticamente, execute manualmente:

```bash
cd /app
npx prisma migrate deploy
```

## ✅ Resultado Esperado

Agora deve funcionar! Você verá:

```
✅ Applied migration `20251128004019_init`
✅ Applied migration `20251202170331_add_media_approval_fields`
✅ Applied migration `20251202171240_add_kanban_system`
...
✅ All migrations have been applied successfully!
```

## 📋 Resumo

1. ✅ Correção aplicada (ordem das tabelas)
2. ⏳ Push para repositório
3. ⏳ Limpar banco
4. ⏳ Redeploy do backend
5. ⏳ Migrações aplicarão automaticamente

---

**💡 Dica:** Após o push e redeploy, as migrações devem funcionar perfeitamente!

