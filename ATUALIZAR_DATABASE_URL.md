# 🔧 Atualizar DATABASE_URL no Backend

## 📋 Novas Credenciais do Banco

Com base nas credenciais que você mostrou:

- **Usuário:** `postgres`
- **Senha:** `0d8928d080ea6d04edcf`
- **Banco de Dados:** `marketing` (mudou de `outset`)
- **Host Interno:** `marketing_postgres` (mudou de `marketing_outsetpostgres`)
- **Porta:** `5432`

## 🔧 Atualizar Variáveis de Ambiente no EasyPanel

### No Serviço Backend (`marketing_outset` ou nome do seu serviço backend):

1. **Vá em "Variáveis de Ambiente"** ou **"Environment Variables"**

2. **Atualize a `DATABASE_URL`:**

   **ANTES:**
   ```env
   DATABASE_URL=postgresql://postgres:f366cbf3c9d44f089e96@marketing_outsetpostgres:5432/outset?sslmode=disable
   ```

   **DEPOIS (use a URL completa que aparece nas credenciais):**
   ```env
   DATABASE_URL=postgresql://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable
   ```

   **OU copie direto da tela de credenciais:**
   ```env
   DATABASE_URL=postgresql://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable
   ```

## ✅ Passos para Atualizar

1. **Acesse o serviço backend no EasyPanel**
2. **Vá em "Variáveis de Ambiente"** ou **"Config"**
3. **Encontre `DATABASE_URL`**
4. **Substitua pelo valor:**
   ```
   postgresql://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable
   ```
5. **Salve as alterações**
6. **Faça restart/redeploy do serviço**

## 🧪 Testar Conexão

Após atualizar, o servidor deve:
- ✅ Conectar ao novo banco
- ✅ Aplicar migrações (se necessário)
- ✅ Funcionar normalmente

## ⚠️ Importante

- O banco `marketing` está **vazio** (novo banco)
- Você precisará **aplicar as migrações novamente**
- Dados do banco anterior (`outset`) não estarão disponíveis

## 🚀 Aplicar Migrações no Novo Banco

Após atualizar a `DATABASE_URL` e fazer restart, as migrações serão aplicadas automaticamente pelo script `docker-entrypoint.sh`.

Se precisar aplicar manualmente:
```bash
npx prisma migrate deploy
```

---

**💡 Dica:** Copie a URL de conexão direto da tela de credenciais do EasyPanel para garantir que está correta!

