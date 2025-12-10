# 🔧 Corrigir Erro: Can't reach database server

## ❌ Erro Atual

```
Error: P1001: Can't reach database server at `marketing_outsetpostgres:5432`
```

**Causa:** A `DATABASE_URL` ainda está usando o host antigo `marketing_outsetpostgres`, mas o banco agora está em `marketing_postgres`.

## ✅ Solução

### 1. Verificar e Atualizar DATABASE_URL no EasyPanel

No serviço backend do EasyPanel:

1. **Vá em "Variáveis de Ambiente"** ou **"Environment Variables"**
2. **Procure por `DATABASE_URL`**
3. **Verifique o valor atual** - provavelmente está assim (ERRADO):
   ```
   postgresql://postgres:...@marketing_outsetpostgres:5432/outset?sslmode=disable
   ```

4. **Atualize para (CORRETO):**
   ```
   postgresql://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable
   ```
   
   **OU copie direto da tela de credenciais do PostgreSQL:**
   - Vá nas credenciais do banco
   - Copie a "URL de Conexão Interna"
   - Cole no campo `DATABASE_URL`

### 2. Verificar Mudanças Importantes

Certifique-se de que atualizou:

- ❌ `marketing_outsetpostgres` → ✅ `marketing_postgres` (HOST)
- ❌ `outset` → ✅ `marketing` (NOME DO BANCO)
- ❌ Senha antiga → ✅ Nova senha (`0d8928d080ea6d04edcf`)

### 3. Fazer Restart/Redeploy

**IMPORTANTE:** Após atualizar a variável de ambiente:

1. **Salve as alterações**
2. **Faça RESTART do serviço** ou **REDEPLOY**
3. Isso é necessário para o container pegar a nova `DATABASE_URL`

### 4. Verificar se Funcionou

Após o restart, os logs devem mostrar:

```
✅ Prisma schema loaded from prisma/schema.prisma
✅ Datasource "db": PostgreSQL database "marketing", schema "public" at "marketing_postgres:5432"
✅ Migrações aplicadas com sucesso!
✅ API ouvindo na porta 3333
```

## 🧪 Teste Rápido

Se quiser testar a conexão manualmente no terminal do backend:

```bash
# Verificar se a variável está correta
echo $DATABASE_URL

# Deve mostrar: postgresql://postgres:...@marketing_postgres:5432/marketing?sslmode=disable

# Testar conexão
psql $DATABASE_URL -c "SELECT 1;"
```

## ⚠️ Problemas Comuns

### Problema 1: Variável não atualizou após restart

**Solução:**
- Verifique se salvou as variáveis de ambiente
- Faça um **redeploy completo** (não só restart)
- Verifique se não há cache de variáveis antigas

### Problema 2: Ainda mostra host antigo nos logs

**Solução:**
- Verifique se atualizou a variável correta (pode haver várias `DATABASE_URL`)
- Reinicie o serviço completamente
- Verifique se não há `.env` local sobrescrevendo

### Problema 3: Erro de autenticação

**Solução:**
- Verifique se a senha está correta (copie direto das credenciais)
- Verifique se o usuário está correto (`postgres`)
- Verifique se `sslmode=disable` está no final da URL

## 📋 Checklist

- [ ] `DATABASE_URL` atualizada no EasyPanel
- [ ] Host mudado: `marketing_outsetpostgres` → `marketing_postgres`
- [ ] Banco mudado: `outset` → `marketing`
- [ ] Senha atualizada
- [ ] Variáveis salvas
- [ ] Serviço reiniciado/redeployado
- [ ] Logs mostram conexão com `marketing_postgres`
- [ ] Migrações aplicadas com sucesso

---

**💡 Dica:** Sempre copie a URL de conexão direto da tela de credenciais do PostgreSQL no EasyPanel para garantir que está 100% correta!

