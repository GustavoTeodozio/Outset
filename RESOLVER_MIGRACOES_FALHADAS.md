# 🔧 Como Resolver Migrações Falhadas (P3009)

## ❌ Erro Encontrado

```
Error: P3009
migrate found failed migrations in the target database, 
new migrations will not be applied.
The 20251128004019_init migration started at 2025-12-10 19:01:24.813508 UTC failed
```

## ✅ Soluções

### Opção 1: Automático (Script Atualizado)

O script `docker-entrypoint.sh` foi atualizado para tentar resolver migrações falhadas automaticamente. Se não funcionar, use as opções abaixo.

### Opção 2: Via Terminal do EasyPanel

No EasyPanel, acesse o terminal do container do backend e execute:

```bash
# Marcar migração como resolvida (rolled-back)
npx prisma migrate resolve --rolled-back 20251128004019_init

# Depois tentar aplicar novamente
npm run prisma:deploy
```

### Opção 3: Marcar como Aplicada (Se a migração já foi aplicada manualmente)

Se a migração já foi aplicada manualmente no banco, marque como aplicada:

```bash
npx prisma migrate resolve --applied 20251128004019_init
npm run prisma:deploy
```

### Opção 4: Resetar Migrações (CUIDADO - Apaga dados!)

⚠️ **ATENÇÃO:** Isso apagará todos os dados!

```bash
# Deletar todas as migrações do banco
npx prisma migrate reset --force

# Aplicar todas as migrações novamente
npm run prisma:deploy
```

### Opção 5: Via SQL Direto no PostgreSQL

Se você tem acesso ao banco PostgreSQL diretamente:

```sql
-- Ver migrações falhadas
SELECT * FROM "_prisma_migrations" WHERE finished_at IS NULL;

-- Marcar como resolvida (substitua o migration_name)
UPDATE "_prisma_migrations" 
SET finished_at = NOW(), rolled_back_at = NOW()
WHERE migration_name = '20251128004019_init' 
  AND finished_at IS NULL;
```

## 📝 Próximos Passos

Após resolver as migrações:

1. Faça push das alterações
2. Redeploy no EasyPanel
3. Verifique os logs para confirmar que as migrações rodaram

---

**💡 Dica:** Se as migrações continuarem falhando, pode ser necessário recriar as migrações do zero para PostgreSQL, já que foram criadas originalmente para SQLite.

