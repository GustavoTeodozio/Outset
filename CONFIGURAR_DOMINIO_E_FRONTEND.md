# 🔧 Configurar Domínio Correto e Deploy do Frontend

## 🔍 Problema Identificado

**Domínio atual:** `https://mjfupy.easypanel.host/` (sem "marketing-")
**Variáveis apontam para:** `https://marketing-mjfupy.easypanel.host/` (com "marketing-")

**Status:**
- ✅ Backend funcionando
- ❌ Domínio apontando direto para backend
- ❌ Frontend não configurado

## ✅ Solução

### 1. Corrigir Variáveis de Ambiente do Backend

No serviço `outset` (backend) no EasyPanel, atualize:

**ANTES:**
```env
BACKEND_URL=https://marketing-mjfupy.easypanel.host
APP_URL=https://marketing-mjfupy.easypanel.host
```

**DEPOIS:**
```env
BACKEND_URL=https://mjfupy.easypanel.host
APP_URL=https://mjfupy.easypanel.host
```

### 2. Criar Serviço Frontend

1. **No projeto `marketing`, clique em "Adicionar Serviço"**
2. **Escolha:** `Dockerfile` (ou `Custom`)
3. **Configurações:**
   - **Nome:** `outset-frontend` (ou qualquer nome)
   - **Build Context:** `frontend`
   - **Dockerfile:** `Dockerfile`
   - **Porta Interna:** `80`

### 3. Configurar Domínio no Frontend

**No serviço frontend:**

- **Domínio Público:** `https://mjfupy.easypanel.host/`
- **Redireciona para:** `http://outset-frontend:80/` (ou nome que você deu ao serviço)

**Variáveis de Ambiente:**
```env
NODE_ENV=production
```

### 4. Remover Domínio do Backend

**IMPORTANTE:** Após configurar o frontend:

1. Vá no serviço `outset` (backend)
2. Vá em **"Domínios"**
3. **Delete** o domínio `https://mjfupy.easypanel.host/`
4. O backend ficará apenas acessível internamente (via proxy do frontend)

### 5. Verificar Nome do Serviço Backend

O `nginx.conf` do frontend está configurado para fazer proxy para `marketing_outset:3333`.

**Verifique se o nome do seu serviço backend no EasyPanel é exatamente `outset` ou `marketing_outset`.**

Se for diferente, você precisa atualizar o `frontend/nginx.conf`:

```nginx
location /api {
    proxy_pass http://NOME_DO_SERVICO_BACKEND:3333;
    ...
}
```

## 🔄 Como Funcionará

```
Usuário acessa: https://mjfupy.easypanel.host/
    ↓
Frontend (Nginx) na porta 80
    ↓
├── / → Serve arquivos React
└── /api → Proxy para marketing_outset:3333
```

## 📋 Checklist

- [ ] Corrigir `BACKEND_URL` e `APP_URL` no backend (remover "marketing-")
- [ ] Criar serviço frontend no EasyPanel
- [ ] Build Context: `frontend`
- [ ] Porta: `80`
- [ ] Domínio configurado no frontend: `https://mjfupy.easypanel.host/`
- [ ] Variáveis de ambiente do frontend configuradas
- [ ] Domínio do backend removido
- [ ] Deploy do frontend feito
- [ ] Testado no navegador

## ✅ Após Configurar

Quando tudo estiver configurado:

1. **Acesse:** `https://mjfupy.easypanel.host/`
2. **Deve ver:** Interface React (não mais JSON do backend)
3. **API funcionando:** Requisições para `/api/*` via proxy

---

**💡 Dica:** O nome do serviço backend no EasyPanel deve corresponder ao que está no `nginx.conf` do frontend!



