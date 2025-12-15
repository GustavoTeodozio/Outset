# ✅ Correção: Migração com PRAGMA (SQLite)

## ✅ Problema Corrigido

A migração `20251202170331_add_media_approval_fields` tinha comandos `PRAGMA` do SQLite, que não funcionam no PostgreSQL.

**Corrigido para usar `ALTER TABLE ADD COLUMN`** (sintaxe PostgreSQL).

## 🚀 Próximos Passos

### 1. Fazer Push da Correção

No seu computador:

```bash
git push
```

### 2. No EasyPanel - Limpar Banco e Reaplicar

Como algumas migrações foram aplicadas parcialmente, precisamos limpar e reaplicar tudo.

**Instalar psql (se necessário):**
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

Se não aplicar automaticamente:
```bash
cd /app
npx prisma migrate deploy
```

## ✅ Resultado Esperado

Agora deve funcionar! Você verá:

```
✅ Applied migration `20251128004019_init`
✅ Applied migration `20251128152749_add_lesson_video_thumbnail`
✅ Applied migration `20251128153210_add_track_cover_image`
✅ Applied migration `20251128153506_add_track_intro_video`
✅ Applied migration `20251128170200_add_meta_api_key_to_client_profile`
✅ Applied migration `20251202170331_add_media_approval_fields` ← Agora corrigida!
✅ Applied migration `20251202171240_add_kanban_system`
...
✅ All migrations have been applied successfully!
```

---

**💡 Dica:** A correção substitui o método SQLite (PRAGMA + recriar tabela) pelo método PostgreSQL (ALTER TABLE ADD COLUMN), que é mais eficiente e correto.



