# ✅ Aplicar Migrações em Banco Limpo

## ✅ Situação Atual

A tabela `_prisma_migrations` não existe, o que significa:
- ✅ Banco está limpo
- ✅ Pronto para aplicar migrações do zero

## 🚀 Solução: Aplicar Migrações Diretamente

Se a tabela não existe, o Prisma vai criar ela e aplicar todas as migrações.

### Execute:

```bash
cd /app
npx prisma migrate deploy
```

## ⚠️ Se ainda der erro P3009

Se ainda aparecer erro de migração falhada, tente:

### 1. Verificar status das migrações:

```bash
cd /app
npx prisma migrate status
```

### 2. Se mostrar migração falhada, marque como resolvida:

```bash
npx prisma migrate resolve --rolled-back 20251128004019_init
```

### 3. Depois aplique novamente:

```bash
npx prisma migrate deploy
```

## 🔄 Ou Resetar Completamente (Se necessário)

Se nada funcionar, tente fazer um reset via Prisma:

```bash
cd /app
npx prisma migrate reset --force --skip-seed
```

Depois:

```bash
npx prisma migrate deploy
```

## ✅ Resultado Esperado

Após executar `npx prisma migrate deploy`, você deve ver:

```
✅ Prisma schema loaded from prisma/schema.prisma
✅ Datasource "db": PostgreSQL database "marketing", schema "public" at "marketing_postgres:5432"
✅ Applying migration `20251128004019_init`
✅ Applied migration `20251128004019_init`
✅ Applying migration `20251202170331_add_media_approval_fields`
✅ Applied migration `20251202170331_add_media_approval_fields`
✅ Applying migration `20251202171240_add_kanban_system`
✅ Applied migration `20251202171240_add_kanban_system`
...
✅ All migrations have been applied successfully!
```

---

**💡 Dica:** Se o banco está limpo (sem `_prisma_migrations`), o `prisma migrate deploy` deve funcionar direto!

