# 🔧 Solução Definitiva para Migrações Falhadas

## ❌ Problema

O banco de dados está em estado inconsistente:
- A migração `20251128004019_init` foi parcialmente aplicada
- Algumas tabelas foram criadas, mas a migração falhou
- Agora tenta criar índices em tabelas que não existem (ex: `DownloadToken`)

## ✅ Solução Automática (Script Atualizado)

O script `docker-entrypoint.sh` foi atualizado para:
1. Tentar aplicar migrações normalmente
2. Se falhar, detectar o erro
3. **Resetar completamente o banco** (apaga tudo e recria)
4. Aplicar todas as migrações do zero

⚠️ **ATENÇÃO:** Isso apagará TODOS os dados do banco!

## 🔧 Solução Manual (Se Necessário)

### Opção 1: Via Terminal do EasyPanel

1. Acesse o terminal do container do backend no EasyPanel
2. Execute:

```bash
# Resetar banco completamente
npx prisma migrate reset --force --skip-seed

# Aplicar migrações
npm run prisma:deploy
```

### Opção 2: Limpar Manualmente (Mais Controlado)

```bash
# 1. Conectar ao PostgreSQL
# (ou use o terminal do PostgreSQL no EasyPanel)

# 2. Deletar tabela de migrações do Prisma
psql -h marketing_outsetpostgres -U postgres -d outset -c "DROP TABLE IF EXISTS \"_prisma_migrations\" CASCADE;"

# 3. Deletar todas as tabelas criadas pela migração
psql -h marketing_outsetpostgres -U postgres -d outset -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 4. Voltar ao terminal do backend e aplicar migrações
npx prisma migrate deploy
```

### Opção 3: Via SQL Direto (Avançado)

Se você tem acesso direto ao PostgreSQL:

```sql
-- Deletar tabela de migrações
DROP TABLE IF EXISTS "_prisma_migrations" CASCADE;

-- Deletar todas as tabelas (ajuste conforme necessário)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Depois, no terminal do backend:
-- npx prisma migrate deploy
```

## 📋 Checklist

Após resolver:

- [ ] Banco resetado ou limpo
- [ ] Todas as migrações aplicadas com sucesso
- [ ] Sem erros de "failed migrations"
- [ ] Aplicação iniciando corretamente

## ⚠️ Importante

- **Backup:** Se você tem dados importantes, faça backup antes de resetar!
- **Primeira execução:** Se for a primeira vez, pode resetar sem problemas
- **Produção:** Em produção com dados, use a Opção 2 (mais controlada)

## 🚀 Próximos Passos

1. Faça push do código atualizado
2. Faça redeploy no EasyPanel
3. O script tentará resetar automaticamente se detectar problemas
4. Se não funcionar automaticamente, use uma das opções manuais acima

---

**💡 Dica:** Para evitar esse problema no futuro, sempre teste migrações em desenvolvimento antes de aplicar em produção!

