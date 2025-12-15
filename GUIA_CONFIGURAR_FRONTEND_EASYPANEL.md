# 🚀 Configurar Frontend no EasyPanel

## 📋 Passo a Passo Completo

### 1️⃣ Adicionar Novo Serviço Frontend

No EasyPanel, no projeto `marketing`:

1. **Clique em "Adicionar Serviço"** (botão verde)
2. **Escolha:** `Dockerfile`
3. **Preencha:**

   **Básico:**
   - **Nome do Serviço:** `outset-frontend` (ou `frontend`)
   - **Porta Interna:** `80`

   **Build:**
   - **Build Context:** `frontend`
   - **Dockerfile:** `Dockerfile` (deixe como está, ou especifique `frontend/Dockerfile`)
   - **Build Command:** (deixe vazio, o Dockerfile já faz tudo)

### 2️⃣ Configurar Domínio no Frontend

**IMPORTANTE:** Depois de criar o serviço:

1. No serviço `outset-frontend`, vá em **"Domínios"**
2. Clique em **"Adicionar Domínio"**
3. Configure:
   - **Domínio Público:** `https://mjfupy.easypanel.host/`
   - **Redireciona para:** `http://outset-frontend:80/` (ou nome que você deu)

### 3️⃣ Variáveis de Ambiente (Opcional)

O frontend não precisa de variáveis de ambiente especiais. Mas se quiser:

```env
NODE_ENV=production
```

**💡 Nota:** O `nginx.conf` já está configurado para fazer proxy de `/api` para `marketing_outset:3333`, então funciona automaticamente!

### 4️⃣ Remover Domínio do Backend

**CRÍTICO:** Após configurar o frontend:

1. Vá no serviço **`outset`** (backend)
2. Vá em **"Domínios"**
3. **Delete** o domínio `https://mjfupy.easypanel.host/`
4. O backend ficará apenas acessível internamente via proxy do frontend

### 5️⃣ Fazer Deploy

1. **Salve** todas as configurações
2. Clique em **"Deploy"** (botão verde)
3. Aguarde o build completar (pode levar alguns minutos)
4. Verifique os logs se houver erro

## 🔍 Verificações

### ✅ Checklist

- [ ] Serviço `outset-frontend` criado
- [ ] Build Context: `frontend`
- [ ] Porta: `80`
- [ ] Domínio `https://mjfupy.easypanel.host/` configurado no frontend
- [ ] Domínio removido do backend
- [ ] Deploy concluído com sucesso
- [ ] Acessar `https://mjfupy.easypanel.host/` mostra interface React (não mais JSON)

### 🧪 Testar

1. **Acesse:** `https://mjfupy.easypanel.host/`
   - ✅ **Esperado:** Interface React (login/dashboard)
   - ❌ **Erro:** Se ainda mostrar JSON do backend, o domínio não foi removido do backend

2. **Teste API:** Faça login ou qualquer requisição
   - ✅ **Esperado:** Requisições `/api/*` funcionam normalmente
   - ❌ **Erro:** Se der 502, verifique se o nome do serviço backend está correto no `nginx.conf`

## 🔧 Como Funciona

```
┌─────────────────────────────────────┐
│  https://mjfupy.easypanel.host/    │
└──────────────┬──────────────────────┘
               │
               ↓
      ┌─────────────────┐
      │  Frontend       │
      │  (Nginx:80)     │
      └────────┬────────┘
               │
               ├─→ / → Serve React App
               │
               └─→ /api → Proxy
                          ↓
                  ┌─────────────────┐
                  │  Backend        │
                  │  (Node:3333)    │
                  │  marketing_outset│
                  └─────────────────┘
```

## ⚠️ Troubleshooting

### Erro: "502 Bad Gateway" ao acessar `/api`

**Causa:** O nome do serviço backend no `nginx.conf` não corresponde ao nome real no EasyPanel.

**Solução:** Verifique o nome exato do serviço backend:
1. No EasyPanel, veja o nome do serviço backend (provavelmente é `outset` ou `marketing_outset`)
2. Edite `frontend/nginx.conf` e ajuste a linha:
   ```nginx
   proxy_pass http://NOME_DO_SERVICO:3333;
   ```
3. Faça commit e deploy novamente

### Frontend não aparece, ainda mostra JSON do backend

**Causa:** O domínio ainda está configurado no backend.

**Solução:** 
1. Vá no serviço backend
2. Remova o domínio `https://mjfupy.easypanel.host/`
3. Aguarde alguns segundos e recarregue a página

### Build falha

**Verifique:**
1. Build Context está como `frontend` (não `./frontend` ou `/frontend`)
2. Dockerfile existe em `frontend/Dockerfile`
3. Verifique os logs do build para ver o erro específico

---

**🎉 Pronto!** Após seguir esses passos, seu frontend estará funcionando!

