# 🚀 Configuração EasyPanel - Tudo Pronto!

Este guia mostra exatamente como configurar os serviços no EasyPanel sem precisar mexer em nada do código.

## 📋 Serviços Necessários

Você precisa criar **2 serviços** no EasyPanel:

### 1️⃣ Backend (outset)

**Configurações:**
- **Tipo:** `Dockerfile`
- **Nome do Serviço:** `outset` (ou `marketing_outset`)
- **Build Context:** `backend`
- **Dockerfile:** `Dockerfile` (deixe como está, ou especifique `backend/Dockerfile`)
- **Porta Interna:** `3333`

**Variáveis de Ambiente (.env):**
```env
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

**Domínios:** ❌ **NÃO configure domínio público** - apenas acesso interno

---

### 2️⃣ Frontend (outset-frontend)

**Configurações:**
- **Tipo:** `Dockerfile`
- **Nome do Serviço:** `outset-frontend` (ou `frontend`)
- **Build Context:** `frontend`
- **Dockerfile:** `Dockerfile` (deixe como está, ou especifique `frontend/Dockerfile`)
- **Porta Interna:** `80`

**Variáveis de Ambiente (.env):**
```env
NODE_ENV=production
```

**Domínios:** ✅ **Configure domínio público**
- **Domínio Público:** `https://mjfupy.easypanel.host/`
- **Redireciona para:** `http://outset-frontend:80/` (ou o nome que você deu ao serviço)

---

## 📸 Screenshots das Configurações

### Backend - Aba "Build"
```
Build Context: backend
Dockerfile: Dockerfile
Porta Interna: 3333
```

### Backend - Aba "Variables"
Cole todas as variáveis de ambiente listadas acima.

### Backend - Aba "Domains"
**Deixe vazio!** Não adicione nenhum domínio.

---

### Frontend - Aba "Build"
```
Build Context: frontend
Dockerfile: Dockerfile
Porta Interna: 80
```

### Frontend - Aba "Variables"
```env
NODE_ENV=production
```

### Frontend - Aba "Domains"
```
Domínio Público: https://mjfupy.easypanel.host/
Redireciona para: http://outset-frontend:80/
```

---

## ⚙️ Como o Proxy Funciona

O frontend já está configurado para fazer proxy automático:

```nginx
# /api/* → Backend
location /api {
    proxy_pass http://marketing_outset:3333;
}

# /static/* → Backend (arquivos de mídia)
location /static {
    proxy_pass http://marketing_outset:3333;
}
```

**⚠️ IMPORTANTE:** O nome `marketing_outset` no `nginx.conf` deve corresponder ao nome do seu serviço backend no EasyPanel!

Se o nome for diferente, você tem 2 opções:
1. Renomear o serviço backend no EasyPanel para `marketing_outset`
2. Ou editar `frontend/nginx.conf` antes do deploy

---

## ✅ Checklist Rápido

**Backend:**
- [ ] Serviço criado com Build Context: `backend`
- [ ] Porta: `3333`
- [ ] Variáveis de ambiente configuradas
- [ ] **SEM domínio público**
- [ ] Nome do serviço: `outset` ou `marketing_outset` (verifique no nginx.conf)

**Frontend:**
- [ ] Serviço criado com Build Context: `frontend`
- [ ] Porta: `80`
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio `https://mjfupy.easypanel.host/` configurado
- [ ] Nome do serviço usado no nginx.conf corresponde ao backend

**Deploy:**
- [ ] Backend deployado e funcionando
- [ ] Frontend deployado e funcionando
- [ ] Testado no navegador: `https://mjfupy.easypanel.host/`

---

## 🔍 Verificar Nome do Serviço Backend

Para verificar qual nome usar no `nginx.conf`, após criar o serviço backend no EasyPanel:

1. Veja o nome do serviço na lista de serviços
2. Esse nome será usado internamente na rede Docker
3. Use esse nome no `frontend/nginx.conf` na linha:
   ```nginx
   proxy_pass http://NOME_DO_SERVICO:3333;
   ```

---

## 🎉 Pronto!

Depois de seguir esses passos, você só precisa:
1. Fazer deploy dos serviços
2. Acessar `https://mjfupy.easypanel.host/`
3. Tudo funcionará automaticamente! 🚀

