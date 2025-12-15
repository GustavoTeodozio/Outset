# 📋 Configuração EasyPanel - Copy & Paste

## 🎯 Configurações Exatas para Copiar e Colar

### ✅ Serviço 1: Backend

**Nome:** `outset`

**Build:**
- Build Context: `backend`
- Dockerfile: `Dockerfile`
- Porta Interna: `3333`

**Variables (Cole tudo):**
```
NODE_ENV=production
PORT=3333
APP_URL=https://mjfupy.easypanel.host
BACKEND_URL=https://mjfupy.easypanel.host
DATABASE_URL=postgres://postgres:0d8928d080ea6d04edcf@marketing_postgres:5432/marketing?sslmode=disable
REDIS_URL=redis://<nome-do-servico-redis>:6379/0
JWT_SECRET=<chave forte 32+ caracteres>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=<outra chave forte 32+ caracteres>
REFRESH_TOKEN_EXPIRES_IN=7d
STORAGE_DRIVER=local
```

**Domains:** ❌ Não adicione nenhum domínio

---

### ✅ Serviço 2: Frontend

**Nome:** `outset-frontend`

**Build:**
- Build Context: `frontend`
- Dockerfile: `Dockerfile`
- Porta Interna: `80`

**Variables:**
```
NODE_ENV=production
```

**Domains:**
- Domínio Público: `https://mjfupy.easypanel.host/`
- Redireciona para: `http://outset-frontend:80/`

---

## ⚠️ IMPORTANTE: Nome do Serviço Backend

O `nginx.conf` do frontend espera o backend se chamar `marketing_outset`.

**Se o nome do seu serviço backend for diferente**, você tem 2 opções:

### Opção 1: Renomear o serviço (Recomendado)
No EasyPanel, renomeie o serviço backend para: `marketing_outset`

### Opção 2: Editar nginx.conf
Edite `frontend/nginx.conf` e troque `marketing_outset` pelo nome do seu serviço.

---

## ✅ Depois de Configurar

1. Deploy do backend
2. Deploy do frontend  
3. Acesse: `https://mjfupy.easypanel.host/`

**Pronto!** 🎉

