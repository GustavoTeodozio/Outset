# ✅ Configuração do Banco de Dados - Atualizada

## 🔄 Alterações Realizadas

### 1. Schema Prisma Alterado para PostgreSQL ✅

**Arquivo:** `backend/prisma/schema.prisma`

**Alteração:**
```prisma
datasource db {
  provider = "postgresql"  // ← Alterado de "sqlite" para "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. Credenciais do Banco Configuradas

**Baseado nas informações do EasyPanel:**

- **Usuário:** `postgres`
- **Senha:** `f366cbf3c9d44f089e96`
- **Banco de Dados:** `outset`
- **Host Interno:** `marketing_outsetpostgres`
- **Porta:** `5432`
- **URL Completa:** `postgresql://postgres:f366cbf3c9d44f089e96@marketing_outsetpostgres:5432/outset?sslmode=disable`

### 3. Arquivos Atualizados

✅ `backend/prisma/schema.prisma` - Provider alterado para PostgreSQL
✅ `easypanel.env.example` - Credenciais atualizadas
✅ `DEPLOY_EASYPANEL.md` - Documentação atualizada
✅ `easypanel.yml` - Configuração de referência atualizada

---

## 📋 Variáveis de Ambiente para o Backend no EasyPanel

Configure estas variáveis no serviço do **Backend** no EasyPanel:

```env
NODE_ENV=production
PORT=3333
DATABASE_URL=postgresql://postgres:f366cbf3c9d44f089e96@marketing_outsetpostgres:5432/outset?sslmode=disable
REDIS_URL=redis://<nome-do-servico-redis>:6379/0
JWT_SECRET=<GERAR_CHAVE_FORTE_32_CARACTERES>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<GERAR_CHAVE_FORTE_32_CARACTERES>
REFRESH_TOKEN_EXPIRES_IN=7d
APP_URL=https://seu-dominio.com
STORAGE_DRIVER=local
```

---

## ⚠️ Importante

### Nome do Host no EasyPanel

O host interno do PostgreSQL no EasyPanel é: **`marketing_outsetpostgres`**

Certifique-se de que:
- ✅ O nome do serviço PostgreSQL no EasyPanel está configurado corretamente
- ✅ O backend pode acessar esse host na mesma rede
- ✅ A porta 5432 está acessível internamente

### SSL Mode

A URL de conexão inclui `?sslmode=disable`. Se você quiser habilitar SSL:
- Remova `?sslmode=disable`
- Configure certificados SSL no PostgreSQL

---

## 🚀 Próximos Passos

1. ✅ Schema Prisma atualizado - **CONCLUÍDO**
2. ⏳ Configurar variáveis de ambiente no EasyPanel
3. ⏳ Fazer deploy do backend
4. ⏳ As migrações executarão automaticamente (graças ao script de inicialização)

---

## 🔍 Verificação

Para verificar se tudo está correto:

1. **Teste local (opcional):**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   ```

2. **No EasyPanel:**
   - Configure a variável `DATABASE_URL` com a URL completa
   - Faça o deploy do backend
   - Verifique os logs - as migrações devem executar automaticamente

---

**Status:** ✅ Configuração do banco atualizada e pronta para uso no EasyPanel!

